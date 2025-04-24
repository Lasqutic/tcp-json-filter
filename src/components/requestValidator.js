export default class RequestValidator {
    static #allowedFormats = new Set(['csv', 'json']);
    static #allowedFields = new Set([
        'name', 'first', 'last',
        'phone',
        'address', 'zip', 'city', 'country', 'street',
        'email'
    ]);

    static validate(request) {
        if (!request || typeof request !== 'object') {
            throw new Error('Request must be an object');
        }

        const { filter, meta } = request;

        if (!filter || typeof filter !== 'object') {
            throw new Error('Missing or invalid "filter" field');
        }

        if (!meta || typeof meta !== 'object') {
            throw new Error('Missing or invalid "meta" field');
        }

        this.#validateFilter(filter);
        this.#validateMeta(meta);
    }

    static #validateMeta(meta) {
        if (!this.#allowedFormats.has(meta.format)) {
            throw new Error('Invalid format. Allowed: csv, json');
        }

        if (typeof meta.archive !== 'boolean') {
            throw new Error('Meta.archive must be boolean');
        }
    }

    static #validateFilter(filter) {
        if (Object.keys(filter).length === 0) {
            throw new Error('Filter object cannot be empty');
        }

        this.#validateStructure(filter);
    }

    static #validateStructure(obj, parentKey = '') {
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
