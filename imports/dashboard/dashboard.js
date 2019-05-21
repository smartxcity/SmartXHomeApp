import { Template } from 'meteor/templating';
import './dashboard.html';

const deviceStatus = new Mongo.Collection('deviceStatus');

Template.SmartXHomeDashBoard.onCreated(() => {
  let self = this;
  Meteor.subscribe('allDeviceStatus');
});

Template.SmartXHomeDashBoard.helpers({
  deivceStatus: (clientId) => {
    let device = deviceStatus.findOne({ 'clientId': clientId });
    return device && device.status ? 'checked' : '';
  }
});

Template.SmartXHomeDashBoard.events({
  'change .light-switch': (event) => {
    if (event.target.checked) {
      Meteor.call('turnonDevice', event.target.getAttribute('data-id'));
    } else {
      Meteor.call('turnoffDevice', event.target.getAttribute('data-id'));
    }
  }
});