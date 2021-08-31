const {ApolloServer} = require('apollo-server');
const {typeDefs, resolvers} = require('./schema');

const server = new ApolloServer({typeDefs, resolvers});

(async() => {
    const response = await server.listen();
    console.log(`🚀  Server ready at ${response.url}`);
})();
