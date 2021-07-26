import './number'

export {}

declare global {
    interface Date {
        formatClock(withSeconds?: boolean): string
    }
}

Date.prototype.formatClock = function (withSeconds: boolean = false): string {
    const hh = this.getHours().prependZeroes(2)
    const mm = this.getMinutes().prependZeroes(2)

    if (withSeconds) {
        const ss = this.getSeconds().prependZeroes(2)
        return `${hh}:${mm}:${ss}`
    } else {
        return `${hh}:${mm}`
    }
}
