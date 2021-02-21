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
import { get } from '../../../src/item/handler/get';

describe('Get Item', () => {
    it('Must return a successful code', async () => {
        const response: APIGatewayProxyResultV2 = await get({
            pathParameters: {
                id: '24342fe8-4554-44fe-bf45-ff6b2d83a6bb'
            }
        });

        expect(response.statusCode).toEqual(200);
    });

    it('Must return an expected item by id', async () => {
        const response: APIGatewayProxyResultV2 = await get({
            pathParameters: {
                id: '24342fe8-4554-44fe-bf45-ff6b2d83a6bb'
            }
        });

        const actualItem: Item = JSON.parse(response.body);

        expect(actualItem).toEqual(storedItems[0]);
    });

    it('Must return 404 status code', async () => {
        const response: APIGatewayProxyResultV2 = await get({
            pathParameters: {
                id: 'non-existent id'
            }
        });

        expect(response.statusCode).toEqual(404);
    });
});
