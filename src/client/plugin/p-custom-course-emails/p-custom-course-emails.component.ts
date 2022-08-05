/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { SchedulingApiService } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { SchedulingApiCustomBookableMail } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { assumeNonNull } from '../../../shared/core/null-type-utils';

@Component({
	selector: 'p-custom-course-emails',
	templateUrl: './p-custom-course-emails.component.html',
	styleUrls: ['./p-custom-course-emails.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PCustomCourseEmailsComponent implements AfterContentInit {
	public formGroup : PFormGroup | null = null;
	public modalRef : NgbModalRef | null = null;

	constructor(
		public api : SchedulingApiService,
		public accountApi : AccountApiService,
		private validators : ValidatorsService,
		private pFormsService : PFormsService,
		public modalService : ModalService,
		private router : Router,
	) {
		// eventTypes.eventTypesObjects
		// api.data.customBookableMails
		// SchedulingApiCustomBookableMailEventType.BOOKED
	}

	public Config = Config;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getDeleteModal(deleteWarning : any) : (
		success ?: () => void,
		dismiss ?: () => void,
	) => void {
		return this.modalService.getEditableHook(deleteWarning, {
			theme: PThemeEnum.DANGER,
		});
	}

	public ngAfterContentInit() : void {
		this.initFormGroup();
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const tempFormGroup = this.pFormsService.group({});

		// eslint-disable-next-line literal-blacklist/literal-blacklist
		this.pFormsService.addControl(tempFormGroup, 'bookableMailsSenderName',
			{
				value: this.accountApi.data.bookableMailsSenderName,
				disabled: false,
			},
			[this.validators.required(this.accountApi.data.attributeInfoBookableMailsSenderName.primitiveType)],
			(value : string) => {
				this.accountApi.data.bookableMailsSenderName = value;
			},
		);

		this.formGroup = tempFormGroup;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/ban-types */
	public get customBookableMailsArray() : UntypedFormArray {
		assumeNonNull(this.formGroup);
		// eslint-disable-next-line literal-blacklist/literal-blacklist, @typescript-eslint/ban-types
		return this.formGroup.get('customBookableMailsArray') as UntypedFormArray;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeItem(
		item : SchedulingApiCustomBookableMail,
	) : void {
		this.api.data.customBookableMails.removeItem(item);
	}

	/**
	 * Create a new absence entry for a member
	 */
	public showItemDetail( customBookableMail ?: SchedulingApiCustomBookableMail ) : void {
		if (customBookableMail) {
			this.router.navigate([`/client/email/${customBookableMail.id.toString()}`]);
		} else {
			this.router.navigate(['/client/email/']);
		}
	}

}
