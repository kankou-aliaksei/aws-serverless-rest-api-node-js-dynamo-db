export const encodeObj = (data: any): string =>
    Buffer.from(JSON.stringify(data)).toString('base64');

export const decodeObj = (data: string): any => JSON.parse(Buffer.from(data, 'base64').toString());
