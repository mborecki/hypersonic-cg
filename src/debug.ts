declare let printErr;

export const debug = (obj: any) => {
    for (let i in obj) {
        printErr(i, ' :: ', obj[i]);
    }
}
