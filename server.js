import net from 'net';
import JsonFilter from './JsonFilter.js';
import RequestValidator from './requestValidator.js';
import JsonToCsvConverter from './jsonToCsvConverter.js';
import { Readable, Transform, pipeline } from 'stream';
import zlib from 'zlib';

const server = net.createServer();
const PORT = 8080;
const PATH_TO_JSON = './data/users.json';

server.on('connection', (socket) => {
    console.log('New client connected');

    let buffer = '';

    socket.on('data', async chunk => {
        buffer += chunk.toString();

        let index;
        while ((index = buffer.indexOf('\n')) !== -1) {
            const rawClientMessage = buffer.slice(0, index);
            buffer = buffer.slice(index + 1);

            try {

                const clientObjFilter = JSON.parse(rawClientMessage);
                new RequestValidator().validate(clientObjFilter);

                const jsonFilter = new JsonFilter(PATH_TO_JSON);
                const filtered = await jsonFilter.readAndFilterJson(clientObjFilter.filter);

                const dataStream = Readable.from(filtered, { objectMode: true });

                const streams = [dataStream];

                if (clientObjFilter.meta.format === 'csv') {
                    streams.push(new JsonToCsvConverter());
                } else {
                    streams.push(new Transform({
                        writableObjectMode: true,
                        transform(obj, _, cb) {
                            console.log(obj)
                            this.push(JSON.stringify(obj) + '\n');
                            cb();
                        }
                    }));
                }

                if (clientObjFilter.meta.archive) {
                    streams.push(zlib.createGzip());
                }

                pipeline(
                    ...streams,
                    socket,
                    (err) => {
                        if (err) {
                            console.log('Pipeline error:', err);
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
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err) => {
        console.log('Socket error:', err.message);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
