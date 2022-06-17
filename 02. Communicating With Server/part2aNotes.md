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


