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


## Store With Complex State
- Implement filtering of notes displayed to user.
- Use `radio buttons`.
- Start very simple and straightforward:
```js
import NewNote from "./components/NewNote";
import Notes from "./components/Notes";

const App = () => {
    const filterSelected = (value) => {
        console.log(value);
    };

    return (
        <div>
            <NewNote />
            <div>
                all <input type="radio" name="filter" onChange={() => filterSelected("ALL")} />
                important <input type="radio" name="filter" onChange={() => filterSelected("IMPORTANT")} />
                nonimportant <input type="radio" name="filter" onChange={() => filterSelected("NONIMPORTANT")} />
            </div>
            <Notes />
        </div>
    );
};
```
- The `name` attribute makes the radio buttons a `button group`.
    - Only one button is clicked at a time.
- The `onChange` only prints value associated with the filter.
- Implement filter by storing value of filter in redux store in addition to notes themselves.
- State of store should look like:
```js
{
    notes: [
        { content: "Reducer defines how redux store works", important: true, id: 1 },
        { content: "State of store can contain any data", important: false, id: 2 }
    ],
    filter: "IMPORTANT"
}
```

