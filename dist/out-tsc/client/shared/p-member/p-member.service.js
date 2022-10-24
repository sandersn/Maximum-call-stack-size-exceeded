import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
let MemberService = class MemberService {
    constructor(localize) {
        this.localize = localize;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    makeNameGenitive(genitivName) {
        if (genitivName.charAt(genitivName.length - 1).match(/[sxz|ß]/))
            return this.localize.transform('${genitivName}’', { genitivName: genitivName });
        // if (genitivName.indexOf('Andrea') > -1) return this.localize.transform('${genitivName}’s', { genitivName: genitivName });
        return this.localize.transform('${genitivName}s', { genitivName: genitivName });
    }
};
MemberService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [LocalizePipe])
], MemberService);
export { MemberService };
//# sourceMappingURL=p-member.service.js.map