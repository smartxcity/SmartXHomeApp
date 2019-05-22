import { Template } from 'meteor/templating';
import './main.html';
import '../routes';

Meteor.startup(() => {
  sAlert.config({
    effect: 'jelly',
    position: 'top',
    timeout: 10000,
    html: false,
    onRouteClose: true,
    stack: true
  });
});

Template.inAppLayout.events({
  'click #logout-button': () => {
    Meteor.logout(() => {
      FlowRouter.go('/');
    });
  },
  'click #dashboard-button': () => {
    FlowRouter.go('/dashboard');
  } 
})