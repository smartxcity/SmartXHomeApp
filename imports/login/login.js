import { Template } from 'meteor/templating';
import './login.html';

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
          sAlert.error(error.reason);
        } else {
          FlowRouter.go('/dashboard');
        }
      }
    );
  }
});