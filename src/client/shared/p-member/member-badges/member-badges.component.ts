import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiMembers, SchedulingApiAbsenceType } from '@plano/shared/api';
import { SchedulingApiShift, SchedulingApiMember} from '@plano/shared/api';
import { AuthenticatedApiRootBase } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { MemberBadgeComponent } from './member-badge/member-badge.component';
import { AbsenceService } from '../../absence.service';

@Component({
	selector: 'p-member-badges[members]',
	templateUrl: './member-badges.component.html',
	styleUrls: ['./member-badges.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberBadgesComponent {
	@HostBinding('class.d-flex')
	@HostBinding('class.badges-stack') protected _alwaysTrue = true;

	@Input() public members ! : SchedulingApiMembers;
	@Input() public emptyMemberSlots : number | null = null;

	@Input() public shiftStart : SchedulingApiShift['start'] | null = null;
	@Input() public shiftEnd : SchedulingApiShift['end'] | null = null;
	@Input() public shiftId : SchedulingApiShift['id'] | null = null;

	@Input() private myId : AuthenticatedApiRootBase['id'] | null = null;

	constructor(
		private absenceService : AbsenceService,
	) {}

	public SchedulingApiAbsenceType = SchedulingApiAbsenceType;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public absenceType(memberId : Id) : MemberBadgeComponent['absenceType'] {
		if (this.members.get(memberId)?.trashed) return 'trashed';
		if (this.shiftStart === null) return null;
		if (this.shiftEnd === null) return null;
		if (this.shiftId === null) return null;
		const type = this.absenceService.absenceType(memberId, {
			start: this.shiftStart,
			end: this.shiftEnd,
			id: this.shiftId,
		});
		return type === SchedulingApiAbsenceType.OTHER ? null : type ?? null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isMe(member : SchedulingApiMember) : boolean | undefined {
		if (this.myId === null) return undefined;
		if (member.isNewItem()) return undefined;
		return this.myId.equals(member.id);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get membersForList() : SchedulingApiMember[] {
		return this.members.iterableSortedBy([
			item => item.lastName,
			item => item.firstName,
			item => !item.trashed,
			item => this.isMe(item),
		], true);
	}
}
