import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PShiftExchangeConceptService } from '../p-shift-exchange-concept.service';
import { PShiftExchangeService } from '../shift-exchange.service';

@Component({
	selector: 'p-shift-exchange-btn',
	templateUrl: './p-shift-exchange-btn.component.html',
	styleUrls: ['./p-shift-exchange-btn.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PShiftExchangeBtnComponent {
	@Input() private shiftExchange : SchedulingApiShiftExchange | null = null;
	@Input() private shiftId : ShiftId | null = null;
	@Input() private assignedMember : SchedulingApiMember | null = null;
	@Input() private hideNonCounterBadges : boolean = false;
	@Input() private colorizeIconIfShiftExchangeExists : boolean = false;

	constructor(
		private router : Router,
		private pShiftExchangeConceptService : PShiftExchangeConceptService,
		private rightsService : RightsService,
		private pShiftExchangeService : PShiftExchangeService,
		private localize : LocalizePipe,
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get badgeValue() : string | number | null {
		if (!this.shiftExchange) return null;
		const icon = this.pShiftExchangeConceptService.getBadgeIcon(this.shiftExchange);
		if (icon && !this.hideNonCounterBadges) return icon;
		if (this.shiftExchange.todoCount) return this.shiftExchange.todoCount;
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get icon() : FaIcon {
		if (!this.shiftExchange) {
			if (Config.DEBUG && !this.assignedMember) throw new Error('provide assigned member here');
			if (this.rightsService.isMe(this.assignedMember!.id)) return 'hands-helping';
			return 'briefcase-medical';
		} else if (this.shiftExchange.isIllness && !this.shiftExchange.isBasedOnIllness) {
			return 'briefcase-medical';
		}
		return 'hands-helping';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get title() : string {
		let result : string = '';
		if (this.icon === 'hands-helping') {
			result += this.shiftExchange ? this.localize.transform('Ersatzsuche anzeigen') : this.localize.transform('Ersatz suchen');
		} else if (this.icon === 'briefcase-medical') {
			if (this.shiftExchange) {
				result += this.localize.transform('Krankmeldung anzeigen');
			} else {
				result += this.localize.transform('Krank melden');
				if (

					/** If shift exists, check if user is allowed to manage it */
					// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
					this.shiftExchange &&
					// @ts-expect-error -- BUG: PLANO-18170 Nils… this.shiftExchange can not be defined here!
					this.rightsService.hasManagerRightsForAllShiftRefs(this.shiftExchange.shiftRefs) ||

					/** If shiftId exists, check if user is allowed to manage it */
					this.shiftId &&
					this.rightsService.hasManagerRightsForShiftModel(this.shiftId.shiftModelId)
				) {
					result += ` & ${this.localize.transform('Ersatz suchen')}`;
				}
			}
		} else if (Config.DEBUG) throw new Error('Icon unknown');

		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get style() : PBtnThemeEnum.OUTLINE_DANGER | PBtnThemeEnum.OUTLINE_PRIMARY | PThemeEnum.SECONDARY {
		if (this.icon === 'briefcase-medical' && this.shiftExchange) return PBtnThemeEnum.OUTLINE_DANGER;
		return PThemeEnum.SECONDARY;
	}

	/**
	 * Navigate to the detail page of this item
	 */
	public navToDetailPage() : void {
		if (
			// User wants to edit existing shiftExchange? Go for it!
			!this.shiftExchange
		) {
			assumeNonNull(this.shiftId);
			if (this.pShiftExchangeService.blockedByAssignmentProcessWarningModal(this.shiftId)) return;
		}

		let lastPartOfRoute : string;
		if (this.shiftExchange) {
			lastPartOfRoute = this.shiftExchange.id.toString();
		} else if (this.shiftId) {
			lastPartOfRoute = `create/${this.shiftId.toUrl()}`;
			if (this.assignedMember) {
				lastPartOfRoute += `/member/${this.assignedMember.id.toString()}`;
			}
		} else {
			throw new Error('Could not navigate. Id is missing.');
		}
		this.router.navigate([`/client/shift-exchange/${lastPartOfRoute}/`]);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get iconHasTextPrimaryClass() : boolean {
		return this.icon === 'hands-helping' && !!this.shiftExchange && this.colorizeIconIfShiftExchangeExists;
	}
}
