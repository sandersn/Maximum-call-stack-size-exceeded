var WarningsService_1;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
export var WarningId;
(function (WarningId) {
    WarningId[WarningId["WARN_STAMPED_NOT_SHIFT_TIME"] = 0] = "WARN_STAMPED_NOT_SHIFT_TIME";
    WarningId[WarningId["WARN_UNPLANNED_WORK"] = 1] = "WARN_UNPLANNED_WORK";
    WarningId[WarningId["WARN_STAMPED_NOT_CURRENT_TIME"] = 2] = "WARN_STAMPED_NOT_CURRENT_TIME";
})(WarningId || (WarningId = {}));
let WarningsService = WarningsService_1 = class WarningsService {
    constructor() { }
    /**
     * Get warning by enum value
     */
    static get(id) {
        switch (id) {
            case WarningId.WARN_STAMPED_NOT_SHIFT_TIME:
                return 'Deine gestempelte Arbeitszeit weicht von der geplanten ab. Warum?';
            case WarningId.WARN_UNPLANNED_WORK:
                return 'Dein Arbeitseinsatz ist ungeplant? Wie kommt das?';
            case WarningId.WARN_STAMPED_NOT_CURRENT_TIME:
                return 'Warum hast du nicht die aktuelle Zeit gestempelt?';
            default:
                return null;
        }
    }
    /**
     * Warning messages as simple array of strings
     */
    getWarningMessages(input) {
        let warningMessages = [];
        if (input.warnStampedNotShiftTime) {
            const warning = WarningsService_1.get(WarningId.WARN_STAMPED_NOT_SHIFT_TIME);
            if (warning)
                warningMessages.push(warning);
        }
        if (input.warnUnplannedWork) {
            const warning = WarningsService_1.get(WarningId.WARN_UNPLANNED_WORK);
            if (warning)
                warningMessages.push(warning);
        }
        if (input.warnStampedNotCurrentTime) {
            const warning = WarningsService_1.get(WarningId.WARN_STAMPED_NOT_CURRENT_TIME);
            if (warning)
                warningMessages.push(warning);
        }
        if (!warningMessages.length) {
            warningMessages = [];
        }
        return warningMessages;
    }
};
WarningsService = WarningsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], WarningsService);
export { WarningsService };
//# sourceMappingURL=warnings.service.js.map