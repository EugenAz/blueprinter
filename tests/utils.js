const { ncp } = require('ncp');

exports.copy = (source, destination) => new Promise((resolve, reject) => {
  ncp(source, destination, err => {
    if (err) {
      reject(err);
    }

    resolve();
  });
});
