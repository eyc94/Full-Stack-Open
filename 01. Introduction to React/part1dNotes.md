# A More Complex State, Debugging React Apps


## A Note On React Version
- Version 18 of React released late March 2022.
- Code in material should work.
    - Some libraries might not yet be compatible.
- If app breaks because of library compatibility, downgrade to older React.
    - Change `package.json`.
```json
{
    "dependencies": {
        "react": "^17.0.2",
        "react-dom": "^17.0.2",
        "react-scripts": "5.0.0",
        "web-vitals": "^2.1.4"
    },
    // ...
}
```
- Reinstall dependencies: `$ npm install`.
- Need to change `index.js` as well.
    - For React 17.
```javascript
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```
- For React 18.
```javascript
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDom.createRoot(document.getElementById("root")).render(<App />);
```


