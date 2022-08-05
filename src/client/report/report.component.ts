import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { AfterContentInit, OnDestroy } from '@angular/core';
import { Component, HostBinding, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavigationEnd, ActivatedRoute } from '@angular/router';
import { ReportUrlParamsService } from '@plano/client/report/report-url-params.service';
import { ReportService } from '@plano/client/report/report.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiMembers} from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { ExportReportingExcelApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiWorkingTimes } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiAbsences } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { ReportFilterService } from './report-filter.service';
import { Id } from '../../shared/api/base/id';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { RightsService } from '../accesscontrol/rights.service';
import { FilterService } from '../shared/filter.service';
import { HighlightService } from '../shared/highlight.service';
import { PExportService } from '../shared/p-export.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
import { PFormGroup } from '../shared/p-forms/p-form-control';
import { PSidebarService } from '../shared/p-sidebar/p-sidebar.service';

@Component({
	selector: 'p-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ReportComponent implements AfterContentInit, OnDestroy {
	public readonly CONFIG : typeof Config = Config;
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	public formGroup : PFormGroup | null = null;

	public modalRef : NgbModalRef | null = null;

	constructor(
		public api : SchedulingApiService,
		public meService : MeService,
		private route : ActivatedRoute,
		private pRouterService : PRouterService,
		private validators : ValidatorsService,
		private exportExcelApi : ExportReportingExcelApiService,
		public reportService : ReportService,
		public reportUrlParams : ReportUrlParamsService,
		private accountApiService : AccountApiService,
		private pFormsService : PFormsService,
		private filterService : FilterService,
		public highlightService : HighlightService,
		public pSidebarService : PSidebarService,
		public rightsService : RightsService,
		private changeDetectorRef : ChangeDetectorRef,
		private console : LogService,
		public reportFilterService : ReportFilterService,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
		private pExport : PExportService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;
	public DropdownTypeEnum = DropdownTypeEnum;
	public PThemeEnum = PThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;

	public ngAfterContentInit() : void {
		this.setRouterListener();
		this.initValues();
	}

	private refresh() : void {
		this.refreshStartAndEnd((reloadNecessary) => {
			if (!reloadNecessary) {
				this.loadNewData();
			} else {
				this.navTo({
					start: this.reportUrlParams.urlParam.start ?? null,
					end: this.reportUrlParams.urlParam.end ?? null,
				}, { replaceUrl: true });
			}
		});
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.refresh();
	}

	private getStart( success : (reloadNecessary : boolean | 'scilently') => void ) : void {
		// Check if user navigated to a specific date
		if (this.readStartParam) {

			// User came via direct link
			if (this.reportUrlParams.urlParam.start === undefined) {
				this.reportUrlParams.urlParam.start = this.readStartParam;
				success(false);
				return;
			}

			// Check if start is still "up-to-date"
			if (this.reportUrlParams.urlParam.start === this.readStartParam) {
				success(false);
				return;
			}

			this.reportUrlParams.urlParam.start = this.readStartParam;
			success(true);
			return;
		}

		// User did not nav to a specific date.
		// Is a date stored from a previous visit?
		if (this.reportUrlParams.urlParam.start) {
			// Send the user to the previous start
			success(true);
			return;
		}

		// There is no data available. Calculate a default date based on the accountingPeriodStartDay
		this.meService.isLoaded(() => {
			this.accountApiService.isLoaded(() => {
				this.reportUrlParams.urlParam.start = this.getDefaultStart();
				success(true);
			});
			if (!this.accountApiService.isLoaded()) this.accountApiService.load();
		});
	}

	private getEnd( success : (reloadNecessary : boolean) => void ) : void {
		// Check if user navigated to a specific date
		if (this.readEndParam) {

			// User came via direct link
			if (this.reportUrlParams.urlParam.end === undefined) {
				this.reportUrlParams.urlParam.end = this.readEndParam;
				success(false);
				return;
			}

			// Check if end is still "up-to-date"
			if (this.reportUrlParams.urlParam.end === this.readEndParam) {
				success(false);
				return;
			}

			this.reportUrlParams.urlParam.end = this.readEndParam;
			success(true);
			return;
		}

		// User did not nav to a specific date.
		// Is a date stored from a previous visit?
		if (this.reportUrlParams.urlParam.end) {
			// Send the user to the previous start
			success(true);
			return;
		}

		// There is no data available. Calculate a default date based on the accountingPeriodStartDay
		this.meService.isLoaded(() => {
			this.accountApiService.isLoaded(() => {
				this.reportUrlParams.urlParam.end = this.getDefaultEnd();
				success(true);
			});
			if (!this.accountApiService.isLoaded()) this.accountApiService.load();
		});
	}

	private refreshStartAndEnd(success : (reloadNecessary : boolean) => void) : void {
		let reloadNecessary : boolean = false;
		this.getStart((reloadNecessaryFromGetStart : boolean | 'scilently') => {
			if (reloadNecessaryFromGetStart) reloadNecessary = true;
			this.getEnd((reloadNecessaryFromGetEnd : boolean) => {
				if (reloadNecessaryFromGetEnd) reloadNecessary = true;
				success(reloadNecessary);
			});
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasSomeFilterSettings() : boolean {
		if (!this.filterService.isSetToShowAll) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get membersForList() : SchedulingApiMembers {
		return this.api.data.members.filterBy(
			(member) => {
				// Members only get their own entry
				if (!this.rightsService.isOwner && !this.rightsService.isMe(member.id)) return false;

				if (!this.filterService.isVisible(member)) return false;

				// Does this member has a visible absence?
				const visibleAbsence = this.absences.findBy((item) => item.memberId.equals(member.id));
				if (visibleAbsence) return true;

				// Does this member has a visible workingTime?
				const visibleWorkingTime = this.workingTimes.findBy((item) => item.memberId.equals(member.id));
				if (visibleWorkingTime) return true;

				// User wants to see members without entries?
				if (this.reportFilterService.showUsersWithoutEntries) return true;

				return false;
			},
		);
	}

	/**
	 * Shortcut to reset all Filters.
	 */
	public resetFilter() : void {
		this.reportFilterService.unload();
		this.reportFilterService.initValues();
		this.filterService.unload();
		this.filterService.initValues();
	}

	// public get showContent() : boolean {
	// 	return this.api.isLoaded();
	// }

	/**
	 * Initialize the formGroup for this component
	 */
	private initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }
		const tempFormGroup = this.pFormsService.group({});
		this.pFormsService.addControl(tempFormGroup, 'minDate',
			{
				value : this.reportUrlParams.urlParam.start,
				disabled: false,
			},
			[this.validators.required(PApiPrimitiveTypes.number)],
			(value) => {
				this.reportUrlParams.urlParam.start = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'maxDate',
			{
				value : this.reportUrlParams.urlParam.end,
				disabled: false,
			},
			[this.validators.required(PApiPrimitiveTypes.number)],
			(value) => {
				this.reportUrlParams.urlParam.end = value;
			},
		);
		this.formGroup = tempFormGroup;
	}

	/**
	 * Load new absences and workingTimes
	 */
	private loadNewData() : void {
		this.initFormGroup();
		this.reportUrlParams.updateQueryParams();
		this.api.load({
			searchParams: this.reportUrlParams.queryParams,
			success: () => {
				this.uncollapseMemberCollapsibleIfProvided();
			},
		});
	}

	private uncollapseMemberCollapsibleIfProvided() : void {
		const routeParams = this.route.snapshot.paramMap;
		// If memberId is provided, uncollapse the desired member
		const memberId = Number(routeParams.get('memberId'));
		this.reportService.uncollapse(Id.create(memberId));
	}

	private getDefaultStart() : number {
		const newMoment = this.pMoment.m().startOf('day');
		if (!this.meService.isLoaded()) throw new Error('Make sure meService is loaded here.');
		if (!this.accountApiService.isLoaded()) throw new Error('Make sure accountApi is loaded here.');
		if (this.accountApiService.data.attributeInfoAccountingPeriodStartDay.value !== null) {
			if (newMoment.date() > this.accountApiService.data.accountingPeriodStartDay) newMoment.add(1, 'month');
			newMoment.date(this.accountApiService.data.accountingPeriodStartDay);
		} else {
			newMoment.add(1, 'day');
		}
		return +this.pMoment.m(newMoment).subtract(1, 'month');
	}

	private getDefaultEnd() : number {
		const start = this.getDefaultStart();
		const newMoment = this.pMoment.m(start);
		return +this.pMoment.m(newMoment).add(1, 'month');
	}

	private ngUnsubscribe : Subject<null> = new Subject<null>();

	public ngOnDestroy() : void {
		this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
		this.changeDetectorRef.detach();
	}

	private get readStartParam() : number | undefined {
		assumeDefinedToGetStrictNullChecksRunning(this.route, 'route');
		if (this.route.snapshot.params['start'] === undefined) return undefined;
		if (this.route.snapshot.params['start'] === '0') return undefined;
		return +this.route.snapshot.params['start'];
	}

	private get readEndParam() : number | undefined {
		assumeDefinedToGetStrictNullChecksRunning(this.route, 'route');
		if (this.route.snapshot.params['end'] === undefined) return undefined;
		if (this.route.snapshot.params['end'] === '0') return undefined;
		return +this.route.snapshot.params['end'];
	}

	/**
	 * Listen to NavigationEnd to navigate somewhere if no url params are provided or load data if params are provided.
	 */
	private setRouterListener() : void {
		// eslint-disable-next-line rxjs/no-ignored-subscription -- Remove this before you work here.
		this.pRouterService.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
			(event) => {
				if (!(event instanceof NavigationEnd)) return;

				this.highlightService.setHighlighted(null);
				this.refresh();
			},
			(error : unknown) => {
				this.console.error(error);
			},
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public navToNewRange() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		if (!this.formGroup.valid) return;

		const newStart = this.formGroup.get('minDate')!.value;
		const newEnd = +this.pMoment.m(this.formGroup.get('maxDate')!.value).startOf('day');
		this.navTo({ start: newStart, end: newEnd });
	}

	private navTo(input : { start ?: number | null, end ?: number | null }, extras ?: NavigationExtras) : void {
		const newUrl = `/client/report/${input.start}/${input.end}`;
		this.pRouterService.navigate([newUrl], extras);
	}

	/**
	 * Create a new absence entry for a member
	 */
	public createAbsenceEntry() : void {
		this.pRouterService.navigate(['client/absence/']);
	}

	/**
	 * Create a new workingTime entry for a member
	 */
	public createWorkingTimeEntry() : void {
		this.pRouterService.navigate(['client/workingtime/']);
	}

	/**
	 * Get absences
	 */
	public get absences() : SchedulingApiAbsences {
		if (!this.reportFilterService.showAbsences) return new SchedulingApiAbsences(null, false);
		return this.api.data.absences.filterBy((item) => {
			return this.filterService.isVisible(item);
		});
	}

	/**
	 * Get workingTimes
	 */
	public get workingTimes() : SchedulingApiWorkingTimes {
		if (!this.reportFilterService.showWorkingTimes) return new SchedulingApiWorkingTimes(null, false);
		return this.api.data.workingTimes.filterBy((item) => {
			return this.filterService.isVisible(item);
		});
	}

	/**
	 * is the api currently loading?
	 */
	public get isApiLoading() : boolean {
		return this.api.isLoadOperationRunning;
	}

	public exportIsRunning = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public export() : void {
		// set workingTimes and absences to be exported
		this.exportExcelApi.setEmptyData();

		for (const workingTime of this.api.data.workingTimes.iterable()) {
			if (!this.filterService.isVisible(workingTime)) continue;
			this.exportExcelApi.data.workingTimeIds.createNewItem(workingTime.id);
		}

		for (const absence of this.api.data.absences.iterable()) {
			if (!this.filterService.isVisible(absence)) continue;
			this.exportExcelApi.data.absenceIds.createNewItem(absence.id);
		}

		// set members to be exported
		for (const member of this.api.data.members.iterable()) {
			if (this.filterService.isVisible(member))
				this.exportExcelApi.data.memberIds.push(member.id);
		}
		// set shiftModel to be exported
		for (const shiftModel of this.api.data.shiftModels.iterable()) {
			if (this.filterService.isVisible(shiftModel))
				this.exportExcelApi.data.shiftModelIds.push(shiftModel.id);
		}

		assumeDefinedToGetStrictNullChecksRunning(this.reportUrlParams.urlParam.start, 'reportUrlParams.urlParam.start');
		assumeDefinedToGetStrictNullChecksRunning(this.reportUrlParams.urlParam.end, 'reportUrlParams.urlParam.end');

		// get query params
		let queryParams = new HttpParams()
			.set('start', (this.reportUrlParams.urlParam.start).toString())
			.set('end', (this.reportUrlParams.urlParam.end).toString());

		if (this.reportFilterService.showWorkingTimes) {
			queryParams = queryParams.set('includeWorkingTimes', '');
		}
		if (this.reportFilterService.showWorkingTimesForecast) {
			queryParams = queryParams.set('includeWorkingTimesForecast', '');
		}

		if (this.reportFilterService.showAbsences) {
			queryParams = queryParams.set('includeAbsences', '');
		}
		if (this.reportFilterService.showUnpaidAbsences) {
			queryParams = queryParams.set('includeUnpaidAbsences', '');
		}

		// cSpell:ignore auswertungsexport
		const fileName = this.pExport.getFileName(this.localize.transform('auswertungsexport'), this.reportUrlParams.urlParam.start, this.reportUrlParams.urlParam.end - 1);

		// download file
		this.exportIsRunning = true;
		this.exportExcelApi.downloadFile(fileName, 'xlsx', queryParams, 'PUT', () => {
			this.exportIsRunning = false;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get fromLabelText() : string | undefined {
		if (Config.IS_MOBILE) return undefined;
		if (!this.pSidebarService.mainSidebarIsCollapsed) {
			return this.localize.transform('Auswertung vom');
		}
		return this.localize.transform('vom');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get tillLabelText() : string {
		if (Config.IS_MOBILE) return ' – ';
		return this.localize.transform('bis');
	}
}
