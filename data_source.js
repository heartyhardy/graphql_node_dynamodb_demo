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


module.exports = {
    fetchAllGames,
}