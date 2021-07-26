function count(array_elements: string[]) {
    array_elements.sort()

    var current = null
    var cnt = 0

    const min = 0

    const summary: { name: string; count: number; share: number }[] = []
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > min && current) {
                // document.write(current + " comes --> " + cnt + " times<br>")
                summary.push({
                    name: current,
                    count: cnt,
                    share: (cnt * 100) / array_elements.length,
                })
            }
            current = array_elements[i]
            cnt = 1
        } else {
            cnt++
        }
    }
    if (cnt > min && current) {
        summary.push({
            name: current,
            count: cnt,
            share: (cnt * 100) / array_elements.length,
        })
    }
    return {
        items: summary.sort((a, b) => (a.count > b.count ? -1 : 1)),
        total: array_elements.length,
    }
}

export { count }
