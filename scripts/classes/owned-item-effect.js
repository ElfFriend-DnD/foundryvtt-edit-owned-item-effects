import { EditOwnedItemEffects } from '../edit-owned-item-effects.js'
import { EditOwnedItemEffectsActor } from './actor.js';

/**
 * Handles all the logic related to the Active Effect itself
 * This is an extension of the core ActiveEffect document class which
 * overrides `update` and `delete` to make them work.
 * 
 * THIS IS UNSTABLE, BRITTLE, AND NOT MADE FOR USE BEYOND THIS MODULE'S USE CASE
 */
export class EditOwnedItemEffectsActiveEffect extends ActiveEffect {
  constructor(effect, owner) {
    EditOwnedItemEffects.log('Attempting instanciation of Owned Item Effect', effect);

    // manually set the parent
    super(effect, { parent: owner });

    EditOwnedItemEffects.log('Instanciated Owned Item Effect', this);
  }

  /**
   * Fake Create this effect by instead updating the parent embedded Item document's array of effects.
   */
  async create(context) {
    const dataToCreate = this.toJSON();

    EditOwnedItemEffects.log('Attempting create on Owned Item Effect', context, dataToCreate);

    try {
      await this._preCreate(dataToCreate, context, game.userId);
    } catch (error) {
      console.error(error);
    }

    EditOwnedItemEffects.log('Updating Parent', {
      effect: dataToCreate,
    });

    this.parent.update({
      effects: [dataToCreate]
    }, context);
    
    try {
      await this._onCreate(dataToCreate, {...context, renderSheet: false}, game.userId);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Fake delete this effect by instead updating the parent embedded Item document's array of effects.
   */
  async delete(context) {
    EditOwnedItemEffects.log('Attempting delete on Owned Item Effect', context);

    try {
      await this._preDelete(context, game.user);
    } catch (error) {
      console.error(error);
    }

    const effectIdToDelete = this.id;

    const newParentEffects = this.parent.effects.filter(effect => effect.id !== effectIdToDelete);

    EditOwnedItemEffects.log('Updating Parent', {
      effectIdToDelete,
      newParentEffects,
    });

    this.parent.update({
      effects: newParentEffects
    }, {...context, recursive: false});
    
    try {
      await this._onDelete(context, game.userId);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Fake Update this Effec Document by instead updating the parent embedded Item document's array of effects.
   */
  async update(data = {}, context = {}) {
    EditOwnedItemEffects.log('Attempting update on Owned Item Effect', data, context);

    const embeddedItem = this.parent;
    if (!(embeddedItem instanceof Item) && (embeddedItem.parent instanceof Actor)) {
      EditOwnedItemEffects.log('Attempted to update a non owned item effect with the owned Item effect update method', data, context);
      return;
    }

    const newEffects = embeddedItem.effects.toObject();

    const originalEffectIndex = newEffects.findIndex(effect => effect._id === this.id);

    // means somehow we are editing an effect which does not exist on the item
    if (originalEffectIndex < 0) {
      return;
    }

    // merge updates directly into the array of objects
    foundry.utils.mergeObject(
      newEffects[originalEffectIndex],
      data,
      context
    );

    const diff = foundry.utils.diffObject(this.data._source, foundry.utils.expandObject(data));

    try {
      await this._preUpdate(diff, context, game.userId);
    } catch (e) {
      console.error(e);
    }

    EditOwnedItemEffects.log('Attempting update on Owned Item Effect', newEffects);
    
    try {
      await embeddedItem.update({
        effects: newEffects
      })
    } catch (e) {
      console.error(e);
    }
    
    try {
      await this._onUpdate(diff, context, game.userId);
    } catch (e) {
      console.error(e);
    }

    this.data.update(diff);
    this.sheet.render();

    if (this.data.transfer) {
      ui.notifications.notify(game.i18n.localize(`${EditOwnedItemEffects.MODULE_NAME}.not-reflected`));
    }

    if (!this.data.transfer && data.transfer) {
      ui.notifications.notify(game.i18n.localize(`${EditOwnedItemEffects.MODULE_NAME}.not-transferred`));
    }
  }

  /**
   * Applies the effect to the grandparent actor.
   */
  async transferToActor() {
    if (!this.data.transfer) {
      return;
    }

    const actor = this.parent?.parent;

    if (!actor || !(actor instanceof Actor)) {
      EditOwnedItemEffects.log('Attempted to Transfer an effect on an unowned item.');
      return;
    }

    EditOwnedItemEffects.log('Attempting to Transfer an effect to an Actor', {
      effectUuid: this.uuid,
      actor
    });

    EditOwnedItemEffectsActor.applyEffectToActor(actor, [this.uuid]);
  }

  /**
   * Gets default duration values from the provided item.
   * Assumes dnd5e data model, falls back to 1 round default.
   */
  static getDurationFromItem(item, passive) {

    if (passive === true) {
      return undefined;
    }

    if (!!item?.data.data.duration?.value) {

      let duration = {};

      switch (item.data.data.duration.units) {
        case 'hour':
          duration.seconds = item.data.data.duration?.value * 60 * 60;
          break;
        case 'minute':
          duration.seconds = item.data.data.duration?.value * 60;
          break;
        case 'day':
          duration.seconds = item.data.data.duration?.value * 60 * 60 * 24;
          break;
        case 'month':
          duration.seconds = item.data.data.duration?.value * 60 * 60 * 24 * 28;
          break;
        case 'year':
          duration.seconds = item.data.data.duration?.value * 60 * 60 * 24 * 365;
          break;
        case 'turn':
          duration.turns = item.data.data.duration?.value;
          break;
        case 'round':
          duration.rounds = item.data.data.duration?.value;
          break;
        default:
          duration.rounds = 1;
          break;
      }

      return duration
    }

    return {
      rounds: 1
    }
  }

  /**
   * Overridden handlers for the buttons on the item sheet effect list
   * Assumes core active effect list controls (what 5e uses)
   */
  static onManageOwnedItemActiveEffect(event, owner) {
    event.preventDefault();

    const a = event.currentTarget;
    const li = a.closest("li");
    const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;

    const initialEffectFromItem = {
      label: owner.data.name,
      icon: owner.data.img,
      origin: owner.uuid,
      duration: this.getDurationFromItem(owner, li.dataset.effectType === "passive"),
      disabled: li.dataset.effectType === "inactive"
    }

    const effectData = effect?.toJSON() ?? initialEffectFromItem;

    const ownedItemEffect = new EditOwnedItemEffectsActiveEffect(effectData, owner);

    switch (a.dataset.action) {
      case "create":
        return ownedItemEffect.create();

      case "transfer":
        return ownedItemEffect.transferToActor();

      case "delete":
        return ownedItemEffect.delete();

      case "edit":
        return ownedItemEffect.sheet.render(true);
    }
  }
}
