# !!! Work in Progress !!!

This works only in combination with the other Repositories. They are currently private and will probably stay private for some more time. This repo is only public to enable Github Pages.

# GeoGlow Service

This is the Backend-Service (or the ❤️) of GeoGlow.
It is responsible for:

1. Managing the device <-> friend relationship
2. Persisting friend and device data
3. Providing an API for the devices and friends to register
4. Providing an API for retrieving the Friend information

## Setup

To setup the service a .env file with the following contents needs to be added at the root level (same directory where this README sits):

```env
MONGO_URI="<Your-MONGO_DB-URI>"
PORT=<THE_PORT_TO_SERVE_THE_APP>
MQTT_URL="<YOUR_MQTT_BROKER_URL>
MQTT_PORT=<YOUR_MQTT_BROKER_PORT>
```

## Routes

The Service will provide the following routes

### App

- [x] `GET /friends`
- [x] `GET /friends?groupId={groupId}`
- [x] `GET /friends/{friendId}`
- [x] `POST /friends/{friendId}/colors`
- [x] `PATCH /friends/{friendId}`

### Admin

- [ ] `POST /groups`
- [ ] `POST /groups/{groupId}/friends`
- [ ] `DELETE /groups/{groupId}`
- [ ] `DELETE /groups/{groupId}/friends/{friendId}`
- [ ] `PATCH /groups/{groupId}`

## Health Check

- [ ] `GET /health`
