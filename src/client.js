import { Socket } from 'net';
import zlib from 'zlib';
import ResponseHandler from './components/responseHandler.js';

export default class ClientApp {
    constructor(port) {
        this.port = port;
        this.socket = new Socket();
        this.resultChunks = [];
    }

    connectAndSend(messageObj) {
        this.socket.connect(this.port, () => {
            console.log('Connected to server');
            this.socket.write(JSON.stringify(messageObj) + '\n');
        });

        this.socket.on('data', chunk => {
            this.resultChunks.push(chunk);
        });

        this.socket.on('end', () => {
            const buffer = Buffer.concat(this.resultChunks);
            const { format, archive } = messageObj.meta;

            if (archive) {
                zlib.gunzip(buffer, (err, decompressed) => {
                    if (err) {
                        console.error('Failed to decompress:', err.message);
                        return;
                    }
                    console.log('Successfully decompressed\n');
                    ResponseHandler.handle(decompressed.toString(), format);
                });
            } else {
                ResponseHandler.handle(buffer.toString(), format);
            }
        });

        this.socket.on('close', () => {
            console.log('Connection closed');
        });

        this.socket.on('error', err => {
            console.error('Socket error:', err.message);
        });
    }
}