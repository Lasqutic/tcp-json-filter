import { Transform } from 'stream';

export default class JsonToCsvConverter extends Transform {
    #isHeaderWritten = false;
    #headers = [];


    constructor() {
        super({ writableObjectMode: true });
    }

    _transform(chunk, encoding, callback) {
        try {
            if (!this.#isHeaderWritten) {
                this.#headers = this.#extractHeaders(chunk);
                this.push(this.#headers.join(';') + '\n');
                this.#isHeaderWritten = true;
            }

            const values = this.#headers.map(header => {
                let value = this.#getValueByPath(chunk, header);

                value = String(value ?? '').replace(/"/g, '""');

                if (value.includes(',') || value.includes(';') 
                    || value.includes('"') || value.includes('\n')) {
                
                    value = `"${value}"`;
                }

                return value;
            });

            const line = values.join(';') + '\n';
            console.log(line);
            this.push(line);
            callback();
        } catch (err) {
            callback(err);
        }
    }

    #extractHeaders(obj, parent = '', headers = []) {

        for (const key in obj) {
            
            const fullPath = parent ? `${parent}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                this.#extractHeaders(obj[key], fullPath, headers);
            } else {
                headers.push(fullPath);
            }
        }
        return headers;
    }

    #getValueByPath(obj, path) {
      
        const parts = path.split('.');
        let current = obj;
      
        for (const part of parts) {
            if (current == null || typeof current !== 'object') return undefined;
           
            current = current[part];
        }
        return current;
    }
}
