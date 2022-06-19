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


## Changing The Importance Of Notes
- Add a button to every note to change its importance.
- Make the following changes to `Note` component:
```javascript
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? "make not important" : "make important";
    
    return (
        <li>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    );
};
```
- Add a button to the component.
    - Assign its event handler as the `toggleImportance` function passed in the props.
- The `App` component defines initial version of `toggleImportanceOf` event handler function and passes to every `Note`.
```javascript
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(true);

    // ...

    const toggleImportanceOf = (id) => {
        console.log("Importance of " + id + " needs to be toggled");
    };

    // ...

    return (
        <div>
            <h1>Notes</h1>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul>
            // ...
        </div>
    );
};
```
- Notice that every note has its own event handler because each note's `id` is unique.
- Use `template string` to display strings nicer.
```javascript
console.log(`importance of ${id} needs to be toggled`);
```
- The `dollar-bracket` syntax can be used to evaluate JS syntax.
- Individual notes in backend can be modified in two ways by making HTTP request to the unique URL.
    - Replace entire note with HTTP PUT request
    - Change some of the note with HTTP PATCH request.
- Final form of event handler function:
```javascript
const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    axios.put(url, changedNote).then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data));
    });
};
```
- First line defines unique URL for each note resource based on `id`.
- The `find()` method finds the note we want to modify.
- We create a new object that is an exact copy of the old note.
    - Only the `important` property is different.
    - The new object is a copy of the old.
    - The value of the `important` is changed to its negation.
- Why did we make a copy of the note we want to modify?
    - Why not modify it directly?
```javascript
const note = notes.find(n => n.id === id);
note.important = !note.important;

axios.put(url, note).then(response => {
    // ...
```
- Never mutate state directly.
- Notice that `changedNote` is a `shallow copy`.
    - Values of new object is the same as the value of the old.
    - If the values of old object were also objects, then the copied values in the new object would reference the same objects in the old object.
- New note is sent with PUT request to server which will completely replace the old note.
- Callback sets `notes` state to new array.
    - It has all items from the previous `notes` array.
    - It doesn't have the old note that is to be replaced by the updated version.
- The `map` method above works like so:
    - Creates new array by mapping every item from the old array into an item in the new array.
    - New array is created conditionally.
    - If the note is NOT the note we are updating, keep that original note.
    - If the note IS the note we are updating, use the object returned by the server to add to the array.


## Extracting Communication With The Backend Into A Separate Module
- `App` is now bloated.
    - We have code for communicating with the backend.
- Implement the `single responsibility principle`.
    - Extract communication to its own module.
- Create a `src/services` folder.
    - Add a file called `notes.js`.
```javascript
import axios from "axios";
const baseUrl = "http://localhost:3001/notes";

const getAll = () => {
    return axios.get(baseUrl);
};

const create = newObject => {
    return axios.post(baseUrl, newObject);
};

const update = (id newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject);
};

export default {
    getAll: getAll,
    create: create,
    update: update
};
```
- Module returns object with three functions.
- The functions directly return the promises returned by the axios methods.
- The `App` component uses `import` to get access to the module.
```javascript
import noteService from "./services/note";

const App = () => {
```
- Functions of module can be used with imported variable `noteService`:
```javascript
const App = () => {
    // ...

    useEffect(() => {
        noteService
            .getAll()
            .then(response => {
                setNotes(response.data);
            });
    }, []);

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then(response => {
                setNotes(notes.map(note => note.id !== id ? note : response.data));
            });
    };

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            date: newDate().toISOString(),
            important: Math.random() > 0.5
        };

        noteService
            .create(noteObject)
            .then(response => {
                setNotes(notes.concat(response.data));
                setNewNote("");
            });
    };

    // ...
};

export default App;
```
- Take implementation a step further.
- When `App` uses the functions, it receives an object that contains entire response.
    - We only need `response.data`.
- What if we only get back from the server what we need?
```javascript
noteService
    .getAll()
    .then(initialNotes => {
        setNotes(initialNotes);
    });
```
- This works if we change our server module like so:
```javascript
import axios from "axios";
const baseUrl = "http://localhost:3001/notes";

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = newObject => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
};

const update = (id newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};

export default {
    getAll: getAll,
    create: create,
    update: update
};
```
- We no longer return the promise from the axios method.
- We assign promise to the `request` variable and call its `then` method.
- It might be better visually if we use:
```javascript
const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => {
        return response.data;
    });
};
```
- The `getAll` method returns a promise because the `then` method returns a promise.
- We directly define the `then` method to return `response.data`.
- Update `App` to work with the changes made to our module.
    - Fix callbacks given as parameters to `noteService` object's methods.
    - They need to use the returned response data directly.
```javascript
const App = () => {
    // ...

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes);
            });
    }, []);

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnedNote));
            });
    };

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            date: newDate().toISOString(),
            important: Math.random() > 0.5
        };

        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
                setNewNote("");
            });
    };

    // ...
};
```
- Promises are central to modern JavaScript development.
    - Should invest time in learning and understanding them.
- Resources:
    - Promises Chaining: `https://javascript.info/promise-chaining`
    - You Don't Know JS - 1st Edition: `https://github.com/getify/You-Dont-Know-JS/tree/1st-ed`
    - You Don't Know JS - Async & Performance: `https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md`


## Cleaner Syntax For Defining Object Literals
- The export in the module is kind of weird looking.
- Notice the keys and values of the object are the same.
    - We can write it more compactly.
```javascript
{
    getAll,
    create,
    update
}
```
- So simplify:
```javascript
export default { getAll, create, update };
```
- This was newly introduced.
- For example:
```javascript
const name = "Leevi";
const age = 0;

const person = {
    name: name,
    age: age
};
```
- New way:
```javascript
const person = { name, age };
```


## Promises And Errors
- What if a user tries to change the importance of a note that is already deleted?
- Test this.
    - Have `getAll` return a hard-coded note that does not exist on the backend server.
```javascript
const getAll = () => {
    const request = axios.get(baseUrl);
    const nonExisting = {
        id: 10000,
        content: "This note is note saved to server",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    };
    return request.then(repsonse => response.data.concat(nonExisting));
};
```
- When trying to change importance of hard-coded note.
    - We get 404 not found.
    - App should handle these errors gracefully.
- A promise can be in three states.
- Need to handle the rejection of a promise.
    - This is done by providing the `then` method with a second callback function.
    - This is called when the promise is rejected.
    - Use the `catch` method.
```javascript
axios
    .get("http://example.com/probably_will_fail")
    .then(response => {
        console.log("success");
    })
    .catch(error => {
        console.log("fail");
    });
```
- If request fails, event handler registered to `catch` is called.
- The `catch` is placed deeper in the promise chain.
- When app makes HTTP request, we are making promise chain.
```javascript
axios
    .put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
    .then(changedNote => {
        // ...
    });
```
- The `catch` is used at the end to catch an error.
```javascript
axios
    .put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
    .then(changedNote => {
        // ...
    })
    .catch(error => {
        console.log("fail");
    });
```
- Register an error handler in `App` component:
```javascript
const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.imporant };

    noteService
        .update(id, changedNote).then(returnedNote => {
            setNotes(notes.map(note => note.id !== id ? note : returnedNote));
        })
        .catch(error => {
            alert(
                `The note '${note.content}' was already deleted from the server`
            );
            setNotes(notes.filter(n => n.id !== id));
        });
};
```
- The alert pops up and the deleted note gets filtered out from the state.


