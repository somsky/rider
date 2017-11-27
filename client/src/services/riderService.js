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

  getCandidates() {
    this.ac.get('/api/candidates').then(res => {
      this.candidates = res.content;
      console.log(this.candidates);
    });
  }

  getUsers() {
    this.ac.get('/api/users').then(res => {
      this.users = res.content;
      console.log(this.users);
    });
  }

  donate(amount, method, candidate) {
    const donation = {
      amount: amount,
      method: method,
      candidate: candidate
    };
    this.donations.push(donation);
    console.log(amount + ' donated to ' + candidate.firstName + ' ' + candidate.lastName + ': ' + method);

    this.total = this.total + parseInt(amount, 10);
    console.log('Total so far ' + this.total);
    this.ea.publish(new TotalUpdate(this.total));
  }

  addCandidate(firstName, lastName, office) {
    const candidate = {
      firstName: firstName,
      lastName: lastName,
      office: office
    };
    this.candidates.push(candidate);
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

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    console.log('Authenticating ' + email + ' ' + password);
    this.ac.authenticate('/api/users/authenticate', user);
    const status = {
      success: true,
      message: ''
    };
    this.ea.publish(new LoginStatus(status));
  }

  logout() {
    const status = {
      success: false,
      message: ''
    };
    this.ac.clearAuthentication();
    this.ea.publish(new LoginStatus(status));
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
}
