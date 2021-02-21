import * as _ from 'lodash';
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

import { getModel } from '../model/item.model';
import { toItem } from '../converter';
import { getErrorsCheckRequiredFields } from '../validator';

const ItemModel = getModel();

export const update = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.pathParameters.id;

        const storedItemResponse = await ItemModel.get({ id });

        if (_.isEmpty(storedItemResponse)) {
            return {
                statusCode: 404
            };
        }

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

        item.id = storedItemResponse.Item.id;
        item.createdAt = storedItemResponse.Item.createdAt;
        item.updatedAt = Date.now();

        await ItemModel.put(toItem(item));

        return {
            statusCode: 200,
            body: JSON.stringify(item)
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500
        };
    }
};
