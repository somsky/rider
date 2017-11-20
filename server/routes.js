const Accounts = require('./app/controllers/accounts');
const Donations = require('./app/controllers/donations');
const Assets = require('./app/controllers/assets');

module.exports = [

  /* user signup, login, logout */
  { method: 'GET', path: '/', config: Accounts.main },
  //{ method: 'GET', path: '/signup', config: Accounts.signup },
  //{ method: 'GET', path: '/login', config: Accounts.login },
  //{ method: 'POST', path: '/login', config: Accounts.authenticate },
  //{ method: 'GET', path: '/logout', config: Accounts.logout },
  //{ method: 'POST', path: '/register', config: Accounts.register },

  /* donations */
  //{ method: 'GET', path: '/home', config: Donations.home },
  //{ method: 'GET', path: '/report', config: Donations.report },
  //{ method: 'POST', path: '/donate', config: Donations.donate },

  /* settings */
  //{ method: 'GET', path: '/settings', config: Accounts.viewSettings },
  //{ method: 'POST', path: '/settings', config: Accounts.updateSettings },

  //{ method: 'GET', path: '/{param*}',config: { auth: false },handler: Assets.servePublicDirectory },
];
