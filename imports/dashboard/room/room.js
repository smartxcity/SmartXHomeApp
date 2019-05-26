import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './room.html';
import { DeviceStatus } from '../../collection';

Template.room.onCreated(function() {
  let self = this;
  const roomId = FlowRouter.current().params.roomId;
  Session.set('devicesOfRoom-' + roomId, []);
  Session.set('deviceIdsOfRoom-' + roomId, [])
  Meteor.call('getDevicesForRoom', roomId, (error, devices) => {
    if (error) {
      sAlert.error(error.reason);
    } else {
      const deviceClientIds = devices.map(a => a.clientId);
      Session.set('devicesOfRoom-' + roomId, devices);
      Session.set('deviceIdsOfRoom-' + roomId, deviceClientIds);
    }
  });
  self.autorun(() => {
    let subDeviceStatus = Meteor.subscribe('allDeviceStatus', Session.get('deviceIdsOfRoom-' + roomId));
  })
});

Template.room.helpers({
  devices: () => {
    const roomId = FlowRouter.current().params.roomId;
    console.log(Session.get('devicesOfRoom-' + roomId));
    return Session.get('devicesOfRoom-' + roomId);
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
  },
  'click #add-room-device-modal': () => {
    Modal.show('roomDeviceAddModal');
  }
});

Template.roomDeviceAddModal.onRendered(() => {
  $('#add-room-device').validate();
});

Template.roomDeviceAddModal.events({
  'submit #add-room-device': (event, template) => {
    event.preventDefault();
    let deviceObj = {
      name: $('#room-device-add-name').val(),
      roomId: FlowRouter.current().params.roomId,
      type: $('#room-device-add-type').val()
    };
    Meteor.call('addRoomDevice', deviceObj, (error, responseDevice) => {
      if (error) {
        sAlert.error(error.reason);
      } else {
        const roomId = FlowRouter.current().params.roomId;
        let deviceClientIds = Session.get('deviceIdsOfRoom-' + roomId);
        deviceClientIds.push(responseDevice.clientId);
        let deviceList = Session.get('devicesOfRoom-' + roomId);
        deviceList.push(responseDevice);
        Session.set('devicesOfRoom-' + roomId, deviceList);
        Session.set('deviceIdsOfRoom-' + roomId, deviceClientIds);
      }
    });
    Modal.hide(template);
  }
});