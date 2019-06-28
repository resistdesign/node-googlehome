const googletts = require('google-tts-api');
const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const mime = require('mime-types');


const Connector = (() => {
  const playMethod = Symbol('playMethod');

  class Connector {

    constructor(ip) {
      this.ip = ip;
      this.lang = 'en';
    }

    config(options = {}) {
      this.lang = options.lang || this.lang;
    }

    async readySpeaker() {
      const client = new Client();
      this.player = await new Promise((resolve, reject) => client.connect(this.ip, () => {
        client.launch(DefaultMediaReceiver, (err, player) => {
          err ? reject(err) : resolve(player);
        });
      }));
    }

    async speak(message, speed = 1, timeout = 3000) {
      const url = await googletts(message, this.lang, speed, timeout);
      return await this[playMethod](url);
    }

    async playMedia(url) {
      if (!url.startsWith('http')) throw new Error('This format is not supported.');
      return await this[playMethod](url);
    }

    async [playMethod](url) {

      if (!this.player) {
        await this.readySpeaker();
      }

      const params = {
        contentId: url,
        contentType: mime.lookup(url) || 'audio/mp3',
        streamType: 'BUFFERED'
      };

      return await new Promise((resolve, reject) => {
        this.player.load(params, {autoplay: true}, (err, status) => {
          err ? reject() : resolve(status);
        });
      });

    }
  }

  return Connector

})();

module.exports = Connector;
