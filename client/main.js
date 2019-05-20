import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import '../routes';
const deviceStatus = new Mongo.Collection('deviceStatus');

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
  },
  'click #logout-button': () => {
    Meteor.logout();
    FlowRouter.go('/');
  }
});

Template.login.onRendered(() => {
  $('#login-form').validate();
});

Template.login.events({
  "submit #login-form": function(event, template) {
    event.preventDefault();
    Meteor.loginWithPassword(
      template.find("#login-username").value,
      template.find("#login-password").value,
      function(error) {
        if (error) {
          console.log(error);
        } else {
          FlowRouter.go('/dashboard');
        }
      }
    );
  }
});