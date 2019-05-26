import { Room, RoomDevice, DeviceStatus } from './collection';
import { Random } from 'meteor/random';

Meteor.publish('allDeviceStatus', (clientIds) => {
  let user = Meteor.user();
  if (user) {
    return DeviceStatus.find({ clientId: { $in: clientIds } });
  }
});

let generateClientId = function() {
  let randomString = Random.id(6);
  let duplicate = RoomDevice.findOne({ 'clientId': randomString });
  if (duplicate) {
    return generateClientId();
  } else {
    return randomString;
  }
};


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
  },
  addRoomForCustomer: (name) => {
    let user = Meteor.user();
    if (user) {
      return Room.insert({ 'name': name, customer: user.customer });
    }
  },
  addRoomDevice: (deviceObj) => {
    let user = Meteor.user();
    if (user) {
      deviceObj.clientId = generateClientId();
      deviceObj.customer = user.customer;
      deviceObj._id = RoomDevice.insert(deviceObj);
      return deviceObj;
    }
  }
});