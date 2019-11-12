import io from 'socket.io-client';
import queryString from 'query-string';
import 'babel-polyfill';

import config from './config';

export default class SocketClient {
  constructor({ token, path = config.backendURL, lang = 'ru' }) {
    this.path = path;
    this.token = token;
    this.lang = lang;
    this.hash = Date.now() + Math.floor(Math.random() * 100);
    this.requestMap = {};
    this.resUsermeta = null;
    this.userMeta = new Promise((res) => {
      this.resUsermeta = res;
    });
  }

  connect() {
    const options = {
      origins: '*',
      path: '/socket.io',
      'force new connection': true,
      reconnection: false,
      transports: ['websocket'],
      query: {
        Language: this.lang,
        isMobileApp: true,
      },
    };

    // add token to query
    if (this.token) {
      options.query.Authorization = this.token.trim();
    }
    options.query = queryString.stringify(options.query, { /* fix bug ios 10 */ strict: false });

    const promise = new Promise((resolve, reject) => {
      this.socket = io(this.path, options);
      this.socket.on('connect', () => {
        resolve();
      });

      // if socket disconnected or can't connect this try
      this.socket.on('connect_error', () => {
        // console.log('work?');
        // console.error();
        reject();
      });

      // response from server
      this.socket.on('a', this.handleResponse.bind(this));
    });

    return promise;
  }

  disconnect() {
    this.socket.disconnect();
  }

  send(type, data = {}) {
    const request = {
      sendTime: Date.now(),
      msgid: Math.random().toString(36).substr(2, 8),
      type,
      data,
    };

    this.requestMap[request.msgid] = request;

    const promise = new Promise((resolve, reject) => {
      request.resolve = resolve;
      request.reject = reject;
    });
    setTimeout(() => {
      if (this.requestMap[request.msgid]) {
        this.requestMap[request.msgid].reject();
      }
    }, 5e4);

    this.socket.emit('d', request);

    return promise;
  }

  handleResponse(msg) {
    if (!msg.msgid) {
      if (msg.type === 'user.meta') {
        this.resUsermeta(msg.data);
        this.userMeta = msg.data;
      }
      return;
    }

    if (this.requestMap[msg.msgid] === undefined) {
      delete this.requestMap[msg.msgid];
    } else {
      const { resolve, reject } = this.requestMap[msg.msgid];
      delete this.requestMap[msg.msgid];
      if (msg.needParse) {
        // eslint-disable-next-line no-param-reassign
        msg.data = JSON.parse(msg.data);
      }

      // use resolve callback when response have success status
      if (msg.data.status && msg.data.status >= 200 && msg.data.status < 300) {
        resolve(msg.data);
      } else {
        reject(msg.data);
      }
    }
    // remove request from request map
    delete this.requestMap[msg.msgid];
  }
}
