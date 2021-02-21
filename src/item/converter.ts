import { Item } from './model/item.model';

export const toItem = (data: any): Item => {
    if (!data.id || !data.title || !data.status || !data.createdAt)
        throw new Error('Missing required fields for Item');

    const item: Item = {
        id: data.id,
        title: data.title,
        status: data.status,
        createdAt: data.createdAt
    };

    if (data.description) item.description = data.description;
    if (data.updatedAt) item.updatedAt = data.updatedAt;

    return item;
};
