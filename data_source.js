let AWS = require('aws-sdk');
var client = null;

const setConfig = () => {
    AWS.config.update({
        region: 'us-east-2',
        endpoint: 'dynamodb.us-east-2.amazonaws.com'
    });
};

const initConnection = () => {
    if (client === null) {

        setConfig();

        client = new AWS.DynamoDB.DocumentClient();
    }
};


/**
 * Fetch all records from the database(EXPERIMENTAL)
 *
 * @return  {Promise([VideoGame!])}  Returns a promise, resolves to data or rejects with err
 */
const fetchAllGames = () => {
    let params = {
        TableName: 'VideoGame'
    }

    initConnection();

    return new Promise((resolve, reject) => {
        return client.scan(params, (err, data) => {
            if (err) {
                console.error(`Failed to scan the table: ${params.TableName} Err info:`, JSON.stringify(err, null, 2));
                reject(err);
            } else {
                resolve(data);

                // Continue scanning if there are have more Games, since Max data retrieval capped at 1MB
                if (typeof data.LastEvaluatedKey != "undefined") {
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    return client.scan(params, fetchAllGames());
                }
            }
        });
    });
}


/**
 * Fetch all games by Genre
 *
 * @param   {Genre!}  genre  A variant of the enum Genre
 *
 * @return  {Promise([VideoGame!])}         Returns a promise containing an array of Game or rejects with err
 */
const fetchByGenre = (genre) => {
    let params = {
        TableName: 'VideoGame',
        KeyConditionExpression: 'genre = :g',
        ExpressionAttributeValues: {
            ":g": genre
        }
    };

    initConnection();

    return new Promise((resolve, reject) => {
        return client.query(params, (err, data) => {
            if (err) {
                console.error(`Failed to scan the table: ${params.TableName} Err info:`, JSON.stringify(err, null, 2));
                reject(err);
            }else{
                resolve(data);
            };
        });
    });
}


/**
 * Fetch a game by its Genre and by a specific title
 *
 * @param   {Genre!}  genre  Variant of the Genre Enum
 * @param   {String!}  title  Title of the game
 *
 * @return  {Promise([VideoGame!])}         Returns a promise that resolves to VideoGame array or rejects with err
 */
const fetchByTitle = (genre, title) => {
    let params = {
        TableName: 'VideoGame',
        KeyConditionExpression: "genre = :g and title = :t",
        ExpressionAttributeValues:{
            ":g": genre,
            ":t": title
        }
    };

    initConnection();

    return new Promise((resolve, reject) => {
        return client.query(params, (err, data) => {
            if(err){
                console.error(`Failed to scan the table: ${params.TableName} Err info:`, JSON.stringify(err, null, 2));
                reject(err);       
            }else{
                resolve(data);
            }
        });
    });
}


/**
 * Fetch games by Genre and Rating
 *
 * @param   {Genre!}  genre       A valid variant of Genre Enum
 * @param   {Int!}  lowerBound  From lowest rating
 * @param   {Int!}  upperBound  To highest rating
 *
 * @return  {Promise([VideoGame!])}              Returns a promise resolving to VideoGame array or rejects with err
 */
const fetchByRating = (genre, lowerBound, upperBound) => {
  let params = {
      TableName: 'VideoGame',
      KeyConditionExpression: "#gnr = :g and title between :t1 and :t2",
      FilterExpression: "rating between :r1 and :r2",
      ExpressionAttributeNames: {
          "#gnr": "genre",
      },
      ExpressionAttributeValues:{
          ":g": genre,
          ":t1": 'A',
          ":t2": '~',
          ":r1": lowerBound > upperBound ? upperBound: lowerBound,
          ":r2": lowerBound > upperBound ? lowerBound: upperBound
      }
  };
  
  initConnection();

  return new Promise((resolve, reject) => {
    return client.query(params, (err, data) => {
        if(err){
            console.error(`Failed to scan the table: ${params.TableName} Err info:`, JSON.stringify(err, null, 2));
            reject(err);   
        }else{
            resolve(data);
        }
    });
  });
};



/**
 * Inserts a new game
 *
 * @param   {Genre!}  genre      Variant of a Genre Enum
 * @param   {String!}  title      Game title
 * @param   {String!}  rating     Game rating
 * @param   {String!}  storeLink  Game store link
 *
 * @return  {Promise(NullableVideoGame)}             returns a Promise resolving to NullableVideoGame or rejects with err
 */
const newGame = (genre, title, rating, storeLink) => {
    let params = {
        TableName: 'VideoGame',
        Item: {
            'genre': genre,
            'title': title,
            'rating': rating,
            'storeLink': storeLink
        },
        ReturnValues: 'ALL_OLD'
    };

    initConnection();

    return new Promise((resolve, reject) => {
        return client.put(params, (err, data) => {
            if(err){
                console.error(`Failed to insert an item: ${params.TableName} Err info:`, JSON.stringify(err, null, 2));
                reject(err);   
            }else{
                resolve(data);
            }
        });
    });
};

module.exports = {
    fetchAllGames,
    fetchByGenre,
    fetchByTitle,
    fetchByRating,
    newGame
}