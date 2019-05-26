import { FlowRouter } from 'meteor/kadira:flow-router';

function checkLoggedIn(ctx, redirect) {
  if (!Meteor.userId()) {
    redirect('/')
  }
}

function redirectIfLoggedIn(ctx, redirect) {
  if (Meteor.userId()) {
    redirect('/dashboard')
  }
}

var privateRoutes = FlowRouter.group({
  name: 'private',
  triggersEnter: [
    checkLoggedIn
  ]
});

FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [
    redirectIfLoggedIn
  ],
  action() {
    import('/imports/login/login.js').then(() => {
      BlazeLayout.render('outAppLayout', { main: 'login' });
    });
  }
});

privateRoutes.route('/dashboard', {
  name: 'dashboard',
  triggersEnter: [
    checkLoggedIn
  ],
  action() {
    import('/imports/dashboard/dashboard.js').then(() => {
      BlazeLayout.render('inAppLayout', { main: 'dashboard' });
    });
  }
});

privateRoutes.route('/user', {
  name: 'user',
  triggersEnter: [
    checkLoggedIn
  ],
  action() {
    import('/imports/user/user.js').then(() => {
      BlazeLayout.render('inAppLayout', { main: 'user' });
    });
  }
});

privateRoutes.route('/room/:roomId', {
  name: 'room',
  triggersEnter: [
    checkLoggedIn
  ],
  action() {
    import('/imports/dashboard/room/room.js').then(() => {
      BlazeLayout.render('inAppLayout', { main: 'room' });
    });
  }
});