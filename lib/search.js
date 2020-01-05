const bonjour = require('bonjour')();

async function search(waitTime = 2000) {
  const browser = bonjour.find({});

  await new Promise(res => setTimeout(res, waitTime));

  return browser
    .services
    .filter((service = {}) => {
      const {
        txt: {
          md = ''
        } = {}
      } = service;

      return !!md.match(/^Google Home/) || !!md.match(/^Google Nest/);
    })
    .map(service => Object.assign(service.txt, {address: service.addresses[0]}))
}

module.exports = search;
