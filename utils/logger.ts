import './date'
import chalk from 'chalk'

type Mode = 'development' | 'production'
type Level = 'warn' | 'error' | 'info' | 'all'

class Logger {
    public readonly mode: Mode
    public readonly level: Level
    constructor(mode: Mode = 'development', level: Level = 'all') {
        this.mode = mode
        this.level = level
    }

    info(...message: any[]) {
        this.mode === 'development' &&
            (this.level === 'info' || this.level === 'all') &&
            console.log(
                `${'[' + new Date().formatClock(true) + ']'} ${message}`
            )
    }

    warn(...message: any[]) {
        this.mode === 'development' &&
            (this.level === 'warn' || this.level === 'all') &&
            console.log(
                `${'[' + new Date().formatClock(true) + ']'} ${chalk.yellow(
                    message
                )}`
            )
    }

    error(...message: any[]) {
        this.mode === 'development' &&
            (this.level === 'error' || this.level === 'all') &&
            console.log(
                `${'[' + new Date().formatClock(true) + ']'} ${chalk.red(
                    message
                )}`
            )
    }
}

export default Logger
