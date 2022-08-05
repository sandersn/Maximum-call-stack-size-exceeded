import { AfterContentChecked } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiAbsence} from '@plano/shared/api';
import { SchedulingApiAbsenceType, SchedulingApiMember, SchedulingApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PMemberBadgeService } from './p-member-badge.service';
import { PThemeEnum } from '../../../bootstrap-styles.enum';

@Component({
	selector: 'p-member-badge',
	templateUrl: './member-badge.component.html',
	styleUrls: ['./member-badge.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberBadgeComponent implements AfterContentChecked {

	/**
	 * Title will be used instead of member name if defined
	 */
	@Input('text') private _text ?: string;

	@Input() private member : SchedulingApiMember | null = null;
	@Input('borderStyle') private _borderStyle : PThemeEnum | undefined = undefined;

	@Input() private absenceType : 'trashed' | SchedulingApiAbsenceType.ILLNESS | SchedulingApiAbsenceType.VACATION | null = null;

	@Input('icon') private _icon : MemberBadgeComponent['icon'] | null = null;
	@Input('iconStyle') private _iconStyle : PThemeEnum | undefined = undefined;

	// TODO: use BootstrapSize here
	@Input() public size : 'small' | 'normal' = 'small';
	@Input() public shadow : boolean = false;

	@Input('firstName') private _firstName ?: string;
	@Input('lastName') private _lastName ?: string;
	@Input('memberId') private _memberId : Id | null = null;
	@Input() public isMe : boolean = false;
	@Input() public alwaysShowMemberInitials : boolean | null = null;

	constructor(
		private pMemberBadgeService : PMemberBadgeService,
		private console : LogService,
		private api : SchedulingApiService,
	) {
	}

	public PThemeEnum = PThemeEnum;

	/** ngAfterContentChecked */
	public ngAfterContentChecked() : void {
		this.initValues();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		if (this.absenceType !== null && this._icon !== null) {
			if (this._icon === 'trash') {
				this.console.error('Remove [icon] here. Set absenceType »trashed«.');
				return;
			}
			this.console.error('You already set absenceType. Icon is most likely unnecessary.');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isEmpty() : boolean {
		return !this.memberName;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get backgroundStyle() : PThemeEnum.PRIMARY | null {
		if (this.isMe) return PThemeEnum.PRIMARY;
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get borderStyle() : PThemeEnum | undefined {

		// don’t set the border style here. Instead use styles from .is-me
		if (this.isMe) return undefined;

		if (this._borderStyle) return this._borderStyle;
		if (this.trashed) return PThemeEnum.DANGER;
		switch (this.absenceType) {
			case 'trashed':
			case SchedulingApiAbsenceType.ILLNESS:
			case SchedulingApiAbsenceType.VACATION:
				return PThemeEnum.DANGER;
			case null:
				return undefined;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get badgeText() : string | null {
		if (this.icon && !this.alwaysShowMemberInitials) return null;
		if (this._text !== undefined) return this._text;
		return this.memberInitials ?? '···';
	}

	private debugHint() : void {
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		this.console.warn('IMPROVE: Add [memberId]="member.id" [firstName]="member.firstName" [lastName]="member.lastName" [absenceType]="\'trashed\'" to make this a dump component.');
	}

	private get firstName() : string | null {
		if (this._firstName !== undefined) return this._firstName;
		if (!this.member) return null;
		this.debugHint();
		return this.member.firstName;
	}

	private get memberId() : Id | null {
		if (this._memberId !== null) return this._memberId;
		if (!this.member) return null;
		this.debugHint();
		return this.member.id;
	}

	private get lastName() : string | null {
		if (this._lastName !== undefined) return this._lastName;
		if (!this.member) return null;
		this.debugHint();
		return this.member.lastName;
	}

	private get trashed() : boolean | null {
		if (this.absenceType === 'trashed') return true;
		if (!this.member) return null;
		this.debugHint();
		return this.member.trashed;
	}

	private get memberInitials() : string | null {
		return this.pMemberBadgeService.getInitials(
			{
				id: this.memberId,
				firstName: this.firstName,
				lastName: this.lastName,
				trashed: this.trashed,
			},
			this.api.isLoaded() ? this.api.data.members : null,
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memberName() : string {
		let result = '';
		if (this.firstName) result += `${this.firstName}`;
		if (this.lastName) result += ` ${this.lastName}`;
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get icon() : SchedulingApiAbsence['typeIconName'] | typeof PlanoFaIconPool.TRASHED | undefined {
		if (this._icon) return this._icon;
		if (this.trashed) return PlanoFaIconPool.TRASHED;
		switch (this.absenceType) {
			case 'trashed':
				return PlanoFaIconPool.TRASHED;
			case SchedulingApiAbsenceType.ILLNESS:
				return PlanoFaIconPool.ITEMS_ABSENCE_ILLNESS;
			case SchedulingApiAbsenceType.VACATION:
				return PlanoFaIconPool.ITEMS_ABSENCE_VACATION;
			case null:
				return undefined;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get iconStyle() : PThemeEnum | undefined {
		if (this._iconStyle) return this._iconStyle;
		return this.borderStyle;
	}
}
