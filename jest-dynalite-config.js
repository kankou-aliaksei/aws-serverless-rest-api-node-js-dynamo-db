const { storedItems } = require('./test/src/data/item.data');

module.exports = {
    tables: [
        {
            TableName: 'rest-api-items_us-east-1_dev',
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' },
                { AttributeName: 'title', AttributeType: 'S' },
                { AttributeName: 'status', AttributeType: 'S' },
                { AttributeName: 'createdAt', AttributeType: 'N' }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'status-createdAt-index',
                    KeySchema: [
                        {
                            AttributeName: 'status',
                            KeyType: 'HASH'
                        },
                        {
                            AttributeName: 'createdAt',
                            KeyType: 'RANGE'
                        }
                    ],
                    Projection: {
                        ProjectionType: 'ALL'
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            ],
            data: storedItems,
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        }
    ]
};
