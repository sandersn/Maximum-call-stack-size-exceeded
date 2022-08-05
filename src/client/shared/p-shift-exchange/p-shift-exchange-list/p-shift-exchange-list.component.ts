
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy} from '@angular/core';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SchedulingApiShiftExchanges } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftExchange, SchedulingApiShiftExchangeSwappedShiftRef } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRef } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PShiftExchangeListService } from './p-shift-exchange-list.service';
import { BootstrapSize } from '../../../shared/bootstrap-styles.enum';
import { FilterService } from '../../filter.service';
import { HighlightService } from '../../highlight.service';
import { ListSortDirection } from '../../p-lists/list-headline-item/list-headline-item.component';
import { PShiftExchangeConceptService } from '../p-shift-exchange-concept.service';

@Component({
	selector: 'p-shift-exchange-list[shiftExchanges]',
	templateUrl: './p-shift-exchange-list.component.html',
	styleUrls: ['./p-shift-exchange-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	// animations: [SLIDE_ON_NGIF_TRIGGER]
})
export class PShiftExchangeListComponent implements OnDestroy {
	@Input() public addItemIds : boolean | null = null;
	@Input() private shiftExchanges ! : SchedulingApiShiftExchanges;
	@Output() public calendarBtnClick : EventEmitter<SchedulingApiShiftExchangeShiftRef | SchedulingApiShiftExchangeSwappedShiftRef> =
		new EventEmitter<SchedulingApiShiftExchangeShiftRef | SchedulingApiShiftExchangeSwappedShiftRef>();

	/**
	 * Should this component show all items or only those that are marked as »for desk«?
	 */
	@Input() public showOnlyItemsForDesk : boolean = false;
	@Input() public showDetails : boolean = false;
	@Input() public hideAddBtn : boolean = false;

	constructor(
		public api : SchedulingApiService,
		private router : Router,
		private highlightService : HighlightService,
		private filterService : FilterService,
		private console : LogService,
		private pShiftExchangeConceptService : PShiftExchangeConceptService,
		public pShiftExchangeListService : PShiftExchangeListService,
	) {
		this.setRouterListener();
	}

	public ListSortDirection = ListSortDirection;
	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isMuted(shiftExchange : SchedulingApiShiftExchange) : boolean | undefined {
		// if (shiftExchange.isClosed) return true;

		if (!shiftExchange.indisposedMember) return undefined;
		if (!shiftExchange.shiftModel) return undefined;

		if (this.highlightService.isMuted(shiftExchange.indisposedMember)) return true;
		if (this.highlightService.isMuted(shiftExchange.shiftModel)) return true;

		return false;
	}

	/**
	 * Listen to NavigationEnd to navigate somewhere if no url params are provided or load data if params are provided.
	 */
	private setRouterListener() : void {
		// eslint-disable-next-line rxjs/no-ignored-subscription -- Remove this before you work here.
		this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
			(event) => {
				if (!(event instanceof NavigationEnd)) return;

				this.highlightService.setHighlighted(null);
			},
			(error : unknown) => {
				this.console.error(error);
			},
		);
	}

	private ngUnsubscribe : Subject<void> = new Subject<void>();

	public ngOnDestroy() : void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	/**
	 * All shiftExchanges that should be visible in this list.
	 */
	public get shiftExchangesForList() : ApiListWrapper<SchedulingApiShiftExchange> {
		if (!this.shiftExchanges.length) return new SchedulingApiShiftExchanges(null, false);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let sortFn : ((item : SchedulingApiShiftExchange) => any) | ((item : SchedulingApiShiftExchange) => any)[];
		switch (this.pShiftExchangeListService.key) {
			case 'shiftRefs' :
				sortFn = (item : SchedulingApiShiftExchange) => {
					return item.shiftRefs.earliestStart;
				};
				break;
			case 'lastUpdate' :
				sortFn = (item : SchedulingApiShiftExchange) => item.lastUpdate;
				break;
			case 'state' :
				sortFn = [
					(item : SchedulingApiShiftExchange) => {
						return this.pShiftExchangeConceptService.getStateText(item);
					},
					(item : SchedulingApiShiftExchange) => {
						return this.pShiftExchangeConceptService.getStateStyle(item);
					},
				];
				break;
			default :
				sortFn = () => true;
		}

		return this.shiftExchanges.filterBy((shiftExchange) => {
			if (this.showOnlyItemsForDesk && !shiftExchange.showOnDesk) return false;
			return true;
		}).sortedBy(
			sortFn,
			true,
			this.pShiftExchangeListService.reverse ?? undefined,
		);
	}

	/**
	 * Show the related shift(s) in a calendar
	 */
	public onCalendarBtnClick(item : SchedulingApiShiftExchangeShiftRef | SchedulingApiShiftExchangeSwappedShiftRef) : void {
		this.calendarBtnClick.emit(item);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasCalendarBtn() : boolean {
		return this.calendarBtnClick.observers.length > 0;
	}

	// /**
	//  * Navigate to the page with the list of shift-exchanges
	//  */
	//
	// public navToShiftExchanges() : void {
	// 	this.api.deselectAllSelections();
	// 	this.api.deselectAllSelections();
	// 	this.router.navigate(['client/shift-exchanges']);
	// }

	/**
	 * Open Modal with for for a new assignment process
	 */
	public createNewShiftExchange() : void {
		this.router.navigate(['/client/shift-exchange/create']);
	}

}
