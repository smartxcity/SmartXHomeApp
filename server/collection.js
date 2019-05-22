const DeviceStatus = new Mongo.Collection('DeviceStatus');
const Room = new Mongo.Collection('Room');
const RoomDevice = new Mongo.Collection('RoomDevice');

module.exports = {
  DeviceStatus,
  Room,
  RoomDevice
}