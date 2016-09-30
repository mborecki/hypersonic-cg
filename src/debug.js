export const debug = () => {
    for (let i in obj) {
        printErr(i, ' :: ', obj[i]);
    }
}
