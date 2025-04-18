import { Socket } from 'net';
import { LineSplitter } from './lineSplitter.js';

const filterValueObj = {
    name: { last: "Sm" }
};

const client = new Socket();

client.connect(8080, () => {
    console.log('Connected to server');
    client.write(JSON.stringify(filterValueObj) + '\n');
});

const lineSplitter = new LineSplitter();
client.pipe(lineSplitter);

lineSplitter.on('data', (line) => {

    const response = JSON.parse(line);
    if (response.error) {
        console.log('Server response error:', response.error);
    } else {
        console.log('Server response:', response);
    }

});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.log('Client error:', err.message);
});
