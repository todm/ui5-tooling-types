declare module '@ui5/server' {
    import { Request, RequestHandler } from 'express';
    import { AbstractReader } from '@ui5/fs';

    /**
     * Configuration type akin to YAML/JSON value types
     */
    type ConfigType = string | number | boolean | null | ConfigType[] | Record<string, ConfigType>;

    /**
     * Parameters
     */
    export interface MiddlewareParameters {
        /**
         * Resource collections
         */
        resources: {
            /**
             * Reader or Collection to read resources of the root project and its dependencies
             */
            all: AbstractReader;

            /**
             * Reader or Collection to read resources of the project the server is started in
             */
            rootProject: AbstractReader;

            /**
             * Reader or Collection to read resources of the projects dependencies
             */
            dependencies: AbstractReader;
        };

        /**
         * Options
         */
        options: {
            /**
             * Custom server middleware configuration if given in ui5.yaml
             */
            configuration: ConfigType;
        };

        /**
         * Specification version dependent interface to a MiddlewareUtil instance
         */
        middlewareUtil?: MiddlewareUtilInterface;
    }

    /**
     * Custom middleware defining Specification Version 2.0 or higher have access to an interface of a MiddlewareUtil instance.
     *
     * In this case, a middlewareUtil object is provided as a part of the custom middleware's parameters.
     * Depending on the specification version of the custom middleware, a set of helper functions is available to the implementation.
     * The lowest required specification version for every function is listed in the MiddlewareUtil API reference.
     *
     * Convenience functions for UI5 Server middleware. An instance of this class is passed to every standard UI5 Server middleware.
     * Custom middleware that define a specification version >= 2.0 will also receive an instance of this class as part of the
     * parameters of their create-middleware function. The set of functions that can be accessed by a custom middleware depends
     * on the specification version defined for the extension.
     */
    interface MiddlewareUtilInterface {
        /**
         * Returns the pathname of a given request. Any escape sequences will be decoded.
         *
         * This method is only available to custom middleware extensions defining Specification Version 2.0 and above.
         *
         * @param req - Request object
         * @returns Pathname of the given request
         */
        getPathname(req: Request): string;

        /**
         * Returns MIME information derived from a given resource path.
         *
         * This method is only available to custom middleware extensions defining Specification Version 2.0 and above.
         *
         * @param resourcePath
         * @returns
         */
        getMimeInfo(resourcePath: string): MimeInfo;
    }

    /**
     * Mime info
     *
     * @example
     * const mimeInfo = {
     *   "type": "text/html",
     *   "charset": "utf-8",
     *   "contentType": "text/html; charset=utf-8"
     *  };
     */
    interface MimeInfo {
        /**
         * Detected content-type for the given resource path
         */
        type: string | false;

        /**
         * Default charset for the detected content-type
         */
        charset: string | false;

        /**
         * Calculated content-type header value
         */
        contentType: string;
    }

    export type MiddlewareFunction = (params: MiddlewareParameters) => RequestHandler;
}
