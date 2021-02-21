import * as _ from 'lodash';
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

import { getModel } from '../model/item.model';
import { toItem } from '../converter';

const ItemModel = getModel();

export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.pathParameters.id;

        const itemResponse = await ItemModel.get({ id });

        if (_.isEmpty(itemResponse)) {
            return {
                statusCode: 404
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(toItem(itemResponse.Item))
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500
        };
    }
};
