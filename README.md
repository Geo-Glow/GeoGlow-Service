# GeoGlow Service

This is the Backend-Service (or the ❤️) of GeoGlow.
It is responsible for:

1. Managing the device <-> friend relationship
2. Persisting friend and device data
3. Providing an API for the devices and friends to register
4. Providing an API for retrieving the Friend information

## Routes

The Service will provide the following routes

### App

- [x] `GET /friends`
- [x] `GET /friends?groupId={groupId}`
- [x] `GET /friends/{friendId}`
- [ ] `POST /friends/{friendId}/colors`
- [ ] `PATCH /friends/{friendId}`

### Admin

- [ ] `POST /groups`
- [ ] `POST /groups/{groupId}/friends`
- [ ] `DELETE /groups/{groupId}`
- [ ] `DELETE /groups/{groupId}/friends/{friendId}`
- [ ] `PATCH /groups/{groupId}`

## Health Check

- [ ] `GET /health`

FriendId ist eine generierte ID des Controllers:
Beim Einrichten des Controllers wird der eigene Name angegeben.
Der Controller fügt dem Namen noch eine UUID an (um sicherzustellen, dass diese ID nur einmal existiert)
Zwischen Namen und UUID wird ein Special Character eingefügt (z.B. "#"). Dadurch kann der Name immer aus der ID extrahiert werden.
Ein Friend Objekt beinhaltet Folgendes:

- name: Name des Freundes
- friendId: friendId des Freundes
- tileIds: Ids der Tiles
- groupId: groupId des Freundes

```json
{
  "name": "Nick",
  "friendId": "Nick@123",
  "tileIds": [123, 456, 789],
  "groupId": "Test-Gruppe"
}
```
