declare module '@ui5/fs' {
    import { Readable } from 'stream';
    import { Stats } from 'fs';

    /**
     * Wrapper to keep readers and writers together
     */
    export class DuplexCollection extends AbstractReaderWriter {
        /**
         * Locates resources by glob from source reader only.
         * For found resources that are also available in the writer, the writer resource will be returned.
         *
         * @param virPattern - glob pattern for virtual directory structure
         * @param options - glob options
         * @param options.nodir - Do not match directories
         * @returns Promise resolving to list of resources
         */
        byGlobSource(virPattern: string | string[], options?: { nodir?: boolean = true }): Promise<Resource[]>;
    }

    /**
     * Abstract resource locator
     */
    export class AbstractReaderWriter extends AbstractReader {
        /**
         * Writes the content of a resource to a path.
         *
         * @param resource - Resource to write
         * @param options - Properties
         * @param options.readOnly - Whether the resource content shall be written read-only Do not use in conjunction with the drain option.
         *                      The written file will be used as the new source of this resources content. Therefore the written file should not be altered by any means.
         *                      Activating this option might improve overall memory consumption.
         * @param options.drain - Whether the resource content shall be emptied during the write process.
         *                      Do not use in conjunction with the readOnly option. Activating this option might improve overall memory consumption.
         *                      This should be used in cases where this is the last access to the resource.
         *                      E.g. the final write of a resource after all processing is finished.
         * @returns Promise resolving once data has been written
         */
        write(resource: Resource, options?: { readOnly?: boolean = false; drain?: boolean = false }): Promise<void>;
    }

    /**
     * Abstract resource locator
     */
    export class AbstractReader {
        /**
         * Locates resources by matching glob patterns.
         *
         * @param virPattern - glob pattern as string or array of glob patterns for virtual directory structure
         * @param options - Properties
         * @param options.nodir - 	Do not match directories
         * @returns Promise resolving to list of resources
         *
         * @example
         * byGlob("**‏/*.{html,htm}");
         * byGlob("**‏/.library");
         * byGlob("/pony/*");
         */
        byGlob(virPattern: string | string[], options?: { nodir?: boolean = true }): Promise<Resource[]>;

        /**
         * Locates resources by matching a given path.
         * @param virPattern - Virtual path
         * @param options - Properties
         * @param options.nodir - Do not match directories
         * @returns Promise resolving to a single resource
         */
        byPath(virPattern: string, options?: { nodir?: boolean = true }): Promise<Resource>;
    }

    /**
     * Resource Locator ReaderCollection
     */
    export class ReaderCollection extends AbstractReader {}

    /**
     * Resource
     */
    export class Resource {
        /**
         * Gets a buffer with the resource content.
         *
         * @returns Promise resolving with a buffer of the resource content.
         */
        getBuffer(): Promise<Buffer>;

        /**
         * Sets a Buffer as content.
         *
         * @param buffer - Buffer instance
         */
        setBuffer(buffer: Buffer): void;

        /**
         * Gets a string with the resource content.
         *
         * @returns Promise resolving with the resource content.
         */
        getString(): Promise<string>;

        /**
         * Sets a String as content
         *
         * @param string - Resource content
         */
        setString(string: string): void;

        /**
         * Gets a readable stream for the resource content.
         * Repetitive calls of this function are only possible if new content has been set in the meantime (through setStream, setBuffer or setString).
         * This is to prevent consumers from accessing drained streams.
         *
         * @returns Readable stream for the resource content.
         */
        getStream(): Readable;

        /**
         * Sets a readable stream as content.
         *
         * @param stream - Readable stream of the resource content or callback for dynamic creation of a readable stream
         */
        setStream(stream: Readable | (() => Readable)): void;

        /**
         * Gets the resources path
         *
         * @returns (Virtual) path of the resource
         */
        getPath(): string;

        /**
         * Sets the resources path
         *
         * @param path - (Virtual) path of the resource
         */
        setPath(path: string): void;

        /**
         * Gets the resources stat info. Note that a resources stat information is not updated when the resource is being modified.
         * Also, depending on the used adapter, some fields might be missing which would be present for a fs.Stats instance.
         *
         * @returns Instance of fs.Stats or similar object
         */
        getStatInfo(): Stats;

        /**
         * Size in bytes allocated by the underlying buffer.
         *
         * @returns Size in bytes, 0 if there is no content yet
         */
        getSize(): Promise<number>;

        /**
         * Adds a resource collection name that was involved in locating this resource.
         *
         * @param name - Resource collection name
         */
        pushCollection(name: string);

        /**
         * Returns a clone of the resource. The clones content is independent from that of the original resource
         *
         * @returns Promise resolving with the clone
         */
        clone(): Resource;

        /**
         * Tracing: Get tree for printing out trace
         *
         * @returns Trace tree
         */
        getPathTree(): Record<string, Record<string, object>>;
    }
}
