var connection = require('../libs/database.js');

function User() {
  this.getAllUsers = function(callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query('SELECT * FROM USERS', function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result)
      });
    });
  };
}

module.exports = new User();