# UI5 Tooling Types
Basic types for building ui5 tasks in typescript.

## Installation
Add the package with npm
```sh
npm i -D git+https://github.com/todm/ui5-tooling-types.git
```

Add the types to your ts-config file
```yaml
{
    "compilerOptions": {
        # ...
        "types": ["ui5-tooling-types"]
    }
}
```

If you don't use typescript you can also reference the types in your `.js` files.
```
/// <reference types="ui5-tooling-types" />
// ...
```

## Usage
Simply annotate your functions
```typescript
// task.ts
import { TaskFunction } from "@ui5/builder";

const task: TaskFunction = ({ workspace, options }) => {
    // workspace and options will have the correct types
};
module.exports = task;
```

```typescript
// middleware.ts
import {MiddlewareFunction} from '@ui5/server';

const middleware: MiddlewareFunction = ({resources, options}) => {
    // resources and options will have the correct types
    return (req, res, next) => {
        // req, res and next will have the correct types as well
    }
}

module.exports = middleware;
```
## Typed Modules
Only modules nessessary for task and middlewares are typed.

```
.
├── @ui5/builder
│   ├── 🅸 TaskParameters
│   └── 🆃 TaskFunction
│    
├── @ui5/server
│   ├── 🅸 MiddlewareParameters
│   └── 🆃 MiddlewareFunction
│
├── @ui5/fs
│   ├── 🅲 DuplexCollection
│   ├── 🅲 AbstractReaderWriter
│   ├── 🅲 AbstractReader
│   ├── 🅲 ReaderCollection
│   └── 🅲 Resource
│
└── @ui5/logger
    ├── 🅵 getLogger
    ├── 🅵 getGroupLogger
    ├── 🅵 setLevel
    ├── 🅵 isLevelEnabled
    ├── 🆃 LogLevel
    └── 🅵 setShowProgress
```