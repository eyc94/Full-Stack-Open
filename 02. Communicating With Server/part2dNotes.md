# Altering Data In Server
- We want to store notes in some backend server when we create notes.
- `json-server` claims to be REST or RESTful API in its documentation:
    - **Get a full fake REST API with zero coding in less than 30 seconds (seriously)**
    - Does not match textbook definition of REST API, but neither do most that claim so.
    - Important to familiarize ourselves with conventions used by `json-server` and REST APIs in general.
    - We will look at conventional use of `routes`.
        - Known as URLs and HTTP request types.


## REST
- In REST terminology, the individual data objects (like notes) are called `resources`.
    - Every resource has a unique address to it (URL).
    - General convention of `json-server` is that to locate a note of `id` of 3 we go to URL `notes/3`.
    - The `notes` URL would point to a collection containing all the notes.
- Resources fetched using HTTP GET requests.
    - HTTP GET request to `notes/3` returns a note with `id` of 3.
    - HTTP GET request to `notes` returns all notes.
- Creating new resource for storing a note is done by making HTTP POST request to the `notes` URL.
    - Data of new note is sent in the body of the request object.
- `json-server` requires all data be sent in JSON format.
    - Data must be a correctly formatted string.
    - The request must contain the `Content-Type` request header with the value of `application/json`.


## Sending Data To The Server
- Make the following changes to the event handler that creates a new note.
```javascript
addNote = event => {
    event.preventDefault();

    const noteObject = {
        content: newNote,
        date: new Date(),
        important: Math.random() < 0.5
    };

    axios
        .post("http://localhost:3001/notes", noteObject)
        .then(response => {
            console.log(response);
        });
};
```
- Create new note object for note but omit `id` property.
    - Let the server generate the `id`!
- Object sent to server using axios's `post` method.
    - The event handler logs the response that is sent back from the server to console.
    - The new note resource is stored in `data` property of the `response` object.
- Inspect HTTP requests in `Network` tab of console to see data.
- Data sent in POST request was a JS object.
    - Axios knew to set the appropriate `application/json` value for the `Content-Type` header.
- New note not rendered because we didn't update state of `App` component.
- Fix this:
```javascript
addNote = event => {
    event.preventDefault();

    const noteObject = {
        content: newNote,
        date: new Date(),
        important: Math.random() < 0.5
    };

    axios
        .post("http://localhost:3001/notes", noteObject)
        .then(response => {
            setNotes(notes.concat(response.data));
            setNewNote("");
        });
};
```
- The new note returned by backend server is used to update state in `App`.
    - Remember to use `concat` because it creates a copy of the list.
- New challenge of asynchronicity is introduced.
- Beneficial to inspect state of backend through the browser.
    - Good for verifying data is sent to server.
- Better to let backend generate timestamp for us.


