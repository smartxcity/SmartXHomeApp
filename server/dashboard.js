import { Room, RoomDevice, DeviceStatus } from './collection';

Meteor.publish('allDeviceStatus', (clientIds) => {
  let user = Meteor.user();
  if (user) {
    return DeviceStatus.find({ clientId: { $in: clientIds } });
  }
});

Meteor.methods({
  getCustomerRooms: () => {
    let user = Meteor.user();
    if (user) {
      return Room.find({ 'customer': user.customer }).fetch();
    }
  },
  getDevicesForRoom: (roomId) => {
    let user = Meteor.user();
    if (user) {
      return RoomDevice.find({ 'roomId': roomId, 'customer': user.customer }).fetch();
    }
  },
  turnonDevice: (clientId) => {
    client.publish('turnon/' + clientId, JSON.stringify({ 'token': 'sjfsdghfsjdf234332sdfdsfs1#3454%$^4' }));
    DeviceStatus.update({ 'clientId': clientId }, { $set: { status: 1 } }, { upsert: true });
  },
  turnoffDevice: (clientId) => {
    client.publish('turnoff/' + clientId, JSON.stringify({ 'token': 'sjfsdghfsjdf234332sdfdsfs1#3454%$^4' }));
    DeviceStatus.update({ 'clientId': clientId }, { $set: { status: 0 } }, { upsert: true });
  }
});