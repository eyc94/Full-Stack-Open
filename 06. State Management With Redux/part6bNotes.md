# Many Reducers
- Continue with notes application.
- Change reducer so that store gets initialized with a state that contains a couple of notes:
```js
const initialState = [
    {
        content: "Reducer defines how redux store works",
        important: true,
        id: 1
    },
    {
        content: "State of store can contain any data",
        important: false,
        id: 2
    }
];

const noteReducer = (state = initialState, action) => {
    // ...
};

// ...

export default noteReducer;
```

