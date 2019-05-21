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

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  triggersEnter: [
    checkLoggedIn
  ],
  action() {
    import('/imports/dashboard/dashboard.js').then(() => {
      BlazeLayout.render('inAppLayout', { sidebar: 'sidebar', main: 'SmartXHomeDashBoard' });
    });
  }
});