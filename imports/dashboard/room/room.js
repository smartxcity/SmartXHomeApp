import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './room.html';
import { DeviceStatus } from '../../collection';

Template.room.onCreated(function() {
  let self = this;
  self.devices = new ReactiveVar();
  const roomId = FlowRouter.current().params.roomId;
  Session.set('deviceOfRoom-' + roomId, []);
  Meteor.call('getDevicesForRoom', roomId, (error, devices) => {
    if (error) {
      sAlert.error(error.reason);
    } else {
      self.devices.set(devices);
      const deviceClientIds = devices.map(a => a.clientId);
      Session.set('deviceOfRoom-' + roomId, deviceClientIds);
    }
  });
  self.autorun(() => {
    let subDeviceStatus = Meteor.subscribe('allDeviceStatus', Session.get('deviceOfRoom-' + roomId));
  })
});

Template.room.helpers({
  devices: () => {
    return Template.instance().devices.get();
  },
  deivceStatus: (clientId) => {
    let device = DeviceStatus.findOne({ 'clientId': clientId });
    return device && device.status ? 'checked' : '';
  }
});

Template.room.events({
  'change .light-switch': (event) => {
    if (event.target.checked) {
      Meteor.call('turnonDevice', event.target.getAttribute('data-id'));
    } else {
      Meteor.call('turnoffDevice', event.target.getAttribute('data-id'));
    }
  }
});