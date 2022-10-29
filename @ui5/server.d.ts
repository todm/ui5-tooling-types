declare module '@ui5/server' {
    import { RequestHandler } from 'express';
    import { AbstractReader, ReaderCollection, ReaderCollectionPrioritized } from '@ui5/fs';

    export {};

    /**
     * server
     */
    export namespace server {
        /**
         * Start a server for the given project (sub-)tree.
         *
         * @param tree A (sub-)tree
         * @param options Options
         * @param options.port Port to listen to
         * @param options.changePortIfInUse If true, change the port if it is already in use
         * @param options.h2 Whether HTTP/2 should be used - defaults to <code>http</code>
         * @param options.key Path to private key to be used for https
         * @param options.cert Path to certificate to be used for for https
         * @param options.simpleIndex Use a simplified view for the server directory listing
         * @param options.acceptRemoteConnections If true, listens to remote connections and not only to localhost connections
         * @param options.sendSAPTargetCSP If set to <code>true</code> or an object, then the default (or configured) set of security policies that SAP and UI5 aim for (AKA 'target policies'), are send for any requested <code>*.html</code> file
         * @param options.serveCSPReports Enable CSP reports serving for request url '/.ui5/csp/csp-reports.json'
         * @returns Promise resolving once the server is listening. It resolves with an object containing the <code>port</code>, <code>h2</code>-flag and a <code>close</code> function, which can be used to stop the server.
         */
        export function serve(
            tree: object,
            options: {
                port: number;
                changePortIfInUse?: boolean;
                h2?: boolean;
                key?: boolen;
                cert?: string;
                simpleIndex?: boolean;
                acceptRemoteConnections?: boolean;
                sendSAPTargetCSP?:
                    | boolean
                    | {
                          defaultPolicy?: string;
                          defaultPolicyIsReportOnly?: string;
                          defaultPolicy2?: string;
                          defaultPolicy2IsReportOnly?: string;
                          ignorePaths?: string[];
                      };
                simpleIndex?: boolean;
                serveCSPReports?: boolean;
            }
        ): Promise<{ h2: boolean; port: number; close(callback: (err: any) => void): void }>;
    }

    /**
     * sslUtil
     */
    export namespace sslUtil {
        /**
         * Creates a new SSL certificate or validates an existing one.
         *
         * @param keyPath Path to private key to be used for https. Defaults to <code>$HOME/.ui5/server/server.key</code>
         * @param certPath Path to certificate to be used for for https. Defaults to <code>$HOME/.ui5/server/server.crt</codee>
         * @returns Resolves with an sslObject containing <code>cert</code> and <code>key</code>
         */
        export function getSslCertificate(
            keyPath?: string,
            certPath?: string
        ): Promise<{ key: string | Buffer; cert: string | Buffer }>;
    }

    export namespace middlewareRepository {
        /**
         * Get Middleware
         *
         * @param middlewareName The middleware name
         * @returns The middleware
         */
        export function getMiddleware(middlewareName: string): MiddlewareFunction;

        /**
         * Add Middleware
         *
         * @param parameters Parameters
         * @param parameters.name Middleware name
         * @param parameters.specVersion Spec version
         * @param middlewarePath middlewarePath
         */
        export function addMiddleware(parameters: { name: string; specVersion?: string; middlewarePath: string }): void;
    }

    type JSONValue = string | number | boolean | null | JSONValue[] | Record<string, JSONValue>;

    /**
     * Parameters
     */
    export interface MiddlewareParameters<T extends JSONValue = any> {
        /**
         * Resource collections
         */
        resources: {
            /**
             * Reader or Collection to read resources of the root project and its dependencies
             */
            all: ReaderCollectionPrioritized;

            /**
             * Reader or Collection to read resources of the project the server is started in
             */
            rootProject: ReaderCollection;

            /**
             * Reader or Collection to read resources of the projects dependencies
             */
            dependencies: ReaderCollection;
        };

        /**
         * Options
         */
        options: {
            /**
             * Custom server middleware configuration if given in ui5.yaml
             */
            configuration: T;
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

    export type MiddlewareFunction<T = any> = (parameters: MiddlewareParameters<T>) => RequestHandler;
}
