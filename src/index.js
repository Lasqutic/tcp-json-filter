import Server from './server.js';
import ClientApp from './client.js';

const server = new Server(8080, './src/data/users.json');
server.start();

setTimeout(() => {
    const clientOne = new ClientApp(8080);
    clientOne.connectAndSend({
        filter: { phone: "189-966-8555"},
        meta: {
            format: 'csv',    
            archive: false   
        }
    });
    const clientTwo = new ClientApp(8080);
    clientTwo.connectAndSend({
        filter: { phone: "189-966-8555",},
        meta: {
            format: 'json',    
            archive: true   
        }
    });
}, 500); 