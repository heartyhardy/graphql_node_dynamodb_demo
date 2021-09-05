const { gql } = require('apollo-server');
const {
    fetchAllGames,
    fetchByGenre,
    fetchByTitle,
    fetchByRating,
    newGame } = require('./data_source');

// const {games} = require('./mock_data');

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
    type VideoGame {
        genre: Genre!
        title: String!
        rating: Int!
        storeLink: String!
    }

    # Used when returning results from newGame mutation
    type NullableVideoGame{
        genre: Genre
        title: String
        rating: Int
        storeLink: String
    }

    # Query type lists all the queries a client can execute and what data they return.
    type Query {
        games: [VideoGame!]
        gamesByGenre(genre: Genre!): [VideoGame!]!
        gamesByTitle(genre: Genre!, title: String!): [VideoGame!]
        gamesByRating(genre: Genre!, lowerBound: Int!, upperBound: Int!): [VideoGame!]
    }

    # Mutations write data to the data source
    type Mutation{
        newGame(genre: Genre!, title:String!, rating:Int!, storeLink:String!): NullableVideoGame
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
        games: async () => {
            const response = await fetchAllGames();
            return response.Items;
        },
        gamesByGenre: async (parent, {genre}) => {
            const response = await fetchByGenre(genre);
            return response.Items;
        },
        gamesByTitle: async(parent, {genre, title}) => {
            const response = await fetchByTitle(genre, title);
            return response.Items;
        },
        gamesByRating: async(parent, {genre, lowerBound, upperBound}) => {
            const response = await fetchByRating(genre, lowerBound, upperBound);
            console.log(response);
            return response.Items;
        }
    },
    Mutation: {
        newGame: async(parent, {genre, title, rating, storeLink}) => {
            const response = await newGame(genre, title, rating, storeLink);
            return response.Attributes;
        }
    }
}

module.exports = {
    typeDefs,
    resolvers,
}
