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


