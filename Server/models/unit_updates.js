var connection = require('../libs/database.js');
var gitRepo = require('../get-repo')

function UnitUpdate() {
  this.getAllUnitUpdates = function(callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query('SELECT * FROM UNIT_UPDATES', function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result)
      });
    });
  };

  this.getAllUnitUpdatesOfUnit = function(unit_id, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query(`SELECT * FROM UNIT_UPDATES WHERE unit_id = ${unit_id}`, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result.rows)
      });
    });
  };

  // this.getAllUnitUpdatesOfUsers = function(username, callback) {
  //   gitRepo.getGithubUserReposs(username, function(result){
  //     callback(result)
  //   })
  // };

  this.getSingleUnitUpdate = function(id, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query(`SELECT * FROM UNIT_UPDATES WHERE id = ${id}`, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result)
      });
    });
  };

  this.createNewUnitUpdate = function(owner_id, name, language, stargazers_count, watchers_count, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      //use the client for executing the query
      client.query(`INSERT INTO UNIT_UPDATES (owner_id, name, language, stargazers_count, watchers_count) VALUES (${owner_id}, '${name}', '${language}', ${stargazers_count}, ${watchers_count})`, function(err, result) {
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

module.exports = new UnitUpdate();
