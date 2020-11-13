# Contributing to Link Checker

## Setup

-   Prettier is recommended, if using vscode, please install the extension
-   eslint is also recommended

### In terminal:

-   run `npm install`
-   navigate to the bin folder: `cd Link-Checker/bin`
-   `node index.js <path-to-file>`

## Before submitting a pull request

-   The app should run a pre-commit prettier and eslint command, but just in case...

### Run Prettier

-   In command line, run `npm prettier`
-   or, before starting work, run `npx onchange \"**/*\" -- prettier --write --ignore-unknown {{changed}}`

### Run eslint

-   `npm lint`
