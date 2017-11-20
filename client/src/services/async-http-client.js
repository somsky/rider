import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import Fixtures from './fixtures';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './messages';

@inject(HttpClient, Fixtures, EventAggregator )
export default class AsyncHttpClient {

  constructor(httpClient, fixtures, ea) {
    this.http = httpClient;
    this.http.configure(http => {
      http.withBaseUrl(fixtures.baseUrl);
    });
    this.ea = ea;
  }

  put(url, obj){
    return this.http.put(url, obj);
  }

  get(url) {
    return this.http.get(url);
  }

  post(url, obj) {
    return this.http.post(url, obj);
  }

  delete(url) {
    return this.http.delete(url);
  }

  authenticate(url, user) {
    this.http.post(url, user).then(response => {
      const status = response.content;
      if (status.success) {
        console.log('Authentication successful');
        localStorage.donation = JSON.stringify(response.content);
        this.http.configure(configuration => {
          configuration.withHeader('Authorization', 'bearer ' + response.content.token);
        });
      }
      this.ea.publish(new LoginStatus(status));
    }).catch(error => {
      const status = {
        success: false,
        message: 'service not avilable'
      };
      this.ea.publish(new LoginStatus(status));
    });
  }

  clearAuthentication() {
    localStorage.donation = null;
    this.http.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
  }
}
