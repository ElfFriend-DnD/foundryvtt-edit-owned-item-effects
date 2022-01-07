import { EditOwnedItemEffects } from '../edit-owned-item-effects.js';
import { EditOwnedItemEffectsActiveEffect } from './owned-item-effect.js';

/**
 * Handles all the logic related to Item Sheet
 */
export class EditOwnedItemEffectsItemSheet {
  static init() {
    Hooks.on('renderItemSheet', this.handleItemSheetRender);
  }

  /**
   * Only applies to owned items which can be edited
   * Removes some effect controls
   * Unregisters all Core Effect Control listeners
   * Adds a "Transfer" button for effects marked "Transfer"
   * Re-registers custom listeners for create, edit, and delete controls
   * 
   * @param {*} app 
   * @param {*} html 
   * @returns 
   */
  static handleItemSheetRender = (app, html) => {
    const effectsList = html.find('.tab.effects-list');

    if (!app.item.isOwned || !effectsList || !app.isEditable) {
      return;
    }

    // unregister all remaining listeners on the effect controls
    html.find(".effect-control").unbind('click');

    // remove the 'activate' button on the effect list as it's confusing
    html.find('[data-action="toggle"]').remove();

    // add 'transfer' button to the AEs which should be transferrable
    app.item.effects.filter(effect => effect.data.transfer).forEach(effect => {
      const id = effect.id;

      const newButton = `<a class="effect-control" data-action="transfer" title="${game.i18n.localize('EFFECT.Transfer')}">
      <i class="fas fa-hand-holding-medical"></i>
  </a>`

      html.find(`li[data-effect-id=${id}] .effect-controls`).append(newButton);
    });

    // override the listener preventing management of these effects
    html.on('click', ".effect-control", (ev) => {
      ev.stopPropagation();
      EditOwnedItemEffectsActiveEffect.onManageOwnedItemActiveEffect(ev, app.item);
    })

    EditOwnedItemEffects.log('binding dragdrop');

    const dragDrop = new DragDrop({
      dropSelector: '.effects-list',
      permissions: {
        dragdrop: () => app.isEditable && app.item.isOwned 
      },
      callbacks: {
        drop: this._onDrop(app.object) 
      }
    });

    dragDrop.bind(html[0]);
  }

  /**
   * When an effect is dropped on the sheet, create a copy of that effect
   */
  static _onDrop = (effectParent) => async (event) => {
    if (!effectParent) {
      return;
    }

    // Try to extract the data
    let dropData;
    try {
      dropData = JSON.parse(event.dataTransfer.getData('text/plain'));

      EditOwnedItemEffects.log('DragDrop drop', {
        event,
        dropData,
      });
    } catch (err) {
      EditOwnedItemEffects.log('DragDrop drop', {
        err,
      });

      return false;
    }

    if (dropData.type !== 'ActiveEffect') return false;

    EditOwnedItemEffects.log('DragDrop drop starting:', {
      effectParent,
      dropData,
    });

    return EditOwnedItemEffectsActiveEffect.create(
      {
        ...dropData.data,
        origin: effectParent.uuid,
        _id: null,
      }, {parent: effectParent}
    );
  }
}
