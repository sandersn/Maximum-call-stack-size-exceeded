import { SubscriptionLike as ISubscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AfterContentInit, OnDestroy} from '@angular/core';
import { Component, Input, Renderer2 } from '@angular/core';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { BookingsSortedByEmum } from '@plano/client/scheduling/shared/p-bookings/booking-list/booking-list.component';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { PMoreBtnService } from '@plano/client/scheduling/shared/p-bookings/legacy-booking-list/more-btn.service';
import { PAlertThemeEnum, BootstrapSize, PBtnThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { PExportService } from '@plano/client/shared/p-export.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { PSidebarService } from '@plano/client/shared/p-sidebar/p-sidebar.service';
import { ApiListWrapper, SchedulingApiBooking, SchedulingApiBookings, SchedulingApiShiftModel} from '@plano/shared/api';
import { ExportBookingsExcelApiService, ExportCourseStatisticsExcelApiService, MeService, RightsService, SchedulingApiBookingState, SchedulingApiService, SchedulingApiShifts } from '@plano/shared/api';
import { Integer} from '@plano/shared/api/base/generated-types.ag';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { PFaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LocalizePipe, LocalizePipeParamsType } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { BookingListService } from './booking-list.service';
import { LogService } from '../../../shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { ModalService } from '../../../shared/core/p-modal/modal.service';
import { SalesSubPage } from '../sales.component';

@Component({
	selector: 'p-bookings[shifts]',
	templateUrl: './bookings.component.html',
	styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements PComponentInterface, OnDestroy, AfterContentInit, SalesSubPage {

	@Input() public shifts ! : SchedulingApiShifts;

	@Input() public initialStart : number | null = null;
	@Input() public initialEnd : number | null = null;

	private bookingState = SchedulingApiBookingState;

	private subscription : ISubscription | null = null;

	public searchVisible : boolean = false;

	constructor(
		public api : SchedulingApiService,
		public bookingsService : BookingsService,
		private exportBookingsExcelApiService : ExportBookingsExcelApiService,
		private exportStatisticsExcelApi : ExportCourseStatisticsExcelApiService,
		private schedulingService : SchedulingService,
		private rightsService : RightsService,
		private filterService : FilterService,
		private schedulingFilterService : SchedulingFilterService,
		private pExport : PExportService,
		private localize : LocalizePipe,
		private pCurrencyPipe : PCurrencyPipe,
		private bookingListService : BookingListService,
		public pMoreBtnService : PMoreBtnService,
		private pRouterService : PRouterService,
		private meService : MeService,
		public pSidebarService : PSidebarService,
		private renderer : Renderer2,
		private modalService : ModalService,
		private console : LogService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PAlertThemeEnum = PAlertThemeEnum;
	public DropdownTypeEnum = DropdownTypeEnum;
	public BootstrapSize = BootstrapSize;
	public Config = Config;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PBtnThemeEnum = PBtnThemeEnum;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public showInquiryHeadline(bookings : ApiListWrapper<SchedulingApiBooking>) : boolean {
		return !(bookings.get(0) && !!bookings.get(0)!.firstShiftStart);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public bookingIsAInquiry(booking : SchedulingApiBooking) : boolean {
		if (booking.state === SchedulingApiBookingState.INQUIRY) return true;
		if (booking.state === SchedulingApiBookingState.INQUIRY_DECLINED) return true;
		return false;
	}

	public ngAfterContentInit() : void {
		this.initValues();

		this.getGroupedBookings();
		this.subscription = this.api.onChange.subscribe(() => {
			this.getGroupedBookings();
			this.pMoreBtnService.initValues(this.amountOfListItems);
		});
		this.subscription = this.bookingsService.onChange.subscribe(() => {
			this.getGroupedBookings();
			this.pMoreBtnService.initValues(this.amountOfListItems);
		});
		this.subscription = this.filterService.onChange.subscribe(() => {
			this.getGroupedBookings();
			this.pMoreBtnService.initValues(this.amountOfListItems);
		});
		this.subscription = this.schedulingFilterService.onChange.subscribe(() => {
			this.getGroupedBookings();
			this.pMoreBtnService.initValues(this.amountOfListItems);
		});
		this.api.isLoaded(() => {
			this.getGroupedBookings();
			this.pMoreBtnService.initValues(this.amountOfListItems);
		});

		this.meService.isLoaded(() => {
			this.loadNewData();
		});
	}

	public ngOnDestroy() : void {
		this.subscription?.unsubscribe();
	}

	/**
	 * Set of bookings that i assume will not change during a components lifecycle.
	 */
	private _bookings : Data<SchedulingApiBookings> =
		new Data<SchedulingApiBookings>(this.api, this.filterService);
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get bookings() : SchedulingApiBookings | undefined {
		return this._bookings.get(() => {
			return this.api.data.bookings.filterBy((item) => {
				// Only existing items
				if (item.isNewItem()) return false;

				if (!item.api) throw new Error('Expected api to be defined here');
				if (!item.api.data.shiftModels.length) return false;

				// Only items where user can read the ShiftModel
				if (!this.rightsService.userCanRead(item.model)) return false;

				// Only Items that are visible by the users filter settings in ui
				if (!this.filterService.isVisible(item)) return false;

				return true;
			});
		});
	}

	/**
	 * Shorthand filter for the list
	 */
	private bookingsForListFilteredBy(
		fn : (item : SchedulingApiBooking) => boolean,
	) : ApiListWrapper<SchedulingApiBooking> {

		// This seems inefficient.
		//       I think the bookings that get filtered here (without `fn()`) should be stored. Based
		//       on that, we can filter and sort them in methods like bookingsWithCoursesForList,
		//       bookingsWithoutCoursesForList etc.

		// FIXME: This method IS a performance-issue.

		return this.bookings!.filterBy(item => {
			// Only items that pass the provided 'fn'
			if (!fn(item)) return false;

			// FIXME: I am not sure if the following makes sense.
			if (this.bookingsService.showInquiry) return true;
			if (
				item.state !== this.bookingState.INQUIRY &&
				item.state !== this.bookingState.INQUIRY_DECLINED
			) return true;

			return false;
		}).sortedBy(this.sortedBy, false, !this.sortedReverse);
	}

	/**
	 * Shorthand for the list
	 */
	public get bookingsForList() : ApiListWrapper<SchedulingApiBooking> {
		// Return the filtered list without any further filtering
		return this.bookingsForListFilteredBy(() => true);
	}

	public groupedBookings : ApiListWrapper<ApiListWrapper<SchedulingApiBooking>> | null = null;
	// eslint-disable-next-line jsdoc/require-jsdoc
	public getGroupedBookings() : ApiListWrapper<ApiListWrapper<SchedulingApiBooking>> | void {
		if (!this.bookingsService.groupByCourses) return;
		const compareBookingFn = (a : SchedulingApiBooking, b : SchedulingApiBooking) : number => {
			if (a.courseSelector === null || b.courseSelector === null) {
				const aCourseSelectorDefined = a.courseSelector !== null ? 1 : 0;
				const bCourseSelectorDefined = b.courseSelector !== null ? 1 : 0;

				return aCourseSelectorDefined - bCourseSelectorDefined;
			} else {
				// otherwise do detailed comparison of the selectors
				return a.courseSelector.compare(b.courseSelector, a.firstShiftStart ?? null, b.firstShiftStart ?? null);
			}
		};

		const BOOKINGS_SORTED = this.bookingsForList.sortedBy(this.sortedBy, false, this.sortedReverse);
		const GROUPED_BOOKINGS = BOOKINGS_SORTED.groupedBy(compareBookingFn, false);

		const REVERSE = this.sortedBy === BookingsSortedByEmum.FIRST_SHIFT_START ? this.sortedReverse : false;
		const GROUPED_BOOKINGS_SORTED = GROUPED_BOOKINGS.sortedBy((item) => item.get(0)!.firstShiftStart, false, REVERSE);

		this.groupedBookings = GROUPED_BOOKINGS_SORTED;
		return this.groupedBookings;
	}

	/**
	 * Grouped Bookings include inquiries no matter if they are visible or not.
	 */
	public get groupedBookingsLength() : number {
		let result = 0;
		for (const bookings of this.groupedBookings!.iterable()) {
			result = result + bookings.length;
		}
		return result;
	}

	/**
	 * open detail view of new booking
	 */
	public addBooking() : void {
		this.bookingsService.addBooking();
	}

	/**
	 * Select related shifts in Calendar
	 */
	public onSelectShifts(booking : SchedulingApiBooking) : void {
		this.onClickSelectShifts(booking, this.shifts);
	}

	/**
	 * Select the related shift
	 */
	public onClickSelectShifts(booking : SchedulingApiBooking, shifts : SchedulingApiShifts) : void {
		const relatedShifts = this.bookingsService.relatedShifts(booking.courseSelector, shifts);
		if (relatedShifts instanceof SchedulingApiShifts || relatedShifts?.length) {
			assumeDefinedToGetStrictNullChecksRunning(booking.courseSelector, 'booking.courseSelector');
			this.bookingsService.toggleRelatedShiftsFn(booking.courseSelector, shifts);
		} else {
			const bookingCourseSelector = booking.courseSelector;
			this.schedulingService.afterNavigationCallbacks.push(() => {
				assumeDefinedToGetStrictNullChecksRunning(bookingCourseSelector, 'bookingCourseSelector');
				this.bookingsService.toggleRelatedShiftsFn(bookingCourseSelector, shifts);
			});
			this.pRouterService.navigate([`/client/scheduling/${this.schedulingService.urlParam!.calendarMode}/${booking.firstShiftStart!.toString()}`]);
		}
	}

	public exportIsRunning = false;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public export() : void {
		// inform user if not all visible bookings will be exported
		if (this.bookingsExportCount === this.bookingsForList.length) {
			this.executeExport();
		} else {
			let modalText = this.localize.transform('Buchungen der folgenden Tätigkeiten werden <mark>nicht exportiert</mark>, weil dir dafür die Rechte fehlen:');

			// Add list of all shift-models which will not be exported
			const shiftModelsNotBeingExported = new Array<SchedulingApiShiftModel>();

			for (const booking of this.bookingsForList.iterable()) {
				if (!this.rightsService.hasManagerRightsForShiftModel(booking.shiftModelId) && !shiftModelsNotBeingExported.includes(booking.model)) {
					shiftModelsNotBeingExported.push(booking.model);
				}
			}

			modalText += '<ul>';
			for (const shiftModel of shiftModelsNotBeingExported) {
				modalText += `<li>${shiftModel.name}</li>`;
			}
			modalText += '</ul>';

			// show modal
			this.modalService.warn(
				{
					modalTitle: this.localize.transform('Buchungen exportieren'),
					description: modalText,
				},
				() => {
					// okay pressed
					this.executeExport();
				},
			);
		}
	}

	private executeExport() : void {
		// set bookings to be exported
		this.exportBookingsExcelApiService.setEmptyData();

		for (const booking of this.bookingsForList.iterable()) {
			this.exportBookingsExcelApiService.data.bookingIds.createNewItem(booking.id);
		}

		// get query params
		const startMillis = this.bookingsService.start;
		const endMillis = this.bookingsService.end;

		assumeNonNull(startMillis);
		assumeNonNull(endMillis);

		let queryParams = new HttpParams()
			.set('start', (startMillis).toString())
			.set('end', (endMillis).toString());

		if (this.bookingsService.showInquiry) {
			queryParams = queryParams
				.set('showInquiries', (this.bookingsService.showInquiry.toString()));
		}

		if (this.searchString) {
			queryParams = queryParams
				.set('searchString', (this.searchString));
		}
		if (this.bookingsService.byShiftTime) {
			queryParams = queryParams.set('byShiftTime', this.bookingsService.byShiftTime.toString());
		}

		// set shiftModel to be exported
		for (const shiftModel of this.api.data.shiftModels.iterable()) {
			if (this.filterService.isVisible(shiftModel))
				this.exportBookingsExcelApiService.data.shiftModelIds.push(shiftModel.id);
		}
		// cSpell:ignore buchungsexport
		const fileName = this.pExport.getFileName(this.localize.transform('buchungsexport'), startMillis, endMillis - 1);

		// download file
		this.exportIsRunning = true;
		this.exportBookingsExcelApiService.downloadFile(fileName, 'xlsx', queryParams, 'PUT', () => {
			this.exportIsRunning = false;
		});
	}

	public isPreparingTheStatisticsExport : boolean = false;
	// eslint-disable-next-line jsdoc/require-jsdoc
	public exportStatistics() : void {
		this.isPreparingTheStatisticsExport = true;
		// get query params
		const startMillis = this.bookingsService.start;
		const endMillis = this.bookingsService.end;

		assumeNonNull(startMillis);
		assumeNonNull(endMillis);

		const queryParams = new HttpParams()
			.set('start', (startMillis).toString())
			.set('end', (endMillis).toString());

		// cSpell:ignore buchungsstatistik
		const fileName = this.pExport.getFileName(this.localize.transform('buchungsstatistik'), startMillis, endMillis - 1);

		// download file
		this.exportStatisticsExcelApi.downloadFile(fileName, 'xlsx', queryParams, undefined, () => {
			this.isPreparingTheStatisticsExport = false;
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get userCanExportBookingStatistics() : boolean {
		return this.exportStatisticsExcelApi.data.attributeInfoThis.show;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get userCanExportBookings() : boolean {
		return this.exportBookingsExcelApiService.data.attributeInfoThis.show;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get disabledExportStatisticsBtn() : boolean {
		if (this.isLoading) return true;
		if (this.isPreparingTheStatisticsExport) return true;
		if (!this.bookingsService.byShiftTime) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get disabledExportBookingsBtn() : boolean {
		if (this.isLoading) return true;
		if (this.exportIsRunning) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isLoading() : PComponentInterface['isLoading'] {
		if (!this.api.isLoaded()) return true;
		if (this.api.isBackendOperationRunning) return true;
		if (this.preparingNewSearchRequest) return true;

		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showBookingsGroupedByCourses() : boolean {
		if (!this.bookingsService.groupByCourses) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get currencyIcon() : PFaIcon {
		return this.pCurrencyPipe.getCurrencyIcon();
	}

	/**
	 * The number of bookings which will be exported. Note that only bookings, for which the user
	 * has write permission, will be exported.
	 */
	public get bookingsExportCount() : Integer {
		let result = 0;

		for (const booking of this.bookingsForList.iterable()) {
			if (this.rightsService.hasManagerRightsForShiftModel(booking.shiftModelId))
				++result;
		}

		return result;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get translatedDropdownExportDescription() : string {
		if (this.bookingsForList.length === 1) return this.localize.transform('Eine Buchung exportieren');
		return this.localize.transform('${bookingsCount} Buchungen exportieren', {bookingsCount: this.bookingsExportCount.toString()});
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get translatedDropdownExportStatisticsDescription() : string {
		if (this.searchString) return this.localize.transform('Bei aktiver Suche steht der Statistik-Export nicht zur Verfügung.');
		if (!this.bookingsService.byShiftTime) return this.localize.transform('Nur verfügbar, wenn sich der eingestellte Zeitraum auf das »Angebotsdatum« bezieht.');
		if (this.bookingsForList.length === 1) return this.localize.transform('Statistik für eine Buchung exportieren');
		return this.localize.transform('Statistik für ${bookingsCount} Buchungen exportieren', {bookingsCount: this.bookingsForList.length.toString()});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get amountOfListItems() : number {
		if (this.bookingsService.groupByCourses) return this.groupedBookings!.length;
		return this.bookingsForList.length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public toggleGroupByCourses() : void {
		this.bookingsService.groupByCourses = !this.bookingsService.groupByCourses;
		this.pMoreBtnService.resetValues(this.amountOfListItems);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get moreBtnText() : string {
		const btnTextObj = this.pMoreBtnService.btnTextObj;
		btnTextObj['label'] = this.bookingsService.groupByCourses ? this.localize.transform('Angebote') : this.localize.transform('Buchungen');
		const TEXT = 'Lade ${label} ${index1} – ${index2} von ${index3}';
		return this.localize.transform(TEXT, btnTextObj as LocalizePipeParamsType);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get maxVisibleItems() : PMoreBtnService['visibleItemsAmount'] {
		return this.pMoreBtnService.visibleItemsAmount;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public toggleCollapsedState(
		bookings : ApiListWrapper<SchedulingApiBooking>,
		collapse ?: boolean,
	) : void {
		this.bookingListService.toggleCollapsedState(bookings, collapse);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isCollapsed(bookings : ApiListWrapper<SchedulingApiBooking>) : boolean {
		return this.bookingListService.isCollapsed(bookings);
	}

	/**
	 * Load new Data
	 */
	public loadNewData() : void {
		if (!this.bookingsService.start) throw new Error('Start date must be defined for bookings.');
		if (!this.bookingsService.end) throw new Error('End date must be defined for bookings.');

		let queryParams = new HttpParams()
			.set('data', 'bookings');

		if (this.bookingsService.byShiftTime) {
			queryParams = queryParams
				.set('bookingsByShiftTime', (this.bookingsService.byShiftTime.toString()));
		}

		if (this.bookingsService.showInquiry) {
			queryParams = queryParams
				.set('bookingsShowInquiries', (this.bookingsService.showInquiry.toString()));
		}

		if (!this.searchAll || !this.searchString) {
			queryParams = queryParams
				.set('start', (this.bookingsService.start.toString()))
				.set('end', (this.bookingsService.end.toString()));
		}

		if (this.searchString) {
			queryParams = queryParams
				.set('searchString', (this.searchString));
		}

		this.api.load({
			searchParams: queryParams,
			success: () => {
				this.bookingsService.previousRequest = this.searchString;
				// this.uncollapseFirstGroupIfNonIsUncollapsed();
			},
		});
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	public initValues() : void {
		if (!this.bookingsService.start) this.bookingsService.start = this.initialStart;
		if (!this.bookingsService.end) this.bookingsService.end = this.initialEnd;
	}

	private timeout : number | null = null;

	/**
	 * We don‘t want the api to load on every change immediately.
	 */
	public onSearchKeyUp(event : KeyboardEvent) : void {
		if (event.key !== 'Enter') return;
		window.clearTimeout(this.timeout ?? undefined);
		event.stopPropagation();
		this.runSearch();
	}

	private runSearch() : void {
		if (this.bookingsService.previousRequest === this.searchString) return;
		this.bookingsService.previousRequest = this.searchString;
		this.loadNewData();
	}

	/**
	 * Should all bookings be searched, or only the bookings within the defined time range?
	 */
	public get searchAll() : BookingsService['searchAll'] {
		return this.bookingsService.searchAll;
	}
	public set searchAll(input : BookingsService['searchAll']) {
		this.bookingsService.searchAll = input;
		if (this.searchString) this.loadNewData();
	}

	/**
	 * Start timestamp. Used for the api request and date picker.
	 */
	public get start() : BookingsService['start'] {
		return this.bookingsService.start;
	}
	public set start(input : BookingsService['start']) {
		this.bookingsService.start = input;
		this.loadNewData();
	}

	/**
	 * End timestamp. Used for the api request and date picker.
	 */
	public get end() : BookingsService['end'] {
		return this.bookingsService.end;
	}
	public set end(input : BookingsService['end']) {
		this.bookingsService.end = input;
		this.loadNewData();
	}

	/**
	 * I just have this here in order to be able to make bookingsService private
	 */
	public get showInquiry() : BookingsService['showInquiry'] {
		return this.bookingsService.showInquiry;
	}
	public set showInquiry(input : BookingsService['showInquiry']) {
		this.bookingsService.showInquiry = input;
	}

	/**
	 * Should bookings be grouped by courses in the ui?
	 */
	public get groupByCourses() : BookingsService['groupByCourses'] {
		return this.bookingsService.groupByCourses;
	}

	/**
	 * Defines if the urlParams bookingsStart and bookingsEnd should be applied to
	 * bookings.dateOfBooking or the time of the course(s)
	 */
	public get byShiftTime() : BookingsService['byShiftTime'] {
		return this.bookingsService.byShiftTime;
	}
	public set byShiftTime(input : BookingsService['byShiftTime']) {
		this.bookingsService.byShiftTime = input;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get preparingNewSearchRequest() : SalesSubPage['preparingNewSearchRequest'] {
		// This happens if e.g. previousRequest is an empty string and searchString is `undefined`
		if (!this.bookingsService.previousRequest && !this.searchString) return false;
		return this.bookingsService.previousRequest !== this.searchString;
	}

	/**
	 * The string the gift-cards should be searched for
	 */
	public get searchString() : BookingsService['searchString'] {
		return this.bookingsService.searchString;
	}
	public set searchString(input : BookingsService['searchString']) {
		this.bookingsService.searchString = input;
		window.clearTimeout(this.timeout ?? undefined);
		this.timeout = window.setTimeout(() => {
			this.runSearch();
		}, 700);
	}

	/**
	 * Navigate to detail-page of given booking
	 */
	public navToItem(id : Id) : void {
		this.bookingsService.onEditBooking(id);
	}

	public focusOnSearch : boolean = false;
	public focusOnSearchSettings : boolean = false;
	private searchFocusTimeout : number | null = null;

	/**
	 * Shows additional options in UI when user is about to search something
	 */
	public onFocusSearch() : void {
		window.clearTimeout(this.searchFocusTimeout ?? undefined);
		this.focusOnSearch = true;
		this.focusOnSearchSettings = false;
	}

	/**
	 * Hides additional options in UI
	 */
	public onBlurSearch() : void {
		this.searchFocusTimeout = window.setTimeout(() => {
			this.focusOnSearch = false;
		}, 100);
	}

	/**
	 * Keeps the options from disappearing
	 */
	public onFocusSearchSettings() : void {
		window.clearTimeout(this.searchFocusTimeout ?? undefined);
		this.focusOnSearchSettings = true;
		this.focusOnSearch = false;
	}

	/**
	 * Hides additional options in UI
	 */
	public onBlurSearchSettings() : void {
		this.searchFocusTimeout = window.setTimeout(() => {
			this.focusOnSearchSettings = false;
		}, 100);
	}

	/**
	 * Set focus back to input when user changed option
	 */
	public onSelectSearchSetting() : void {
		this.renderer.selectRootElement('#search-input input').focus();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasFilterSettings() : SalesSubPage['hasFilterSettings'] {
		if (!!this.filterService.hiddenItems['shiftModels'].length) return true;
		if (!this.showInquiry) return true;
		return false;
	}

	/**
	 * Unload all filters related to this component
	 */
	public unloadFilters() : void {
		this.showInquiry = true;
		this.filterService.unloadShiftModels();
		this.filterService.initValues();
		this.loadNewData();
	}

	/**
	 * If ui shows a list of bookings, how should they be sorted?
	 */
	public get sortedBy() : BookingsService['sortedBy'] {
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (!this.bookingsService.sortedBy) {
			// TODO: PLANO-151585 `this.bookingsService.sortedBy === undefined` relict?
			this.console.error('Type of this.bookingsService.sortedBy is wrong');
			return this.byShiftTime ? BookingsSortedByEmum.FIRST_SHIFT_START : BookingsSortedByEmum.DATE_OF_BOOKING;
		}
		return this.bookingsService.sortedBy;
	}

	public set sortedBy(input : BookingsService['sortedBy']) {
		this.bookingsService.sortedBy = input;
		this.getGroupedBookings();
	}

	/**
	 * If ui shows a sorted list of bookings, how should they be sorted asc or dec?
	 */
	public get sortedReverse() : BookingsService['sortedReverse'] {
		return this.bookingsService.sortedReverse;
	}

	public set sortedReverse(input : BookingsService['sortedReverse']) {
		this.bookingsService.sortedReverse = input;
	}

}
