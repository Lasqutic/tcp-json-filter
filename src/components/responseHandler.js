export default class ResponseHandler {
    static handle(text, format) {
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
}
