import { Socket } from 'net';

const filterValueObj = {
    name: {last:"Sm"}
};

const client = new Socket();
let buffer = '';

client.connect(8080, () => {
    console.log('Connected');
    client.write(JSON.stringify(filterValueObj) + '\n');
});

client.on('data', (chunk) => {
    buffer += chunk.toString();

    let boundary;
    while ((boundary = buffer.indexOf('\n')) !== -1) {
        const jsonStr = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 1);

        const response = JSON.parse(jsonStr);
        if (response.error) {
            console.log('Server response error:', response.error);
        } else {
            console.log('Server response:', response);
        }
    }
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.log('Client error:', err.message);
});
