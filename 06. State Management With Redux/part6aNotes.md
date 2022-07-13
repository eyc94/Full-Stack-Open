# Flux-Architecture and Redux
- So far, we did what's recommended.
- We placed all state in the app's root component.
- We then passed state and all handlers down to the components using props.
- Works up to a point and the app just gets larger.
- State management gets more complex.


## Flux-Architecture
- Facebook developed the `Flux` architecture.
    - `https://facebook.github.io/flux/docs/in-depth-overview/`
    - Makes state management easier.
- State separated completely from React components in its own `stores`.
    - State in store is not changed directly.
    - Changed with different `actions`.
- When actions change the state of the store, the `views` are rerendered.
- If an action (like pressing button), changes state, the change is made with an action.
    - Causes rerendering the view.
- Flux offers a way for how and where the app's state is kept and how it is modified.

