import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AfterContentInit, TemplateRef } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { TimeStampApiShift } from '@plano/shared/api';
import { TimeStampApiShiftModel } from '@plano/shared/api';
import { TimeStampApiService } from '@plano/shared/api';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PPushNotificationsService, PRequestWebPushNotificationPermissionContext } from '@plano/shared/core/p-push-notifications.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PApiPrimitiveTypes } from '../../../shared/api/base/generated-types.ag';
import { DateTime} from '../../../shared/api/base/generated-types.ag';
import { LogService } from '../../../shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { PlanoFaIconPool } from '../../../shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames, PValidatorObject } from '../../../shared/core/validators.types';
import { PValidationErrors} from '../../../shared/core/validators.types';
import { BootstrapSize, PThemeEnum } from '../../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-stopwatch',
	templateUrl: './stopwatch.component.html',
	styleUrls: ['./stopwatch.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class StopwatchComponent implements AfterContentInit {
	@Output() public onEnd : EventEmitter<undefined> = new EventEmitter();
	@Input() public selectedItem : TimeStampApiShift | TimeStampApiShiftModel | null = null;

	constructor(
		public api : TimeStampApiService,
		private modalService : ModalService,
		public toasts : ToastsService,
		private pFormsService : PFormsService,
		private validators : ValidatorsService,
		private pPushNotificationsService : PPushNotificationsService,
		private console : LogService,
		private pMomentService : PMomentService,
	) {
		this.initValues();
	}

	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;

	public formGroup : PFormGroup | null = null;
	public modalRef : NgbModalRef | null = null;
	private now ! : number;

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.now = +this.pMomentService.m();
	}

	public ngAfterContentInit() : void {
		this.initFormGroup();
	}

	/**
	 * Initialize the formGroup for this component
	 */
	private initFormGroup() : void {
		if (this.formGroup) this.formGroup = null;

		const tempFormGroup = this.pFormsService.group({});

		// We should have something like <p-input type="Minutes" [formControlName]="duration"></p-input>
		this.pFormsService.addControl(tempFormGroup, 'duration', {
			value: this.api.data.regularPauseDuration,
			disabled: false,
		}, [
			this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
			this.validators.required(PApiPrimitiveTypes.Duration),

			new PValidatorObject({name: PPossibleErrorNames.MAX, fn: (control : Pick<AbstractControl<typeof this.api.data.regularPauseDuration | null>, 'value'>) => {
				return control.value !== null ? this.maxPauseValidator(control.value) : null;
			}}),
		], () => {});
		this.formGroup = tempFormGroup;
	}

	/**
	 * Exists in the following components:
	 * - DetailFormComponent
	 * - StopwatchComponent
	 */
	private maxPauseValidator(value : number) : PValidationErrors | null {
		let end : DateTime;
		let start : DateTime | null = null;
		if (this.api.data.selectedItem instanceof TimeStampApiShift) {
			start = this.api.data.selectedItem.start;
			end = this.api.data.selectedItem.end;
		} else {
			start = this.api.data.start;
			end = +this.pMomentService.m();
		}
		if (start === null) return null;
		const maxDurationOfPause = end - start;
		const limitAsMinutes = this.pMomentService.d(maxDurationOfPause).asMinutes();
		const controlValueAsMinutes = this.pMomentService.d(value).asMinutes();
		return this.validators.max(
			limitAsMinutes,
			true,
			PApiPrimitiveTypes.Minutes,
			undefined,
			'Die Pause war länger als die Arbeitszeit? Witzbold ;)',
		).fn({value: controlValueAsMinutes});
	}

	/**
	 * Should the user be able to add a pause for this shift? If not, user must stamp the pause.
	 */
	public get isAddPauseMode() : boolean {
		if (this.api.data.selectedItem instanceof TimeStampApiShift) {
			if (this.api.data.whenMemberStampedStart === null) return false;
			// Did the user click the start button after shift.end?
			return this.api.data.whenMemberStampedStart > this.api.data.selectedItem.end;
		}

		if (this.api.data.selectedItem instanceof TimeStampApiShiftModel) {
			// Did the user select a start time that is before/outside a limit?
			const minLimit = +this.pMomentService.m(this.now).subtract(3, 'hours');
			if (this.api.data.start === null) return false;
			return this.api.data.start < minLimit;
		}

		return false;
	}

	/**
	 * Should the start button be disabled?
	 */
	public get startButtonDisabled() : boolean {
		const started = !!this.api.data.start;
		const isInvalid = !this.selectedItem;
		return isInvalid || started;
	}


	/**
	 * Should the Pause button be disabled?
	 */
	public get pauseButtonDisabled() : boolean {
		return !this.api.timeStampIsRunning();
	}

	/**
	 * Should the Stop button be disabled?
	 */
	public get stopButtonDisabled() : boolean {
		return !this.api.timeStampIsRunning();
	}

	/**
	 * Save the current data
	 */
	private save() : void {
		this.api.save();
	}

	/**
	 * Start the Pause and save it
	 */
	private startPause() : void {
		this.api.startPause();
		this.save();
	}

	/**
	 * Stop the Pause and save it
	 */
	private stopPause() : void {
		this.api.completePause();
		this.save();
	}

	private askForNotificationPermissionIfNecessary() : void {
		if (!(this.selectedItem instanceof TimeStampApiShift)) return;
		const deadline = +this.pMomentService.m(this.now).subtract(10, 'hours');
		if (this.selectedItem.end > deadline) return;
		// End was more then 10 hours ago. So user probably forgot to stamp his/her shift.
		this.pPushNotificationsService.requestWebPushNotificationPermission(
			PRequestWebPushNotificationPermissionContext.STAMPED_PAST_SHIFT,
		);
	}

	/**
	 * Start the time-stamp and save it
	 */
	public onStart(timestamp : number) : void {
		if (!this.selectedItem) throw new Error('No item is selected. Start button should have been disabled.');
		this.api.startTimeStamp(timestamp, this.selectedItem);
		this.askForNotificationPermissionIfNecessary();
		this.api.save();
	}

	/**
	 * Stop the time-stamp and save it
	 */
	public onStop(timestamp : number) : void {
		if (this.api.isPausing) { this.stopPause(); }
		this.api.stopTimeStamp(timestamp);
		this.askForNotificationPermissionIfNecessary();
		this.api.save({
			success: () => {
				this.onEnd.emit();
			},
		});
	}

	/**
	 * Stop the pause
	 */
	public togglePause() : void {
		if (this.api.isPausing) {
			this.stopPause();
		} else {
			this.startPause();
		}
	}

	/**
	 * Add the pause
	 */
	public addPause(modalContent : TemplateRef<unknown>) : void {
		this.initFormGroup();
		this.modalService.openModal(modalContent, {
			success: () => {
				assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
				this.api.completePause(this.formGroup.get('duration')!.value);
				this.api.save();
			},
			dismiss: () => {
				this.initFormGroup();
			},
		});
	}

	/** A time the user probably wants to set */
	public get suggestionTimestampForStart() : number | null {
		if (this.selectedItem instanceof TimeStampApiShift) {
			return this.selectedItem.start;
		} else if (this.selectedItem instanceof TimeStampApiShiftModel) {
			return null;
		}
		return null;
	}

	/** A time the user probably wants to set */
	public get suggestionTimestampForEnd() : number | null {
		const selectedItem = this.selectedItem ?? this.api.data.selectedItem;
		if (selectedItem instanceof TimeStampApiShift) {
			let earliestPossibleEnd ! : number;
			if (this.api.data.start === null) {
				earliestPossibleEnd = this.api.data.regularPauseDuration;
			} else {
				earliestPossibleEnd = this.api.data.start + this.api.data.regularPauseDuration;
			}
			if (selectedItem.end < earliestPossibleEnd) return null;
			return selectedItem.end;
		} else if (selectedItem instanceof TimeStampApiShiftModel) {
			return null;
		}
		return null;
	}

	/**
	 * The minimum possible timestamp the user can choose
	 */
	public get minStart() : DateTime | null {
		const validationObjects = this.api.data.attributeInfoStart.validations.map(item => item());
		const comparedConst = validationObjects.find(item => item?.name === PPossibleErrorNames.MIN)?.comparedConst as DateTime | undefined;
		if (typeof comparedConst === 'function') this.console.error('Function is not implemented here');
		return comparedConst ?? null;
	}

	/**
	 * The maximum possible timestamp the user can choose
	 */
	public get maxStart() : DateTime | null {
		const validationObjects = this.api.data.attributeInfoStart.validations.map(item => item());
		const comparedConst = validationObjects.find(item => item?.name === PPossibleErrorNames.MAX)?.comparedConst as DateTime | undefined;
		if (typeof comparedConst === 'function') this.console.error('Function is not implemented here');
		return comparedConst ?? null;
	}

	/**
	 * The min possible timestamp the user can choose
	 */
	public get minEnd() : DateTime | null {
		const validationObjects = this.api.data.attributeInfoEnd.validations.map(item => item());
		const comparedConst = validationObjects.find(item => item?.name === PPossibleErrorNames.MIN)?.comparedConst as (() => DateTime) | undefined;
		const minByValidator = typeof comparedConst === 'number' ? comparedConst : comparedConst?.() ?? null;

		const minByDuration = this.api.data.start !== null ? this.api.data.start + this.api.data.regularPauseDuration : this.api.data.regularPauseDuration;
		if (!minByValidator) return minByDuration;

		return minByValidator > minByDuration ? minByValidator : minByDuration;
	}

	/**
	 * The maximum possible timestamp the user can choose
	 */
	public get maxEnd() : DateTime | null {
		const validationObjects = this.api.data.attributeInfoEnd.validations.map(item => item());
		const comparedConst = validationObjects.find(item => item?.name === PPossibleErrorNames.MAX)?.comparedConst as (() => DateTime) | undefined;
		const maxByValidator = typeof comparedConst === 'number' ? comparedConst : comparedConst?.() ?? null;

		if (maxByValidator === null) return null;
		if (this.minEnd !== null && maxByValidator < this.minEnd) {
			// this.console.warn('Min must be less than max');
			return null;
		}

		return maxByValidator;
	}
}
