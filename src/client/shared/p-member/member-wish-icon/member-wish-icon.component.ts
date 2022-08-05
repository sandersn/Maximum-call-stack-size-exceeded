import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShiftMemberPrefValue } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { AbsenceService } from '../../absence.service';

@Component({
	selector: 'p-member-wish-icon',
	templateUrl: './member-wish-icon.component.html',
	styleUrls: ['./member-wish-icon.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PMemberWishIconComponent {
	@Input() private shift : SchedulingApiShift | null = null;
	@Input() private member : SchedulingApiMember | null = null;

	constructor(
		private pWishesService : PWishesService,
		public absenceService : AbsenceService,
		private console : LogService,
		private localizePipe : LocalizePipe,
	) {
		this.console.debug('IMPROVE: Make wish-icon component dump');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get item() : SchedulingApiShift | SchedulingApiMember {
		return this.shift ?? this.member!;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get wish() : ReturnType<PWishesService['getWish']> {
		return this.pWishesService.getWish(this.item);
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get title() : string {
		if (this.cannot) return this.localizePipe.transform('Kann nicht');
		if (this.can) return this.localizePipe.transform('Wenn es sein muss');
		if (this.want) return this.localizePipe.transform('Möchte die Schicht');
		return 'Kein Schichtwunsch vorhanden';
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get cannot() : boolean {
		return this.wish === SchedulingApiShiftMemberPrefValue.CANNOT;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get can() : boolean {
		return this.wish === SchedulingApiShiftMemberPrefValue.CAN;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get want() : boolean {
		return this.wish === SchedulingApiShiftMemberPrefValue.WANT;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasBeenAsked() : boolean {
		if (!this.pWishesService.isAssignable(this.item)) return false;
		const member = this.item instanceof SchedulingApiMember ? this.item : this.pWishesService.item as SchedulingApiMember;
		const shift = this.item instanceof SchedulingApiShift ? this.item : this.pWishesService.item as SchedulingApiShift;
		if (this.absenceService.absenceTypeIconName(member.id, shift)) return false;

		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get hasAnswer() : boolean {
		return this.cannot || this.can || this.want || this.hasBeenAsked;
	}
}
