export const getErrorsCheckRequiredFields = (item: any): string | null => {
    if (!item.title || !item.status) {
        return 'Required fields are missing';
    }
    return null;
};
