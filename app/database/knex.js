const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "mydb.sqlite",
  },
  useNullAsDefault: true,
})

knex.on('query', (queryData) => {
  if (queryData && queryData.sql) {
    console.debug('SQL Query: ' + queryData.sql)
  }
})

module.exports = knex