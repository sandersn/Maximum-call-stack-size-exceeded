export class FakeCookieService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    constructor(_document, _platformId) {
        this.cookies = [];
    }
    get(name) {
        const result = this.cookies.find(item => item.name === name);
        if (!result)
            return '';
        return result.value;
    }
    set(name, value, _expires, _path, _domain, _secure, _sameSite) {
        // eslint-disable-next-line no-console
        console.debug(`set: ${name}`);
        const existingCookie = this.cookies.find(item => item.name === name);
        if (existingCookie) {
            existingCookie.value = value;
            return;
        }
        this.cookies.push({
            name: name,
            value: value.toString(),
        });
    }
    check(name) {
        const existingCookie = this.cookies.find(item => item.name === name);
        return !!existingCookie;
    }
    delete(name, _path, _domain) {
        this.cookies = this.cookies.filter(item => item.name !== name);
    }
    /**
     * @returns {}
     */
    getAll() { return undefined; }
    /**
     * @param _path   Cookie path
     * @param _domain Cookie domain
     */
    deleteAll(_path, _domain) { }
    /**
     * @param _name Cookie name
     * @returns {RegExp}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCookieRegExp(_name) { }
}
//# sourceMappingURL=cookie.service.mock.js.map