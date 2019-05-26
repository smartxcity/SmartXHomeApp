import { Template } from 'meteor/templating';
import './user.html';

Template.user.onCreated(function() {
  let self = this;
  self.autorun(() => {
    Meteor.subscribe('userOfTheCustomer')
  });
});

Template.user.helpers({
  users: () => {
    return Meteor.users.find({});
  }
});

Template.user.events({
  'click #add-user-modal': () => {
    Modal.show('userAddModal');
  }
});

Template.userAddModal.onRendered(() => {
  $("#add-user").validate({
    rules: {
      'email': {
        email: true,
        required: true
      },
      'username': {
        digits: true,
        required: true
      },
      'firstName': {
        required: true
      },
      'lastName': {
        required: true
      },
      'password': {
        required: true
      }
    }
  });
});

Template.userAddModal.events({
  'submit #add-user': (event, template) => {
    event.preventDefault();
    let userObj = {
      firstName: $('#user-add-first-name').val(),
      lastName: $('#user-add-last-name').val(),
      email: $('#user-add-email').val(),
      mobile: $('#user-add-mobile').val(),
      password: $('#user-add-password').val()
    };
    Meteor.call('addNewUser', userObj, function(error) {
      if (error) {
        sAlert.error(error.reason);
      } else {
        sAlert.success('User added successfully');
      }
      Modal.hide();
    });
  }
});