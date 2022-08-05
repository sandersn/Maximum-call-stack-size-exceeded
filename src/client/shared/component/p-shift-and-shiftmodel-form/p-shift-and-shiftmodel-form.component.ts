/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1894] */

/**	NOTE: Do not make this service more complex than it already is */
/* eslint complexity: ["error", 12]  */
import { PercentPipe } from '@angular/common';
import { OnInit, AfterContentInit, TemplateRef } from '@angular/core';
import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { BookingSystemRights } from '@plano/client/accesscontrol/rights-enums';
import { EventTypesService } from '@plano/client/plugin/p-custom-course-emails/event-types.service';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import {
	PShiftBookingsComponent,
} from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-bookings/p-shift-bookings.component';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { ShiftModalSizes } from '@plano/client/shift/shift-modal-sizes';
import { SchedulingApiService, SchedulingApiShiftModel, SchedulingApiShift, SchedulingApiPaymentMethodType } from '@plano/shared/api';
import { SchedulingApiShiftRepetitionType, SchedulingApiCourseType, SchedulingApiWorkingTimeCreationMethod, SchedulingApiBookingDesiredDateSetting, SchedulingApiPosSystem } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiCustomBookableMailEventType, SchedulingApiShiftModelCoursePaymentMethod} from '@plano/shared/api';
import { SchedulingApiShiftModelCourseTariff } from '@plano/shared/api';
import { SchedulingApiBooking } from '@plano/shared/api';
import { PApiPrimitiveTypes, PSupportedCurrencyCodes } from '@plano/shared/api/base/generated-types.ag';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { SHIFT_MODEL_COLOR_SHADES } from './available-color-shades';
import { IntervalEndDateModes, PShiftAndShiftmodelFormService } from './p-shift-and-shiftmodel-form.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';
import { PCurrencyPipe } from '../../../../shared/core/pipe/p-currency.pipe';
import { AngularDatePipeFormat } from '../../../../shared/core/pipe/p-date.pipe';
import { PBookingFormService } from '../../../booking/booking-form.service';
import { BootstrapSize, PAlertThemeEnum, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormGroup } from '../../p-forms/p-form-control';
import { FormControlSwitchType } from '../../p-forms/p-form-control-switch/p-form-control-switch.component';
import { PShiftmodelTariffService } from '../../p-forms/p-shiftmodel-tariff.service';
import { PShiftService } from '../../p-shift-module/p-shift.service';
import { PTabSizeEnum } from '../../p-tabs/p-tabs/p-tab/p-tab.component';
import { PTypeOfChange } from '../../p-transmission/change-selectors-modal.component';
import { SectionWhitespace } from '../../page/section/section.component';
import { PDurationPipe } from '../../pipe/p-duration.pipe';

export enum ShiftAndShiftModelFormTabs {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	basissettings = 'basissettings',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	bookingsettings = 'bookingsettings',
}

type RepetitionOptionsType = {
	title : 'Tage' | 'Wochen' | 'Monate' | 'Jahre',
	enum : SchedulingApiShiftRepetitionType,
}[];

@Component({
	selector: 'p-shift-and-shiftmodel-form',
	templateUrl: './p-shift-and-shiftmodel-form.component.html',
	styleUrls: ['./p-shift-and-shiftmodel-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class PShiftAndShiftmodelFormComponent implements OnInit, AfterContentInit {
	public readonly Config = Config;
	@Input() public shiftModel : SchedulingApiShiftModel | null = null;
	@Input() public shift : SchedulingApiShift | null = null;
	@Output() public add : EventEmitter<undefined> = new EventEmitter();

	@ViewChild('modalContentForIsCoronaSlotBooking', { static: true }) public modalContentForIsCoronaSlotBooking ! : ElementRef<HTMLElement>;

	public courseTypes : typeof SchedulingApiCourseType = SchedulingApiCourseType;
	public bookingDesiredDateSettings : typeof SchedulingApiBookingDesiredDateSetting =
		SchedulingApiBookingDesiredDateSetting;

	public formGroup : PFormGroup | null = null;
	public typeAheadShiftModelParentContent : string[] = [];
	public typeAheadCourseGroupContent : string[] = [];
	public costCentreTypeAheadArray : string[] = [];
	public articleGroupTypeAheadArray : string[] = [];
	public posAccountTypeAheadArray : string[] = [];
	public now ! : number;

	public shiftModelColorShades : typeof SHIFT_MODEL_COLOR_SHADES = SHIFT_MODEL_COLOR_SHADES;
	public shiftModelColorShadeKeys = Object.keys(SHIFT_MODEL_COLOR_SHADES) as (keyof typeof SHIFT_MODEL_COLOR_SHADES)[];

	public intervalEndDateModes : typeof IntervalEndDateModes = IntervalEndDateModes;
	public repetitionOptions : RepetitionOptionsType = [
		{ title: 'Tage', enum: SchedulingApiShiftRepetitionType.EVERY_X_DAYS },
		{ title: 'Wochen', enum: SchedulingApiShiftRepetitionType.EVERY_X_WEEKS },
		{ title: 'Monate', enum: SchedulingApiShiftRepetitionType.EVERY_X_MONTHS },
		{ title: 'Jahre', enum: SchedulingApiShiftRepetitionType.EVERY_X_YEARS },
	];

	constructor(
		public api : SchedulingApiService,
		public modalService : ModalService,
		public eventTypes : EventTypesService,
		private router : Router,
		public service : PShiftAndShiftmodelFormService,
		private pWishesService : PWishesService,
		private rightsService : RightsService,
		public pShiftModelTariffService : PShiftmodelTariffService,
		private pShiftService : PShiftService,
		private localize : LocalizePipe,
		private percentPipe : PercentPipe,
		private pMoment : PMomentService,
		private pDuration : PDurationPipe,
		private bookingsService : BookingsService,
		private toastsService : ToastsService,
		private console : LogService,
		public pFormsService : PFormsService,
		private pCurrencyPipe : PCurrencyPipe,
		private pBookingFormService : PBookingFormService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public FormControlSwitchType = FormControlSwitchType;
	public PAlertThemeEnum = PAlertThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;
	public PTabSizeEnum = PTabSizeEnum;
	public SectionWhitespace = SectionWhitespace;
	public PTypeOfChange = PTypeOfChange;
	public SchedulingApiPaymentMethodType = SchedulingApiPaymentMethodType;

	/**
	 * Should the bookingsettings be visible or not?
	 */
	public get showBookingsettingsTab() : boolean {
		// TODO: This should be replaced by rightsService.can()
		if (!this.userCanReadShiftModel) return false;
		// const MODEL = this.formItem instanceof SchedulingApiShift ? this.formItem.model : this.formItem;
		// if (!this.rightsService.can(ShiftsAndShiftModelsRights.readBookingSettings, MODEL)) return false;

		if (!this.formGroup) return false;

		// Currently the bookings-tab on mobile only shows the related bookings.
		// if there are no related bookings, no tab needed
		if (Config.IS_MOBILE && !this.showRelatedBookings) return false;

		if (this.formGroup.get('isCourse')!.value) return true;
		if (this.service.modeIsEditShiftModel) return true;
		if (this.service.modeIsCreateShiftModel) return true;

		return false;
	}

	/**
	 * Should the accounting be visible or not?
	 */
	public get showAccountingTab() : boolean {
		if (!this.isOwner) return false;
		if (!this.showBookingsettingsTab) return false;

		if (this.service.modeIsEditShiftModel || this.service.modeIsCreateShiftModel) return true;

		return false;
	}

	public ngOnInit() : void {
		// NOTE: Create-shift-Modal gets initialized without shift and shiftModel
		// Create-shiftModel-Modal gets initialized with a new and empty shiftModal item

		this.service.modeIsEditShift = (!!this.shift && !this.shift.isNewItem());
		this.service.modeIsEditShiftModel = (!!this.shiftModel && !this.shiftModel.isNewItem());
		this.service.modeIsCreateShift = (!!this.shift && this.shift.isNewItem());
		this.service.modeIsCreateShiftModel = (!!this.shiftModel && this.shiftModel.isNewItem());

		if (this.shift && !this.shiftModel) {
			this.shiftModel = this.shift.model;
		}

		this.now = +this.pMoment.m();
		this.service.now = this.now;
	}

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(success ?: () => void) : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
		if (this.formItem.isNewItem()) {
			this.initValues();
			this.initFormGroup();
			if (success) { success(); }
		} else {
			// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
			if (this.formItem.id === null) throw new Error('Can not load details if formItem has no defined id');

			this.formItem.loadDetailed({
				success: () : void => {
					if (this.formItem instanceof SchedulingApiShift && !this.shiftModel) {
						this.shiftModel = this.formItem.model;
					}
					this.initValues();
					this.initFormGroup();
					if (success) success();
				},
			});
		}
	}

	private initTypeAheadArrays() : void {
		this.typeAheadShiftModelParentContent = this.api.data.shiftModels.parentNames;
		this.typeAheadCourseGroupContent = this.api.data.shiftModels.courseGroups;

		const addTypeAheadValue = (value : string | null, array : string[]) : void => {
			if (value && !array.includes(value))
				array.push(value);
		};

		for (const shiftModel of this.api.data.shiftModels.iterable()) {
			addTypeAheadValue(shiftModel.costCentre, this.costCentreTypeAheadArray);
			addTypeAheadValue(shiftModel.articleGroup, this.articleGroupTypeAheadArray);

			for (const posAccount of shiftModel.posAccounts.iterable())
				addTypeAheadValue(posAccount.name, this.posAccountTypeAheadArray);
		}
	}

	private initShiftModelValues() : void {
		if (!this.shiftModel) throw new Error('This method should never be called when shiftModel is null');
		if (this.shiftModel.courseType === null) {
			this.shiftModel.courseType = SchedulingApiCourseType.ONLINE_BOOKABLE;
		}

		if (!this.shiftModel.posAccounts.length) {
			for (const possibleTax of this.api.data.possibleTaxes.iterable()) {
				const newPosAccount = this.shiftModel.posAccounts.createNewItem();
				newPosAccount.tax = possibleTax;
				newPosAccount.name = this.localize.transform('Buchungen ${taxPercent}', {
					taxPercent: this.percentPipe.transform(possibleTax / 100, '0.0-1') ?? '…',
				});
			}
		}
	}

	private initFormItemValues() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		if (this.formItem.attributeInfoWorkingTimeCreationMethod.value === null) {
			if (this.shiftModel.attributeInfoWorkingTimeCreationMethod.value === null) {
				this.formItem.workingTimeCreationMethod = SchedulingApiWorkingTimeCreationMethod.AUTOMATIC;
			} else {
				this.formItem.workingTimeCreationMethod = this.shiftModel.workingTimeCreationMethod;
			}
		}

		if (this.formItem.attributeInfoMinCourseParticipantCount.value === null) {
			if (this.shiftModel.minCourseParticipantCount) {
				this.formItem.minCourseParticipantCount = this.shiftModel.minCourseParticipantCount;
			} else {
				this.formItem.minCourseParticipantCount = 1;
			}
		}
		if (this.formItem.maxCourseParticipantCount === null) {
			this.formItem.maxCourseParticipantCount = this.shiftModel.maxCourseParticipantCount;
		}

		if (this.formItem.isNewItem() && this.formItem instanceof SchedulingApiShiftModel) {
			if (this.formItem.repetition.attributeInfoType.value === null) {
				this.formItem.repetition.type = SchedulingApiShiftRepetitionType.NONE;
			}
			if (this.formItem.repetition.packetRepetition.attributeInfoType.value === null) {
				this.formItem.repetition.packetRepetition.type = SchedulingApiShiftRepetitionType.NONE;
			}
		}
	}

	private initWishesServiceValue() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
		if (this.formItem.isNewItem() && this.formItem instanceof SchedulingApiShiftModel) return;
		this.pWishesService.item = this.formItem as SchedulingApiShift;
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		this.initTypeAheadArrays();
		this.initStartOfDay();
		this.initEndOfDay();
		this.initFormItemValues();
		this.initShiftModelValues();
		this.initWishesServiceValue();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get formItem() : SchedulingApiShift | SchedulingApiShiftModel | null {
		if (this.service.modeIsEditShift || this.service.modeIsCreateShift) {
			return this.shift;
		}
		return this.shiftModel;
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formItem === null) throw new Error(`never call initFormGroup() without a defined formItem`);

		if (this.formGroup) {
			// this.pFormsService.removePControl(this.formGroup, 'currentCancellationPolicy');
			this.formGroup = null;
		}
		const model = this.formItem instanceof SchedulingApiShift ? this.formItem.model : this.formItem;
		this.formGroup = this.service.initFormGroup(
			this.formItem,
			this.userCanWrite,
			this.api.data.notificationsConf,
			this.api.data.shiftModels,
			this.modalContentForIsCoronaSlotBooking,
			model,
		);

		this.pFormsService.addFormGroup(this.formGroup, 'currentCancellationPolicy', new FormGroup({}));

	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public removeTariff(
		formGroup : PFormGroup,
		i : number,
		tariff : SchedulingApiShiftModelCourseTariff,
	) : void {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		this.pShiftModelTariffService.removeTariff(formGroup, i, tariff, this.shiftModel);
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public hasPaymentMethodOfType(type : SchedulingApiPaymentMethodType) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		for (let i = 0;i < this.shiftModel.coursePaymentMethods.length;i++) {
			const coursePaymentMethod = this.shiftModel.coursePaymentMethods.get(i);
			if (!coursePaymentMethod) throw new Error('coursePaymentMethod not found');
			if (coursePaymentMethod.type === type && !coursePaymentMethod.trashed) {
				return true;
			}
		}
		return false;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public removeCoursePaymentMethod(
		formGroup : PFormGroup,
		i : number,
		coursePaymentMethod : SchedulingApiShiftModelCoursePaymentMethod,
	) : void {
		if (!coursePaymentMethod.isNewItem()) { this.service.setChangeSelectors(coursePaymentMethod); }
		if (coursePaymentMethod.isNewItem()) {
			assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
			this.shiftModel.coursePaymentMethods.removeItem(coursePaymentMethod);
		} else {
			coursePaymentMethod.trashed = true;
		}
		// eslint-disable-next-line @typescript-eslint/ban-types
		const formArray = formGroup.get('coursePaymentMethods') as UntypedFormArray;
		formArray.removeAt(i);
		formArray.updateValueAndValidity();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public trimParentName() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.trim(this.formGroup.get('parentName')!);
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public trimCourseGroup() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.trim(this.formGroup.get('courseGroup')!);
	}
	private trim(control : AbstractControl) : void {
		if (!control.value) return;
		control.setValue(control.value.trim());
		control.updateValueAndValidity();
	}

	/**
	 * Check if color is selected
	 * @param availableColor color that needs to be checked
	 */
	public isSelectedColor( availableColor : string ) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		return !!this.shiftModel.color && availableColor.toUpperCase() === this.shiftModel.color.toUpperCase();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get packetRepetitionTitle() : string | boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		switch (this.formGroup.get('packetRepetition_type')!.value) {
			case SchedulingApiShiftRepetitionType.EVERY_X_DAYS:
				return this.localize.transform(this.repetitionOptions[0].title);
			case SchedulingApiShiftRepetitionType.EVERY_X_WEEKS:
				return this.localize.transform(this.repetitionOptions[1].title);
			case SchedulingApiShiftRepetitionType.EVERY_X_MONTHS:
				return this.localize.transform(this.repetitionOptions[2].title);
			case SchedulingApiShiftRepetitionType.EVERY_X_YEARS:
				return this.localize.transform(this.repetitionOptions[3].title);
			case SchedulingApiShiftRepetitionType.NONE:
				return this.localize.transform('Wähle…');
			default:
				this.formGroup.get('packetRepetition_type')!.setValue(0);
				this.formGroup.get('packetRepetition_type')!.updateValueAndValidity();
				return 'Wähle…';
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get repetitionTitle() : string | boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		switch (this.formGroup.get('repetition_type')!.value) {
			case SchedulingApiShiftRepetitionType.EVERY_X_DAYS:
				return this.localize.transform(this.repetitionOptions[0].title);
			case SchedulingApiShiftRepetitionType.EVERY_X_WEEKS:
				return this.localize.transform(this.repetitionOptions[1].title);
			case SchedulingApiShiftRepetitionType.EVERY_X_MONTHS:
				return this.localize.transform(this.repetitionOptions[2].title);
			case SchedulingApiShiftRepetitionType.EVERY_X_YEARS:
				return this.localize.transform(this.repetitionOptions[3].title);
			case SchedulingApiShiftRepetitionType.NONE:
				return this.localize.transform('Wähle…');
			default:
				this.formGroup.get('repetition_type')!.setValue(undefined);
				this.formGroup.get('repetition_type')!.updateValueAndValidity();
				return this.localize.transform('Wähle…');
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get repetitionEndDateModeTitle() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		switch (this.formGroup.get('selectedRepetitionEndDateMode')!.value) {
			case IntervalEndDateModes.NEVER:
				return this.service.intervalEndDateModesIterable[0].title;
			case IntervalEndDateModes.AFTER_X_TIMES:
				assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');
				if (this.formItem.repetition.endsAfterRepetitionCount > 1) {
					if (this.formGroup.get('isPacket')!.value) {
						return this.localize.transform('Paketen');
					} else {
						return this.localize.transform('Schichten');
					}
				} else {
					if (this.formGroup.get('isPacket')!.value) {
						return this.localize.transform('Paket');
					} else {
						return this.localize.transform('Schicht');
					}
				}
			case IntervalEndDateModes.ENDS_AFTER_DATE:
				return this.localize.transform('nach dem');
			default:
				return this.localize.transform('Wähle…');
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get packetTypeIsWeekly() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		// this.formItem.repetition.packetRepetition.isRepeatingOnFriday
		return this.formGroup.get('packetRepetition_type')!.value ===
			SchedulingApiShiftRepetitionType.EVERY_X_WEEKS;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get typeIsWeekly() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		// this.formItem.repetition.packetRepetition.isRepeatingOnFriday
		return this.formGroup.get('repetition_type')!.value === SchedulingApiShiftRepetitionType.EVERY_X_WEEKS;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get packetIsEditableOrAlreadySet() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		return (
			this.service.modeIsEditShift && this.formGroup.get('isPacket')!.value
		) || !this.service.modeIsEditShift;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get intervalIsEditableOrAlreadySet() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		return (
			this.service.modeIsEditShift && this.formGroup.get('isInterval')!.value
		) || !this.service.modeIsEditShift;
	}

	/**
	 * Handle click on delete button
	 */
	public getChangeSelectorModalAsHook(modalContent : TemplateRef<unknown>) : () => void {
		return this.modalService.getEditableHook(modalContent, {
			success: () => {
			},
			dismiss: () => {
				this.initFormGroup();
			},
			size: this.shift ? ShiftModalSizes.WITH_TRANSMISSION_PREVIEW : null,
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onDismiss() : void {
		// TODO: (PLANO-1868)
		if (this.shift) {
			this.shift = this.api.data.shifts.get(this.shift.id);
		}
		this.initFormGroup();
	}

	/**
	 * Check if user can read this shift
	 */
	public get userCanReadShiftModel() : boolean | null {
		const MODEL = this.formItem instanceof SchedulingApiShift ? this.formItem.model : this.formItem;
		if (!MODEL) throw new Error('model can not be found');
		return this.rightsService.userCanRead(MODEL);
	}

	/**
	 * open detail view to edit booking
	 */
	public navToBooking(booking ?: SchedulingApiBooking) : void {
		if (booking) {
			assumeDefinedToGetStrictNullChecksRunning(booking.id, 'booking.id');
			this.router.navigate([`/client/booking/${booking.id.toString()}`]);
		} else if (this.shift) {
			this.router.navigate([`/client/booking/create/${this.shift.id.toUrl()}`]);
		} else {
			this.router.navigate(['/client/booking/']);
		}
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasBookingsForList() : boolean {
		const component = new PShiftBookingsComponent(
			this.api,
			this.pShiftService,
			this.bookingsService,
			this.console,
			this.pShiftModelTariffService,
			this.pBookingFormService,
		);
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
		component.shift = this.shift;
		return component.hasBookingsForList;
	}

	/**
	 * Check if user can edit this shift
	 */
	public get userCanWrite() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'this.formItem');
		return !!this.rightsService.userCanWrite(this.formItem);
	}

	/**
	 * Check if user can edit this shift
	 */
	public get isOwner() : boolean | null {
		return this.rightsService.isOwner;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get intervalSettingsAreValid() : boolean {
		return this.service.intervalSettingsAreValid(this.formGroup!);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftPacketSettingsValid() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');

		if (this.formGroup.get('isPacket')!.invalid) return false;
		if (this.formGroup.get('packet_x')!.invalid) return false;
		if (this.formGroup.get('packetRepetition_type')!.invalid) return false;
		if (this.formGroup.get('packet_endsAfterRepetitionCount')!.invalid) return false;
		if (this.formGroup.get('packet_weekdays')!.invalid) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftPacketSettingsDisabled() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');

		return (
			this.userCanWrite && this.service.modeIsEditShift ||
			this.formGroup.get('isPacket')!.disabled ||
			this.formGroup.get('packet_x')!.disabled ||
			this.formGroup.get('packetRepetition_type')!.disabled ||
			this.formGroup.get('packet_endsAfterRepetitionCount')!.disabled
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get intervalSettingsAreDisabled() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');

		if (this.userCanWrite && this.service.modeIsEditShift) return true;
		if (this.formGroup.get('repetition_type')!.disabled) return true;
		if (this.formGroup.get('repetition_x')!.disabled) return true;
		if (this.formGroup.get('repetition_endsAfterRepetitionCount')!.disabled) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showRelatedBookings() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');

		if (this.formItem.isNewItem()) return false;
		if (this.service.modeIsEditShiftModel) return false;
		if (this.service.modeIsCreateShiftModel) return false;
		if (!this.userCanReadShiftModel) return false;

		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');

		if (this.shiftModel.courseType === SchedulingApiCourseType.NO_BOOKING) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showNeededMembersCountConfShowroom() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');

		const tempFormGroup = this.formGroup.get('neededMembersCountConf');
		assumeDefinedToGetStrictNullChecksRunning(tempFormGroup, 'tempFormGroup');
		const modeIsFixedMembersCountControl = tempFormGroup.get('modeIsFixedMembersCount');
		assumeDefinedToGetStrictNullChecksRunning(modeIsFixedMembersCountControl, 'modeIsFixedMembersCountControl');
		if (modeIsFixedMembersCountControl.value) return false;
		if (!this.service.modeIsEditShift && !this.service.modeIsCreateShift) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get neededMembersCountConfNotReached() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		assumeDefinedToGetStrictNullChecksRunning(this.shift, 'shift');

		const tempFormGroup = this.formGroup.get('neededMembersCountConf');
		assumeDefinedToGetStrictNullChecksRunning(tempFormGroup, 'tempFormGroup');
		const isZeroNotReachedMinParticipantsControls = tempFormGroup.get('isZeroNotReachedMinParticipantsCount');
		assumeDefinedToGetStrictNullChecksRunning(isZeroNotReachedMinParticipantsControls, 'isZeroNotReachedMinParticipantsControls');
		return (
			isZeroNotReachedMinParticipantsControls.value &&
			this.shift.currentCourseParticipantCount < this.shift.minCourseParticipantCount
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showSendEmailSetting() : boolean {
		if (!this.shift) return false;
		return this.shift.assignedMemberIds.length > 0;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public hasCourseEmails(type : SchedulingApiCustomBookableMailEventType) : boolean {
		return this.api.data.customBookableMails.getByEventType(type).length > 0;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get basisSettingsTabLabel() : string {
		if (Config.IS_MOBILE) return this.localize.transform('Schichtinfo');
		return this.localize.transform('Grundeinstellungen');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get bookingsettingsTabLabel() : string {
		if (Config.IS_MOBILE) return this.localize.transform('Buchungsinfo');
		return this.localize.transform('Buchungseinstellungen');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get bookingsettingsTabHasDanger() : boolean {
		if (this.formGroup?.get('courseCodePrefix')?.invalid) return true;
		if (this.formGroup?.get('courseTariffs')?.invalid) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showQuickAssignment() : boolean {
		if (!Config.IS_MOBILE) return false;
		if (!this.shift) return false;

		if (this.shift.assignedMemberIds.length > 0) return true;
		if (this.shift.emptyMemberSlots > 0) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showBookingOptionsSection() : boolean {
		if (this.service.modeIsEditShiftModel) return true;
		if (this.service.modeIsCreateShiftModel) return true;
		if (this.userCanWrite) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get addButtonIsDisabled() : boolean {
		return !this.formGroup || this.formGroup.invalid || this.api.isBackendOperationRunning;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showControlCourseCodePrefix() : boolean {
		return (
			this.userCanWrite &&
			this.formGroup!.get('isCourse')!.value &&
			(this.service.modeIsEditShiftModel || this.service.modeIsCreateShiftModel)
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showControlCourseCode() : boolean {
		return (
			this.formGroup!.get('isCourse')!.value &&
			this.service.modeIsEditShift || this.service.modeIsCreateShift
		);
	}

	public startOfDay ! : number;
	private initStartOfDay() : void {
		this.startOfDay = this.pMoment.duration('00:00').asMilliseconds();
	}

	public endOfDay ! : number;
	private initEndOfDay() : void {
		this.endOfDay = this.pMoment.duration('23:59').asMilliseconds();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get translatedStartTimeValidationHintText() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');

		let end : number;
		if (
			!!this.formGroup.get('endTime')!.value &&
			this.formGroup.get('endTime')!.value !== null
		) {
			end = this.formGroup.get('endTime')!.value;
		} else {
			end = this.endOfDay;
		}
		return this.timeValidationHintText(this.startOfDay, end);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get translatedEndTimeValidationHintText() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');

		let start : number;
		if (
			!!this.formGroup.get('startTime')!.value &&
			this.formGroup.get('startTime')!.value !== null
		) {
			start = this.formGroup.get('startTime')!.value;
		} else {
			start = this.startOfDay;
		}
		return this.timeValidationHintText(start, this.endOfDay);
	}

	private timeValidationHintText(start : number, end : number) : string {
		return this.localize.transform('Benötigtes Format: ss:mm. Wähle eine Uhrzeit zwischen ${start} und ${end}', {
			start: this.pDuration.transform(start, AngularDatePipeFormat.SHORT_TIME) ?? '…',
			end: this.pDuration.transform(end, AngularDatePipeFormat.SHORT_TIME) ?? '…',
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get translatedIsIntervalValueText() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');

		if (this.formGroup.get('isPacket')!.value) {
			return this.localize.transform('Das Schicht-Paket »${shiftModelName}« wiederholt sich.', {
				shiftModelName: this.shiftModel.attributeInfoName.value ?? '…',
			});
		}
		return this.localize.transform('Die Schicht »${shiftModelName}« wiederholt sich.', {
			shiftModelName: this.shiftModel.attributeInfoName.value ?? '…',
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get translatedNeededMembersCountModalBoxLabel() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		const neededMembersCountConf = this.formGroup.get('neededMembersCountConf') as PFormGroup;
		const neededMembersCount = neededMembersCountConf.get('neededMembersCount')!.value;
		let result = '';
		switch (neededMembersCount) {
			case 0 :
				result += this.localize.transform('0 Mitarbeitende');
				break;
			case 1 :
				result += this.localize.transform('1 Mitarbeitende');
				break;
			default :
				result += this.localize.transform('${counter} Mitarbeitende', { counter: neededMembersCount });
		}
		const modeIsFixedMembersCount = neededMembersCountConf.get('modeIsFixedMembersCount')!.value;
		if (!modeIsFixedMembersCount) {
			result += ' ';
			result += this.localize.transform('pro ${x} teilnehmende', {
				x: neededMembersCountConf.get('perXParticipants')!.value,
			});
		}
		return result;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get packetEndsAfterRepetitionCountLabel() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		if (this.formGroup.get('packet_endsAfterRepetitionCount')!.value > 1) {
			return this.localize.transform('Verteilt auf die Tage');
		}
		return this.localize.transform('Am');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isPacketLabel() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		if (!this.formGroup.get('isPacket')!.value) return this.localize.transform('An jedem');
		return this.localize.transform('Das Paket beginnt jeweils am');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get affectedWeekdays() : string {
		let result = '';

		const addDayToResult = (day : 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So') : void => {
			if (result.length > 0) result += ', ';
			result += this.localize.transform(day);
		};

		assumeDefinedToGetStrictNullChecksRunning(this.formItem, 'formItem');

		if (this.formItem.repetition.packetRepetition.isRepeatingOnMonday) addDayToResult('Mo');
		if (this.formItem.repetition.packetRepetition.isRepeatingOnTuesday) addDayToResult('Di');
		if (this.formItem.repetition.packetRepetition.isRepeatingOnWednesday) addDayToResult('Mi');
		if (this.formItem.repetition.packetRepetition.isRepeatingOnThursday) addDayToResult('Do');
		if (this.formItem.repetition.packetRepetition.isRepeatingOnFriday) addDayToResult('Fr');
		if (this.formItem.repetition.packetRepetition.isRepeatingOnSaturday) addDayToResult('Sa');
		if (this.formItem.repetition.packetRepetition.isRepeatingOnSunday) addDayToResult('So');

		if (result === '') result = '–';
		return result;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showFreeclimberSettings() : boolean {
		if (this.shift) return false;
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		if (!this.formGroup.get('isCourse')!.value) return false;
		if (this.api.data.posSystem !== SchedulingApiPosSystem.FREECLIMBER) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get formItemName() : string {
		if (!this.formItem || !this.formItem.name) return this.localize.transform('Neue Tätigkeit');
		return this.formItem.name;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public copyTariff(event : MouseEvent, courseTariff : PFormGroup) : void {
		event.preventDefault();
		event.stopPropagation();

		// Create a new tariff based on the clicked one
		const NEW_TARIFF : SchedulingApiShiftModelCourseTariff = courseTariff.get('reference')!.value.copy();

		// Check if a copy already exists.
		const NEW_TARIFF_NAME = `${NEW_TARIFF.name} – ${this.localize.transform('Kopie')}`;

		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');

		if (this.shiftModel.courseTariffs.findBy(item => !item.trashed && item.name === NEW_TARIFF_NAME)) {
			this.toastsService.addToast({
				theme: PThemeEnum.DANGER,
				title: this.localize.transform('Momentchen …'),
				content: this.localize.transform('Ein Tarif mit dem Namen »${name}« existiert schon.', {
					name : NEW_TARIFF_NAME,
				}),
			});
			return;
		}

		// Edit necessary values
		NEW_TARIFF.name = NEW_TARIFF_NAME;

		// Add the new tariff to the existing ones
		this.shiftModel.courseTariffs.push(NEW_TARIFF);

		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');

		// eslint-disable-next-line @typescript-eslint/ban-types
		const formArray = this.formGroup.get('courseTariffs') as UntypedFormArray;
		const INDEX_OF_TEMPLATE = formArray.controls.indexOf(courseTariff);
		const NEW_INDEX = INDEX_OF_TEMPLATE !== -1 ? INDEX_OF_TEMPLATE + 1 : null;

		// Create a new form group based on the pushed item
		this.service.addTariff({
			formGroup: this.formGroup,
			userCanWrite: this.userCanWrite,
			shiftModel: this.shiftModel,
			item: NEW_TARIFF,
			indexToInsert: NEW_INDEX,
		});
	}

	/**
	 * Add a brand new tariff to the list of tariffs.
	 * Beware: This method also sets default values.
	 */
	public addNewTariff(
		formGroup : PFormGroup,
		userCanWrite : boolean,
		shiftModel : SchedulingApiShiftModel,
		item ?: SchedulingApiShiftModelCourseTariff | null,
		index ?: number | null,
	) : void {
		this.service.addTariff({
			formGroup: formGroup,
			userCanWrite: userCanWrite,
			shiftModel: shiftModel,
			item: item ?? null,
			indexToInsert: index ?? null,
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public hasCourseDatesData(courseTariff : SchedulingApiShiftModelCourseTariff) : boolean {
		return this.pShiftModelTariffService.hasCourseDatesData(
			courseTariff.negateForCourseDatesInterval,
			courseTariff.forCourseDatesFrom,
			courseTariff.forCourseDatesUntil,
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public forCourseDatesPlaceholder(time : number) : string | null {
		return !time ? this.localize.transform('Unbegrenzt') : null;
	}

	private paymentMethodIsPayPal(paymentMethod : SchedulingApiShiftModelCoursePaymentMethod) : boolean {
		return paymentMethod.type === SchedulingApiPaymentMethodType.PAYPAL;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public paymentMethodIcon(paymentMethod : SchedulingApiShiftModelCoursePaymentMethod) : FaIcon | null {
		if (this.paymentMethodIsPayPal(paymentMethod)) return PlanoFaIconPool.BRAND_PAYPAL;
		return this.pCurrencyPipe.getPaymentMethodIcon(paymentMethod.type, paymentMethod.name);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get saveChangesHook() : ((success : () => void, dismiss : () => void) => void) | undefined {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		const IS_FREE_COURSE = this.pShiftModelTariffService.isFreeCourse(this.shiftModel.courseTariffs, this.shiftModel.coursePaymentMethods);
		if (!IS_FREE_COURSE) return undefined;
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		if (this.formGroup.get('isFreeCourse')!.value) return undefined;

		return (success, dismiss) => {
			let text : string = '';
			assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
			const hasUntrashedPaymentMethods = this.shiftModel.courseTariffs.hasUntrashedItem;
			if (hasUntrashedPaymentMethods && !this.pShiftModelTariffService.hasVisiblePaymentMethod(this.shiftModel.coursePaymentMethods)) {
				text += this.localize.transform('Alle Zahlungsarten sind als interne Zahlungsart markiert.');
				text += ' ';
			}

			const hasUntrashedCourseTariff = this.shiftModel.courseTariffs.hasUntrashedItem;
			if (hasUntrashedCourseTariff && !this.pShiftModelTariffService.hasVisibleCourseTariffWithCosts(this.shiftModel.courseTariffs)) {
				text += this.localize.transform('Alle Tarife sind als interner Tarif markiert.');
				text += ' ';
			}

			text += this.localize.transform('${name} wird bei Online-Buchung als kostenlos angezeigt werden.', { name : this.shiftModel.name });
			this.modalService.confirm({
				description: text,
			}, {
				theme: PThemeEnum.WARNING,
				success: () => {
					success();
					assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
					this.formGroup.get('isFreeCourse')!.setValue(true);
				},
				dismiss: dismiss,
			});
		};
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showIsCoronaSlotBooking() : boolean {
		if (this.service.modeIsEditShift || this.service.modeIsCreateShift) return false;
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		if (!this.shiftModel.isCourse) return false;
		if (this.shiftModel.courseType !== SchedulingApiCourseType.ONLINE_BOOKABLE) return false;
		if (!this.rightsService.userCanWrite(this.shiftModel)) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasTariffWithNoCosts() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		// eslint-disable-next-line @typescript-eslint/ban-types
		const courseTariffsControl = this.formGroup.get('courseTariffs') as UntypedFormArray | null;
		assumeDefinedToGetStrictNullChecksRunning(courseTariffsControl, 'courseTariffsControl');
		const tariffs = courseTariffsControl.controls.map(item => {
			return (item as PFormGroup).get('reference')!.value as SchedulingApiShiftModelCourseTariff;
		});
		for (const tariff of tariffs) {
			if (tariff.isInternal) continue;
			if (tariff.trashed) continue;
			if (tariff.fees.findBy(fee => fee.fee > 0)) continue;
			return true;
		}
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasTariffWithCosts() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		// eslint-disable-next-line @typescript-eslint/ban-types
		const tariffs = (this.formGroup.get('courseTariffs') as UntypedFormArray).controls.map(item => {
			return (item as PFormGroup).get('reference')!.value as SchedulingApiShiftModelCourseTariff;
		});
		for (const tariff of tariffs) {
			if (tariff.isInternal) continue;
			if (tariff.trashed) continue;
			if (!tariff.fees.findBy(fee => fee.fee > 0)) continue;
			return true;
		}
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get basisSettingsIsInvalid() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		return this.formGroup.get('name')!.invalid;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showAddBookingsBtn() : boolean | null {
		if (this.shiftModel === null) return null;

		if (!this.service.modeIsEditShift) return false;
		if (!this.rightsService.can(BookingSystemRights.createBookings, this.shiftModel)) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftStart() : number | undefined {
		if (!this.shift) return undefined;
		if (!this.shift.rawData) throw new Error('Can not get start. Shift is lost. [PLANO-FE-3FN]');
		return this.shift.start;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/ban-types
	public showPaymentMethodNameAndDescriptionFormFields(paymentMethodFormGroup : UntypedFormGroup) : boolean | undefined {
		const typeControl = paymentMethodFormGroup.get(paymentMethodFormGroup.get('reference')!.value.attributeInfoType.id);
		if (!typeControl) {
			this.console.error('No typeControl available');
			return undefined;
		}
		return typeControl.value !== this.service.paymentMethodTypes.PAYPAL && typeControl.value  !== this.service.paymentMethodTypes.ONLINE_PAYMENT;
	}

	/**
	 * @returns Should option paypal be available?
	 */
	public get showPaypal() : boolean {
		if (!this.api.data.isPaypalAvailable) return false;
		const now = +this.pMoment.m();
		return now <= Config.PAYPAL_SHUTDOWN_DATE;
	}

	/**
	 * @returns Should option online-payment be available?
	 */
	public get showOnlinePayment() : boolean {
		return this.api.data.isOnlinePaymentAvailable;
	}

	/**
	 * Is Adyen supported for this client?
	 */
	public get adyenIsSupported() : boolean {
		return Config.CURRENCY_CODE === PSupportedCurrencyCodes.EUR;
	}

	/**
	 * Text for the case that online-payment is not available
	 */
	public get cannotEditOnlinePaymentHint() : PDictionarySourceString {
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		if (!this.adyenIsSupported) return 'Online-Zahlung steht für deine Landeswährung noch nicht zur Verfügung. Falls du die Online-Zahlung nutzen möchtest, melde dich gerne bei uns im Chat oder per <a href="mailto:service@dr-plano.com">Email</a>.';
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		return 'Bitte erst für deinen Account die <a href="client/plugin/payments" target="_blank">Online-Zahlung aktivieren</a>, um die Zahlungsart hier verwenden zu können.';
	}
}

