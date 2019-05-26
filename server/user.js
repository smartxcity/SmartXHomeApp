import { Accounts } from 'meteor/accounts-base';

Meteor.publish('userOfTheCustomer', () => {
  let user = Meteor.user();
  if (user && user.customer) {
    return Meteor.users.find({ 'customer': user.customer });
  }
});

Meteor.methods({
  'addNewUser': (userObj) => {
    let user = Meteor.user();
    if (user) {
      let userId = Accounts.createUser({ userName: userObj.userName, password: userObj.password, email: userObj.email, profile: { firstName: userObj.firstName, lastName: userObj.lastName } });
      Meteor.users.update({ '_id': userId }, { $set: { customer: user.customer } });
    }
  }
})