# Testing The Backend
- Start writing tests for the backend.
- Current backend is not complicated.
    - Does not make sense to write `unit` tests for it.
    - We could write them for the `toJSON` method used for formatting notes.
- Some situations it's good to make some backend tests by mocking the database instead of using the real database.
    - One library that could be used for this is `mongodb-memory-server`.
- Backend application is really simple.
    - We will make the decision to test the entire application through its REST API.
    - Database is also included.
- Multiple components of a system being tested as a group is called `integration testing`.


