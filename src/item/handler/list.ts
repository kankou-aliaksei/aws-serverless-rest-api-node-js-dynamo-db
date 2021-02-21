import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

import { getModel, Item } from '../model/item.model';
import { scanOptions } from 'dynamodb-toolbox/dist/classes/Table';
import { encodeObj, decodeObj } from '../../utils';
import { toItem } from '../converter';

const PAGE_SIZE = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;

const ItemModel = getModel();

type RequestPayload = {
    limit?: string;
    startToken?: string;
};

type ResponsePayload = {
    items: Item[];
    nextToken?: string;
};

export const list = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    try {
        const requestPayload: RequestPayload = event.queryStringParameters
            ? {
                  limit: event.queryStringParameters.limit,
                  startToken: event.queryStringParameters.startToken
              }
            : {};

        const options: scanOptions = {
            limit: requestPayload.limit ? parseInt(requestPayload.limit) : PAGE_SIZE
        };

        requestPayload.startToken ? (options.startKey = decodeObj(requestPayload.startToken)) : {};

        const result: ResponsePayload = await ItemModel.scan(options).then(itemsResponse => {
            const responsePayload: ResponsePayload = {
                items: itemsResponse.Items.map(toItem)
            };
            itemsResponse.LastEvaluatedKey
                ? (responsePayload.nextToken = encodeObj(itemsResponse.LastEvaluatedKey))
                : {};
            return responsePayload;
        });

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500
        };
    }
};
