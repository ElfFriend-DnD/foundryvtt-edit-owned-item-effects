# Edit Owned Item Effects

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FElfFriend-DnD%2Ffoundryvtt-edit-owned-item-effects%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange)
![Latest Release Download Count](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets%5B1%5D.download_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2FElfFriend-DnD%2Ffoundryvtt-edit-owned-item-effects%2Freleases%2Flatest)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fedit-owned-item-effects&colorB=4aa94a)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fedit-owned-item-effects%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/edit-owned-item-effects/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fedit-owned-item-effects%2Fshield%2Fcomments)](https://www.foundryvtt-hub.com/package/edit-owned-item-effects/)

[![ko-fi](https://img.shields.io/badge/-buy%20me%20a%20coke-%23FF5E5B)](https://ko-fi.com/elffriend)
[![patreon](https://img.shields.io/badge/-patreon-%23FF424D)](https://www.patreon.com/ElfFriend_DnD)

This module's goal is to allow GMs to add/modify effects for Owned Items.

## Features

Allows the user to create, delete, view and edit the details of Active Effects for an Item owned an Actor they have permission to edit.

This is most useful to tweak an incorrectly configured Active Effect after the Item has been put on an Actor, but not for Effects which transfer to the Actor by default.

Any edits made to the Item's Effect will not reflect on the Actor's Effects, and visa versa. To keep them in sync, you must delete the Actor effect and use the new "Transfer" button to push the updated effect to the Actor. This button is only available for effects marked as "Transfer" effects.

![Image of the Transfer icon button.](https://user-images.githubusercontent.com/7644614/147792197-793dcf0f-82da-4a05-94b0-6496127fc870.png)

https://user-images.githubusercontent.com/7644614/147790779-3b3b991f-f52b-4e49-9a10-bc37e5198543.mp4

## Compatibility

Tested with dnd5e, might work on other systems as well though.

Super Charged by:

- [Item Effects to Chat D&D5e](https://github.com/ElfFriend-DnD/foundryvtt-item-effects-to-chat-5e)

Uncertain Compatiblity with:

- DAE: Use at your risk. DAE already has the ability to edit effects on Owned Items.
- Any system that isn't dnd5e. The core concept should be system-agnostic but there might be details missing.

