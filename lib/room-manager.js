var crypto = require('crypto');

function RoomManager() {
  function *roomKey() {
    return crypto.createHash('sha1')
      .update(this.tenant.links.capabilities)
      .update(String(this.tenant.group))
      .update(String(this.room.id))
      .digest('hex');
  }
  function getRoom() {
    return function *() {
      var key = yield roomKey;
      var room = yield this.addonStore.narrow('rooms').get(key);
      return room || {enabled: true};
    };
  }
  function setRoom(room) {
    return function *() {
      var key = yield roomKey;
      yield this.addonStore.narrow('rooms').set(key, room);
    };
  }
  return {
    enableRoom: function *() {
      var room = yield getRoom();
      room.enabled = true;
      yield setRoom(room);
    },
    disableRoom: function *() {
      var room = yield getRoom();
      room.enabled = false;
      yield setRoom(room);
    },
    isRoomEnabled: function *() {
      var room = yield getRoom();
      return room.enabled;
    }
  };
}

module.exports = RoomManager;
