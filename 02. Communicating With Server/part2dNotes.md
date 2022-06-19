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


