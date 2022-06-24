# Deploying App To Internet
- Connect frontend we made in Part 2 with backend we made in Part 3A.
- Previously, frontend asks for list of notes from `json-server` backend.
    - From address: `http://localhost:3001/notes`
- Backend now has different structure.
    - From address: `http://localhost:3001/api/notes`.
- Change `baseUrl` in `src/services/notes.js` file.
```javascript
import axios from "axios";
const baseUrl = "http://localhost:3001/api/notes";

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

// ...

export default { getAll, create, update };
```
- Also need to change URL specified in the effect in `App.js`:
```javascript
useEffect(() => {
    axios
        .get("http://localhost:3001/api/notes")
        .then(res => {
            setNotes(res.data);
        });
}, []);
```
- The frontend's GET request to `http://localhost:3001/api/notes` does not work for some reason.
- What's happening?
    - We can access backend from browser and Postman without problems.


