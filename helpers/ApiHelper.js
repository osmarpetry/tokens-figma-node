const fetch = require('node-fetch');

class ApiHelper {
  constructor(config) {
    this.endpoint = config.endpoint;
    this.key = config.key;
  }

  async get() {
    return await fetch(this.endpoint, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'X-Figma-Token': this.key,
      },
    });
  }
}

module.exports = ApiHelper;