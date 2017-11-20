const CandidatesApi = require('./app/api/candidatesapi');
const UsersApi = require('./app/api/usersapi');

module.exports = [
  { method: 'GET', path: '/api/candidates', config: CandidatesApi.find },
  { method: 'GET', path: '/api/candidates/{id}', config: CandidatesApi.findOne },
  { method: 'POST', path: '/api/candidates', config: CandidatesApi.create },
  { method: 'DELETE', path: '/api/candidates/{id}', config: CandidatesApi.deleteOne },
  { method: 'DELETE', path: '/api/candidates', config: CandidatesApi.deleteAll },
  
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },
  { method: 'POST', path: '/api/users/register', config: UsersApi.register },
  { method: 'POST', path: '/api/users/postTweet', config: UsersApi.postTweet },
  { method: 'POST', path: '/api/users/updateSettings', config: UsersApi.updateSettings },
  { method: 'GET', path: '/api/users/getSettings', config: UsersApi.getSettings },
  { method: 'GET', path: '/api/users/getAllTweets', config: UsersApi.getAllTweets },
  { method: 'GET', path: '/api/users/getProfile', config: UsersApi.getProfile },
  { method: 'GET', path: '/api/users/getFriendsTweets', config: UsersApi.getFriendsTweets }
];