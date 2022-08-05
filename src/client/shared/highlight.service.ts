import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SchedulingApiShift, SchedulingApiHoliday } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiAbsence } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '../../shared/core/log.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { SchedulingApiBirthday } from '../scheduling/shared/api/scheduling-api-birthday.service';
import { SchedulingApiWorkingTimes, SchedulingApiWorkingTime } from '../scheduling/shared/api/scheduling-api-working-time.service';
import { PWishesService } from '../scheduling/wishes.service';

type HighlightItemType =
	SchedulingApiShift |
	SchedulingApiMember |
	SchedulingApiShiftModel |
	SchedulingApiAbsence |
	SchedulingApiHoliday |
	SchedulingApiBirthday |
	SchedulingApiWorkingTime |
	SchedulingApiWorkingTimes;

@Injectable()
export class HighlightService {

	/**
	 * The element that defines what needs to be highlighted
	 */
	private el : HighlightItemType | null = null;

	private timestampOfAbsencePart : number | null = null;
	public onChange : Subject<void> = new Subject<void>();

	constructor(
		private pWishesService : PWishesService,
		private console : LogService,
	) {
	}

	/**
	 * Set provided item as the highlighted one
	 * @param input Highlighted Element
	 * @param timestampOfAbsencePart Date of the clicked absence
	 */
	public setHighlighted(
		input : HighlightItemType | null,
		timestampOfAbsencePart ?: number,
	) : void {
		if ((
			input instanceof SchedulingApiAbsence ||
			input instanceof SchedulingApiHoliday
		) && !timestampOfAbsencePart) {
			throw new Error('timestampOfAbsencePart must be defined for absence || holiday');
		}
		this.timestampOfAbsencePart = timestampOfAbsencePart ?? null;
		this.el = input;
		this.onChange.next();
	}

	/**
	 * Clear all highlighting
	 */
	public clear() : void {
		this.setHighlighted(null);
	}

	/**
	 * Check if given item is the highlighted one
	 */
	public isHighlighted(
		input : HighlightItemType | null,
		timestampOfAbsencePart ?: number,
	) : boolean {
		if (timestampOfAbsencePart && timestampOfAbsencePart !== this.timestampOfAbsencePart) {
			return false;
		}
		return this.el === input;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isMuted(
		item : HighlightItemType,
	) : boolean {
		if (item instanceof SchedulingApiShiftModel) {
			return this.isMutedShiftModel(item);
		}

		if (item instanceof SchedulingApiHoliday) {
			return this.isMutedHoliday(item);
		}

		if (item instanceof SchedulingApiAbsence) {
			return this.isMutedAbsence(item);
		}

		if (item instanceof SchedulingApiBirthday) {
			return this.isMutedMember(item.memberId);
		}

		if (item instanceof SchedulingApiMember) {
			return this.isMutedMember(item);
		}

		if (item instanceof SchedulingApiShift) {
			return this.isMutedShift(item);
		}

		if (item instanceof SchedulingApiWorkingTime) {
			return this.isMutedWorkingTime(item);
		}

		if (item instanceof SchedulingApiWorkingTimes) {
			return this.isMutedWorkingTimes(item);
		}

		this.console.error('Could not determine if item is muted');
		return false;
	}

	private isMutedShiftModel(item : SchedulingApiShiftModel) : boolean {
		if (this.el instanceof SchedulingApiShiftModel) {
			return !this.el.id.equals(item.id);
		}
		if (this.el instanceof SchedulingApiShift) {
			return !this.el.model.id.equals(item.id);
		}
		return false;
	}

	private isMutedHoliday(item : SchedulingApiHoliday) : boolean {
		if (this.el instanceof SchedulingApiHoliday) {
			assumeNonNull(this.el.rawData, 'this.el.rawData', 'PLANO-FE-4MY');
			assumeNonNull(item.rawData, 'item.rawData', 'PLANO-FE-4MY');
			return this.el.name !== item.name;
		}
		if (this.el instanceof SchedulingApiAbsence) {
			return true;
		}
		if (this.el instanceof SchedulingApiShift) {
			return true;
		}
		if (this.el instanceof SchedulingApiShiftModel) {
			return true;
		}
		if (this.el instanceof SchedulingApiMember) {
			return true;
		}
		return false;
	}

	private isMutedAbsence(item : SchedulingApiAbsence) : boolean {
		if (this.el instanceof SchedulingApiHoliday) {
			return true;
		}
		if (this.el instanceof SchedulingApiAbsence) {
			return !this.el.id.equals(item.id);
		}
		if (this.el instanceof SchedulingApiShift) {
			return !this.el.assignedMemberIds.contains(item.memberId);
		}
		if (this.el instanceof SchedulingApiShiftModel) {
			return true;
		}
		if (this.el instanceof SchedulingApiMember) {
			return !this.el.id.equals(item.memberId);
		}
		return false;
	}

	private isMutedMember(item : SchedulingApiMember | Id) : boolean {
		if (this.el instanceof SchedulingApiHoliday) {
			return true;
		}
		const id = item instanceof Id ? item : item.id;
		if (this.el instanceof SchedulingApiShift) {
			return !this.el.assignedMemberIds.contains(id);
		}
		if (this.el instanceof SchedulingApiMember) {
			return !this.el.id.equals(id);
		}
		if (this.el instanceof SchedulingApiAbsence) {
			return !this.el.memberId.equals(id);
		}
		if (item instanceof SchedulingApiMember) {
			return this.showWishIcon(item) && this.pWishesService.getWish(item) === false;
		}
		return false;
	}

	private isMutedShift(item : SchedulingApiShift) : boolean {
		if (this.el instanceof SchedulingApiHoliday) {
			return true;
		}
		if (this.el instanceof SchedulingApiAbsence) {
			return !item.assignedMemberIds.contains(this.el.memberId);
		}
		if (this.el instanceof SchedulingApiMember) {
			return !item.assignedMembers.contains(this.el);
		}
		if (this.el instanceof SchedulingApiShift) {
			return !item.id.equals(this.el.id);
		}
		if (this.el instanceof SchedulingApiShiftModel) {
			return !item.shiftModelId.equals(this.el.id);
		}
		return this.showWishIcon(item) && this.pWishesService.getWish(item) === false;
	}

	private isMutedWorkingTime(item : SchedulingApiWorkingTime) : boolean {
		if (!this.el) return false;
		if (this.el instanceof SchedulingApiShiftModel) {
			return !this.el.id.equals(item.shiftModelId);
		}
		if (this.el instanceof SchedulingApiHoliday) return false;
		if (this.el instanceof SchedulingApiAbsence) return false;
		if (this.el instanceof SchedulingApiMember) return !this.el.id.equals(item.memberId);
		if (this.el instanceof SchedulingApiShift) return false;
		if (this.el instanceof SchedulingApiWorkingTime) return false;
		if (this.el instanceof SchedulingApiWorkingTimes) return false;

		this.console.error('Could not determine if item is muted');
		return false;
	}

	private isMutedWorkingTimes(items : SchedulingApiWorkingTimes) : boolean {
		if (!this.el) return false;
		if (this.el instanceof SchedulingApiShiftModel) {
			for (const item of items.iterable()) {
				if (!this.el.id.equals(item.shiftModelId)) continue;
				return false;
			}
			return true;
		}
		if (this.el instanceof SchedulingApiHoliday) return false;
		if (this.el instanceof SchedulingApiAbsence) return false;
		if (this.el instanceof SchedulingApiMember) {
			for (const item of items.iterable()) {
				if (!this.el.id.equals(item.memberId)) continue;
				return false;
			}
			return true;
		}
		if (this.el instanceof SchedulingApiShift) return false;
		if (this.el instanceof SchedulingApiWorkingTime) return false;
		if (this.el instanceof SchedulingApiWorkingTimes) return false;

		this.console.error('Could not determine if item is muted');
		return false;
	}

	/**
	 * The element that defines what needs to be highlighted
	 */
	public get highlightedItem() : HighlightItemType | null {
		return this.el;
	}

	/**
	 * Should the wish-icon be visible or not?
	 */
	public showWishIcon(item : HighlightItemType) : boolean {
		if (!this.el) return false;
		if (item instanceof SchedulingApiShift && this.el instanceof SchedulingApiShift) return false;
		if (item instanceof SchedulingApiMember && this.el instanceof SchedulingApiMember) return false;
		if (this.el instanceof SchedulingApiShiftModel) return false;
		if (this.el instanceof SchedulingApiAbsence) return false;
		if (this.el instanceof SchedulingApiHoliday) return false;

		return true;
	}
}
