import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
const deviceStatus = new Mongo.Collection('deviceStatus');
import './main.html';

Template.SmartXHome.onCreated(() => {
  let self = this;
  Meteor.subscribe('allDeviceStatus');
});



Template.SmartXHome.helpers({
  deivceStatus: (clientId) => {
    let device = deviceStatus.findOne({ 'clientId': clientId });
    return device && device.status ? 'checked' : '';
  }
});

Template.SmartXHome.events({
  'change .light-switch': (event) => {
    if (event.target.checked) {
      Meteor.call('turnonDevice', event.target.getAttribute('data-id'));
    } else {
      Meteor.call('turnoffDevice', event.target.getAttribute('data-id'));
    }
  }
})