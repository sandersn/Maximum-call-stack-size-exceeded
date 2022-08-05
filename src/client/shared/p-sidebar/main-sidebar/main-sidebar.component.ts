import { AfterContentChecked} from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SLIDE_HORIZONTAL_ON_NGIF_TRIGGER } from '@plano/animations';
import { PCalendarService } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-calendar.service';
import { SchedulingApiShiftModel, SchedulingApiShiftModels, SchedulingApiMember, SchedulingApiMembers} from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiShiftExchanges } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { Id } from '../../../../shared/api/base/id';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { FilterService } from '../../filter.service';
import { PShiftExchangeConceptService } from '../../p-shift-exchange/p-shift-exchange-concept.service';
import { PTabSizeEnum } from '../../p-tabs/p-tabs/p-tab/p-tab.component';
import { ClientRoutingService, CurrentPageEnum } from '../../routing.service';
import { PSidebarService } from '../p-sidebar.service';
import { SidebarTab } from '../p-sidebar.types';

@Component({
	selector: 'p-main-sidebar',
	templateUrl: './main-sidebar.component.html',
	styleUrls: ['./main-sidebar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [ SLIDE_HORIZONTAL_ON_NGIF_TRIGGER ],
})

export class MainSidebarComponent implements AfterContentChecked {
	@Input() public shifts : SchedulingApiShifts | null = null;
	@Output() public onSelectRelatedShifts : EventEmitter<SchedulingApiShiftModel | SchedulingApiMember> =
		new EventEmitter<SchedulingApiShiftModel | SchedulingApiMember>();

	constructor(
		public api : SchedulingApiService,
		public filterService : FilterService,
		public pSidebarService : PSidebarService,
		public me : MeService,
		private router : Router,
		private pCalendarService : PCalendarService,
		private pShiftExchangeConceptService : PShiftExchangeConceptService,
		private clientRoutingService : ClientRoutingService,
		private console : LogService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PTabSizeEnum = PTabSizeEnum;
	public SidebarTab = SidebarTab;
	public PlanoFaIconPool = PlanoFaIconPool;

	public config : typeof Config = Config;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onSelectShiftsRelatedToMember(id : Id) : void {
		const member = this.api.data.members.get(id)!;
		this.onSelectRelatedShifts.emit(member);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onSelectShiftsRelatedToShiftModel(id : Id) : void {
		const shiftModel = this.api.data.shiftModels.get(id)!;
		this.onSelectRelatedShifts.emit(shiftModel);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hideMultiSelectBtn() : boolean {
		return this.clientRoutingService.currentPage !== CurrentPageEnum.SCHEDULING;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftExchanges() : SchedulingApiShiftExchanges {
		if (!this.api.isLoaded()) return new SchedulingApiShiftExchanges(null, false);
		return this.api.data.shiftExchanges;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelsForList() : SchedulingApiShiftModels {
		return this.api.data.shiftModels;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get membersForList() : SchedulingApiMembers {
		return this.api.data.members;
	}

	public ngAfterContentChecked() : void {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasImportantNoteForToday() : boolean {
		return !!this.pCalendarService.hasImportantNoteForDay();
	}

	/**
	 * Navigate to the page with the list of shift-exchanges
	 */
	public navToShiftExchanges() : void {
		this.api.deselectAllSelections();
		this.api.deselectAllSelections();
		this.router.navigate(['client/shift-exchanges']);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftExchangesForList() : SchedulingApiShiftExchanges {
		return this.shiftExchanges.filterBy(item => {

			// FIXME: PLANO-1389
			if (!this.api.data.members.length) { this.console.error('Members list is empty. (Probably PLANO-1389)'); return false; }

			assumeDefinedToGetStrictNullChecksRunning(item.indisposedMember, 'item.indisposedMember');
			if (!this.filterService.isVisible(item.indisposedMember)) return false;
			if (item.shiftModel && !this.filterService.isVisible(item.shiftModel)) return false;
			return true;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get badgeContent() : number {
		let result = 0;
		for (const shiftExchange of this.shiftExchangesForList.iterable()) {
			if (!shiftExchange.showOnDesk) continue;
			if (shiftExchange.todoCount) {
				result += shiftExchange.todoCount;

			} else if (this.pShiftExchangeConceptService.getBadgeIcon(shiftExchange)) {
				result += 1;
			}
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasTodaysShiftDescriptionsForMember() : boolean {
		return !!this.pCalendarService.shiftsOfDayHaveDescriptions(undefined, { onlyForUser: true });
	}
}
