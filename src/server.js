import net from 'net';
import { Readable, Transform, pipeline } from 'stream';
import zlib from 'zlib';
import { JsonFilter, JsonToCsvConverter, RequestValidator } from './components/index.js';

export default class Server {
    constructor(port, pathToJson) {
        this.port = port;
        this.pathToJson = pathToJson;
        this.server = net.createServer();
        this.server.on('connection', (socket) => this.#handleConnection(socket));
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }

    #handleConnection(socket) {
        console.log('New client connected');
        let buffer = '';

        socket.on('data', chunk => {
            buffer += chunk.toString();

            let index;
            while ((index = buffer.indexOf('\n')) !== -1) {
                const rawClientMessage = buffer.slice(0, index);
                buffer = buffer.slice(index + 1);
                this.#handleRequest(socket, rawClientMessage);
            }
        });

        socket.on('end', () => {
            console.log('Client disconnected\n');
        });

        socket.on('error', err => {
            console.log('Socket error:', err.message);
        });
    }

    async #handleRequest(socket, rawClientMessage) {
        try {
            const clientObj = JSON.parse(rawClientMessage);

            RequestValidator.validate(clientObj);

            const jsonFilter = new JsonFilter(this.pathToJson);
            const filtered = await jsonFilter.readAndFilterJson(clientObj.filter);

            const dataStream = Readable.from(filtered, { objectMode: true });
            const streams = [dataStream];

            if (clientObj.meta.format === 'csv') {
                streams.push(new JsonToCsvConverter());
            } else {
                streams.push(new Transform({
                    writableObjectMode: true,
                    transform(obj, _, cb) {
                        this.push(JSON.stringify(obj) + '\n');
                        cb();
                    }
                }));
            }

            if (clientObj.meta.archive) {
                streams.push(zlib.createGzip());
            }

            pipeline(
                ...streams,
                socket,
                err => {
                    if (err) {
                        console.error('Pipeline error:', err.message);
                    } else {
                        console.log('Pipeline finished');
                    }
                }
            );
        } catch (err) {
            socket.write(JSON.stringify({ error: err.message }) + '\n');
            socket.end();
        }
    }
}
