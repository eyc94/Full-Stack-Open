# JavaScript

- Name of JavaScript standard is ECMAScript.
    - Latest release is in June 2021 with the name `ECMAScript 2021` or `ES12`.
- Not all latest JS features are supported.
    - Code in browsers has been transpiled from a newer version of JavaScript to an older one.
    - Most popular way to transpile is using `Babel`.
    - Transpilation is automatic with `create-react-app` applications.
- `Node.js` is a JavaScript runtime environment based on Google's `Chrome V8` JavaScript engine.
    - Works anywhere.
- Practice writing JS using Node.
- Code does not need to be transpiled.
- Code written in files ending with `.js`.
    - Run by the command: `$ node name_of_file.js`.
- Can also write JS in the Node console by typing `node` in the command line.
- You can also do this in the dev console.


## Variables
- Few ways to define variables.
```javascript
const x = 1;
let y = 5;

console.log(x, y);      // 1, 5 are printed.
y += 10;
console.log(x, y);      // 1, 15 are printed.
y = "sometext";
console.log(x, y);      // 1, sometext are printed.
x = 4;                  // Causes an error.
```
- The `const` defines a constant for which the value can no longer be changed.
- The `let` defines a normal variable.
- The type of data can also change during execution.
- Can also define variables using `var`.
    - This was the only way to create variables.
    - Now it's not used as much.
    - `const` and `let` were only recently added to ES6.
    - Some resources to learn this issue:
        - Javascript variables; should you use let, var or const?: `https://medium.com/podiihq/javascript-variables-should-you-use-let-var-or-const-394f7645c88f`
        - ES6, var vs let: `https://www.jstips.co/en/javascript/keyword-var-vs-let/`
        - YouTube [var, let and const - What, why and how - ES6 JavaScript Features]: `https://www.youtube.com/watch?v=sjyJBL5fkp8`


## Arrays
- Example of array:
```javascript
const t = [1, -1, 3];

t.push(5);

console.log(t.length);  // 4 is printed.
console.log(t[1]);      // -1 is printed.

t.forEach(value => {
    console.log(value); // numbers 1, -1, 3, 5 are printed, each to own line.
});
```
- Contents of array can be changed even though array is a constant.
    - This just means the variable always points to the same object.
    - Contents can be changed.
- One way of iterating through an array is to use `forEach`.
    - `forEach` receives a function defined using the arrow syntax.
```javascript
value => {
    console.log(value);
}
```
- `forEach` calls the function *for each* item in the array.
    - It passes the individual item as an argument.
    - The function as the argument of `forEach` may also have its own parameters.
- Add new item to array using `push` method.
- Preferable to use the method `concat`.
    - This creates a new array in which the contents of the old array and the new item are both included.
- There are many methods for an array.
- Look at the `map` method.
```javascript
const t = [1, 2, 3];

const m1 = t.map(value => value * 2);
console.log(m1);        // [2, 4, 6] is printed.
```
- The `map` method creates a new array.
    - The function given is used as a map to create the new array from the old array values.
    - In the case of the above, we multiply every value of the array by 2.
- The `map` method can also transform the array into something different:
```javascript
const m2 = t.map(value => "<li>" + value + "</li>);
console.log(m2);
// [ "<li>1</li>", "<li>2</li>", "<li>2</li>" ] is printed.
```
- Items of the array can be assigned to variables with the help of `destructuring assignment`.
```javascript
const t = [1, 2, 3, 4, 5];

const [first, second, ...rest] = t;

console.log(first, second);     // 1, 2 is printed.
console.log(rest);              // [3, 4, 5] is printed.
```


## Objects
- Can define objects using `object literals`.
```javascript
const object1 = {
    name: "Arto Hellas",
    age: 35,
    education: "PhD"
};

const object2 = {
    name: "Full Stack Web Application Development",
    level: "Intermediate Studies",
    size: 5
};

const object3 = {
    name: {
        first: "Dan",
        last: "Abramov"
    },
    grades: [2, 3, 5, 3],
    department: "Stanford University"
};
```
- Values of properties can be any type.
- Object properties are referenced using "dot" notation or by brackets.
```javascript
console.log(object1.name);          // Arto Hellas is printed.
const fieldName = "age";
console.log(object1[fieldName]);    // 35 is printed.
```
- Can also add properties to objects.
```javascript
object1.address = "Helsinki";
object1["secret number"] = 12341;
```


## Functions
- The complete process of defining functions is:
```javascript
const sum = (p1, p2) => {
    console.log(p1);
    console.log(p2);
    return p1 + p2;
};
```
- Function is called as expected:
```javascript
const result = sum(1, 5);
console.log(result);
```
- If there is a single parameter, we can exclude the parentheses:
```javascript
const square = p => {
    console.log(p);
    return p * p;
};
```
- If function contains only a single expression, the braces are not needed.
- Remove the console printing:
```javascript
const square = p => p * p;
```
- Form is handy when manipulating arrays with the `map` method:
```javascript
const t = [1, 2, 3];
const tSquared = t.map(p => p * p);
// tSquared is now [1, 4, 9]
```
- Before, you had to use the `function` keyword to create a function.
    - Now, you can use arrow functions.
- Two ways to reference the function:
- One is giving a name in a `function declaration`.
```javascript
function product(a, b) {
    return a * b;
};

const result = product(2, 6);
// Result is now 12.
```
- The other is to define the function using a `function expression`.
    - No need to give the function a name.
```javascript
const average = function(a, b) {
    return (a + b) / 2;
};

const result = average(2, 5);
// result is now 3.5.
```


## Object Methods and "this"
- No need to define objects for methods because of React Hooks.
- Can assign methods to an object by defining the properties that are functions:
```javascript
const arto = {
    name: "Arto Hellas",
    age: 35,
    education: "PhD",
    greet: function() {
        console.log("Hello, my name is " + this.name);
    }
};

arto.greet()        // "Hello, my name is Arto Hellas" gets printed.
```
- Methods can be assigned to objects even after creation of the object.
```javascript
const arto = {
    name: "Arto Hellas",
    age: 35,
    education: "PhD",
    greet: function() {
        console.log("Hello, my name is " + this.name);
    }
};

arto.growOlder = function() {
    this.age += 1;
};

console.log(arto.age);  // 35 is printed.
arto.growOlder();
console.log(arto.age);  // 36 is printed.
```
- Modify object slightly.
```javascript
const arto = {
    name: "Arto Hellas",
    age: 35,
    education: "PhD",
    greet: function() {
        console.log("Hello, my name is " + this.name);
    },
    doAddition: function(a, b) {
        console.log(a + b);
    }
};

arto.doAddition(1, 4);      // 5 is printed.

const referenceToAddition = arto.doAddition;
referenceToAddition(10, 15) // 25 is printed.
```
- Notice that we can call the method from the object or we can provide a reference to the method and call it.
- If we try to do it with the method `greet()`.
```javascript
arto.greet();       // "Hello, my name is Arto Hellas" gets printed.

const referenceToGreet = arto.greet;
referenceToGreet(); // Prints "Hello, my name is undefined".
```
- When calling the method through a reference, we lose track of what "this" is.
- When calling a method through a reference, "this" is the global object.
- If you set a timeout to call `greet` function, `this` disappears too.
```javascript
const arto = {
    name: "Arto Hellas",
    greet: function() {
        console.log("Hello, my name is " + this.name);
    }
};

setTimeout(arto.greet, 1000);
```
- When `setTimeout` is called, it is the JS engine that calls the method, so "this" is the global object.
- Can preserve "this" with `bind` method.
```javascript
setTimeout(arto.greet.bind(arto), 1000);
```
- This creates a new function where `this` is bound to point to Arto.
    - Doesn't matter where the function is called.


## Classes
- Not really any class mechanisms.
- Look at the class syntax introduced in ES6.
- Define a class called Person and two Person objects.
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    };

    greet() {
        console.log("Hello, my name is " + this.name);
    };
};

const adam = new Person("Adam Ondra", 35);
adam.greet();

const janja = new Person("Janja Garnbret", 22);
janja.greet();
```
- The object's type is `Object`.
- JavaScript only defines the types `Boolean`, `Null`, `Undefined`, `Number`, `String`, `Symbol`, `BigInt`, and `Object`.


## JavaScript Materials
- Can view Mozilla's JavaScript Guide.
- There are plenty of other resources as well.


