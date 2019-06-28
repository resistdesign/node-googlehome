const expect = require('expect.js');
const search = require('./search');

module.exports = {
  search: {
    'should find Google Home devices on the local network': async function () {
      this.timeout(5000);

      const results = await search();

      console.log(`    found ${results.length} services`);

      expect(results).to.be.an(Array);
      expect(results.length).to.be.greaterThan(0);
    }
  }
};
