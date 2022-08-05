import { SchedulingApiMember, SchedulingApiServiceBase } from '@plano/shared/api';
import { SchedulingApiMailSentToBookingPersonBase } from '@plano/shared/api';


export class SchedulingApiMailSentToBookingPerson<ValidationMode extends 'draft' | 'validated' = 'validated'> extends
	SchedulingApiMailSentToBookingPersonBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
	) {
		super(api);
	}

	/**
	 * If this mail is a manually triggered resend then this returns the member who requester the resend.
	 */
	public get resendRequester() : SchedulingApiMember | null {
		return this.api?.data.members.get(this.resendRequesterId) ?? null;
	}
}

