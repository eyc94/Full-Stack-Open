# Rendering A Collection, Modules
- Recap some topics.


## console.log()
- Always a good idea to log things to check values.
- Separate values in `console.log()` with a comma.
    - Do not concatenate!


## Protip: Visual Studio Code Snippets
- Easy to create snippets.
    - Shortcuts for generating re-used portions of code.
    - Like `sout` in Netbeans.
- Snippet for `console.log()` is `clog`.
```json
{
    "console.log": {
        "prefix": "clog",
        "body": [
            "console.log('$1')"
        ],
        "description": "log output to console"
    }
}
```
- VSCode has a builtin snippet though.
    - Type `log` and hit tab to autocomplete.


## JavaScript Arrays
- We will use functional programming methods of `array`.
    - `find`, `filter`, and `map`.
- Can watch first three parts of YouTube series `Functional Programming in JavaScript`.
    - `https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84`
    - Higher-order functions.
    - Map.
    - Reduce basics.


## Event Handlers Revisited
- It's worth going back to read about event handlers as it has proven to be difficult.



