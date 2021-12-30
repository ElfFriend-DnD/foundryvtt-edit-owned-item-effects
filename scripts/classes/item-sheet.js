import { EditOwnedItemEffects } from '../edit-owned-item-effects.js'
import { EditOwnedItemEffectsActiveEffect } from './owned-item-effect.js';

/**
 * Handles all the logic related to Item Sheet
 */
export class EditOwnedItemEffectsItemSheet {
  static init() {
    Hooks.on('renderItemSheet', this.handleItemSheetRender);
  }

  static handleItemSheetRender = (app, html) => {
    const effectsList = html.find('.tab.effects-list');

    if (!app.item.isOwned || !effectsList || !app.isEditable) {
      return;
    }

    console.log(html.find('a[data-action="toggle"]'))

    // unregister all remaining listeners on the effect controls
    // TODO: FIXME
    html.find(".effect-control").unbind('click');
    console.log(html.find(".effect-control"))

    // remove the 'activate' button on the effect list as it's confusing
    html.find('[data-action="toggle"]').remove();

    // remove the 'delete' button on owned item effects as this is not possible
    // html.find('.effects-list [data-action="delete"]').remove();

    // remove the 'create' button on owned item effects as that's out of scope
    // todo: make it in-scope... lol
    // html.find('.effects-list [data-action="create"]').remove();

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
  }
}
