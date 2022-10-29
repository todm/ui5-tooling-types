declare module '@ui5/cli' {
    /**
     * Initiates the projects <b>ui5.yaml</b> configuration file.
     *
     * Checks the package.json and tries to determine the project type. If the <b>ui5.yaml</b> file does not exist,
     * it is created with the basic project configuration.
     *
     * @param options Options
     * @param options.cwd Current working directory
     * @returns Promise resolving with the project configuration object
     */
    export function init(options?: { cwd?: string }): Promise<object>;
}
