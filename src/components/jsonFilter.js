import fsp from 'fs/promises';

export default class JsonFilter {
    constructor(pathToJson) {
        this.pathToJson = pathToJson;
    }

    async readAndFilterJson(filterObj) {
        try {
            const data = await fsp.readFile(this.pathToJson, 'utf8');
            const parsed = JSON.parse(data);
            return this.#filter(parsed, filterObj);
        } catch (err) {
            throw new Error(`Read/parse Json file error: ${err.message}`);
        }
    }

    #filter(dataArray, filter) {
        return dataArray.filter(obj => this.#matches(obj, filter));
    }

    #matches(obj, filter) {
        if (typeof obj !== 'object' || obj === null) return false;

        for (const key in filter) {
            const filterValue = filter[key];
            const objValue = obj[key];

            if (typeof filterValue === 'object' && filterValue !== null) {
                if (!this.#matches(objValue, filterValue)) return false;
            } else if (typeof objValue !== 'string' || !objValue.includes(filterValue)) {
                    return false;
                }
            }
        

        return true;
    }
}
