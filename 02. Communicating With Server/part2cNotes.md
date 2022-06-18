# Getting Data From Server
- We've only been working on frontend right now.
    - This is client-side functionality.
- The backend will be worked on in Part 3.
- We will now see how code executing in the browser communicates with the backend.
- Use a tool meant to be used during development.
    - `JSON Server` will act as our server.
- Create a file named `db.json` in the root directory with the following:
```json
{
    "notes": [
        {
            "id": 1,
            "content": "HTML is easy",
            "date": "2022-1-17T17:30:31.098Z",
            "important": true
        },
        {
            "id": 2,
            "content": "Browser can execute only JavaScript",
            "date": "2022-1-17T18:39:34.091Z",
            "important": false
        },
        {
            "id": 3,
            "content": "GET and POST are the most important methods of HTTP protocol",
            "date": "2022-1-17T19:20:14.298Z",
            "important": true
        }
    ]
}
```
- Can install `JSON Server` globally:
    - `$ npm install -g json-server`.
    - Requires admin privileges.
    - Global installation not necessary.
- From root of app, run `json-server` using `npx` command:
```
$ npx json-server --port 3001 --watch db.json
```
- `json-server` starts running on 3000 by default.
    - Our CRA app is running in 3000, so we define an alternate port, 3001.
- Navigate to `http://localhost:3001/notes` in the browser.
    - The `notes` is the name of the "notes" property of the JSON object.
    - The notes are served in the browser in JSON format.
- Install plugins to view the format properly.
- Idea is to save notes to the server.
    - Save them to `json-server`.
    - React fetches notes from server and renders to screen.
    - When a new note is added, React sends it to the server to persist in memory.
- `json-server` stores all data in `db.json` file.
    - Resides in server.
    - In the real world, data would be stored in a database.
    - `json-server` is a handy tool that allows the use of server-side functionality in development phase without the need to program it.
    - We will do more of this in Part 3.


