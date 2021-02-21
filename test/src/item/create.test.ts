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

import { create } from '../../../src/item/handler/create';
import { get } from '../../../src/item/handler/get';
import { apiGatewayProxyCreateRequest } from '../data/item.data';
import { Item } from '../../../src/item/model/item.model';

describe('Create Item', () => {
    it('Must return a successful code', async () => {
        const apiGatewayProxyRequest = { ...apiGatewayProxyCreateRequest };

        const item = {
            title: 'Title',
            status: 'WAITING'
        };

        apiGatewayProxyRequest.body = JSON.stringify(item);

        const response: APIGatewayProxyResultV2 = await create(apiGatewayProxyRequest);

        expect(response.statusCode).toEqual(201);
    });

    it('Must return the saved item', async () => {
        const apiGatewayProxyRequest = { ...apiGatewayProxyCreateRequest };

        const item = {
            title: 'Title',
            status: 'WAITING'
        };

        apiGatewayProxyRequest.body = JSON.stringify(item);

        const response: APIGatewayProxyResultV2 = await create(apiGatewayProxyRequest);

        const savedItem = JSON.parse(response.body);

        delete savedItem.id;
        delete savedItem.createdAt;

        expect(savedItem).toEqual(item);
    });

    it('Must store the saved item', async () => {
        const apiGatewayProxyRequest = { ...apiGatewayProxyCreateRequest };

        const item = {
            title: 'Title',
            status: 'WAITING'
        };

        apiGatewayProxyRequest.body = JSON.stringify(item);

        const createResponse: APIGatewayProxyResultV2 = await create(apiGatewayProxyRequest);

        const savedItem: Item = JSON.parse(createResponse.body);

        const getResponse: APIGatewayProxyResultV2 = await get({
            pathParameters: {
                id: savedItem.id
            }
        });

        expect(getResponse.statusCode).toEqual(200);
    });
});
