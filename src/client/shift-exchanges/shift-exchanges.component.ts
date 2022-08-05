import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { OnDestroy, AfterContentChecked, AfterContentInit } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { PExportService } from '@plano/client/shared/p-export.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { MeService } from '@plano/shared/api';
import { ExportShiftExchangeStatisticsExcelApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ShiftExchangesService } from './shift-exchanges.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { SchedulingApiShiftExchanges } from '../scheduling/shared/api/scheduling-api-shift-exchange.service';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';
import { BootstrapSize, PThemeEnum } from '../shared/bootstrap-styles.enum';
import { FilterService } from '../shared/filter.service';
import { HighlightService } from '../shared/highlight.service';
import { PShiftExchangeService } from '../shared/p-shift-exchange/shift-exchange.service';

@Component({
	selector: 'p-shift-exchanges',
	templateUrl: './shift-exchanges.component.html',
	styleUrls: ['./shift-exchanges.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ShiftExchangesComponent implements OnDestroy, AfterContentChecked, AfterContentInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	// private now ! : number;

	constructor(
		public api : SchedulingApiService,
		private localize : LocalizePipe,
		public shiftExchangesService : ShiftExchangesService,
		public highlightService : HighlightService,
		public location : Location,
		private changeDetectorRef : ChangeDetectorRef,
		private meService : MeService,
		private route : ActivatedRoute,
		private console : LogService,
		public pShiftExchangeService : PShiftExchangeService,
		private pRouterService : PRouterService,
		private pMoment : PMomentService,
		private filterService : FilterService,
		public exportShiftExchangeStatisticsExcelApi : ExportShiftExchangeStatisticsExcelApiService,
		private pExport : PExportService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	public config : typeof Config = Config;

	/**
	 * Cache start and end to use them if they toggle defineCustomDateRange
	 */
	private _start : number | null = null;
	private _end : number | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get start() : number | null {
		return this.shiftExchangesService.start;
	}
	public set start(input : number | null) {
		this._start = input;
		// NOTE: backend does not support -1 (yet)
		// this.shiftExchangesService.start = input !== 0 ? input : -1;
		this.shiftExchangesService.start = input;
		this.navToNewRange();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get end() : number | null {
		return this.shiftExchangesService.end;
	}
	public set end(input : number | null) {
		this._end = input;
		// NOTE: backend does not support -1 (yet)
		// this.shiftExchangesService.end = input !== 0 ? input : -1;
		this.shiftExchangesService.end = input;
		this.navToNewRange();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get defineCustomDateRange() : boolean {
		return this.shiftExchangesService.defineCustomDateRange;
	}
	public set defineCustomDateRange(input : boolean) {
		this.shiftExchangesService.defineCustomDateRange = input;
		if (!this.shiftExchangesService.defineCustomDateRange) {
			this.shiftExchangesService.start = null;
			this.shiftExchangesService.end = null;
		} else {
			if (this._start) this.shiftExchangesService.start = this._start;
			if (this._end) this.shiftExchangesService.end = this._end;
		}
		this.navToNewRange();
	}

	/**
	 * Check if url has start
	 */
	private get routeStart() : number | null {
		const cookie = this.route.snapshot.paramMap.get('start');
		if (!cookie) return null;
		return +cookie;
	}

	/**
	 * Check if url has end
	 */
	private get routeEnd() : number | null {
		const cookie = this.route.snapshot.paramMap.get('end');
		if (!cookie) return null;
		return +cookie;
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		if (this.routeStart || this.routeEnd) {
			if (this.routeStart) this.shiftExchangesService.start = this.routeStart;
			if (this.routeEnd) this.shiftExchangesService.end = this.routeEnd;
			this.shiftExchangesService.defineCustomDateRange = true;
		} else {
			this.shiftExchangesService.start = null;
			this.shiftExchangesService.end = null;
			this.shiftExchangesService.defineCustomDateRange = false;
		}

		this.meService.isLoaded(() => {
			this.loadNewData();
		});
	}

	public ngAfterContentChecked() : void {
	}

	public ngAfterContentInit() : void {
		this.initValues();
		this.setRouterListener();
	}

	private subscription : Subscription | null = null;

	/**
	 * Listen to NavigationEnd to navigate somewhere if no url params are provided or load data if params are provided.
	 */
	private setRouterListener() : void {
		this.subscription = this.pRouterService.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
			event => {
				if (!(event instanceof NavigationEnd)) return;

				this.highlightService.setHighlighted(null);
				this.loadNewData();
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
		this.changeDetectorRef.detach();
		this.subscription?.unsubscribe();
	}

	/**
	 * Load new absences and workingTimes
	 */
	private loadNewData(success ?: () => void) : void {
		this.shiftExchangesService.updateQueryParams();
		assumeNonNull(this.shiftExchangesService.queryParams);
		this.api.load({
			searchParams: this.shiftExchangesService.queryParams,
			success: success ?? null,
		});
	}

	// private relatedShifts(shiftExchange : SchedulingApiShiftExchange) : SchedulingApiShifts {
	// 	const shifts = new SchedulingApiShifts(null, false);
	// 	if (!this.api.isLoaded()) return shifts;
	// 	for (const item of shiftExchange.shifts.iterable()) {
	// 		const shift = this.api.data.shifts.get(item.id);
	// 		if (shift) shifts.push(shift);
	// 	}
	// 	return shifts;
	// }

	/**
	 * Navigate to start and end from the service
	 * Use this after service values have changes
	 */
	public navToNewRange() : void {
		const newStart = this.shiftExchangesService.start;
		const end = this.shiftExchangesService.end;
		this.navTo({ start: newStart, end: end });
	}

	/**
	 * Navigate to a given start and end
	 */
	public navTo(input : { start ?: number | null, end ?: number | null }) : void {
		let newUrl = '/client/shift-exchanges';

		if (input.start) newUrl += `/${input.start}`;
		if (input.end) {
			if (!input.start) newUrl += '/0';
			newUrl += `/${input.end}`;
		}

		this.pRouterService.navigate([newUrl]);
		this.location.replaceState(newUrl);
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public navBack() : void {
		this.pRouterService.navBack();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftExchangesForList() : SchedulingApiShiftExchanges {
		if (!this.api.isLoaded()) return new SchedulingApiShiftExchanges(null, false);
		return this.api.data.shiftExchanges.filterBy(item => {
			if (!item.showInList) return false;
			if (!this.filterService.isVisible(item.indisposedMember!)) return false;
			if (item.shiftModel && !this.filterService.isVisible(item.shiftModel)) return false;
			return true;
		});
	}


	/**
	 * Export for people who like microsoft more than us…
	 */
	public exportIsRunning = false;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public exportShiftExchangeStatistics() : void {
		this.exportShiftExchangeStatisticsExcelApi.setEmptyData();

		// set shifts to be exported
		for (const item of this.shiftExchangesForList.iterable()) {
			this.exportShiftExchangeStatisticsExcelApi.data.shiftExchangeIds.push(item.id);
		}

		// set members to be exported
		for (const member of this.api.data.members.iterable()) {
			if (this.filterService.isVisible(member))
				this.exportShiftExchangeStatisticsExcelApi.data.memberIds.push(member.id);
		}
		// set shiftModel to be exported
		for (const shiftModel of this.api.data.shiftModels.iterable()) {
			if (this.filterService.isVisible(shiftModel))
				this.exportShiftExchangeStatisticsExcelApi.data.shiftModelIds.push(shiftModel.id);
		}

		assumeNonNull(this.shiftExchangesService.start);
		assumeNonNull(this.shiftExchangesService.end);

		// get query parameters
		const queryParams = new HttpParams()
			.set('start', (this.shiftExchangesService.start).toString())
			.set('end', (this.shiftExchangesService.end).toString());

		const fileName = this.pExport.getFileName(this.localize.transform('Tauschbörsen Statistik'), this.shiftExchangesService.start, this.shiftExchangesService.end - 1);

		// download file
		this.exportIsRunning = true;
		this.exportShiftExchangeStatisticsExcelApi.downloadFile(fileName, 'xlsx', queryParams, 'PUT', () => {
			this.exportIsRunning = false;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public createNewShiftExchange() : void {
		this.pRouterService.navigate(['/client/shift-exchange/create']);
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get exportPopOverContent() : string {
		if (
			!this.defineCustomDateRange ||
				this.start === null ||
				this.end === null
		) {
			this.console.error('unexpected type');
			return this.localize.transform('Bitte erst oben bei »Zeitraum der Schichten« auf »benutzerdefiniert« umstellen und ein Start- sowie Enddatum festlegen.');
		}
		return this.localize.transform('Statistik exportieren');
	}
}
