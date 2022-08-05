import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiMember, SchedulingApiMembers } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { PBasicInfoComponent } from '../../component/basic-shift-info/basic-info.component';
import { MemberBadgeComponent } from '../../p-member/member-badges/member-badge/member-badge.component';

@Component({
	selector: 'p-shift-comment-meta',
	templateUrl: './shift-comment-meta.component.html',
	styleUrls: ['./shift-comment-meta.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftCommentMetaComponent {
	@Input('name') public name : PBasicInfoComponent['name'] = null;
	@Input() public start : PBasicInfoComponent['start'] = null;
	@Input() public end : PBasicInfoComponent['end'] = null;
	@Input() public assignedMembers : SchedulingApiMembers | null = null;

	constructor(
		private rightsService : RightsService,
	) {
	}

	/**
	 * Is this member the logged in user?
	 * @param member Member that should be checked
	 */
	public isMe(member : SchedulingApiMember) : MemberBadgeComponent['isMe'] {
		return !!this.rightsService.isMe(member.id);
	}

}
