# Component State, Event Handlers

- Go back to React.
- Start with a new example.
```javascript
const Hello = (props) => {
    return (
        <div>
            <p>
                Hello {props.name}, you are {props.age} years old
            </p>
        </div>
    );
};

const App = () => {
    const name = "Peter";
    const age = 10;

    return (
        <div>
            <h1>Greetings</h1>
            <Hello name="Maya" age={26 + 10} />
            <Hello name={name} age={age} />
        </div>
    );
};
```


## Component Helper Functions
- Expand the `Hello` component so it guesses year of birth of person greeted:
```javascript
const Hello = (props) => {
    const bornYear = () => {
        const yearNow = new Date().getFullYear();
        return yearNow - props.age;
    };

    return (
        <div>
            <p>
                Hello {props.name}, you are {props.age} years old
            </p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    );
};
```
- Notice the logic is in a separate component.
- Notice also that the helper function is defined inside a component function.
    - This is common in JavaScript.


## Destructuring
- Can `destructure` values from objects and arrays.
- We had to reference data as `props.name` and `props.age`.
- We repeated `props.age` twice in our code.
    - We know `props` is an object.
```javascript
props = {
    name: "Arto Hellas",
    age: 35
};
```
- Streamline our component by assigning values of properties directly into two variables `name` and `age`.
```javascript
const Hello = (props) => {
    const name = props.name;
    const age = props.age;

    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    );
};
```
- Used compact arrow syntax for function.
- The two below are the same:
```javascript
const bornYear = () => new Date.getFullYear() - age;

const bornYear = () => {
    return new Date().getFullYear() - age;
};
```
- Destructuring is more useful.
```javascript
const Hello = (props) => {
    const { name, age } = props;
    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    );
};
```
- Take it a step further.
```javascript
const Hello = ({ name, age }) => {
    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    );
};
```
- We don't need to assign the values anymore to variables.


