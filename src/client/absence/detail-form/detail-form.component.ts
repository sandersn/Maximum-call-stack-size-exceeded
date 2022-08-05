import { OnDestroy, AfterContentInit} from '@angular/core';
import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { SchedulingApiAbsence, SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiAbsenceType } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { PAbsenceDetailFormService } from './detail-form.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';

@Component({
	selector: 'p-detail-form[item]',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent implements OnDestroy, AfterContentInit, DetailFormComponentInterface<SchedulingApiAbsence<'validated' | 'draft'>> {
	@Input() public item ! : SchedulingApiAbsence<'draft' | 'validated'>;
	public formGroup : DetailFormComponentInterface['formGroup'] | null = null;

	// TEMP: There seems to be a bug in angular forms. Disabled state does not get updated properly. This is a dirty fix.
	private interval : number | null = null;

	constructor(
		public api : SchedulingApiService,
		private pRouterService : PRouterService,
		private pMoment : PMomentService,
		private pAbsenceDetailFormService : PAbsenceDetailFormService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PThemeEnum = PThemeEnum;
	public SchedulingApiAbsenceType = SchedulingApiAbsenceType;

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(success ?: () => void) : void {
		this.initFormGroup();
		if (success) { success(); }
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }
		this.formGroup = this.pAbsenceDetailFormService.generateFormGroup(this.item);
		this.fixAngularFormDisabledStateUpdate();
	}

	// HACK: There seems to be a bug in angular forms. Disabled state does not get updated properly. This is a dirty fix.
	private fixAngularFormDisabledStateUpdate() : void {
		if (this.interval) return;

		this.interval = window.setInterval(() => {
			if (!this.formGroup) return;
			if (!this.item.rawData) return;

			if (!this.formGroup.get('fullday')!.value) {
				if (!this.formGroup.get('workingTimePerDay')!.disabled) this.formGroup.get('workingTimePerDay')!.disable();
			} else {
				if (this.formGroup.get('workingTimePerDay')!.disabled) this.formGroup.get('workingTimePerDay')!.enable();
			}
		}, 1000);
	}

	public ngOnDestroy() : void {
		window.clearInterval(this.interval!);
		// if (this.item.isNewItem()) {
		// 	this.removeCurrentAbsencePrompt('verwerfen', event);
		// }
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public canDeactivate() : boolean {
		// if the editName !== this.user.name
		return window.confirm('Discard changes?');
	}
	// canDeactivate() : Observable<boolean> | boolean {
	// 	// Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
	// 	if (this.formGroup.valid) {
	// 		return true;
	// 	}
	// 	// Otherwise ask the user with the dialog service and return its
	// 	// observable which resolves to true or false when the user decides
	// 	return this.removeCurrentAbsencePrompt('verwerfen', event);
	// }

	/**
	 * The end value that is shown to the user
	 */
	public get displayedEnd() : number {
		let result : number;
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		const END_TIMESTAMP : number = +this.formGroup.get('end')!.value;
		if (this.item.isFullDay) {
			result = +this.pMoment.m(END_TIMESTAMP - 1).endOf('day');
		} else {
			result = END_TIMESTAMP;
		}
		return result;
	}

	/**
	 * Remove Item of this Detail page
	 */
	public removeItem() : void {
		this.formGroup = null;
		this.api.data.absences.removeItem(this.item);

		this.pRouterService.navBack();
		this.api.save({
			success : () => {
			},
		});
	}

	@Output() public onAddItem : EventEmitter<SchedulingApiAbsence> = new EventEmitter<SchedulingApiAbsence>();

	/**
	 * Save this item
	 */
	public saveItem() : void {
		if (!this.item.isNewItem()) return;
		this.onAddItem.emit(this.item);
		this.pRouterService.navBack();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get relatedShiftExchange() : SchedulingApiShiftExchange | undefined | null {
		if (!this.api.isLoaded()) return undefined;
		if (!this.item.shiftExchangeId) return undefined;
		return this.api.data.shiftExchanges.get(this.item.shiftExchangeId);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showRelatedShiftExchange() : boolean {
		if (Config.IS_MOBILE) return false;
		if (!this.item.shiftExchangeId) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get formattedWorkingTimePerDay() : string {
		const DURATION = this.item.workingTimePerDay;
		return this.pMoment.duration(DURATION).asHours().toString();
	}
}
