# JSON Filter & CSV Converter over TCP

## Description

This project demonstrates a Node.js TCP client-server system that allows clients to send filtering criteria to the server. The server reads a local JSON file (`data/users.json`), filters its content based on the client's request, optionally converts it to JSON or CSV format, and optionally compresses the result with Gzip before sending it back to the client.

Key features:
- Deep filtering support for nested JSON (e.g. `name.last` or `address.city`)
- Format options: JSON or CSV
- Optional Gzip compression

---

## Expected Output

When running the server and client with the provided code and sending the following request:

```js
const filterValueObj = {
    filter: { name: { last: 'Smith' } },
    meta: {
        format: 'csv',
        archive: false
    }
};
```

You should see the following output in the client console:

```bash
Connected to server
Received CSV:
id;name.first;name.last;phone;address.zip;address.city;address.country;address.street;email
0;Ron;Smith;615-245-4689;10496-0178;West Garfieldview;Kuwait;10984 Alanna Points;annabell11.hackett@hotmail.com
0;Ron;Smitham;615-246-4689;2096-0178;South Garfieldview;Kuwait;204984 Alanna Points;annabell22.hackett@hotmail.com
353;Nathen;Smitham;939-993-9588;03338;Port Louisa;Vietnam;9725 Karina Skyway;teagan_bradtke@yahoo.com
446;Sydney;Smith;117-670-9700;96796;Faychester;Sudan;742 Janis Ford;teagan_conroy@gmail.com
496;Lenore;Smitham;978-878-8131;78059-6572;Lake Lonieshire;Papua New Guinea;0510 Toby Oval;arjun_turner@hotmail.com

Connection closed
```

---

## Example Input JSON (data/users.json)

```json
[
  {
    "id": 0,
    "name": {
      "first": "Ron",
      "last": "Smith"
    },
    "phone": "615-245-4689",
    "address": {
      "zip": "10496-0178",
      "city": "West Garfieldview",
      "country": "Kuwait",
      "street": "10984 Alanna Points"
    },
    "email": "annabell11.hackett@hotmail.com"
  },
  {
    "id": 0,
    "name": {
      "first": "Ron",
      "last": "Smitham"
    },
    "phone": "615-246-4689",
    "address": {
      "zip": "2096-0178",
      "city": "South Garfieldview",
      "country": "Kuwait",
      "street": "204984 Alanna Points"
    },
    "email": "annabell22.hackett@hotmail.com"
  }
]
```

---

## Project Structure

- `server.js`: TCP server logic, validates client input, filters and streams data
- `client.js`: Sends filter/meta, receives and logs result
- `jsonFilter.js`: Reads JSON file and filters based on nested conditions
- `requestValidator.js`: Validates structure and types of client request
- `jsonToCsvConverter.js`: Stream transform that flattens JSON to CSV with nested field support


---

## Usage

1. Start the server:
   ```bash
   node server.js
   ```

2. Run the client:
   ```bash
   node client.js
   ```

3. Optionally modify the `filterValueObj` in `client.js` to test different scenarios:
   - Filter by other fields
   - Change output format to `json`
   - Enable `archive: true` for gzip compression

---

Let me know if you want an example with `archive: true` and decompression output!

