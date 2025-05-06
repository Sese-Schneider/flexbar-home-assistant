# Flexbar Home Assistant
Integrate HomeAssistant into your Flexbar

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)

## Installation

1. Open FlexDesigner
2. Click on the (+) button to add a new plugin
3. Paste the URL of this repository into the input field

```
https://github.com/Sese-Schneider/flexbar-home-assistant
```

4. Click on Setting -> Application
5. Click on "Home Assistant"
    1. Enter your HomeAssistant instance URL and a long lived access token
    2. Click on the checkmark to save, ensure the status is "Connected"

## Functionality

### Toggle

Toggles an entity like a light or a switch.

#### Configuration

- Entity ID: The entity ID of the entity to toggle like `light.kitchen` or `switch.garden_lights`.
- Sync style with Home Assistant: If enabled, the style of the key will be synced with the state of the entity in Home Assistant. The following styles are supported:
  - icon
  - color (lights)


[license-shield]: https://img.shields.io/github/license/Sese-Schneider/flexbar-home-assistant.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/Sese-Schneider/flexbar-home-assistant.svg?style=for-the-badge
[releases]: https://github.com/Sese-Schneider/flexbar-home-assistant/releases
