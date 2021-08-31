const {gql} = require('apollo-server');
const {games} = require('./mock_data');

const typeDefs = gql`
    # Enums are scalar that is restricted to particular set of values
    # When an enum is used, that field will have an exactly one of pre-defined values.
    enum Genre {
        ACTION
        ADVENTURE
        RPG
        STRATEGY
    }

    # type Game defines the queryable fields for every Game in our data source 
    type Game {
        id: Int!
        title: String!
        genre: Genre!
        coverImg: String!
    }

    # Query type lists all the queries a client can execute and what data they return.
    type Query {
        games: [Game!]!
    }
`;


/*
    Query type specifies all of the entry points in our GraphQL API
*/
const resolvers = {
    
    Genre: {
        ACTION: 'ACTION',
        ADVENTURE: 'ADVENTURE',
        RPG: 'RPG',
        STRATEGY: 'STRATEGY'
    },
    Query: {
        games: () => games,
    }
}

module.exports = {
    typeDefs,
    resolvers,
}
