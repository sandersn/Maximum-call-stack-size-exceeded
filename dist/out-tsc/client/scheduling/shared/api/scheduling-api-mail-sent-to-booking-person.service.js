import { SchedulingApiMailSentToBookingPersonBase } from '@plano/shared/api';
export class SchedulingApiMailSentToBookingPerson extends SchedulingApiMailSentToBookingPersonBase {
    constructor(api) {
        super(api);
        this.api = api;
    }
    /**
     * If this mail is a manually triggered resend then this returns the member who requester the resend.
     */
    get resendRequester() {
        var _a, _b;
        return (_b = (_a = this.api) === null || _a === void 0 ? void 0 : _a.data.members.get(this.resendRequesterId)) !== null && _b !== void 0 ? _b : null;
    }
}
//# sourceMappingURL=scheduling-api-mail-sent-to-booking-person.service.js.map