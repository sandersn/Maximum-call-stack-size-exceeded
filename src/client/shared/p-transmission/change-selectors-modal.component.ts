/* eslint-disable max-lines */
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgWizardService, STEP_STATE, STEP_POSITION, STEP_DIRECTIN } from 'ng-wizard'; // cSpell:ignore DIRECTIN
import { NgWizardConfig, THEME, StepChangedArgs, StepValidationArgs, NgWizardStepComponent} from 'ng-wizard';
import { of } from 'rxjs';
import { Observable} from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { OnDestroy, AfterContentChecked } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, HostBinding, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { ViewChild } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiService, SchedulingApiShiftChangeSelector } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiShift } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiShiftModel } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { AffectedShiftsApiService, SchedulingApiShiftRepetitionType } from '@plano/shared/api';
import { MeService } from '@plano/shared/core/me/me.service';
import { ModalContentComponent, ModalContentComponentCloseReason } from '@plano/shared/core/p-modal/modal-content-component.interface';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { TransmissionPreviewComponent } from './transmission-preview/transmission-preview.component';
import { PFaIcon } from '../../../shared/core/component/fa-icon/fa-icon-types';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { AngularDatePipeFormat } from '../../../shared/core/pipe/p-date.pipe';
import { PlanoFaIconPool } from '../../../shared/core/plano-fa-icon-pool.enum';
import { ToastsService } from '../../service/toasts.service';
import { AffectedShiftsApiShifts } from '../api/affected-shifts-api.service';
import { PAlertThemeEnum, PThemeEnum } from '../bootstrap-styles.enum';
import { PFormGroup } from '../p-forms/p-form-control';
import { FormControlSwitchType } from '../p-forms/p-form-control-switch/p-form-control-switch.component';
import { SectionWhitespace } from '../page/section/section.component';

export enum PTypeOfChange {
	EDIT = 'other',
	DELETE = 'remove',
	CANCEL = 'cancel',
}

@Component({
	selector: 'p-change-selectors-modal[shiftChangeSelector]',
	templateUrl: './change-selectors-modal.component.html',
	styleUrls: ['./change-selectors-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ChangeSelectorsModalComponent implements OnInit, OnDestroy, ModalContentComponent, AfterContentChecked {

	/**
	 * A more fine-grained title can be provided here. If not set a more generic sentence will be used.
	 */
	@Input('title') private _title ?: string;

	/**
	 * A function that will be called in the moment the modal closes.
	 * TODO: Check if this should be replaced by a @Output() thingy.
	 */
	@Input() private close : (value : string | ModalContentComponentCloseReason) => void = () => {};

	/**
	 * A function that will be called in the moment the modal is dismissed.
	 * TODO: Check if this should be replaced by a @Output() thingy.
	 */
	@Input() public dismiss : () => void = () => {};

	/**
	 * Needed to generate nice user-badges in the transmission-preview (little calendar with affected shifts).
	 */
	@Input() public members : TransmissionPreviewComponent['members'] = null;

	/**
	 * The shiftModel where the values have changed.
	 * Only needs to be set if this is a change-selector-modal for a shiftModel.
	 */
	@Input() public shiftModel : SchedulingApiShiftModel | null = null;

	/**
	 * The shift where the values have changed.
	 * Only needs to be set if this is a change-selector-modal for a shift.
	 */
	@Input() public shift : SchedulingApiShift | null = null;

	/**
	 * The object containing all params the backend needs to know to transmit values to other shifts.
	 */
	@Input() public shiftChangeSelector ! : SchedulingApiShiftChangeSelector;



	/**
	 * A default start date. If not set, a default will be calculated. E.g. start of shift or 'today'.
	 */
	@Input() private defaultStart ?: number;

	/**
	 * HACK: This indicates if the modal was triggered by one of the course section in shift-forms.
	 * The fields where this is true are (state 13. July 2020)
	 * isCourseOnline
	 * minCourseParticipantCount
	 * maxCourseParticipantCount
	 */
	@Input() public modalForCourseRelatedValues : boolean = false;

	@Input() public typeOfChange : PTypeOfChange = PTypeOfChange.EDIT;

	/**
	 * @deprecated please use typeOfChange
	 */
	@Input('isForDeletion') private set _isForDeletion(input : boolean) {
		if (!!input) this.typeOfChange = PTypeOfChange.DELETE;
	}

	@Input() public minDate : number | null = null;
	@Input('minEndDate') private _minEndDate : number | null = null;
	@Input() public customWarning : string | null = null;

	@Input('showApplyToShiftModelCheckbox') public _showApplyToShiftModelCheckbox : boolean | null = null;

	/**
	 * The Option »Apply to Shift Model« does not always make sense.
	 * Here is the getter to decide if it should be visible.
	 */
	public get showApplyToShiftModelCheckbox() : boolean {
		if (!this.shift) return false;
		if (!this.addChangeSelectors) return false;
		if (this._showApplyToShiftModelCheckbox !== null) return this._showApplyToShiftModelCheckbox;
		return !this.isForDeletion;
	}

	// @Input() public initValuesOnInit : boolean = false;

	@HostBinding('class.modal-content') private _alwaysTrue = true;

	@ViewChild('ngContent', { static: true }) public ngContent ! : ElementRef<HTMLDivElement>;

	constructor(
		public affectedShiftsApiService : AffectedShiftsApiService,
		private schedulingService : SchedulingService,
		public api : SchedulingApiService,
		private pMoment : PMomentService,
		private localize : LocalizePipe,
		private pFormsService : PFormsService,
		public meService : MeService,
		private changeDetectorRef : ChangeDetectorRef,
		private ngWizardService : NgWizardService,
		private zone : NgZone,
		private toastsService : ToastsService,
	) {
		this.today = +this.pMoment.m().startOf('day');
	}

	public PThemeEnum = PThemeEnum;
	public SectionWhitespace = SectionWhitespace;
	public PlanoFaIconPool = PlanoFaIconPool;
	public AngularDatePipeFormat = AngularDatePipeFormat;
	public FormControlSwitchType = FormControlSwitchType;
	public PTypeOfChange = PTypeOfChange;
	public PAlertThemeEnum = PAlertThemeEnum;
	public STEP_STATE = STEP_STATE;

	public componentInitialized : boolean = false;

	public today ! : number;
	public addChangeSelectors : boolean = false;

	public transmissionPreviewIsLoading : boolean = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get minEndDate() : number | null {
		if (this._minEndDate !== null) return this._minEndDate;
		return this.changeSelectorStart;
	}

	public affectedShifts : AffectedShiftsApiShifts = new AffectedShiftsApiShifts(null, false);
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getAffectedShifts() : void {
		if (this.transmissionPreviewIsLoading) return;
		this.transmissionPreviewIsLoading = true;

		const start = +this.pMoment.m(this.transmissionPreviewTimestamp).startOf('month');
		const end = +this.pMoment.m(start).add(1, 'month');
		const shiftChangeSelectorForParams = this.showTransmissionPreview ? this.shiftChangeSelector : null;

		let queryParams = new HttpParams()
			.set('action', this.typeOfChange)
			.set('start', start.toString())
			.set('end', end.toString());

		if (shiftChangeSelectorForParams !== null)
			queryParams = queryParams.set('shiftChangeSelector',  encodeURIComponent(JSON.stringify(shiftChangeSelectorForParams.rawData)));

		if (this.shift) {
			const id = this.shift.id.toString();
			queryParams = queryParams.set('currentShiftId', id);
		}

		this.affectedShiftsApiService.load({
			searchParams: queryParams,
			success: () => {
				this.affectedShifts = this.affectedShiftsApiService.data.shifts.filterBy((item) => {
					const startIsInMonth = item.start >= start && item.start < end;
					if (startIsInMonth) return true;
					const endIsInMonth = item.end > start && item.end <= end;
					if (endIsInMonth) return true;
					return false;
				});
				this.transmissionPreviewIsLoading = false;
			},
		});
	}

	public transmissionPreviewTimestamp : number | null = null;

	private validateValues() : void {
		if (!!this.shift && this.members === null) {
			throw new Error('members is required when using ChangeSelectorsModalComponent for a shift');
		}

	}

	public ngOnInit() : void {
		// if (!this.initValuesOnInit) return;
		this.initComponent();
		// FIXME: PLANO-35789
		// TODO: Refactor this component so that submit gets obsolete. If you have this, you can remove a bunch of
		//       getAffectedShifts() calls and replace them by the following:
		// this.schedulingApiService?.onChange?.subscribe(() => {
		// 	this.getAffectedShifts();
		// });
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent() : void {
		this.validateValues();

		this.resetChangeSelectors();
		this.initValues();
		this.initFormGroup();

		// It is not necessary to get affected shifts when user applies settings from changes on shiftModel
		if (!!this.shift) this.getAffectedShifts();

		this.componentInitialized = true;
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		if (this.shift) {
			this.transmissionPreviewTimestamp = this.shift.start;
			if (this.alwaysGetsAppliedToPacket) this.setOptionShiftsOfPacket(true);
		} else {
			this.transmissionPreviewTimestamp = this.today;
		}
	}

	public formGroup : PFormGroup | null = null;

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const newFormGroup = this.pFormsService.group({});

		if (this.shift) {
			this.pFormsService.addControl(newFormGroup, 'changeSelectorEnd',
				{
					value: undefined,
					disabled: false,
				},
			);
		}
		this.formGroup = newFormGroup;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showCaptureRequest() : boolean {
		return this.applyToSomeOtherShifts;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get applyToSomeOtherShifts() : boolean {
		if (this.optionShiftsOfPacket) return true;
		if (this.optionShiftsOfSeries) return true;
		if (this.optionShiftsOfModel) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showApplyToShiftsOfSeriesCheckbox() : boolean {
		assumeNonNull(this.shift);
		if (this.shift.repetition.rawData === undefined) throw new Error('No shift.repetition. Forgot shift.loadDetailed()?');

		return this.shift.repetition.type !== SchedulingApiShiftRepetitionType.NONE;
	}

	/**
	 * Set if changes should be transferred to other shifts or not.
	 */
	public setAddChangeSelectors(input : boolean, success ?: () => void) : void {
		if (!this.shift) this.initChangeSelectorStart(input);

		if (!input) {
			this.resetChangeSelectors();
			this.shiftChangeSelector.shiftModelId = null;
			return;
		}

		const runMeWhenAllNecessaryDataIsAvailable : () => void = () => {
			this.addChangeSelectors = true;
			this.changeDetectorRef.detectChanges();
			if (success) success();
		};

		if (!this.shift || this.shift.repetition.rawData !== undefined) {
			runMeWhenAllNecessaryDataIsAvailable();
			return;
		}

		this.shift.loadDetailed({
			searchParams: this.schedulingService.queryParams,
			success: () => {
				runMeWhenAllNecessaryDataIsAvailable();
			},
		});
	}


	/**
	 * (Re)set all changeSelectors.
	 * More info: PLANO-1400
	 */
	private resetChangeSelectors() : void {
		this.addChangeSelectors = false;
		if (!!this.shift) {
			// NOTE: 	It is important to do this before setting 'changeSelectorEnd' to undefined.
			// 				Otherwise the validator of 'changeSelectorEnd' would return error,
			// 				because of calculations based on outdated data.
			this.optionShiftsOfPacket = this.alwaysGetsAppliedToPacket;
		} else {
			this.shiftModel!.changeSelector.start = null;
		}

		this.shiftChangeSelector.start = null;
		if (this.formGroup?.get('changeSelectorEnd')) {
			this.formGroup.get('changeSelectorEnd')!.setValue(undefined);
			this.changeDetectorRef.markForCheck();
		}
	}

	public ngOnDestroy() : void {
		// this.resetChangeSelectors();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selectedChangeSelectorStartIsCurrentDate() : boolean {
		return this.pMoment.m(this.changeSelectorStart).isSame(this.today, 'day');
	}

	/**
	 * Use this instead of shiftChangeSelector.start
	 * It represents the same, but makes sure the 'start of day' will be set and it will update the preview of affected
	 * shifts.
	 *
	 * @deprecated
	 * TODO: 	Refactor this component so that submit gets obsolete.
	 * 				See ngOnInit()
	*/
	private _changeSelectorStart : number | null = null;

	/**
	 * @deprecated
	 * TODO: 	Refactor this component so that submit gets obsolete.
	 * 				See ngOnInit()
	*/
	public get changeSelectorStart() : number | null {
		return this._changeSelectorStart;
	}

	/**
	 * @deprecated
	 * TODO: 	Refactor this component so that submit gets obsolete.
	 * 				See ngOnInit()
	*/
	public set changeSelectorStart(input : number | null) {
		const PROCESSED_INPUT = input ? +this.pMoment.m(input).startOf('day') : input;

		this._changeSelectorStart = PROCESSED_INPUT;
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (this.shiftChangeSelector) this.shiftChangeSelector.start = PROCESSED_INPUT ?? 0;
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		if (this.shiftModel!.changeSelector.start) this.shiftChangeSelector.start = PROCESSED_INPUT ? PROCESSED_INPUT : 0;
		if (this.shift) this.getAffectedShifts();
	}

	/**
	 * Check if defaultStartDate would be possible
	 */
	private defaultStartIsValid(defaultStart : number | undefined) : defaultStart is number {
		// If no defaultStartDate is available then it can only be valid.
		if (!defaultStart) return true;

		// If minDate is defined and startDate is before minDate, then it is invalid.
		if (this.minDate && defaultStart < this.minDate) return false;

		if (this.shiftChangeSelector.end) {
			const oneDayAsMilliseconds = 1000 * 60 * 60 * 24;
			return (this.shiftChangeSelector.end - oneDayAsMilliseconds) > defaultStart;
		}

		return true;
	}

	/**
	 * Initialize start date for datepicker
	 */
	private initChangeSelectorStart(input : boolean) : void {
		if (input === false) {
			this.changeSelectorStart = null;
			return;
		}

		if (!this.shift) {
			this.changeSelectorStart = this.today;
		} else if (this.defaultStartIsValid(this.defaultStart)) {
			this.changeSelectorStart = this.defaultStart;
		} else if (this.shiftChangeSelector.end) {
			const oneDayAsMilliseconds = 1000 * 60 * 60 * 24;
			this.changeSelectorStart = this.shiftChangeSelector.end - oneDayAsMilliseconds;
		} else {
			// If there is no other solution then set today as default, because its always better do have a default then
			// to change all the items in the past 💣
			this.changeSelectorStart = this.today;
		}
	}

	/**
	 * Returns true if changeSelector-flags are set to "apply to shifts of this shiftModel"
	 */
	public get optionToShiftModel() : boolean {
		return this.shiftChangeSelector.shiftModelId !== null;
	}
	public set optionToShiftModel(input : boolean) {
		if (input) {
			this.shiftChangeSelector.shiftModelId = this.shiftModel!.id;
		} else {
			this.shiftChangeSelector.shiftModelId = null;
		}
	}

	/**
	 * Set shiftModelId in changeSelector flags
	 * shiftModelId is required for all other changeSelector flags
	 */
	public toggleOptionToShiftModel() : void {
		this.optionToShiftModel = this.shiftChangeSelector.shiftModelId === null;
		if (this.shift) this.getAffectedShifts();
	}

	/**
	 * Returns true if changeSelector-flags are set to "apply to shifts of this shiftModel"
	 */
	public get optionShiftsOfModel() : boolean {
		return this.shiftChangeSelector.shiftsOfShiftModelId !== null &&
			this.shiftChangeSelector.shiftsOfShiftModelVersion === null &&
			this.shiftChangeSelector.shiftsOfSeriesId === null &&
			this.shiftChangeSelector.shiftsOfPacketIndex === null;
	}

	public set optionShiftsOfModel(input : boolean) {
		if (input) {
			this.shiftChangeSelector.shiftsOfShiftModelId = this.shiftModel!.id;
			this.shiftChangeSelector.shiftsOfShiftModelVersion = null;
			this.shiftChangeSelector.shiftsOfSeriesId = null;
			this.shiftChangeSelector.shiftsOfPacketIndex = null;
		} else {
			this.setOptionShiftsOfPacket(this.alwaysGetsAppliedToPacket);
		}
	}

	/**
	 * Set necessary flags to apply changes to shifts of this model at save
	 */
	public setOptionShiftsOfModel(input : boolean) : void {
		this.optionShiftsOfModel = input;
		if (this.shift) {
			if (!this.changeSelectorStart) this.initChangeSelectorStart(this.applyToSomeOtherShifts);
			this.getAffectedShifts();
		}
	}

	/**
	 * Returns true if changeSelector-flags are set to "apply to shifts of this series"
	 */
	public get optionShiftsOfSeries() : boolean {
		const hasBeenSelected = (
			this.shiftChangeSelector.shiftsOfShiftModelId !== null &&
			this.shiftChangeSelector.shiftsOfShiftModelVersion !== null &&
			this.shiftChangeSelector.shiftsOfSeriesId !== null &&
			this.shiftChangeSelector.shiftsOfPacketIndex === null
		);
		return this.optionShiftsOfModel || hasBeenSelected;
	}

	public set optionShiftsOfSeries(input : boolean) {
		if (input) {
			assumeNonNull(this.shift);
			this.shiftChangeSelector.shiftsOfShiftModelId = this.shiftModel!.id;
			this.shiftChangeSelector.shiftsOfShiftModelVersion = this.shift.id.shiftModelVersion;
			this.shiftChangeSelector.shiftsOfSeriesId = this.shift.id.seriesId;
			this.shiftChangeSelector.shiftsOfPacketIndex = null;
		} else {
			this.setOptionShiftsOfPacket(this.alwaysGetsAppliedToPacket);
		}
	}

	/**
	 * Set necessary flags to apply changes to shifts of this series at save
	 */
	public setOptionShiftsOfSeries(input : boolean) : void {
		this.optionShiftsOfSeries = input;
		if (this.shift) {
			if (!this.changeSelectorStart) this.initChangeSelectorStart(this.applyToSomeOtherShifts);
			this.getAffectedShifts();
		}
	}

	/**
	 * Returns true if changeSelector-flags are set to "apply to shifts of this packet"
	 */
	public get optionShiftsOfPacket() : boolean | null {
		const hasBeenSelected = (
			this.shiftChangeSelector.shiftsOfShiftModelId !== null &&
			this.shiftChangeSelector.shiftsOfShiftModelVersion !== null &&
			this.shiftChangeSelector.shiftsOfSeriesId !== null &&
			this.shiftChangeSelector.shiftsOfPacketIndex !== null
		);
		return this.optionShiftsOfSeries || hasBeenSelected;
	}

	public set optionShiftsOfPacket(input : boolean | null) {
		if (input) {
			assumeNonNull(this.shift);
			this.shiftChangeSelector.shiftsOfShiftModelId = this.shiftModel!.id;
			this.shiftChangeSelector.shiftsOfShiftModelVersion = this.shift.id.shiftModelVersion;
			this.shiftChangeSelector.shiftsOfSeriesId = this.shift.id.seriesId;
			this.shiftChangeSelector.shiftsOfPacketIndex = this.shift.id.packetIndex;
		} else {
			this.shiftChangeSelector.shiftsOfShiftModelId = null;
			this.shiftChangeSelector.shiftsOfShiftModelVersion = null;
			this.shiftChangeSelector.shiftsOfSeriesId = null;
			this.shiftChangeSelector.shiftsOfPacketIndex = null;
		}
	}

	/**
	 * Set necessary flags to apply changes to shifts of this packet at save
	 */
	public setOptionShiftsOfPacket(input : boolean | null) : void {
		this.optionShiftsOfPacket = input;
		if (this.shift) {
			if (!this.changeSelectorStart) this.initChangeSelectorStart(this.applyToSomeOtherShifts);
			this.getAffectedShifts();
		}
	}

	/**
	 * Submit the form
	 * TODO: 	Refactor this component so that submit gets obsolete.
	 * 				See ngOnInit()
	 */
	public submit() : void {
		const START = !!this.shift ? this.shiftChangeSelector.start : this.shiftModel!.changeSelector.start;
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		const END = this.shiftChangeSelector.end ? this.shiftChangeSelector.end : 0;

		if (!this.shift) {
			if (this.addChangeSelectors) {
				this.shiftModel!.changeSelector.start = START;
			} else {
				this.shiftModel!.changeSelector.start = null;
			}
		} else {
			this.shiftChangeSelector.start = START;
			this.shiftChangeSelector.end = END;
		}

		if (this.api.data.automaticBookingCancellationSettings.automaticOnlineRefund) {
			this.toastsService.addToast({
				title: this.localize.transform('Check deine Emails'),
				content: this.localize.transform('Wir haben dir geschrieben, bei welchen Buchungen eine Online-Rückerstattung veranlasst wurde.'),
				theme: PThemeEnum.INFO,
				icon: PlanoFaIconPool.EMAIL_NOTIFICATION,
			});
		}
		this.close('Close click');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasNgContent() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.ngContent.nativeElement, 'this.ngContent.nativeElement');
		return this.ngContent.nativeElement.children.length > 0;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showDateRangeSelection() : boolean {
		if (!this.shift) return false;

		if (this.shift.packetShifts.length > 0) return true;
		if (this.showApplyToShiftsOfSeriesCheckbox) return true;
		if (this.shiftChangeSelector.shiftsOfShiftModelId !== null) return true;

		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get translatedAddChangeSelectorsRadioValue() : string {
		const thisThing = this.localize.transform(!this.shift ? 'diese Vorlage' : (this.alwaysGetsAppliedToPacket ? 'dieses Schicht-Paket' : 'diese Schicht'));
		return this.localize.transform('Nein, nur auf ${thisThing}', {
			thisThing: thisThing,
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get title() : string {
		if (this._title) return this._title;
		return this.localize.transform('Änderung auf andere Bereiche übertragen?');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClickNowBtn() : void {
		this.changeSelectorStart = this.today;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get submitBtnIsDisabled() : boolean {

		if (this.formGroup?.invalid) return true;

		if (!this.shift) return false;

		if (!this.showCaptureRequest) return false;

		// If the user wants to apply this change to any other shifts or shiftModels, the user must confirm with capture.
		if (this.captureInput?.toLowerCase() !== this.captureRequest.toLowerCase()) return true;

		if (this.changeSelectorStart) return false;
		if (this.shiftChangeSelector.shiftModelId !== null) return false;
		if (this.optionShiftsOfPacket) return false;
		if (this.optionShiftsOfSeries) return false;
		if (this.optionShiftsOfModel) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get changeSelectorEndPlaceholder() : string | null {
		return this.shiftChangeSelector.end === 0 ? this.localize.transform('Unbegrenzt') : null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get changeSelectorStartPlaceholder() : string | null {
		return this.shiftChangeSelector.start === 0 ? this.localize.transform('Unbegrenzt') : null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public transmissionPreviewTimestampChanged(input : number) : void {
		this.transmissionPreviewTimestamp = input;
		this.getAffectedShifts();
	}

	/**
	 * If there are packetShifts, the course related value changes will always be applied to the
	 * whole packet. The checkbox should be visible, checked and disabled.
	 * More details: PLANO-5297
	 */
	private get alwaysGetsAppliedToPacket() : boolean | null {
		assumeNonNull(this.shift);
		if (!this.shift.packetShifts.length) return false;
		if (this.typeOfChange === PTypeOfChange.CANCEL) return true;
		if (this.modalForCourseRelatedValues) return true;
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showApplyToShiftPacketCheckbox() : boolean {
		if (this.alwaysGetsAppliedToPacket) return true;
		return !!this.shift && !!this.shift.packetShifts.length;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get applyToShiftPacketCheckboxIsDisabled() : boolean {
		if (this.alwaysGetsAppliedToPacket) return true;

		if (
			this.shiftChangeSelector.shiftsOfPacketIndex === null &&
			this.shiftChangeSelector.shiftsOfSeriesId !== null &&
			this.shiftChangeSelector.shiftsOfShiftModelId !== null
		) {
			return true;
		}
		if (
			this.shiftChangeSelector.shiftsOfPacketIndex === null &&
			this.shiftChangeSelector.shiftsOfSeriesId === null &&
			this.shiftChangeSelector.shiftsOfShiftModelId !== null
		) {
			return true;
		}
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showTransmissionPreview() : boolean {
		if (!this.shift) return false;
		if (!this.applyToSomeOtherShifts) return false;
		if (this.shiftChangeSelector.end === null) return false;
		return true;
	}

	private modalRef : NgbModalRef | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public initModalContentComponent(
		modalRef : ChangeSelectorsModalComponent['modalRef'],
		title : ChangeSelectorsModalComponent['title'],
		members : ChangeSelectorsModalComponent['members'],
		shiftModel : ChangeSelectorsModalComponent['shiftModel'],
		shift : ChangeSelectorsModalComponent['shift'],
		shiftChangeSelector : ChangeSelectorsModalComponent['shiftChangeSelector'],
	) : void {
		this.modalRef = modalRef;
		this._title = title;
		this.members = members;
		this.shiftModel = shiftModel;
		this.shift = shift;
		this.shiftChangeSelector = shiftChangeSelector;
		this.initComponent();
	}

	/**
	 * Dismiss the current modal
	 */
	public dismissModal() : void {
		this.dismiss();
		if (this.modalRef) this.modalRef.dismiss();
	}

	/**
	 * Close the current modal
	 */
	public closeModal(reason : ModalContentComponentCloseReason) : void {
		this.close(reason);
		if (this.modalRef) this.modalRef.close(reason);
	}

	public config : NgWizardConfig = {
		selected: 0,
		toolbarSettings: {
			// toolbarExtraButtons: [
			// 	{ text: 'Finish', class: 'btn btn-info', event: () => { alert('Finished!!!'); } },
			// ],
			showNextButton: false,
			showPreviousButton: false,
		},
		anchorSettings: {
			anchorClickable: true,
		},
	};

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showPreviousStep(_event ?: Event) : void {
		this.ngWizardService.previous();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showNextStep(_event ?: Event) : void {
		this.ngWizardService.next();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public resetWizard(_event ?: Event) : void {
		this.ngWizardService.reset();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setTheme(theme : THEME) : void {
		this.ngWizardService.theme(theme);
	}

	public STEP_POSITION = STEP_POSITION;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public stepChanged(args : StepChangedArgs) : void {
		this.currentStepChange = args;

		this.zone.runOutsideAngular(() => {
			requestAnimationFrame(() => {

				// TODO: There must be a safer way to do this.
				const stepElement = (args.step as NgWizardStepComponent).stepContent.viewContainerRef.element.nativeElement;
				const scrollTarget = stepElement.parentNode?.parentNode?.parentNode?.parentNode?.parentNode;

				if (!scrollTarget) return;
				const el = scrollTarget;
				if (el) el.scrollIntoView();
			});
		});

	}

	public isValidTypeBoolean : boolean = true;
	public currentStepChange : StepChangedArgs | undefined;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isValidFunctionReturnsBoolean(_args : StepValidationArgs) : boolean {
		if (_args.direction === STEP_DIRECTIN.backward) return true;
		return !this.formGroup!.invalid;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isValidFunctionReturnsObservable(_args : StepValidationArgs) : Observable<boolean> {
		return of(true);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showCancellationSettings() : boolean {
		if (this.typeOfChange === PTypeOfChange.EDIT) return false;
		if (this.shift?.isCourse) return true;
		if (this.shiftModel?.isCourse) return true;
		return this.api.data.automaticBookingCancellationSettings.attributeInfoThis.show;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get captureRequest() : string {
		switch (this.typeOfChange) {
			case PTypeOfChange.EDIT:
				return this.localize.transform('Bearbeiten');
			case PTypeOfChange.CANCEL:
				return this.localize.transform('Stornieren');
			case PTypeOfChange.DELETE:
				return this.localize.transform('Löschen');
			default:
				throw new Error('Unexpected value for typeOfChange');
		}
	}

	public captureInput : string | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isForDeletion() : boolean {
		return this.typeOfChange === PTypeOfChange.DELETE;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get typeRelatedIcon() : PFaIcon {
		switch (this.typeOfChange) {
			case PTypeOfChange.EDIT:
				return PlanoFaIconPool.EDIT;
			case PTypeOfChange.CANCEL:
				return PlanoFaIconPool.CANCELED;
			case PTypeOfChange.DELETE:
				return PlanoFaIconPool.DELETE;
			default:
				throw new Error('Unexpected value for typeOfChange');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get typeRelatedIconTheme() : PThemeEnum.DANGER | PThemeEnum.SUCCESS {
		switch (this.typeOfChange) {
			case PTypeOfChange.EDIT:
				return PThemeEnum.SUCCESS;
			case PTypeOfChange.CANCEL:
				return PThemeEnum.DANGER;
			case PTypeOfChange.DELETE:
				return PThemeEnum.DANGER;
			default:
				throw new Error('Unexpected value for typeOfChange');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get amountOfBookingsToCancelOrDecline() : number {
		return +this.affectedShiftsApiService.data.bookingsCanceledCount + +this.affectedShiftsApiService.data.bookingsDeclinedCount;
	}

	public ngAfterContentChecked() : void {
		if (!this.currentStepChange) return;
		if (this.formGroup!.invalid) {
			this.currentStepChange.step.state = STEP_STATE.error;
		} else {
			this.currentStepChange.step.state = STEP_STATE.normal;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get someOptionIsSelected() : boolean {
		if (!this.shift) return !!this.changeSelectorStart;
		return !!this.optionToShiftModel || !!this.optionShiftsOfModel || !!this.optionShiftsOfPacket || !!this.optionShiftsOfSeries;
	}

	@Input() private showSendMailCheckbox : boolean = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showNotificationCheckbox() : boolean {
		if (this.showSendMailCheckbox) return true;
		if (!this.shift) return false;
		if (this.typeOfChange === PTypeOfChange.DELETE) return true;
		if (this.typeOfChange === PTypeOfChange.CANCEL) return true;
		return false;
	}
}
