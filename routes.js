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
    BlazeLayout.render('appLayout', { main: 'login' });
  }
});

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  triggersEnter: [
    checkLoggedIn
  ],
  action() {
    BlazeLayout.render('appLayout', { main: 'SmartXHome' });
  }
});