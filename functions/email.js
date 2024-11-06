export function email() {
    return 'test' + (Math.random())
            .toString(10)
            .replace(".","")
            .replace("0","")
        + '@mail.com';
}