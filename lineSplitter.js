import { Transform } from 'stream';

export class LineSplitter extends Transform {
    constructor(options = {}) {
        super({ ...options, readableObjectMode: true });
        this._buffer = '';
    }

    _transform(chunk, encoding, callback) {
        this._buffer += chunk.toString();

        let index;
        while ((index = this._buffer.indexOf('\n')) !== -1) {
            const line = this._buffer.slice(0, index);
            this._buffer = this._buffer.slice(index + 1);
            this.push(line);
        }

        callback();
    }

    _flush(callback) {
        if (this._buffer.length > 0) {
            this.push(this._buffer);
        }
        callback();
    }
}
