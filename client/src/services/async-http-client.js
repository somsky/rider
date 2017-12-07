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

  authenticate(url, user, type) {
    this.http.post(url, user).then(response => {
      const status = response.content;
      if (status.success) {
        console.log('Authentication successful');
        localStorage.donation = JSON.stringify(response.content);
        this.http.configure(configuration => {
          configuration.withHeader('Authorization', 'bearer ' + response.content.token);
        });
      }
      this.ea.publish(new LoginStatus(status, type));

    }).catch(comm => {
      let status;
      if (comm.responseType === 'error' && comm.statusCode === 0){
        status = {
          success: false,
          message: 'service currently unavailable. Please try again later.',
        };
      }
      else {
        status = {
          success: false,
          message: error.statusText,
        };
      }
      this.ea.publish(new LoginStatus(status, 'error'));
    });
  }

  clearAuthentication() {
    localStorage.donation = null;
    this.http.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
  }
}
