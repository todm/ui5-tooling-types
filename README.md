# UI5 Tooling Types

Typescript definition for UI5 Tooling

Includes definitions for

-   [ui5-cli](https://github.com/SAP/ui5-cli)
-   [ui5-project](https://github.com/SAP/ui5-project)
-   [ui5-server](https://github.com/SAP/ui5-server)
-   [ui5-builder](https://github.com/SAP/ui5-builder)
-   [ui5-fs](https://github.com/SAP/ui5-fs)
-   [ui5-logger](https://github.com/SAP/ui5-logger)

## Installation

Add the package with npm

```sh
npm i -D git+https://github.com/todm/ui5-tooling-types.git
```

Add the types to your ts-config file

```yaml
{ 'compilerOptions': {
            # ...
            'types': ['ui5-tooling-types']
        } }
```

If you don't use typescript you can also reference the types in your `.js` files.

```
/// <reference types="ui5-tooling-types" />
// ...
```

## Tasks and Middlewares

```typescript
// task.ts
import { TaskFunction } from '@ui5/builder';

const task: TaskFunction = ({ workspace, options }) => {
    // workspace and options will have the correct types
};
module.exports = task;
```

```typescript
// middleware.ts
import { MiddlewareFunction } from '@ui5/server';

const middleware: MiddlewareFunction = ({ resources, options }) => {
    // resources and options will have the correct types
    return (req, res, next) => {
        // req, res and next will have the correct types as well
    };
};

module.exports = middleware;
```
