import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
let PUrlForHumansPipe = class PUrlForHumansPipe {
    constructor() { }
    /**
     * Transform a url to a nice clean thing.
     * @example
     *   http://www.dr-plano.com to dr-plano.com
     */
    transform(url) {
        // remove protocol like 'https://'
        const withoutProtocol = url.replace(/^https?:\/\/(?:www\.)?/, '');
        const urlArray = withoutProtocol.split(/\//);
        const domain = urlArray.shift();
        let tail = urlArray.join('/');
        if (tail.length) {
            if (tail.length > 8)
                tail = `${tail.substring(0, 5)}…`;
            return `${domain}/${tail}`;
        }
        else {
            return domain;
        }
    }
};
PUrlForHumansPipe = __decorate([
    Pipe({ name: 'pUrlForHumans' }),
    __metadata("design:paramtypes", [])
], PUrlForHumansPipe);
export { PUrlForHumansPipe };
//# sourceMappingURL=url-for-humans.pipe.js.map