# End To End Testing
- So far, we tested backend as a whole on an API level using integration tests.
- We tested frontend components using unit tests.
- Look into another way to test the **system as a whole** using `End to End (E2E) tests`.
- We can do E2E testing of a web app using a browser and a testing library.
    - Multiple libraries like `Selenium`.
        - Can be used with almost any browser.
    - Another browser option are `headless browsers`.
        - These are browsers with no GUI.
        - Chrome can be used in headless mode.
    - E2E is the most useful category of tests.
        - They test the system through the same interface as real users use.
    - More challenging to configure than integration and unit tests.
    - Quite slow.
        - Large systems can have minutes to hours of execution time.
        - Need to be able to run tests as often as possible in case of code `regressions`.
    - E2E can also be `flaky`.
        - Some tests might pass one time and fail another even if no change in code.

    

