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
 * @return  {Promise([Game!])}  Returns a promise, resolves to data or rejects with err
 */
const fetchAllGames = () => {
    let params = {
        TableName: 'Game'
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
 * Fetch a Game by its UUID
 *
 * @param   {String!}  gameID  GameID is a uuid and should be String, not nullable
 *
 * @return  {Promise([Game])}          Returns a Promise, resolves to data or rejects with err
 */
const fetchGameByID = (gameID) =>{
    let params = {
        TableName: 'Game',
        KeyConditionExpression: 'uid = :u',
        ExpressionAttributeValues: {
            ":u": gameID,
        }
    }

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
 * Fetch A Game by its Genre
 *
 * @param   {Game!}  genre  One of Genre enum variants as specified in the Schema
 *
 * @return  {Promise([Game!])}         Returns a promise, resolves to data or rejects with err
 */
const fetchGamesByGenre = (genre) => {
    let params = {
        TableName: 'Game',
        FilterExpression: 'genre = :gn',
        ExpressionAttributeValues: {
            ":gn": genre,
        }
    }

    initConnection();

    return new Promise((resolve, reject) => {
        return client.scan(params, (err, data) => {
            if(err){
                console.error(`Failed to scan the table: ${params.TableName} Err info:`, JSON.stringify(err, null, 2));
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
}


module.exports = {
    fetchAllGames,
    fetchGameByID,
    fetchGamesByGenre,
}