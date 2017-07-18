var connection = require('../libs/database.js');
var gitRepo = require('../get-repo')

function Unit() {
  this.getAllUnits = function(callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query('SELECT * FROM UNITS', function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result.rows)
      });
    });
  };

  this.getAllUnitsOfUser = function(user_id, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query(`SELECT * FROM UNITS WHERE owner_id = ${user_id}`, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result.rows)
      });
    });
  };

  this.getAllUnitsOfUsers = function(username, callback) {
    gitRepo.getGithubUserReposs(username, function(result){
      callback(result)
    })
  };

  this.getSingleUnit = function(id, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query(`SELECT * FROM UNITS WHERE id = ${id}`, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result.rows)
      });
    });
  };

  this.createNewUnit = function(owner_id, name, language, stargazers_count, watchers_count, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      //use the client for executing the query
      client.query(`INSERT INTO UNITS (owner_id, name, language, stargazers_count, watchers_count) VALUES (${owner_id}, '${name}', '${language}', ${stargazers_count}, ${watchers_count})`, function(err, result) {
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

module.exports = new Unit();
