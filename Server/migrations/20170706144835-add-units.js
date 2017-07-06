'use strict';

var dbm;
var type;
var seed;

/**
* We receive the dbmigrate dependency from dbmigrate initially.
* This enables us to not have to rely on NODE_PATH.
*/
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('units', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    owner_id: {
      type: 'int',
      unsigned: true,
      length: 10,
      notNull: true,
      foreignKey: {
        name: 'user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    name: 'string',
    language: 'string',
    experience: 'int',
    stargazers_count: 'int',
    watchers_count: 'int'
  });
};

exports.down = function(db) {
  return db.dropTable('units');
};

exports._meta = {
  "version": 1
};
