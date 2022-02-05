declare module '@ui5/builder' {
    import { DuplexCollection, ReaderCollection, Resource } from '@ui5/fs';

    /**
     * Configuration type akin to YAML/JSON value types
     */
    export type ConfigType = string | number | boolean | null | ConfigType[] | Record<string, ConfigType>;

    /**
     * Parameters
     */
    export interface TaskParameters {
        /**
         * A DuplexCollection to read and write Resources for the project that is currently being built
         */
        workspace: DuplexCollection;

        /**
         * A ReaderCollection to read Resources of the project's dependencies
         */
        dependencies: ReaderCollection;

        /**
         * Options
         */
        options: {
            /**
             * The name of the project currently being built. Example: my.library
             */
            projectName: string;

            /**
             * The namespace of the project. Example: my/library
             */
            projectNamespace: string;

            /**
             * The task configuration as defined in the project's ui5.yaml. See Configuration
             */
            configuration: ConfigType;
        };

        /**
         * Specification Version dependent interface to a TaskUtil instance
         */
        taskUtil?: TaskUtilInterface;
    }

    /**
     * Custom tasks defining Specification Version 2.2 or higher have access to an interface of a TaskUtil instance.
     *
     * In this case, a taskUtil object is provided as a part of the custom task's parameters.
     * Depending on the specification version of the custom task, a set of helper functions is available to the implementation.
     * The lowest required specification version for every function is listed in the TaskUtil API reference.
     *
     * Convenience functions for UI5 Builder tasks.
     * An instance of this class is passed to every standard UI5 Builder task that requires it.
     * Custom tasks that define a specification version >= 2.2 will receive an interface to an instance of this class when called.
     * The set of available functions on that interface depends on the specification version defined for the extension.
     */
    interface TaskUtilInterface {
        /**
         * Standard Tags
         */
        STANDARD_TAGS: Record<string, string>;

        /**
         * Stores a tag with value for a given resource's path. Note that the tag is independent of the supplied resource instance.
         * For two resource instances with the same path, the same tag value is returned.
         * If the path of a resource is changed, any tag information previously stored for that resource is lost.
         *
         * This method is only available to custom task extensions defining Specification Version 2.2 and above.
         *
         * @param resource - The resource the tag should be stored for
         * @param tag - Name of the tag. Currently only the STANDARD_TAGS are allowed
         * @param value - Tag value. Must be primitive
         */
        setTag(resource: Resource, tag: string, value?: string | boolean | number = true): void;

        /**
         * Clears the value of a tag stored for the given resource's path. It's like the tag was never set for that resource.
         *
         * This method is only available to custom task extensions defining Specification Version 2.2 and above.
         *
         * @param resource - The resource the tag should be cleared for
         * @param tag - Tag
         */
        clearTag(resource: Resource, tag: string): void;

        /**
         * Retrieves the value for a stored tag. If no value is stored, undefined is returned.
         *
         * This method is only available to custom task extensions defining Specification Version 2.2 and above.
         *
         * @param resource - The resource the tag should be retrieved for
         * @param tag - Name of the tag
         * @returns Tag value for the given resource. undefined if no value is available
         */
        getTag(resource: Resource, tag: string): string | boolean | number | undefined;

        /**
         * Check whether the project currently being built is the root project.
         *
         * This method is only available to custom task extensions defining Specification Version 2.2 and above.
         *
         * @returns true if the currently built project is the root project
         */
        isRootProject(): boolean;

        /**
         * Register a function that must be executed once the build is finished.
         * This can be used to, for example, clean up files temporarily created on the file system.
         * If the callback returns a Promise, it will be waited for.
         * It will also be executed in cases where the build has failed or has been aborted.
         *
         * This method is only available to custom task extensions defining Specification Version 2.2 and above.
         *
         * @param callback - Callback to register. If it returns a Promise, it will be waited for
         */
        registerCleanupTask(callback: () => void | Promise<void>): void;
    }

    /**
     * Signature of custom task implementation
     * @returns A Promise that resolves once the task has completed and all new or modified resources have been written to the workspace. In case of errors the promise should reject with an Error object, causing the build to abort.
     */
    export type TaskFunction = (params: TaskParameters) => Promise<void>;
}
