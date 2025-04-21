# My TCP Filter Server 📡

## Description

This project implements a TCP-based server/client architecture using Node.js Streams. Clients can send a JSON request to the server, which validates and filters data from a local `users.json` file. Depending on the client's metadata, the filtered data is returned in either JSON or CSV format, optionally compressed using gzip.

## Expected Output

### Terminal output (server + client):

```bash
Server listening on port 8080
New client connected
New client connected
Pipeline finished
Pipeline finished
Connected to server
Received CSV:
id;name.first;name.last;phone;address.zip;address.city;address.country;address.street;email
1;Cristobal;Mueller;189-966-8555;20310-8129;Lake Elmiraburgh;Germany;12233 Glover Meadows;lyric.witting@hotmail.com

Connection closed
Connected to server
Successfully decompressed
Filtered JSON objects:
[
  {
    "id": 1,
    "name": {
      "first": "Cristobal",
      "last": "Mueller"
    },
    "phone": "189-966-8555",
    "address": {
      "zip": "20310-8129",
      "city": "Lake Elmiraburgh",
      "country": "Germany",
      "street": "12233 Glover Meadows"
    },
    "email": "lyric.witting@hotmail.com"
  }
]

Connection closed
```

---

## Project Structure

```
tcp-json-filter/
│
├── README.md
├── package.json
│
└── src/
    ├── components/
    │   ├── jsonFilter.js          # Data filtering logic
    │   ├── jsonToCsvConverter.js  # Stream transformer: JSON → CSV
    │   ├── requestValidator.js    # Request validation logic
    │   └── responseHandler.js     # Response processing (JSON, CSV, decompression)
    │
    ├── data/
    │   └── users.json             # Sample input data (array of objects)
    │
    ├── client.js                 # TCP client class
    ├── index.js                  # Main entry point for app
    └── server.js                 # TCP server class
```

---


### users.json (fragment)
```json
[
  {
    "id": 1,
    "name": { "first": "Cristobal", "last": "Mueller" },
    "phone": "189-966-8555",
    "address": {
      "zip": "20310-8129",
      "city": "Lake Elmiraburgh",
      "country": "Germany",
      "street": "12233 Glover Meadows"
    },
    "email": "lyric.witting@hotmail.com"
  },
  .....
]
```

## Example: Input/Output

### Sample Request Sent by Client 1 (CSV, no archive)
```js
{
    filter: { phone: "189-966-8555" },
    meta: {
        format: 'csv',
        archive: false
    }
}
```

### Sample Request Sent by Client 2 (JSON, gzipped)
```js
{
    filter: { phone: "189-966-8555" },
    meta: {
        format: 'json',
        archive: true
    }
}
```
### Output: CSV
```
id;name.first;name.last;phone;address.zip;address.city;address.country;address.street;email
1;Cristobal;Mueller;189-966-8555;20310-8129;Lake Elmiraburgh;Germany;12233 Glover Meadows;lyric.witting@hotmail.com
```

### Output: JSON
```json
[
  {
    "id": 1,
    "name": {
      "first": "Cristobal",
      "last": "Mueller"
    },
    "phone": "189-966-8555",
    "address": {
      "zip": "20310-8129",
      "city": "Lake Elmiraburgh",
      "country": "Germany",
      "street": "12233 Glover Meadows"
    },
    "email": "lyric.witting@hotmail.com"
  }
]
```
---


