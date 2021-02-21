import * as _ from 'lodash';
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

import { getModel } from '../model/item.model';

const ItemModel = getModel();

export const remove = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.pathParameters.id;

        const storedItem = await ItemModel.get({ id });

        if (_.isEmpty(storedItem)) {
            return {
                statusCode: 404
            };
        }

        await ItemModel.delete({ id });

        return {
            statusCode: 200
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500
        };
    }
};
