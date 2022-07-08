# props.children and prototypes

## Displaying The Login Form Only When Appropriate
- Modify app so that login form is not displayed by default.
- Login form appears when the user presses the `login` button.
- The user can close the login form by clicking the `cancel` button.
- Extract the login form into its own component.
```js
const LoginForm = ({
        handleSubmit,
        handleUsernameChange,
        handlePasswordChange,
        username,
        password
    }) => {

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    Username
                    <input
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
```
- State and all functions related to it are defined outside of the component.
    - Passed to the component as props.
- Props are assigned to variables through `destructuring`.
    - Instead of accessing things like `props.handleSubmit`, you just destructure to access it faster.
- Implementing the functionality of login button and cancel button.
    - You can do it one way like so:
```js
const App = () => {
    const [loginVisible, setLoginVisible] = useState(false);

    // ...

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? "none" : "" };
        const showWhenVisible = { display: loginVisible ? "" : "none" };

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>Log In</button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                    <button onClick={() => setLoginVisible(false)}>Cancel</button>
                </div>
            </div>
        );
    };

    // ...
};
```
- Notice the state `loginVisible`.
    - This represents whether the login form is visible or not.
    - This value is switched by two buttons.
    - Both buttons have event handlers directly defined.
- Visibility of component is defined by giving component an `inline` style rule.
    - Value of `display` is `none` if we do not want component to be displayed.







