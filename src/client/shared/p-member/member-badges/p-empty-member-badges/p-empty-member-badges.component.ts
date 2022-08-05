import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'p-empty-member-badges[emptyMemberSlots]',
	templateUrl: './p-empty-member-badges.component.html',
	styleUrls: ['./p-empty-member-badges.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PEmptyMemberBadgesComponent {
	@Input() public emptyMemberSlots ! : number;

	constructor() {}

	/**
	 * Sometimes we want to show a stack of »empty« member-badges in the ui. This can be used to generate
	 * the stack.
	 */
	public get emptyMemberBadges() : undefined[] {
		let amount = 0;
		amount = this.emptyMemberSlots > 3 ? 3 : this.emptyMemberSlots;
		return Array.from({length: amount});
	}
}
