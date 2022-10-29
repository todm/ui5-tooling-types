import { Readable, Stream } from 'stream';

declare module '@ui5/fs' {
    import fs from 'fs';

    export {};

    export namespace adapters {
        /**
         * Abstract Resource Adapter
         */
        export abstract class AbstractAdapter extends AbstractReaderWriter {
            /**
             * The constructor
             *
             * @param parameters Parameters
             * @param parameters.virBasePath Virtual base path
             * @param parameters.excludes List of glob patterns to exclude
             * @param parameters.project Experimental, internal parameter. Do not use
             */
            public constructor(parameters: { virBasePath: string; excludes?: string[]; project?: object });

            /**
             * Validate if virtual path should be excluded
             *
             * @param virPath Virtual Path
             * @returns True if path is excluded, otherwise false
             */
            public isPathExcluded(virPath: string): boolean;
        }

        /**
         * File system resource adapter
         */
        export class FileSystem extends adapters.AbstractAdapter {
            /**
             * The Constructor.
             *
             * @param parameters Parameters
             * @param parameters.virBasePath Virtual base path
             * @param parameters.fsBasePath (Physical) File system path
             * @param parameters.exclude List of glob patterns to exclude
             * @param parameters.project Experimental, internal parameter. Do not use
             */
            public constructor(parameters: { virBasePath: string; fsBasePath: string; excludes?: string[]; project?: object });
        }

        /**
         * Virtual resource Adapter
         */
        export class Memory extends AbstractAdapter {
            /**
             * The constructor.
             *
             * @param parameters Parameters
             * @param parameters.virBasePath Virtual base path
             * @param parameters.excludes List of glob patterns to exclude
             * @param parameters.project Experimental, internal parameter. Do not use
             */
            public constructor(parameters: { virBasePath: string; excludes?: string[]; project?: object });
        }
    }

    /**
     * Abstract resource locator
     */
    export abstract class AbstractReader {
        /**
         * The constructor.
         */
        public constructor();

        /**
         * Locates resources by matching glob patterns.
         *
         * @example
         * byGlob("**‏/*.{html,htm}");
         * byGlob("**‏/.library");
         * byGlob("/pony/*");
         *
         * @param virPattern glob pattern as string or array of glob patterns for virtual directory structure
         * @param options Options
         * @param options.nodir Do not match directories
         * @returns Promise resolving to list of resources
         */
        public byGlob(virPattern: string | string[], options?: { nodir?: boolean }): Promise<Resource[]>;

        /**
         * Locates resources by matching a given path.
         *
         * @param virPath Virtual path
         * @param options Options
         * @param options.nodir Do not match directories
         * @returns Promise resolving to a single resource
         */
        public byPath(virPath: string, options?: { nodir?: boolean }): Promise<Resource>;
    }

    /**
     *
     */
    export abstract class AbstractReaderWriter extends AbstractReader {
        /**
         * The constructor.
         */
        public constructor();

        /**
         * Writes the content of a resource to a path.
         *
         * @param resource Resource to write
         * @param options Options
         * @param options.drain Whether the resource content shall be emptied during the write process. Do not use in conjunction with the <code>readOnly</code> option. Activating this option might improve overall memory consumption. This should be used in cases where this is the last access to the resource. E.g. the final write of a resource after all processing is finished.
         * @param options.readonly Whether the resource content shall be written read-only. Do not use in conjunction with the <code>drain</code> option. The written file will be used as the new source of this resources content. Therefore the written file should not be altered by any means. Activating this option might improve overall memory consumption.
         *
         */
        public write(resource: Resource, options?: { drain?: boolean; readonly?: boolean }): Promise<undefined>;
    }

    /**
     * Wrapper to keep readers and writers together
     */
    export class DuplexCollection extends AbstractReaderWriter {
        /**
         * The Constructor.
         *
         * @param parameters Parameters
         * @param parameters.reader Single reader or collection of readers
         * @param parameters.writer A ReaderWriter instance which is only used for writing files
         * @param parameters.name The collection name
         */
        public constructor(parameters: { reader: AbstractReader; writer: AbstractReaderWriter; name?: string });

        /**
         * Locates resources by glob from source reader only. For found resources that are also available in the writer, the writer resource will be returned.
         *
         * @param virPattern glob pattern for virtual directory structure
         * @param option Options
         * @param options.nodir Do not match directories
         */
        public byGlobSource(virPattern: string, option?: { nodir?: boolean }): Promise<Resource[]>;
    }

    /**
     * Wraps readers to access them through a [Node.js fs]{@link https://nodejs.org/api/fs.html} styled interface.
     */
    export namespace fsInterface {
        export type readFile = typeof fs.readFile;
        export type stat = typeof fs.stat;
        export type readdir = typeof fs.readdir;
        export type mkdir = typeof fs.mkdir;
    }

    /**
     * Resource Locator ReaderCollection
     */
    export class ReaderCollection extends AbstractReader {
        /**
         * The constructor.
         *
         * @param parameters Parameters
         * @param parameters.readers List of resource readers (all tried in parallel)
         * @param parameters.name The collection name
         */
        public constructor(parameters: { readers: AbstractReader[]; name: string });
    }

    /**
     * Prioritized Resource Locator Collection
     */
    export class ReaderCollectionPrioritized extends AbstractReader {
        /**
         * The constructor.
         *
         * @param parameters Parameters
         * @param parameters.readers List of resource readers (first is tried first)
         * @param parameters.name The collection name
         */
        public constructor(parameters: { readers: AbstractReader[]; name: string });
    }

    /**
     * Resource
     */
    export class Resource {
        /**
         * The constructor.
         *
         * @param parameters Parameters
         * @param parameters.path Virtual path
         * @param parameters.statInfo File information. Instance of [fs.Stats]{@link https://nodejs.org/api/fs.html#fs_class_fs_stats} or similar object
         * @param parameters.buffer Content of this resources as a Buffer instance (cannot be used in conjunction with parameters string, stream or createStream)
         * @param parameters.string Content of this resources as a string (cannot be used in conjunction with parameters buffer, stream or createStream)
         * @param parameters.stream Readable stream of the content of this resource (cannot be used in conjunction with parameters buffer, string or createStream)
         * @param parameters.createStream Function callback that returns a readable stream of the content of this resource (cannot be used in conjunction with parameters buffer, string or stream). In some cases this is the most memory-efficient way to supply resource content
         * @param parameters.project Experimental, internal parameter. Do not use
         */
        public constructor(parameters: {
            path: string;
            statInfo?: fs.Stats;
            buffer?: Buffer;
            string?: string;
            createStream?: () => Readable;
            stream?: Stream;
            project?: object;
        });

        /**
         * Gets a buffer with the resource content.
         *
         * @returns Promise resolving with a buffer of the resource content.
         */
        public getBuffer(): Promise<Buffer>;

        /**
         * Sets a Buffer as content.
         *
         * @param buffer Buffer instance
         */
        public setBuffer(buffer: Buffer): void;

        /**
         * Gets a string with the resource content.
         *
         * @returns Promise resolving with the resource content.
         */
        public getString(): Promise<string>;

        /**
         * Sets a String as content
         *
         * @param string Resource content
         */
        public setString(string: string): void;

        /**
         * Gets a readable stream for the resource content.
         *
         * Repetitive calls of this function are only possible if new content has been set in the meantime (through
         * [setStream]{@link module:@ui5/fs.Resource#setStream}, [setBuffer]{@link module:@ui5/fs.Resource#setBuffer}
         * or [setString]{@link module:@ui5/fs.Resource#setString}). This
         * is to prevent consumers from accessing drained streams.
         *
         * @returns Readable stream for the resource content.
         */
        public getStream(): Readable;

        /**
         * Sets a readable stream as content.
         *
         * @param stream stream Readable stream of the resource content or callback for dynamic creation of a readable stream
         */
        public setStream(stream: Readable | (() => Readable)): void;

        /**
         * Gets the resources path
         *
         * @returns (Virtual) path of the resource
         */
        public getPath(): string;

        /**
         * Sets the resources path
         *
         * @param path (Virtual) path of the resource
         */
        public setPath(path: string): void;

        /**
         * Gets the resources stat info.
         * Note that a resources stat information is not updated when the resource is being modified.
         * Also, depending on the used adapter, some fields might be missing which would be present for a
         * [fs.Stats]{@link https://nodejs.org/api/fs.html#fs_class_fs_stats} instance.
         *
         * @returns Instance of [fs.Stats]{@link https://nodejs.org/api/fs.html#fs_class_fs_stats} or similar object
         */
        public getStatInfo(): fs.Stats;

        /**
         * Size in bytes allocated by the underlying buffer.
         * @returns size in bytes, <code>0</code> if there is no content yet
         */
        public getSize(): Promise<number>;

        /**
         * Adds a resource collection name that was involved in locating this resource.
         *
         * @param name Resource collection name
         */
        public pushCollection(name: string): void;

        /**
         * Returns a clone of the resource. The clones content is independent from that of the original resource
         *
         * @returns Promise resolving with the clone
         */
        public clone(): Promise<Resource>;

        /**
         * Tracing: Get tree for printing out trace
         * @returns tree
         */
        public getPathTree(): object;
    }

    /**
     * ResourceTagCollection
     */
    export class ResourceTagCollection {
        /**
         * The constructor.
         *
         * @param parameters Parameters
         * @param parameters.allowedTags Allowed tags
         */
        public constructor(parameters: { allowedTags: string[] });

        /**
         * Set tag
         *
         * @param resource Resource
         * @param tag Tag
         * @param value Value
         */
        public setTag(resource: Resource, tag: string, value?: string | number | boolean): void;

        /**
         * Clear tag
         *
         * @param resource Resource
         * @param tag Tag
         */
        public clearTag(resource: Resource, tag: string): void;

        /**
         * Get tag
         *
         * @param resource Resource
         * @param tag Tag
         * @returns Tag value
         */
        public getTag(resource: Resource, tag: string): string | number | boolean | undefined;
    }

    /**
     * Resource Factory
     */
    export namespace resourceFactory {
        /**
         * Creates resource reader collections for a (sub-)tree. Returns an object of resource readers:
         * <pre>
         * {
         *  source: Resource reader for source resources
         *  dependencies: Resource readers for dependency resources
         * }
         * </pre>
         *
         * @param tree A (sub-)tree
         * @param parameters Parameters
         * @param parameters.getProjectExcludes Callback to retrieve the exclude globs of a project
         * @param parameters.getVirtualBasePathPrefix Callback to retrieve a prefix for a given virtual base path of a project if required
         * @param parameters.virtualReaders Experimental, internal parameter. Do not use
         * @returns Object containing <code>source</code> and <code>dependencies</code> resource readers
         */
        export function createCollectionsForTree(
            tree: object,
            parameters?: {
                getProjectExcludes?: (project: object) => string[];
                getVirtualBasePathPrefix?: (parameters: { project: object; virBasePath: object }) => string;
                virtualReaders?: object;
            }
        ): object;

        /**
         * Creates a resource <code>ReaderWriter</code>.
         *
         * If a file system base path is given, file system resource <code>ReaderWriter</code> is returned.
         * In any other case a virtual one.
         *
         * @param parameters Paraneters
         * @param parameters.fsBasePath File system base path
         * @param parameters.virBasePath Virtual base path
         * @param parameters.project Experimental, internal parameter. Do not use
         * @param parameters.excludes List of glob patterns to exclude
         * @returns File System- or Virtual Adapter
         */
        export function createAdapter(parameters: {
            fsBasePath?: string;
            virBasePath?: string;
            project?: object;
            excludes?: string[];
        }): adapters.FileSystem | adapters.Memory;

        /**
         * Creates a <code>Resource</code>. Accepts the same parameters as the Resource constructor.
         *
         * @param parameters parameters Parameters to be passed to the resource constructor
         * @returns Resource
         */
        export function createResource(parameters: ConstructorParameters<Resource>): Resource;

        /**
         * Creates a Workspace
         *
         * A workspace is a DuplexCollection which reads from the project sources. It is used during the build process
         * to write modified files into a separate writer, this is usually a Memory adapter. If a file already exists it is
         * fetched from the memory to work on it in further build steps.
         *
         * @param parameters Parameters
         * @param parameters.reader Single reader or collection of readers
         * @param parameters.writer A ReaderWriter instance which is only used for writing files. If not supplied, a Memory adapter will be created.
         * @param parameters.virBasePath Virtual base path
         * @param parameters.name Name of the collection
         * @returns DuplexCollection which wraps the provided resource locators
         */
        export function createWorkspace(parameters: {
            reader: AbstractReader;
            writer?: AbstractReaderWriter;
            virBasePath?: string;
            name?: string;
        }): DuplexCollection;
    }
}
