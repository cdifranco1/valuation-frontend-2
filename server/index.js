const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const createStore = require('./src/store');

const DCFStore = require('./src/datasources/DCFStore');

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return ({
      DCFStore: new DCFStore(store.db().collection('dcfs'))
    })
  }
});

server.listen({ port: 5000 }).then(() => {
  console.log(`
    Server is running!
    Listening on port 5000
  `)
})


