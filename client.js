import { Socket } from 'net';
import zlib from 'zlib';

const client = new Socket();

const filterValueObj = {
    filter: { name: { last: 'Smith' } },
    meta: {
        format: 'csv',
        archive: false
    }
};

client.connect(8080, () => {
    console.log('Connected to server');
    client.write(JSON.stringify(filterValueObj) + '\n');
});

let resultChunks = [];

client.on('data', chunk => {
    resultChunks.push(chunk);
});

client.on('end', () => {
    const buffer = Buffer.concat(resultChunks);
    const { format, archive } = filterValueObj.meta;

    if (archive) {
        zlib.gunzip(buffer, (err, decompressed) => {
            if (err) {
                console.log('Failed to decompress:', err.message);
                return;
            }
            console.log('Successfully decompressed\n')
            handleResponse(decompressed.toString(), format);
        });
    } else {
        handleResponse(buffer.toString(), format);
    }
});

function handleResponse(text, format) {
    if (format === 'json') {
        const lines = text.trim().split('\n');
        const results = [];

        for (const line of lines) {
            try {
                results.push(JSON.parse(line));
            } catch (err) {
                console.log('Failed to parse JSON line:\n', line);
            }
        }

        console.log('Filtered JSON objects:\n', results);
    } else if (format === 'csv') {
        console.log('Received CSV:\n', text);
    } else {
        console.log('Unknown format:\n', text);
    }
}

client.on('close', () => {
    console.log('Connection closed\n');
});
