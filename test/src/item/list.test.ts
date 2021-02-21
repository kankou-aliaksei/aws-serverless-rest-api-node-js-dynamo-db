import * as AWS from 'aws-sdk';

import 'jest-dynalite/withDb';
import { setup } from 'jest-dynalite';

setup('.');

const config = {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: 'local'
};

AWS.config.update(config);

import { storedItems } from '../data/item.data';
import { Item } from '../../../src/item/model/item.model';

import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { list } from '../../../src/item/handler/list';

describe('List Items', () => {
    it('Must return a successful code', async () => {
        const response: APIGatewayProxyResultV2 = await list({});

        expect(response.statusCode).toEqual(200);
    });

    it('Must return expected set of items', async () => {
        const response: APIGatewayProxyResultV2 = await list({});

        const actualItems: Item[] = JSON.parse(response.body).items;

        expect(actualItems.includes(storedItems[0]));
        expect(actualItems.includes(storedItems[1]));
    });

    it('Must return expected number of items', async () => {
        const response: APIGatewayProxyResultV2 = await list({
            queryStringParameters: {
                limit: '1'
            }
        });

        const actualItems: Item[] = JSON.parse(response.body).items;

        expect(actualItems.length === 1).toBeTruthy();
    });

    it('Must return the next token and return expected items if a start token is specified', async () => {
        const firstResponse: APIGatewayProxyResultV2 = await list({
            queryStringParameters: {
                limit: '1'
            }
        });

        const firstResponsePayload = JSON.parse(firstResponse.body);

        const nextToken = firstResponsePayload.nextToken;
        const firstResultActualItems: Item[] = firstResponsePayload.items;

        expect(firstResultActualItems).toEqual([storedItems[0]]);

        const secondResponse: APIGatewayProxyResultV2 = await list({
            queryStringParameters: {
                limit: '1',
                startToken: nextToken
            }
        });

        const secondResponsePayload = JSON.parse(secondResponse.body);

        const secondResultActualItems: Item[] = secondResponsePayload.items;

        expect(secondResultActualItems).toEqual([storedItems[1]]);
    });
});
