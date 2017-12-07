import {inject} from 'aurelia-framework';
import Fixtures from './fixtures';
import {TotalUpdate, LoginStatus} from './messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';

/* commnication service to the rider backend */

@inject(Fixtures, EventAggregator, AsyncHttpClient)
export default class RiderService {

  donations = [];
  methods = [];
  candidates = [];
  users = [];
  total = 0;


  constructor(data, ea, ac) {
    this.methods = data.methods;
    this.ea = ea;
    this.ac = ac;
    //this.getCandidates();
  }

  getUsers() {
    this.ac.get('/api/users').then(res => {
      this.users = res.content;
      console.log(this.users);
    });
  }

  register(firstName, lastName, userName, email, password) {
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: password
    };
    this.ac.post('/api/users/register', newUser);
  }

  login(email, password, type) {
    const user = {
      email: email,
      password: password
    };
    this.ac.authenticate('/api/users/authenticate', user, type);
  }

  logout() {
    const status = {
      success: false,
      message: ''
    };
    this.ac.clearAuthentication();
    this.ea.publish(new LoginStatus(status, 'none'));
  }
  
  getSettings(){
    return(this.ac.get('/api/users/getSettings'));
  }

  getProfile(){
    return(this.ac.get('/api/users/getProfile'));
  }

  updateSettings(firstName, lastName, userName, password, email) {
    let settings = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      password: password,
      email: email
    };
    this.ac.post('/api/users/updateSettings', settings);
  }

  postTweet(text){
    const tweet = {
      text: text,
    }
    //console.log('posting a tweet ' + text);
    this.ac.post('/api/users/postTweet', tweet);
  }  
    
  getGlobalTweets(){
    return this.ac.get('/api/users/getAllTweets');
  }

  getFriendsTweets() {
    return this.ac.get('/api/users/getFriendsTweets');
  }
  
  getUserList() {
    return this.ac.get('api/users/getUserList');
  }

  getUser(id) {
    return this.ac.get('api/users/getUser/' + id);
  }

  getTweetsForUser(id) {
    return this.ac.get('/api/users/getTweetsForUser/' + id);
  }

  addFriend(id) {
    return this.ac.post('/api/users/addFriend', id);
  }

  removeFriend(id) {
    return this.ac.delete('/api/users/removeFriend/' + id);
  }

  /* delete tweets can only delete tweet of the currently logged in user.
   * User identity is determined bye the json web token. */
  deleteTweets(tweetsToDelete) {
    this.ac.post('/api/users/deleteTweets', tweetsToDelete);
  }

  adminDeleteTweets(tweetsToDelete) {
    this.ac.post('/api/users/adminDeleteTweets', tweetsToDelete);
  }

  adminDeleteUsers(usersToDelete) {
    this.ac.post('/api/users/adminDeleteUsers', usersToDelete);
  }
}
