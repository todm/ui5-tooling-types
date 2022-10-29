declare module '@ui5/project' {
    export {};

    /**
     * Generate project and dependency trees via translators.
     * Optionally configure all projects with the projectPreprocessor.
     */
    export namespace normalizer {
        /**
         * Generates a project and dependency tree via translators and configures all projects via the projectPreprocessor
         *
         * @param options Options
         * @param options.cwd Current working directory
         * @param options.configPath Path to configuration file
         * @param options.translatorName Translator to use
         * @param options.translatorOptions Options to pass to translator
         * @param options.frameworkOptions Options to pass to the framework installer
         * @param options.frameworkOptions.versionOverride Framework version to use instead of the root projects
         * @returns Promise resolving to tree object
         */
        export function generateProjectTree(options?: {
            cwd?: string;
            configPath?: string;
            translatorName?: string;
            translatorOptions?: any;
            frameworkOptions?: { versionOverride?: string };
        }): Promise<object>;

        /**
         * Generates a project and dependency tree via translators
         *
         * @param options Options
         * @param options.cwd Current working directory
         * @param options.translatorName Translator to use
         * @param options.translatorOptions Options to pass to translator
         * @returns Promise resolving to tree object
         */
        export function generateDependencyTree(options?: {
            cwd?: string;
            translatorName?: string;
            translatorOptions?: any;
        }): Promise<object>;
    }

    export namespace projectPreprocessor {
        /**
         * Collects project information and its dependencies to enrich it with project configuration
         *
         * @param tree Dependency tree of the project
         * @returns Promise resolving with the dependency tree and enriched project configuration
         */
        export function processTree(tree: object): Promise<object>;
    }

    export namespace ui5Framework {
        // TODO
    }

    export namespace validation {
        // TODO
    }

    export namespace translators {
        // TODO
    }
}
