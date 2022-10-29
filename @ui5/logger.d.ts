declare module '@ui5/logger' {
    export {};

    /**
     * Get a new Logger
     *
     * @param moduleName Module name
     * @returns A new logger
     */
    export function getLogger(moduleName: string): Logger;

    /**
     * Get a new group logger
     *
     * @param moduleName Module name
     * @returns A new group logger
     */
    export function getGroupLogger(moduleName: string): GroupLogger;

    /**
     * Set the log Level
     *
     * @param level The log level
     * @returns The log level
     */
    export function setLevel(level: LogLevel): LogLevel;

    /**
     * Checks if log level is enabled
     * @param levelName The log level
     * @returns true if log level is enabled
     */
    export function isLevelEnabled(levelName: LogLevel): boolean;

    /**
     * Set wether on not to show progress
     *
     * @param showProgress wether on not to show progress
     */
    export function setShowProgress(showProgress: boolean): void;

    /**
     * Log level
     */
    export type LogLevel = 'silly' | 'verbose' | 'perf' | 'info' | 'warn' | 'error' | 'silent';

    /**
     * Logger
     */
    class Logger {
        /**
         * Checks if log level is enabled
         * @param levelName The log level
         * @returns true if log level is enabled
         */
        isLevelEnabled(levelName: LogLevel): boolean;

        /**
         * Log with log level silly
         *
         * @param message Message
         * @param args Arguments
         */
        silly(message: string, ...args: any[]): void;

        /**
         * Log with log level verbose
         *
         * @param message Message
         * @param args Arguments
         */
        verbose(message: string, ...args: any[]): void;

        /**
         * Log with log level perf
         *
         * @param message Message
         * @param args Arguments
         */
        perf(message: string, ...args: any[]): void;

        /**
         * Log with log level info
         *
         * @param message Message
         * @param args Arguments
         */
        info(message: string, ...args: any[]): void;

        /**
         * Log with log level warn
         *
         * @param message Message
         * @param args Arguments
         */
        warn(message: string, ...args: any[]): void;

        /**
         * Log with log level error
         *
         * @param message Message
         * @param args Arguments
         */
        error(message: string, ...args: any[]): void;
    }

    /**
     * Group logger
     */
    class GroupLogger extends Logger {
        /**
         * Creates a sub logger for the current group
         *
         * @param name Module name
         * @param weight Weight
         * @returns The group logger
         */
        createSubLogger(name: string, weight: number = 0): GroupLogger;

        /**
         * Creates a task logger
         *
         * @param name Task name
         * @param todo Todo
         * @param weight Weight
         * @returns The task logger
         */
        createTaskLogger(name: string, todo: number, weight: number): TaskLogger;
    }

    /**
     * Task logger
     */
    class TaskLogger extends Logger {
        /**
         * Add work
         * @param todo The todos
         */
        addWork(todo: number): void;

        /**
         * Start work
         * @param messages Messages
         */
        startWork(...messages: any[]): void;

        /**
         * Complete work
         *
         * @param complete complete
         */
        completeWork(complete: number): void;

        /**
         * Finish
         *
         * @returns something
         */
        finish(): any;
    }
}
