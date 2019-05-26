import { Template } from 'meteor/templating';
import './dashboard.html';

Template.dashboard.onCreated(function() {
  let self = this;
  self.loading = new ReactiveVar(true);
  Meteor.call('getCustomerRooms', (error, rooms) => {
    if (error) {
      sAlert.error(error.reason);
    } else {
      Session.set('rooms', rooms);
    }
    self.loading.set(false);
  })
});

Template.dashboard.helpers({
  rooms: () => {
    return Session.get('rooms');
  },
  loading: () => {
    return Template.instance().loading.get();
  }
});

Template.dashboard.events({
  'click .room-class': function() {
    FlowRouter.go('/room/' + this._id);
  },
  'click #add-room-modal': () => {
    Modal.show('roomAddModal');
  }
});

Template.roomAddModal.onRendered(() => {
  $('#add-room').validate();
});

Template.roomAddModal.events({
  'submit #add-room': (event, template) => {
    event.preventDefault();
    let room = $('#room-add-name').val();
    Meteor.call('addRoomForCustomer', room, (error, roomId) => {
      if (error) {
        sAlert.error(error.reason);
      } else {
        sAlert.success('Room added successfully');
        let rooms = Session.get('rooms');
        rooms.push({ name: room, _id: roomId });
        Session.set('rooms', rooms);
      }
      Modal.hide(template);
    })
  }
});