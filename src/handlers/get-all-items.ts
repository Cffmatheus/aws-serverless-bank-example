// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import dynamodb from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk';
// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;
// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const docClient = new dynamodb.DocumentClient();
// var docClient = new DynamoDBClient({
//     region: 'us-west-2',
//     endpoint: 'http://localhost:8000'
//   });

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getAllItemsHandler = async (event: { httpMethod: string; path: any; }) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
    var params = {
        TableName : tableName
    };
    const data = await docClient.scan(params).promise();
    const items = data.Items;

    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
