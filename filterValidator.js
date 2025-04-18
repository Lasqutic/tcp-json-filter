export default class FilterValidator {
    #allowedFields = new Set([
        'name', 'first', 'last',
        'phone',
        'address', 'zip', 'city', 'country', 'street',
        'email'
    ]);

    validate(filter) {
        if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
            throw new Error('Filter object cannot be empty');
        }
        this.#validateStructure(filter);
    }

    #validateStructure(obj, parentKey = '') {
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
    
            if (!this.#allowedFields.has(key)) {
                throw new Error(`Invalid field: ${fullKey}`);
            }
    
            const isObject = typeof value === 'object' && value !== null;
    
            if (['name', 'address'].includes(key)) {
                if (!isObject) {
                    throw new Error(`${fullKey} must be an object`);
                }
                if (Object.keys(value).length === 0) {
                    throw new Error(`${fullKey} cannot be an empty object`);
                }
                this.#validateStructure(value, fullKey);
            } else {
                if (typeof value !== 'string') {
                    throw new Error(`${fullKey} must be a string`);
                }
                if (value.trim() === '') {
                    throw new Error(`${fullKey} cannot be an empty string`);
                }
            }
        }
    }
    
}

