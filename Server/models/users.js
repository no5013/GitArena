var connection = require('../libs/database.js');
var gitRepo = require('../get-repo')
var unitUpdate = require('./unit_updates')
var unit = require('./units')

function User() {
  this.getUsersCount = function(callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query('SELECT COUNT(*) FROM USERS', function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result.rows[0])
      });
    });
  };

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

        callback(result.rows)
      });
    });
  };

  this.getSingleUser = function(id, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      //use the client for executing the query
      client.query(`SELECT * FROM USERS WHERE id = ${id}`, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result.rows[0])
      });
    });
  };

  this.createNewUser = function(username, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      //use the client for executing the query
      client.query(`INSERT INTO users (name) VALUES ('${username}')`, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result)
      });
    });
  };

  this.authenticate = function(username, password, callback) {
    connection.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      //use the client for executing the query
      client.query(`select * from users where name = '${username}'`, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return console.error('error running query', err);
        }

        callback(result.rows[0])
      });
    });
  }


  // this.updateRepositories = function(username ,callback) {
  //   gitRepo.getGithubUserReposs(username, function(result){
  //     callback(result)
  //   })
  // }

  this.updateRepositories = function(id, username ,callback) {
    gitRepo.getGithubUserReposs(username, function(updates){
      unit.getAllUnitsOfUser(id, function(units){

        var update_repo = []

        for(let i=0; i<units.length; i++){
          for(let j=0; j<updates.length; j++){
            if(units[i].name == updates[j].repo_name){
              unitUpdate.getAllUnitUpdatesOfUnit(units[i].id, function(unitUpdates){
                if(unitUpdates.length <= 0){
                  unitUpdate.createNewUnitUpdate(units[i].id, updates[j].stargazers_count, updates[j].watchers_count, updates[j].open_issues_count, updates[j].forks_count, updates[j].commits_count, updates[j].added_count, updates[j].deleted_count, updates[j].updated_at, function(result){
                    update_repo.push(units[i])

                    //recall when for is finish
                    if(i == units.length-1){
                      callback(update_repo)
                    }
                  })
                }
                else {
                  if(updates[j].updated_at == unitUpdates[unitUpdates.length-1].updated_at){
                    console.log("NO UPDATE")
                    if(i == units.length-1){
                      callback(update_repo)
                    }
                  }
                  else{
                    unitUpdate.createNewUnitUpdate(units[i].id, updates[j].stargazers_count, updates[j].watchers_count, updates[j].open_issues_count, updates[j].forks_count, updates[j].commits_count, updates[j].added_count, updates[j].deleted_count, updates[j].updated_at, function(result){
                      update_repo.push(units[i])
                      console.log("UPDATE")
                      //recall when for is finish
                      if(i == units.length-1){
                        callback(update_repo)
                      }
                    })
                  }
                }
              })
            }
          }
        }
      })
    })
  }
}

module.exports = new User();
