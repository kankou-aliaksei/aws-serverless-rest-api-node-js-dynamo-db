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

import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { remove } from '../../../src/item/handler/remove';
import { get } from '../../../src/item/handler/get';
import { storedItems } from '../data/item.data';

describe('Remove Item', () => {
    it('Must return a successful code', async () => {
        const response: APIGatewayProxyResultV2 = await remove({
            pathParameters: {
                id: '24342fe8-4554-44fe-bf45-ff6b2d83a6bb'
            }
        });

        expect(response.statusCode).toEqual(200);
    });

    it('Must delete an expected item by id', async () => {
        const id = storedItems[0].id;

        await remove({
            pathParameters: { id }
        });

        const response: APIGatewayProxyResultV2 = await get({
            pathParameters: { id }
        });

        expect(response.statusCode).toEqual(404);
    });

    it('Must return 404 status code', async () => {
        const response: APIGatewayProxyResultV2 = await remove({
            pathParameters: {
                id: 'non-existent id'
            }
        });

        expect(response.statusCode).toEqual(404);
    });
});
