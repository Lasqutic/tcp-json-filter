import net from 'net';
import JsonFilter from './JsonFilter.js';
import FilterValidator from './FilterValidator.js';

const server = net.createServer();
const PORT = 8080;
const PATH_TO_JSON = './data/users.json';

server.on('connection', (socket) => {
    console.log('New client connected');

    let buffer = '';

    socket.on('data', async (chunk) => {
        buffer += chunk.toString();

        let boundary;
        while ((boundary = buffer.indexOf('\n')) !== -1) {
            const requestStr = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 1);

            try {
                const filterValueObj = JSON.parse(requestStr);

                const validator = new FilterValidator();
                validator.validate(filterValueObj);

                const jsonFilter = new JsonFilter(PATH_TO_JSON);
                const filtered = await jsonFilter.readAndFilterJson(filterValueObj);

                socket.write(JSON.stringify(filtered) + '\n');
            } catch (err) {
                const errorMessage = { error: err.message };
                socket.write(JSON.stringify(errorMessage) + '\n');
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
