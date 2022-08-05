import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { SchedulingApiShiftModels, SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiWorkingTime } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PValidationErrors} from '@plano/shared/core/validators.types';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { PMomentService } from '../../shared/p-moment.service';

@Component({
	selector: 'p-detail-form[item]',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent implements AfterContentInit, DetailFormComponentInterface<SchedulingApiWorkingTime<'validated' | 'draft'>> {
	@Input() public item ! : SchedulingApiWorkingTime<'draft' | 'validated'>;

	@Output() public onAddItem : EventEmitter<SchedulingApiWorkingTime> = new EventEmitter<SchedulingApiWorkingTime>();

	constructor(
		public api : SchedulingApiService,
		private validators : ValidatorsService,
		public me : MeService,
		private pFormsService : PFormsService,
		private pRouterService : PRouterService,
		private console : LogService,
		private rightsService : RightsService,
		private localize : LocalizePipe,
		private pMomentService : PMomentService,
	) {
	}

	public PPossibleErrorNames = PPossibleErrorNames;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PThemeEnum = PThemeEnum;

	public formGroup : DetailFormComponentInterface['formGroup'] | null = null;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get pageTitle() : string {
		return this.localize.transform('Arbeitseinsatz ${editOrCreate}', {
			editOrCreate: this.localize.transform(this.item.isNewItem() ? 'eintragen' : 'bearbeiten'),
		});
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const tempFormGroup = this.pFormsService.group({});

		this.pFormsService.addControl(tempFormGroup, 'shiftModelId',
			{
				value : this.item.shiftModelId,
				disabled: false,
			},
			[
				this.validators.required(this.item.attributeInfoShiftModelId.primitiveType),
				this.validators.idDefined(),
			],
			(value : Id) => {
				this.item.shiftModelId = value;
				this.refreshInitialEarnings();
			},
		);

		if (!this.item.rawData) throw new Error('PLANO-24037');

		this.pFormsService.addControl(tempFormGroup, 'comment',
			{
				value : this.item.comment,
				disabled: !this.item.attributeInfoComment.canEdit,
			},
			[
			],
		);

		this.pFormsService.addControl(tempFormGroup, 'memberId',
			{
				value : this.item.memberId,
				disabled: !this.userCanWrite,
			},
			[
				this.validators.required(this.item.attributeInfoMemberId.primitiveType),
				this.validators.idDefined(),
			],
			(value : Id) => {
				this.refreshInitialEarnings();
				this.item.memberId = value;
				if (this.item.attributeInfoComment.canEdit) {
					tempFormGroup.get('comment')!.enable();
				} else {
					tempFormGroup.get('comment')!.disable();
				}
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'regularPauseDuration',
			{
				value : this.item.regularPauseDuration,
				disabled: !this.userCanWrite,
			},
			[
				this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
				new PValidatorObject({name: PPossibleErrorNames.MAX, fn: (control) => {
					const start = this.item.time.start;
					const end = this.item.time.end;
					// @ts-expect-error -- fix this after `Maximum call stack size exceeded` has been fixed
					return this.maxPauseValidator(start, end, control.value);
				}}),
			],
			value => {
				if (this.item.regularPauseDuration === value) return;

				if (value !== '' && !Number.isNaN(+value)) {
					this.item.regularPauseDuration = value;
				} else {
					this.item.regularPauseDuration = -1;
				}
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'hourlyEarnings',
			{
				value : (this.item.attributeInfoHourlyEarnings.value) !== null ? this.item.hourlyEarnings : undefined,
				disabled: !this.userCanWrite,
			},
			[
				this.validators.required(this.item.attributeInfoHourlyEarnings.primitiveType),
				this.validators.number(this.item.attributeInfoHourlyEarnings.primitiveType),
			],
			value => { this.item.hourlyEarnings = value; },
		);

		this.pFormsService.addControl(tempFormGroup, 'start',
			{
				value : this.item.time.start,
				disabled: !this.userCanWrite,
			},
			[
				this.validators.required(PApiPrimitiveTypes.DateTime),
				new PValidatorObject({name: PPossibleErrorNames.MAX, fn: (control) => {

					const limit = this.item.time.end;
					assumeDefinedToGetStrictNullChecksRunning(limit, 'limit');
					return this.validators.max(this.item.time.end, true, this.item.time.attributeInfoStart.primitiveType).fn(control);
				}}),
			],
			value => { this.item.time.start = value; },
		);

		this.pFormsService.addControl(tempFormGroup, 'end',
			{
				value : this.item.time.end,
				disabled: !this.userCanWrite,
			},
			[
				this.validators.required(PApiPrimitiveTypes.DateTime),
				new PValidatorObject({name: PPossibleErrorNames.MIN, fn: (control) => {
					const limit = this.item.time.start;
					assumeDefinedToGetStrictNullChecksRunning(limit, 'limit');
					return this.validators.min(this.item.time.start, true, this.item.time.attributeInfoEnd.primitiveType).fn(control);
				}}),
			],
			value => { this.item.time.end = value; },
		);

		this.formGroup = tempFormGroup;
	}

	/**
	 * Exists in the following components:
	 * - DetailFormComponent
	 * - StopwatchComponent
	 */
	private maxPauseValidator(start : number, end : number, value : number) : PValidationErrors | null {
		if (!start) return null;
		if (!end) return null;
		const duration = end - start;
		const limitAsMinutes = this.pMomentService.d(duration).asMinutes();
		const controlValueAsMinutes = this.pMomentService.d(value).asMinutes();
		return this.validators.max(
			limitAsMinutes,
			true,
			PApiPrimitiveTypes.Minutes,
			undefined,
			'Die Pause war länger als die Arbeitszeit? Witzbold ;)',
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		).fn({value: controlValueAsMinutes} as AbstractControl);
	}

	private refreshInitialEarnings() : void {
		assumeNonNull(this.formGroup);
		if (!this.formGroup.get('hourlyEarnings')) return;
		if (!this.formGroup.get('memberId')?.value) return;
		if (!this.formGroup.get('shiftModelId')?.value) return;

		const SHIFTMODEL_ID = this.formGroup.get('shiftModelId')!.value;
		const SHIFTMODEL = this.api.data.shiftModels.get(SHIFTMODEL_ID);
		if (!SHIFTMODEL) {
			this.console.error(`Could not find shiftModel ${SHIFTMODEL_ID.toString()} in list of ${this.api.data.shiftModels.length} shiftModels`);
			return;
		}

		const memberId : Id = this.formGroup.get('memberId')!.value;
		const ASSIGNABLE_MEMBER = SHIFTMODEL.assignableMembers.getByMemberId(memberId);

		// Member is not assignable?
		// NOTE: Mil: Man kann (gewollt) alle Mitarbeiter für alle Tätigkeiten auswählen. Auch die die nicht assignable sind.
		// Deswegen ist das ein valider Fall.
		if (ASSIGNABLE_MEMBER === null) {
			if (this.item.isNewItem()) this.formGroup.get('hourlyEarnings')?.setValue(undefined);
			return;
		}

		const HOURLY_EARNINGS = ASSIGNABLE_MEMBER.attributeInfoHourlyEarnings.value;
		if (HOURLY_EARNINGS !== null) {
			this.formGroup.get('hourlyEarnings')!.setValue(HOURLY_EARNINGS);
		} else {
			if (this.item.isNewItem()) this.formGroup.get('hourlyEarnings')!.setValue(undefined);
		}
	}

	/**
	 * Init modal
	 */
	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(success ?: () => void) : void {
		if (!this.item.isNewItem()) {
			this.item.loadDetailed({
				success: () : void => {
					this.initFormGroup();
					if (success) { success(); }
				},
			});
		} else {
			this.initFormGroup();
			if (success) { success(); }
		}
	}

	/**
	 * Remove Item of this Detail page
	 */
	public removeItem() : void {
		this.formGroup = null;
		this.api.data.workingTimes.removeItem(this.item);

		this.pRouterService.navBack();
		this.api.save({
			success : () : void => {
			},
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showForm() : boolean {
		if (!this.me.isLoaded()) return false;
		if (!this.api.isLoaded()) return false;
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (!this.item) {
			this.console.error('type definition wrong?');
			return false;
		}
		if (!this.item.rawData) return false;
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get memberName() : string | null {
		if (!this.item.attributeInfoMemberId.value) return '';
		assumeDefinedToGetStrictNullChecksRunning(this.item.memberId, 'this.item.memberId');
		if (!this.api.isLoaded()) return '';
		const MEMBER = this.api.data.members.get(this.item.memberId);
		if (MEMBER) return `${MEMBER.firstName} ${MEMBER.lastName}`;
		return null;
	}

	/**
	 * Save this item
	 */
	public saveItem() : void {
		if (!this.item.isNewItem()) return;
		this.onAddItem.emit(this.item);
		this.pRouterService.navBack();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get userCanWrite() : boolean {
		return !!this.rightsService.isOwner;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftModelsForDropdown() : SchedulingApiShiftModels {
		return this.api.data.shiftModels.filterBy(item => !item.trashed);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get relatedShiftModel() : SchedulingApiShiftModel | null {
		if (!this.item.attributeInfoShiftModelId.value) return null;
		if (!this.api.isLoaded()) return null;
		const model = this.api.data.shiftModels.get(this.item.shiftModelId);
		if (!model) return null;
		return model;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftModelColor() : string | null {
		if (!this.relatedShiftModel?.color) return null;
		return `#${this.relatedShiftModel.color}`;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftModelName() : string | undefined {
		if (!this.relatedShiftModel) return undefined;
		return this.relatedShiftModel.name;
	}
}
