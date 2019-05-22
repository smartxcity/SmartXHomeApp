import { Template } from 'meteor/templating';
import './dashboard.html';

Template.dashboard.onCreated(function() {
  let self = this;
  self.rooms = new ReactiveVar();
  self.loading = new ReactiveVar(true);
  Meteor.call('getCustomerRooms', (error, rooms) => {
    if (error) {
      sAlert.error(error.reason);
    } else {
      self.rooms.set(rooms);
    }
    self.loading.set(false);
  })
});

Template.dashboard.helpers({
  rooms: () => {
    return Template.instance().rooms.get();
  },
  loading: () => {
    return Template.instance().loading.get();
  }
});

Template.dashboard.events({
  'click .room-class': function() {
    FlowRouter.go('/room/' + this._id);
  }
})