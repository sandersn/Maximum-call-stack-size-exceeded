import { AfterContentInit} from '@angular/core';
import { NgZone, ChangeDetectionStrategy, Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { SchedulingApiMember} from '@plano/shared/api';
import { SchedulingApiAbsenceType, SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { PlanoFaIconPoolValues } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { AbsenceService } from '../../absence.service';
import { MemberBadgeComponent } from '../../p-member/member-badges/member-badge/member-badge.component';
import { PFormControl } from '../p-form-control';

type ValueType = SchedulingApiMember | null;

@Component({
	selector: 'p-input-member[shift]',
	templateUrl: './input-member.component.html',
	styleUrls: ['./input-member.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputMemberComponent),
			multi: true,
		},
	],
})
export class InputMemberComponent implements ControlValueAccessor, AfterContentInit {
	@Input() public searchTerm : string | null = null;

	@Input() public control : PFormControl | null = null;
	@Input() public members : SchedulingApiMembers | null = null;
	@Input() private shift ! : SchedulingApiShift;

	public isSelectMode : boolean = false;

	constructor(
		public zone : NgZone,
		private absenceService : AbsenceService,
		private api : SchedulingApiService,
		private pWishesService : PWishesService,
		private changeDetectorRef : ChangeDetectorRef,
		private rightsService : RightsService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isValid() : boolean {
		return (!this.formControl || !this.formControl.invalid);
	}

	/**
	 * set initial values
	 */
	public ngAfterContentInit() : void {
		this.isSelectMode = !this.value;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get membersForList() : SchedulingApiMember[] {
		let members = this.members ?? this.api.data.members;
		members = members.filterBy((item) => !item.trashed);
		if (this.searchTerm) members = members.search(this.searchTerm);
		return members.iterableSortedBy([
			(item) => item.lastName,
			(item) => item.firstName,
			(item) => -this.pWishesService.getWish(item)!,
		]);
	}

	/**
	 * Icon of the members absence
	 */
	public absenceTypeIconName(memberId : Id) : PlanoFaIconPoolValues | null {
		return this.absenceService.absenceTypeIconName(memberId, this.shift);
	}

	/**
	 * Icon of the members absence
	 */
	public absenceType(memberId : Id) : MemberBadgeComponent['absenceType'] {
		if (this.shift.assignedMembers.get(memberId)?.trashed) return 'trashed';
		const type = this.absenceService.absenceType(memberId, this.shift);
		return type === SchedulingApiAbsenceType.OTHER ? null : type ?? null;
	}

	public clicked : boolean = false;

	/**
	 * Animate this input when value changes
	 */
	private animateSuccessButton() : void {
		this.clicked = true;
		this.waitForAnimation(() => {
			this.clicked = false;
		});
	}

	/**
	 * Wait for animation
	 */
	private waitForAnimation(callback : () => void) : void {
		this.zone.runOutsideAngular(() => {
			window.setTimeout(() => {
				this.zone.run(() => {
					callback();
				});
			}, 600);
		});
	}

	/**
	 * Toggle if user is about to select a new/other member
	 */
	public toggleIsSelectMode() : void {
		if (this.disabled) return;
		if (!this.isSelectMode) {
			this.startSelectMode();
		}	else {
			this.endSelectMode();
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public startSelectMode() : void {
		if (this.disabled) return;
		this.searchTerm = null;
		if (this.value) this.value = null;
		this.isSelectMode = true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public endSelectMode() : void {
		if (this.disabled) return;
		this.searchTerm = this.value ? `${this.value.firstName} ${this.value.lastName}` : null;
		this.isSelectMode = false;
	}

	/**
	 * Set new selected member as value
	 */
	public onClickMember(member : SchedulingApiMember) : void {
		this.animateSuccessButton();
		this.value = member;
		this.toggleIsSelectMode();
	}

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() public formControl : PFormControl | null = null;

	private _value : ValueType | null = null;
	public onChange : (value : ValueType | null) => void = () => {};

	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = value;
		this.onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
		this._value = value;
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * @see ControlValueAccessor['registerOnChange']
	 *
	 * Note that registerOnChange() only gets called if a formControl is bound.
	 * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
	 * the data model has changed.
	 * Note that you call it with the changed data model value.
	 */
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> {
		this.onChange = () => {
			fn(this.value);
		};
	}

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this.disabled === isDisabled) return;
		// Set internal attribute which gets used in the template.
		this.disabled = isDisabled;
		// Refresh the formControl. #two-way-binding
		if (this.formControl && this.formControl.disabled !== this.disabled) {
			this.disabled ? this.formControl.disable() : this.formControl.enable();
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isMe(member : SchedulingApiMember) : boolean {
		return !!this.rightsService.isMe(member.id);
	}
}
