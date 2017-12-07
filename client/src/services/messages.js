
/*
  LoginStatus: event used to provide information about the success of a login / registration process
*/
export class LoginStatus {
  constructor(status, type) {
    this.status = status;
    this.type = type;
  }
}
/*
  ServerResponseStatus: event used to provide information about the success of an operation.
  status object should contain success and message.
*/
export class ServerResponseStatus {
  constructor (status) {
    this.status = status;
  }
}
