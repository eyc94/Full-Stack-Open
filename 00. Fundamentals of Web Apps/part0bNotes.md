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


## Loading A Page Containing JavaScript - Review
- Review what happens when you visit `https://studies.cs.helsinki.fi/exampleapp/notes`.
- Browser gets HTML using HTTP GET.
- Links in HTML cause browser to fetch CSS style sheet and JavaScript code.
- Browser executes JavaScript code.
    - Code makes HTTP GET request to URL for JSON data.
    - The URL returns JSON data.
- When data is fetched, the browser executes an event handler.
    - This renders the notes to the page using the DOM API.


## Forms and HTTP POST
- See how adding a new note is done.
- The example application notes page has a `form` element.
- When the button is clicked, the browser sends the user input to the server.
    - It is an HTTP POST request to the server address `new_note`.
    - Server responds with status code 302.
        - This is a URL redirect.
        - Server tells browser to do new HTTP GET request to new location.
    - Reloads page requesting the resources again.
- Can also see form data that was submitted.
- The `form` tag has the `action` and `method` attributes.
    - Defines that submitting form is done with HTTP POST to the new address.
- Code on server responsible for POST request is simple.
- Code below is on the server. It is not the JavaScript on the browser.
```javascript
app.post("/new_note", (req, res) => {
    notes.push({
        content: req.body.note,
        date: new Date()
    });

    return res.redirect("/notes");
});
```
- Data is sent as the body of the post request.
- Server can access data by accessing `req.body` field of the `req` body.
- Server creates a new note object and adds it to an array called `notes`.
- `Note` objects have `content` and `date` fields.
- Server does not save the note to the database, so it disappears when the server is restarted.


## AJAX
- The Notes page of the app follows an old style of web development.
    - Uses `AJAX`.
- `AJAX (Asynchronous JavaScript and XML)` enabled a way to fetch content of pages using JavaScript in HTML without need to rerender.
- Before AJAX, web pages worked like traditional web pages.
    - Data shown on a page was fetched with HTML code generated by the server.
- Notes page uses AJAX to fetch notes data.
- Submitting form still uses the traditional way of submitting web-forms.
- The old way was to just have JSON data fetched from `https://studies.cs.helsinki.fi/exampleapp/data.json`.
- New notes were sent to `https://studies.cs.helsinki.fi/exampleapp/new_note`.
- Now it's not acceptable. Need to be `RESTful APIs`.


## Single Page App
- Example app works like a traditional web page.
    - Logic on server.
    - Browser renders the HTML as told to.
- Notes page gives some responsibility, like generating HTML code for existing notes, to the browser.
    - Browser does this by running JavaScript code fetched from the server.
    - Code fetches notes from server as JSON and adds HTML elements for displaying it using the DOM.
- SPA style web pages emerged.
    - Comprise only ONE HTML page fetched from the server.
    - Contents are changed with JavaScript that runs in the browser.
- In SPA version of the example app, the `form` tag has no `action` or `method` attributes.
    - Creating new note means making POST request.
    - This request contains the new note as JSON with content and date.
    - The `Content-Type` tells the server what data to expect.
    - Server responds with status 201 created.
    - This time, server does not ask for a redirect.
    - Browser stays on same page and no further HTTP requests are made.
- SPA version does not send data like the traditional way.
    - Uses JavaScript code fetched from the server.
```javascript
var form = document.getElementById("notes_form");
form.onSubmit = function(e) {
    e.preventDefault();

    var note = {
        content: e.target.elements[0].value,
        date: new Date()
    };

    notes.push(note);
    e.target.elements[0].value = "";
    redrawNotes();
    sendToServer(note);
};
```
- First, we get the form element by ID and assign an event handler to handle form submit event.
- Event handler calls the `e.preventDefault()` to prevent the default event of form submit.
    - Default event sends data to the server and causes a new GET request.
- Then, it creates a new note and adds to list of notes.
- It rerenders the note list and sends new note to the server.
- Code for sending note to server:
```javascript
var sendToServer = function(note) {
    var xhttpForPost = new XMLHttpRequest();
    // ...

    xhttpForPost.open("POST", "/new_note_spa", true);
    xhttpForPost.setRequestHeader(
        "Content-Type", "application/json"
    );
    xhttpForPost.send(JSON.stringify(note));
};
```


# JavaScript Libraries
- The sample app is done with `vanilla JavaScript`.
    - Uses only DOM API and JavaScript to manipulate the structure of the pages.
- Different libraries can be used to help.
- One of these is `jQuery`.
    - Now it's not as prevalent.
- Going to SPA.
    - First came `BackboneJS`.
    - Google announced `AngularJS` which became the de facto standard.
        - Angular not popular when they announced support for version 1 is ending.
        - Angular 2 will not be backwards compatible with the first version.
- The most popular tool for implementing browser-side logic of web-apps is Facebook's `React` library.
    - We will be familiar with React and `Redux` library.
- Newcomer called `VueJS` is capturing interest.


## Full Stack Web Development
- Browser is frontend.
    - JavaScript that runs on the browser is frontend code.
- Server is backend.
- Database is usually below the server layer.
- Code the backend with JavaScript using `Ndoe.js` runtime environment.


