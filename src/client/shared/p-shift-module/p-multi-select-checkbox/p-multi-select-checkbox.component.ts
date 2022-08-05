import { AfterContentChecked } from '@angular/core';
import { Component, Input, HostBinding, forwardRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { SchedulingApiShiftMemberPrefValue } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { EditableDirective } from '../../p-editable/editable/editable.directive';
import { PCheckboxComponent } from '../../p-forms/p-checkbox/p-checkbox.component';

@Component({
	selector: 'p-multi-select-checkbox',
	templateUrl: './../../p-forms/p-checkbox/p-checkbox.component.html',
	styleUrls: ['./../../p-forms/p-checkbox/p-checkbox.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PMultiSelectCheckboxComponent),
			multi: true,
		},
		EditableDirective,
	],
})
export class PMultiSelectCheckboxComponent extends PCheckboxComponent
	implements ControlValueAccessor, AfterContentChecked {
	protected override attributeInfoRequired = false;

	@HostBinding('class.small')
	@HostBinding('class.justify-content-stretch')
	protected override _alwaysTrue : boolean = true;

	@HostBinding('class.bg-white') private get _bgWhite() : boolean {
		return !this.isColored;
	}

	@HostBinding('style.min-width') private hasMinWidth : string = '2em';

	@HostBinding('class.not-disabled') private get _enabled() : boolean {
		return !this.disabled;
	}

	@HostBinding('class.bg-success') private get _hasBgSuccess() : boolean {
		return this.isWant;
	}
	@HostBinding('class.bg-warning') private get _hasBgWarning() : boolean {
		return this.isWarning;
	}
	@HostBinding('class.bg-danger') private get _hasBgDanger() : boolean {
		return this.isDanger;
	}
	@HostBinding('class.bg-dark') private get _hasBgDark() : boolean {
		return this.isDark;
	}

	@Input() public meIsAssignable : boolean = false;
	@Input() private myPref : SchedulingApiShiftMemberPrefValue | null = null;
	@Input() private wishPickerMode : boolean = false;
	@Input() private earlyBirdMode : boolean = false;

	constructor(
		changeDetectorRef : ChangeDetectorRef,
		console : LogService,
		pFormsService : PFormsService,
		modalService : ModalService,
	) {
		super(changeDetectorRef, console, pFormsService, modalService);

		// NOTE: This causes problems when selecting items in shift-picker on mobile
		// this.onClick.subscribe((event : Event) => { event.stopPropagation(); });

		this.hasButtonStyle = false;
		this._size = BootstrapSize.SM;
		this._readMode = false;
	}

	public override ngAfterContentChecked() : never {
		this.textWhite = this.isColored;
		return super.ngAfterContentChecked();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isColored() : boolean {
		return (
			this.wishPickerMode &&
			!this.disabled &&
			this.meIsAssignable
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isDark() : boolean {
		return this.isColored && !this.myPref;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isWant() : boolean {
		return this.isColored && this.myPref === SchedulingApiShiftMemberPrefValue.WANT;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isWarning() : boolean {
		return this.isColored && this.myPref === SchedulingApiShiftMemberPrefValue.CAN;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isDanger() : boolean {
		return this.isColored && this.myPref === SchedulingApiShiftMemberPrefValue.CANNOT;
	}

	@HostBinding('class.d-none') private get _thereIsNoUsefulMultiSelectCase() : boolean {
		if (this.earlyBirdMode) return true;
		return false;
	}
}
