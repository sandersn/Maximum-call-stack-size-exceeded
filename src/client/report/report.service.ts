
import { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { Id } from '@plano/shared/api/base/id';
import { assumeNonNull } from '../../shared/core/null-type-utils';

@Injectable()
export class ReportService implements OnDestroy {
	private uncollapsedItemIds : Id[] | null = null;

	constructor(
	) {
		this.initValues();
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		if (this.uncollapsedItemIds === null) this.uncollapsedItemIds = [];
	}

	/**
	 * Check if member is collapsed
	 */
	public isCollapsed(memberId : Id) : boolean {
		return !this.uncollapsedItemIdsContains(memberId);
	}

	/**
	 * Toggle collapsed state
	 */
	public toggle(memberId : Id) : void {
		if (this.isCollapsed(memberId)) {
			this.uncollapse(memberId);
		} else {
			this.collapse(memberId);
		}
	}

	/**
	 * Mark member as not collapsed
	 */
	public uncollapse(memberId : Id) : void {
		if (!this.uncollapsedItemIdsContains(memberId)) {
			assumeNonNull(this.uncollapsedItemIds);
			this.uncollapsedItemIds.push(memberId);
		}
	}

	/**
	 * Mark member as collapsed
	 */
	public collapse(memberId : Id) : void {
		const index = this.indexOfUncollapsedItem(memberId);
		if (this.uncollapsedItemIdsContains(memberId)) {
			assumeNonNull(this.uncollapsedItemIds);
			this.uncollapsedItemIds.splice(index, 1);
		}
	}

	private uncollapsedItemIdsContains(memberId : Id) : boolean {
		const index = this.indexOfUncollapsedItem(memberId);
		return index > -1;
	}

	private indexOfUncollapsedItem(memberId : Id) : number {
		if (!this.uncollapsedItemIds) return -1;
		for (const uncollapsedItemId of this.uncollapsedItemIds) {
			if (!uncollapsedItemId.equals(memberId)) continue;
			return this.uncollapsedItemIds.indexOf(uncollapsedItemId);
		}
		return -1;
	}

	public ngOnDestroy() : void {
		this.unload();
	}

	/**
	 * Clear all stored values of this service
	 */
	public unload() : void {
		this.uncollapsedItemIds = [];
	}

}
