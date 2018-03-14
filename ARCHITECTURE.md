Architectural Overview
======================

Project Organization
--------------------

Truffle Debugger is organized as a collection of what it calls
**application modules**.

App modules decouple the disparate domains into separate facets of the project,
defining strict boundaries between them.


Truffle Debugger's Application Modules
--------------------------------------

This project separates its domain into the following application modules:

- **`session`** - high-level supervisor, coupling other modules together
- **`controller`** - interface operations such as stepping / continuing
- **`context`** - efficient storage of code segments
- **`trace`** - maintains record of transaction steps and provides clock
- **`evm`** - virtual machine layer
- **`solidity`** - solidity source ranges, function depth
- **`ast`** - processing and responding to traversal of abstract syntax tree
- **`web3`** - integration layer for provider requests
- **`data`** - semantic interpretation of variables / data mapping


Application Module Structure
----------------------------

Each app module is typically divided into four main submodules, for common
behavioral patterns across the project.

These behavioral components center around a tightly-managed, immutable
_state object_ representing the current state of the debugging session.

Each submodule serves a distinct purpose:

- **actions** identify how the state is updated, as plain-objects
- **reducers** process actions against the current state, returning new state
- **selectors** define computed views of the current state
- **sagas** orchestrate the high-level operation by reading data from selectors
    and emitting (`put()`-ing) or listening for (`take()`-ing) actions.


Dependencies Between Application Modules
----------------------------------------

This project aims to maintain separation of concerns between app modules
by identifying the allowed external dependencies for selectors and sagas.

Generally, sagas provide external state update interfaces for an app module,
and selectors are the read interface. Actions and reducers live (almost)
entirely within an app module, as internal concerns.

### Selectors

Selectors may read from selectors within the same app module or from other
app modules.

### Sagas

#### Actions

Sagas may `put` and `take` actions from within the app module itself.

Sagas may `take` actions from other app modules, but this is discouraged.
Currently, only trace's `TICK` action is used externally.

#### Selectors

Sagas may read from selectors only from within the app modules itself.

For sagas to access data from another app, the saga's app must define a
selector to mirror and/or transform the other app's data.

### External Sagas

Sagas may invoke other app's sagas.

