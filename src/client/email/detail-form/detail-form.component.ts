import { AfterContentInit, TemplateRef } from '@angular/core';
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { EventTypesService } from '@plano/client/plugin/p-custom-course-emails/event-types.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiCustomBookableMail, SchedulingApiCustomBookableMailEventType } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidationErrors } from '@plano/shared/core/validators.types';

@Component({
	selector: 'p-detail-form[item]',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent implements AfterContentInit, DetailFormComponentInterface<SchedulingApiCustomBookableMail<'validated' | 'draft'>> {
	@Input() public item ! : SchedulingApiCustomBookableMail<'draft' | 'validated'>;
	public formGroup : DetailFormComponentInterface['formGroup'] | null = null;

	constructor(
		public api : SchedulingApiService,
		private pFormsService : PFormsService,
		private pRouterService : PRouterService,
		private validators : ValidatorsService,
		private asyncValidators : AsyncValidatorsService,
		private modalService : ModalService,
		public eventTypes : EventTypesService,
		private localize : LocalizePipe,
	) {
		// this.booking.model.currentCourseParticipantCount
		// this.booking.rawData
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(success ?: () => void) : void {
		if (!this.item.isNewItem()) {
			this.item.loadDetailed({
				success: () => {
					this.initValues();
					this.initFormGroup();
					if (success) { success(); }
				},
			});
		} else {
			this.initValues();
			this.initFormGroup();
			if (success) { success(); }
		}
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }
		const newFormGroup = this.pFormsService.group({});

		const item = this.item;
		this.pFormsService.addControl(newFormGroup, 'reference',
			{
				value: item,
				disabled: false,
			},
		);
		this.pFormsService.addControl(newFormGroup, 'name',
			{
				value: item.name,
				disabled: false,
			},
			[
				this.validators.required(item.attributeInfoName.primitiveType),
			],
			(value : string) => {
				item.name = value;
			},
		);
		this.pFormsService.addControl(newFormGroup, 'eventType',
			{
				value: item.eventType,
				disabled: false,
			},
			[
				this.validators.required(item.attributeInfoEventType.primitiveType),
			],
			(value : SchedulingApiCustomBookableMailEventType) => {
				item.eventType = value;
			},
		);
		this.pFormsService.addControl(newFormGroup, 'sendToParticipants',
			{
				// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
				value: item.sendToParticipants ? item.sendToParticipants : false,
				disabled: false,
			},
			[
			],
			(value : boolean) => {
				if (item.sendToParticipants === value) return;

				item.sendToParticipants = value;
				newFormGroup.get('sendToParticipants')!.updateValueAndValidity();
				newFormGroup.get('sendToBookingPerson')!.updateValueAndValidity();
			},
		);
		this.pFormsService.addControl(newFormGroup, 'sendToBookingPerson',
			{
				// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
				value: item.sendToBookingPerson ? item.sendToBookingPerson : false,
				disabled: false,
			},
			[
			],
			(value : boolean) => {
				if (item.sendToBookingPerson === value) return;

				item.sendToBookingPerson = value;
				newFormGroup.get('sendToParticipants')!.updateValueAndValidity();
				newFormGroup.get('sendToBookingPerson')!.updateValueAndValidity();
			},
		);
		newFormGroup.get('sendToParticipants')!.setValidators([
			this.validators.required(item.attributeInfoSendToParticipants.primitiveType).fn,
			(control : AbstractControl) : PValidationErrors | null => {
				// FIXME: PLANO-15096
				if (control.value !== true && newFormGroup.get('sendToBookingPerson')!.value !== true) {
					return { noRecipient : {
						name: 'no recipient' as PPossibleErrorNames, // very special error name. dont want to make PPossibleErrorNames entry for it
						primitiveType: null,
					} };
				}
				return null;
			},
		]);
		newFormGroup.get('sendToBookingPerson')!.setValidators([
			this.validators.required(item.attributeInfoSendToBookingPerson.primitiveType).fn,
			(control : AbstractControl) : PValidationErrors | null => {
				// FIXME: PLANO-15096
				if (newFormGroup.get('sendToParticipants')!.value !== true && control.value !== true) {
					return { noRecipient : {
						name: 'no recipient' as PPossibleErrorNames, // very special error name. dont want to make PPossibleErrorNames entry for it
						primitiveType: null,
					} };
				}
				return null;
			},
		]);
		newFormGroup.get('sendToBookingPerson')!.updateValueAndValidity();
		newFormGroup.get('sendToParticipants')!.updateValueAndValidity();
		this.pFormsService.addControl(newFormGroup, 'subjectTemplate',
			{
				value: item.subjectTemplate,
				disabled: false,
			},
			[
				this.validators.required(item.attributeInfoSubjectTemplate.primitiveType),
			],
			(value : string) => {
				item.subjectTemplate = value.replace(/\n/g, '');
			},
		);
		this.pFormsService.addControl(newFormGroup, 'textTemplate',
			{
				value: item.textTemplate,
				disabled: false,
			},
			[
				this.validators.required(item.attributeInfoTextTemplate.primitiveType),
			],
			(value : string) => {
				item.textTemplate = value;
			},
		);
		this.pFormsService.addControl(newFormGroup, 'replyTo',
			{
				value: item.replyTo,
				disabled: false,
			},
			[
				this.validators.required(item.attributeInfoReplyTo.primitiveType),
			],
			(value : string) => {
				item.replyTo = value;
			},
			this.asyncValidators.emailValidAsync(),
		);

		this.formGroup = newFormGroup;
	}

	/**
	 * Remove Item of this Detail page
	 */
	public removeItem() : void {
		this.formGroup = null;
		this.api.data.customBookableMails.removeItem(this.item);

		this.pRouterService.navBack();
		this.api.save({
			success : () => {
			},
		});
	}

	/**
	 * Open a modal with all the placeholders available
	 */
	public showPlaceholdersForEmail(modalContent : TemplateRef<unknown>) : void {
		this.modalService.openModal(modalContent, {
			size: BootstrapSize.LG,
		});
	}

	/**
	 * If string #ZAHLUNGSAUFFORDERUNG# is recommended in textTemplate
	 * and #ZAHLUNGSAUFFORDERUNG# is not part of textTemplate.
	 * show warning
	 */
	public get showZAHLUNGSAUFFORDERUNGHint() : boolean {
		return (
			this.formGroup!.get('eventType')!.value === SchedulingApiCustomBookableMailEventType.BOOKED &&
			!!this.validators.pattern(/#ZAHLUNGSAUFFORDERUNG#/).fn(this.formGroup!.get('textTemplate')!)
		);
	}

	@Output() public onAddItem : EventEmitter<SchedulingApiCustomBookableMail> =
		new EventEmitter<SchedulingApiCustomBookableMail>();

	/**
	 * Save this item
	 */
	public saveItem() : void {
		if (!this.item.isNewItem()) return;
		this.onAddItem.emit(this.item);
		this.pRouterService.navBack();
	}

	/**
	 * Text for trigger button of dropdown for event types.
	 */
	public get eventTypeDropdownLabel() : string {
		if (!this.formGroup!.get('eventType')!.value) return this.localize.transform('Bitte wählen…');
		const text = this.eventTypes.getTitle(this.formGroup!.get('eventType')!.value);
		return this.localize.transform(text!);
	}
}
