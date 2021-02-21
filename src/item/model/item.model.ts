import * as AWS from 'aws-sdk';
import { Table, Entity } from 'dynamodb-toolbox';

const documentClient = new AWS.DynamoDB.DocumentClient();

type ItemStatus = 'WAITING' | 'PROVISIONING' | 'EXECUTING' | 'FAILURE' | 'SUCCESS';

const ITEMS_DYNAMO_DB_TABLE = process.env.ITEMS_DYNAMO_DB_TABLE || '';

export type Item = {
    id: string;
    title: string;
    description?: string;
    status: ItemStatus;
    createdAt: number;
    updatedAt?: number;
};

export const getModel = (): Entity<Item> => {
    const table = new Table({
        partitionKey: 'id',
        name: ITEMS_DYNAMO_DB_TABLE,
        indexes: {
            'status-createdAt-index': {
                partitionKey: 'status',
                sortKey: 'createdAt'
            }
        },
        DocumentClient: documentClient
    });

    return new Entity<Item>({
        name: 'Item',
        attributes: {
            id: { partitionKey: true, type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            createdAt: { type: 'number' },
            updatedAt: { type: 'number' }
        },
        table
    });
};
