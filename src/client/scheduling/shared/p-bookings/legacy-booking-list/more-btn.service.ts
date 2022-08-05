import { Injectable } from '@angular/core';
import { PServiceInterface } from '@plano/shared/core/p-service.interface';
import { LogService } from '../../../../../shared/core/log.service';
import { assumeNonNull } from '../../../../../shared/core/null-type-utils';

interface PMoreBtnTextObject {
	index1 : string | null,
	index2 : string | null,
	index3 : string | null,
	[key : string] : string | null,
}

@Injectable()
export class PMoreBtnService implements PServiceInterface {
	private visibleItemsCounterSteps : number | null = null;
	private visibleItemsCounter : number | null = null;

	/**
	 * How many items are available all in all?
	 */
	private totalItemsCounter : number | null = null;

	constructor(
		private console : LogService,
	) {
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues(itemsCounter ?: number | null) : void {
		if (this.visibleItemsCounter === null) this.visibleItemsCounter = 50;
		if (this.visibleItemsCounterSteps === null) this.visibleItemsCounterSteps = this.visibleItemsCounter;
		if (itemsCounter !== undefined) this.totalItemsCounter = itemsCounter;
	}

	/**
	 * Validate if required attributes are set and
	 * if the set values work together / make sense / have a working implementation.
	 */
	private validateValues() : void {
		assumeNonNull(this.totalItemsCounter, 'totalItemsCounter');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public resetValues(itemsCounter : number) : void {
		this.validateValues();
		this.visibleItemsCounter = this.visibleItemsCounterSteps;
		this.totalItemsCounter = itemsCounter;
	}

	/**
	 * What is the counter of the next item that will be loaded in the next section if items
	 */
	private get nextSectionIndexStart() : number | null {
		this.validateValues();
		if (this.visibleItemsCounter === null) return null;
		return this.visibleItemsCounter + 1;
	}

	/**
	 * How many items will be visible after user loaded the next section
	 */
	private get nextSectionIndexEnd() : number | null {
		this.validateValues();
		if (this.nextSectionIndexStart === null) return null;
		if (this.visibleItemsCounterSteps === null) return null;
		if (this.totalItemsCounter === null) return null;
		if (this.visibleItemsCounter === null) return null;
		if ((this.nextSectionIndexStart + this.visibleItemsCounterSteps) >= this.totalItemsCounter) return this.totalItemsCounter;
		return this.visibleItemsCounter + this.visibleItemsCounterSteps;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get btnTextObj() : PMoreBtnTextObject {
		this.validateValues();
		if (this.nextSectionIndexStart && this.nextSectionIndexEnd && this.nextSectionIndexStart > this.nextSectionIndexEnd) {
			this.console.error('More-Button: SectionEnd ist higher than SectionStart 🤔');
		}
		return {
			index1: this.nextSectionIndexStart?.toString() ?? null,
			index2: this.nextSectionIndexEnd?.toString() ?? null,
			index3: this.totalItemsCounter?.toString() ?? null,
		};
	}

	/**
	 * Counter of how many items should be visible.
	 */
	public get visibleItemsAmount() : number | null {
		return this.visibleItemsCounter;
	}

	/**
	 * Run this when user clicks button
	 */
	public showMore() : void {
		this.validateValues();
		if (this.visibleItemsCounterSteps === null) return;
		if (this.visibleItemsCounter === null) return;
		this.visibleItemsCounter = this.visibleItemsCounter + this.visibleItemsCounterSteps;
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.visibleItemsCounter = null;
		this.visibleItemsCounterSteps = null;
	}
}
