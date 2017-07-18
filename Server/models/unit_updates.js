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

        callback(result.rows)
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
      client.query(`SELECT * FROM UNIT_UPDATES WHERE unit_id = ${id}`, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result.rows)
      });
    });
  };

  this.createNewUnitUpdate = function(unit_id, stargazers_count, watchers_count, open_issues_count, forks_count, commits_count, added_count, deleted_count, updated_at, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      //use the client for executing the query
      client.query(`INSERT INTO UNIT_UPDATES (unit_id, stargazers_count, watchers_count, open_issues_count, forks_count, commits_count, added_count, deleted_count, updated_at) VALUES (${unit_id}, ${stargazers_count}, ${watchers_count}, ${open_issues_count}, ${forks_count}, ${commits_count}, ${added_count}, ${deleted_count}, '${updated_at}')`, function(err, result) {
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
