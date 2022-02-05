declare module '@ui5/logger' {
    export function getLogger(moduleName: string): Logger;
    export function getGroupLogger(moduleName: string): GroupLogger;
    export function setLevel(level: LogLevel): LogLevel;
    export function isLevelEnabled(levelName: LogLevel): boolean;
    export function setShowProgress(showProgress: boolean): void;

    export type LogLevel = 'silly' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';

    class Logger {
        isLevelEnabled(levelName: LogLevel): boolean;
        silly(message: string, ...args: any[]): void;
        verbose(message: string, ...args: any[]): void;
        info(message: string, ...args: any[]): void;
        warn(message: string, ...args: any[]): void;
        error(message: string, ...args: any[]): void;
    }

    class GroupLogger extends Logger {
        createSubLogger(name: string, weight: number = 0): GroupLogger;
        createTaskLogger(name: string, todo: any, weight: any): TaskLogger;
    }

    class TaskLogger extends Logger {
        addWork(todo: any): void;
        startWork(...messages: any[]): void;
        completeWork(complete: any): void;
        finish(): any;
    }
}
