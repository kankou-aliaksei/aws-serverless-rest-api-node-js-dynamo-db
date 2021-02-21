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

import { update } from '../../../src/item/handler/update';
import { get } from '../../../src/item/handler/get';
import { storedItems } from '../data/item.data';
import { Item } from '../../../src/item/model/item.model';

describe('Update Item', () => {
    it('Must return a successful code', async () => {
        const item: Omit<Item, 'id' | 'createdAt'> = {
            title: 'Updated Item',
            status: 'SUCCESS'
        };

        const updateRequest = {
            pathParameters: {
                id: storedItems[0].id
            },
            body: JSON.stringify(item)
        };

        const response: APIGatewayProxyResultV2 = await update(updateRequest);

        expect(response.statusCode).toEqual(200);
    });

    it('Must return the updated item', async () => {
        const item: Omit<Item, 'id' | 'createdAt'> = {
            title: 'Updated Item',
            status: 'SUCCESS'
        };

        const updateRequest = {
            pathParameters: {
                id: storedItems[0].id
            },
            body: JSON.stringify(item)
        };

        const response: APIGatewayProxyResultV2 = await update(updateRequest);

        const updatedItem = JSON.parse(response.body);

        delete updatedItem.id;
        delete updatedItem.createdAt;
        delete updatedItem.updatedAt;

        expect(updatedItem).toEqual(item);
    });

    it('Must update the item', async () => {
        const id = storedItems[0].id;

        const item: Omit<Item, 'id' | 'createdAt'> = {
            title: 'Updated Item',
            status: 'SUCCESS'
        };

        const updateRequest = {
            pathParameters: {
                id
            },
            body: JSON.stringify(item)
        };

        const updateResponse: APIGatewayProxyResultV2 = await update(updateRequest);

        const updatedItem = JSON.parse(updateResponse.body);

        const getResponse: APIGatewayProxyResultV2 = await get({
            pathParameters: {
                id
            }
        });

        const actualUpdatedItem: Item = JSON.parse(getResponse.body);

        expect(actualUpdatedItem).toEqual(updatedItem);
    });

    it('Must set number for updated at field', async () => {
        const id = storedItems[0].id;

        const item: Omit<Item, 'id' | 'createdAt'> = {
            title: 'Updated Item',
            status: 'SUCCESS'
        };

        const updateRequest = {
            pathParameters: {
                id
            },
            body: JSON.stringify(item)
        };

        const updateResponse: APIGatewayProxyResultV2 = await update(updateRequest);

        const updatedItem: Item = JSON.parse(updateResponse.body);

        expect(typeof updatedItem.updatedAt === 'number').toBeTruthy();
    });
});
