import { v4 as uuid } from 'uuid';
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

import { getModel } from '../model/item.model';
import { toItem } from '../converter';
import { getErrorsCheckRequiredFields } from '../validator';

const ItemModel = getModel();

export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    try {
        const item = JSON.parse(event.body);

        const validationErrors = getErrorsCheckRequiredFields(item);
        if (validationErrors) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        message: validationErrors
                    }
                })
            };
        }

        item.id = uuid();
        item.createdAt = Date.now();

        await ItemModel.put(toItem(item));

        return {
            statusCode: 201,
            body: JSON.stringify(item)
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500
        };
    }
};
