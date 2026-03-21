# Wrist Assistant for Home Assistant

Official Home Assistant integration for the [Wrist Assistant](https://apps.apple.com/us/search?term=Wrist%20Assistant) Apple Watch app.

Wrist Assistant lets you connect your Apple Watch to Home Assistant so you can pair your watch, keep it in sync, and send notifications.

## What it does

- Pairs your watch with Home Assistant
- Keeps your watch and Home Assistant in sync
- Supports more than one watch in the same home
- Sends notifications to your watch

## Install

### Recommended

1. Install the Wrist Assistant iPhone app.
2. Follow the onboarding steps in the app.

### HACS

1. Open HACS.
2. Go to `Integrations`.
3. Search for `Wrist Assistant`.
4. Install it and restart Home Assistant.
5. Go to `Settings` -> `Devices & Services`.
6. Add the `Wrist Assistant` integration.

### Manual

1. Copy `custom_components/wrist_assistant` into your Home Assistant `custom_components` folder.
2. Restart Home Assistant.
3. Add the `Wrist Assistant` integration from `Settings` -> `Devices & Services`.

## Main services

### `wrist_assistant.send_notification`

Send a notification to one or all paired watches.

```yaml
service: wrist_assistant.send_notification
data:
  title: "Door Alert"
  message: "Front door was opened"
```

You can also target a specific watch:

```yaml
service: wrist_assistant.send_notification
data:
  title: "Garage"
  message: "Garage door is open"
  target: "my-watch-id"
```

### `wrist_assistant.create_pairing_code`

Create a pairing code if you want to connect the app manually.

```yaml
service: wrist_assistant.create_pairing_code
data:
  local_url: "http://homeassistant.local:8123"
  remote_url: "https://ha.example.com"
```

### `wrist_assistant.force_resync`

Ask connected watches to refresh their data.

```yaml
service: wrist_assistant.force_resync
```

## Need help?

- Open an issue: <https://github.com/NylonDiamond/homeassistant-wrist-assistant/issues>

## License

MIT
