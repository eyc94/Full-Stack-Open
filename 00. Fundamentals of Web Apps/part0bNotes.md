# Fundamentals of Web Apps

- Principles of web development.


## HTTP GET

- Server and browser communicate via HTTP protocol.
- The Network tab shows how the browser and server communicate.
- Using an example of getting a page and an image.
    - Browser sends HTTP GET request to the server to fetch the HTML code of the page.
    - The img tag in the HTML prompts the browser to fetch the image.
    - Browser then renders the HTML page and image.
- HTML page begins to render before image is fetched from the server.


## Traditional Web Applications

- The example page works like a traditional web application.
    - When entering page, browser fetches HTML document detailing the structure and content of page from server.
- Server formed document.
    - Document can be a `static` text file saved in server's directory.
    - Server can also form HTML documents `dynamically` using data from a database.
- HTML code of example application is formed dynamically.
    - Because it has information of number of notes created.
- HTML code of home page:
```javascript
const getFrontPageHtml = (noteCount) => {
    return (`
        <!DOCTYPE html>
        <html>
            <head>
            </head>
            <body>
                <div class="container">
                    <h1>Full stack example app</h1>
                    <p>number of notes created ${noteCount}</p>
                    <a href="/notes">notes</a>
                    <img src="kuva.png" width="200" />
                </div>
            </body>
        </html>
    `);
};

app.get("/", (req, res) => {
    const page = getFrontPageHtml(notes.length);
    res.send(page);
});
```
- Content of HTML page is inside template string.
- Writing HTML like this is not good practice.
- In traditional web applications, browser is dumb.
    - Fetches HTML data from server.
    - Application logic is on the server.
    - Server can be created with Java Spring, Python Flask, Ruby on Rails, Express.
- We use `Node.js` and `Express` to create web servers.


# Running Application Logic In The Browser

- The list of notes in the example application is not shown in the HTML code returned by the server.
- THere is a script tag in HTML's head section.
    - This causes the browser to fetch a JavaScript file called `main.js`.
    - The JavaScript code is shown:
```javascript
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText);
        console.log(data);

        var ul = document.createElement("ul");
        ul.setAttribute("class", "notes");

        data.forEach(function(note) {
            var li = document.createElement("li");

            ul.appendChild(li);
            li.appendChild(document.createTextNode(note.content));
        });

        document.getElementById("notes").appendChild(ul);
    }
};

xhttp.open("GET", "/data.json", true);
xhttp.send();
```
- After fetching script tag, browser executes the code.
- Last two lines.
    - Browser makes GET request to server's address `/data.json`.
    - Can go to the address straight from the browser.
        - `https://studies.cs.helsinki.fi/exampleapp/data/json`.
        - Notes in JSON data.
        - Download plugins to handle viewing format.
            - `JSONVue` on Chrome.
- JavaScipt code downloads the JSON-data with the notes.
    - Forms a bullet-point list from the note contents.


## Event Handlers and Callback Functions
- Structure of code is weird.
    - Notice we send the GET request last and handle the request first.
- Notice the callback function attached to the `xhttp` object.
    - When state of the object changes, the event handler is called.
    - This checks ready state and status code.
- Event handlers are called `callback` functions.
    - The browser invokes the function at an appropriate time.


## Document Object Model or DOM
- HTML pages are implicit tree structures.
- Elements tab in console show this tree-like structure.
- `Document Object Model`, or `DOM`, is an `Application Programming Interface (API)`.
    - Enables modification of element trees corresponding to web pages.
- The JavaScript code above uses the DOM API.


## Manipulating The Document-Object From Console
- Topmost node is called `document`.
- Add new note from console to page.
- Get list of notes from the page.
    - First ul-element of the page.
```javascript
list = document.getElementByTagName("ul")[0];
```
- Create new `li` element and add text to it.
```javascript
newElement = document.createElement("li");
newElement.textContent = "Page manipulation from console is easy";
```
- Add new `li` element to the list:
```javascript
list.appendChild(newElement);
```
- Changes are not permanent.
    - Reload the page and new note will disappear.
    - Changes not pushed to the server.
- The JavaScript code the browser fetches always creates the list of notes based on JSON data from address with `data.json`.


## CSS
- The `head` element of HTML code contains `link` tag for a CSS page.
- `Cascading Style Sheets`, or `CSS`, is a style sheet language for appearance.
- It looks like this:
```css
.container {
    padding: 10px;
    border: 1px solid;
}

.notes {
    color: blue;
}
```
- Defines two classes.
    - Defines styling rules to them.
- Class selectors start with a period and contains the name of the class.
- Classes are attributes which are added to HTML elements.
- CSS attributes are found in the Elements tab of the console.
- The container class should have a 10px padding with a border that is 1px and solid.
- The notes class should be blue.
- Can also have the `id` attribute.
- Can experiment with styling in console, but it won't be permanent.


