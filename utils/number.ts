export {}

declare global {
    interface Number {
        prependZeroes(digits: number): string
        format(locales?: string | string[] | undefined): string
    }
}

Number.prototype.prependZeroes = function (digits: number) {
    const got = this == 0 ? 1 : Math.floor(Math.log10(this.valueOf())) + 1
    return got < digits
        ? Array(digits - got)
              .fill('0')
              .join('') + this
        : this.toString()
}

Number.prototype.format = function (locales: string) {
    return new Intl.NumberFormat(locales).format(this.valueOf())
}
