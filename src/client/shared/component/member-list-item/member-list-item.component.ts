import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiAccountingPeriodExpectedMemberDataItem} from '@plano/shared/api';
import { SchedulingApiAccountingPeriod } from '@plano/shared/api';
import { MeService, RightsService, SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShift } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { Id } from '../../../../shared/api/base/id';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { FilterService } from '../../filter.service';
import { HighlightService } from '../../highlight.service';
import { PMomentService } from '../../p-moment.service';
import { PSidebarService } from '../../p-sidebar/p-sidebar.service';

export interface ApiListWrapperListItemComponent {
	editFilterModeActive : boolean;
	editListItemsMode : boolean;
}

@Component({
	selector: 'p-member-list-item',
	templateUrl: './member-list-item.component.html',
	styleUrls: ['./member-list-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class MemberListItemComponent implements ApiListWrapperListItemComponent {
	@HostBinding('id') private get hasId() : string {
		return `scroll-target-id-${this.member?.id.toString()}`;
	}

	@HostBinding('class.rounded') protected _alwaysTrue = true;
	@HostBinding('class.muted-item') private get _muteItem() : boolean {
		if (!this.member) return false;
		if (this.highlightService.isMuted(this.member)) return true;
		return false;
	}

	@Input() public editFilterModeActive : boolean = false;
	@Input() public editListItemsMode : boolean = false;

	public hover : boolean = false;
	@Input() public member : SchedulingApiMember | null = null;
	@Output() public onItemClick : EventEmitter<SchedulingApiMember> = new EventEmitter();

	@Input() public hideMultiSelectBtn : boolean = true;

	@Input() public showExpectedEarnings : boolean = false;
	public showExpectedEarningsDetails : boolean = false;

	public now ! : number;

	constructor(
		private api : SchedulingApiService,
		private me : MeService,
		public pSidebarService : PSidebarService,
		public schedulingService : SchedulingService,
		public highlightService : HighlightService,
		private filterService : FilterService,
		private router : Router,
		private rightsService : RightsService,
		private pMoment : PMomentService,
	) {
		this.now = +this.pMoment.m();
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isMe() : boolean | null {
		return this.rightsService.isMe(this.member!.id) ?? null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isOwner() : boolean | null {
		return this.rightsService.isOwner;
	}

	/**
	 * Decide if the multi-select-checkbox should be visible or not
	 */
	public get showMultiSelectCheckbox() : boolean {
		if (this.hideMultiSelectBtn) return false;

		if (this.hover) return true;
		if (this.highlightService.isHighlighted(this.member)) return true;
		if (this.member!.selected) return true;
		if (this.api.data.members.hasSelectedItem) return true;
		// if (this.api.hasSelectedItems) return true;

		return false;
	}

	/**
	 * Show details for specific member
	 */
	public showDetails() : void {
		if (this.member) {
			this.router.navigate([`/client/member/${this.member.id.toString()}`]);
		} else {
			this.router.navigate(['/client/member/']);
		}
	}

	@Output() public onSelectInCalendarClick : EventEmitter<Id> = new EventEmitter<Id>();

	// eslint-disable-next-line jsdoc/require-jsdoc
	public selectInCalendar(event : Event) : void {
		event.stopPropagation();
		this.onSelectInCalendarClick.emit(this.member!.id);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showWishesIconForMember() : boolean {
		if (!this.me.isLoaded()) return false;
		if (!(this.highlightService.highlightedItem instanceof SchedulingApiShift)) return false;
		if (
			!this.isOwner &&
			// me has no right to write the highlighted shiftmodel
			!this.rightsService.userCanWrite(this.highlightService.highlightedItem) &&
			// this is me
			!this.isMe
		) return false;
		if (!this.highlightService.showWishIcon(this.member!)) return false;
		return true;
	}

	private expectedMemberData(accountingPeriod : SchedulingApiAccountingPeriod)
		: SchedulingApiAccountingPeriodExpectedMemberDataItem | null {
		return accountingPeriod.expectedMemberData.getByMember(this.member!);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get expectedMemberData1() : SchedulingApiAccountingPeriodExpectedMemberDataItem | null {
		return this.expectedMemberData(this.period1);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get expectedMemberData2() : SchedulingApiAccountingPeriodExpectedMemberDataItem | null {
		return this.expectedMemberData(this.period2);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get period2() : SchedulingApiAccountingPeriod {
		if (this.api.data.accountingPeriods.length >= 2) {
			return this.api.data.accountingPeriods.get(1)!;
		}
		return this.api.data.accountingPeriods.get(0)!;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get period1() : SchedulingApiAccountingPeriod {
		return this.api.data.accountingPeriods.get(0)!;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showExpectedMemberData1() : boolean {
		if (!this.showExpectedEarnings) return false;
		if (!this.pSidebarService.isWorkloadMode) return false;
		if (!this.pSidebarService.showWorkload[0]) return false;
		if (this.api.data.accountingPeriods.length <= 1) return false;
		if (!this.expectedMemberData1) return false;

		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showExpectedMemberData2() : boolean {
		if (!this.showExpectedEarnings) return false;
		if (!this.pSidebarService.isWorkloadMode) return false;
		if (!this.pSidebarService.showWorkload[1]) return false;
		if (this.api.data.accountingPeriods.length < 1) return false;
		if (!this.expectedMemberData2) return false;

		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get affected() : boolean {
		return !!this.member?.affected;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get selected() : boolean {
		return !!this.member?.selected;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasOnItemClickBinding() : boolean {
		return this.onItemClick.observers.length > 0;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isVisible() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.member, 'member');
		return this.filterService.isVisible(this.member);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public toggleItem() : void {
		this.filterService.toggleItem(this.member!);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get bubbleDirection() : 'left' | 'right' | 'center' | undefined {
		if (this.editFilterModeActive && this.editListItemsMode) return 'left';
		if (this.editFilterModeActive !== this.editListItemsMode) return 'center';
		if (!this.editFilterModeActive && !this.editListItemsMode) return 'right';
		return undefined;
	}
}
