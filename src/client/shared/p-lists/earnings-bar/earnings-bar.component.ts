import * as chroma from 'chroma-js';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiMember } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

@Component({
	selector: 'p-earnings-bar[member]',
	templateUrl: './earnings-bar.component.html',
	styleUrls: ['./earnings-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class EarningsBarComponent {
	@Input() private expectedMemberEarnings : number | null = null;
	@Input() private member ! : SchedulingApiMember;

	@Input() public extract : 'min' | 'desired' | 'max' | null = null;

	constructor(
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get minOverlayWidth() : number | null {
		if (this.member.attributeInfoMaxMonthlyEarnings.value === null) return null;
		if (this.member.attributeInfoMinMonthlyEarnings.value === null) return null;

		/* TODO: [PLANO-3464] */

		return (100 - this.maxOverlayWidth) / this.member.maxMonthlyEarnings * this.member.minMonthlyEarnings;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get maxOverlayWidth() : number {
		return 5;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get desiredMarkerOffset() : number | null {
		if (this.member.attributeInfoMaxMonthlyEarnings.value === null) return null;
		if (this.member.attributeInfoDesiredMonthlyEarnings.value === null) return null;

		/* TODO: [PLANO-3464] */

		return (100 - this.maxOverlayWidth) / this.member.maxMonthlyEarnings * this.member.desiredMonthlyEarnings;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get valueBarWidth() : number {

		/* TODO: [PLANO-3464] */

		if (this.expectedMemberEarnings && this.expectedMemberEarnings > this.member.maxMonthlyEarnings) {
			return 100;
		} else if (this.expectedMemberEarnings === 0) {
			return 0;
		} else if (
			this.member.attributeInfoMaxMonthlyEarnings.value !== null &&
			this.expectedMemberEarnings !== null
		) {
			return (100 - this.maxOverlayWidth) / this.member.maxMonthlyEarnings * this.expectedMemberEarnings;
		}
		return 0;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get valueBarColor() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.minOverlayWidth, 'this.minOverlayWidth');
		if (this.valueBarWidth < this.minOverlayWidth) return '#ffc596';
		if (this.valueBarWidth > (100 - this.maxOverlayWidth)) return '#d87777';

		// Value is between min and max.
		// Cut min and max and calculate new percentage.
		const newFullWidth = 100 - this.minOverlayWidth - this.maxOverlayWidth;
		const newValue = this.valueBarWidth - this.minOverlayWidth;
		const newPercentage = 100 / newFullWidth * newValue;

		// let newDesiredMarkerPosition = undefined;
		// if (
		// 	this.minOverlayWidth < this.desiredMarkerOffset &&
		// 	this.desiredMarkerOffset < (100 - this.maxOverlayWidth)
		// ) {
		// 	newDesiredMarkerPosition = 100 / newFullWidth * this.desiredMarkerOffset;
		// }
		// if (newDesiredMarkerPosition !== undefined) {
		// 	let floored = Math.floor(newDesiredMarkerPosition / 10);
		// } else {
		// }

		// Define color fading
		const scale = chroma.scale(['#ffc596', '#7aba98', '#7aba98', '#7aba98', '#ffc596']);

		// Get color from fading by percentage
		return scale(newPercentage / 100).hex();
	}
}
