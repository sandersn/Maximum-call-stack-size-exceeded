import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { SchedulingApiShift, SchedulingApiService, SchedulingApiShiftModels, SchedulingApiTodaysShiftDescription } from '@plano/shared/api';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { TimeStampApiShiftModel, TimeStampApiShift } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LogService } from '@plano/shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapRounded } from '../../bootstrap-styles.enum';

type PossibleItemTypes = (
	SchedulingApiShiftModel |
	TimeStampApiShiftModel |
	SchedulingApiShift |
	TimeStampApiShift |
	SchedulingApiTodaysShiftDescription |
	SchedulingApiShiftExchange
);

@Component({
	selector: 'p-color-marker',
	templateUrl: './color-marker.component.html',
	styleUrls: ['./color-marker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorMarkerComponent implements PComponentInterface {
	@Input() public item ?: PossibleItemTypes | null = null;

	@Input() public items ?: SchedulingApiShiftModels;

	@Input('hexColor') private _hexColor : string | null = null;
	@Input('title') private _title ?: string;
	@Input('isPacket') private _isPacket : boolean | null = null;
	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Input() public rounded : BootstrapRounded | 'top-left' | null = null;

	constructor(
		private api : SchedulingApiService,
		private console : LogService,
	) {
		if (Config.DEBUG && this.item instanceof SchedulingApiShiftModel) {
			this.console.debug('IMPROVE: remove ShiftModel from color-marker to make it dumb');
		}
	}

	public BootstrapRounded = BootstrapRounded;

	private shiftModel(item : PossibleItemTypes | undefined) : SchedulingApiShiftModel | null | undefined {
		if (!item) return undefined;

		if (Config.DEBUG && !this.items) {
			if (item instanceof SchedulingApiShiftModel || this.item instanceof TimeStampApiShiftModel) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [shiftModel]="shiftModel" to make this a dump component.');
			}
			if (item instanceof SchedulingApiShift || item instanceof TimeStampApiShift) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [shiftModel]="shift.model" to make this a dump component.');
			}
			if (item instanceof SchedulingApiShiftExchange) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [shiftModel]="shiftExchange.model" to make this a dump component.');
			}
			if (item instanceof SchedulingApiTodaysShiftDescription) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [shiftModel]="todaysShiftDescription.model" to make this a dump component.');
			}
		}

		if (item instanceof SchedulingApiShiftModel || this.item instanceof TimeStampApiShiftModel) {
			return item as SchedulingApiShiftModel;
		}
		if (item instanceof SchedulingApiShift || item instanceof TimeStampApiShift) {
			return item.model as SchedulingApiShiftModel;
		}
		if (item instanceof SchedulingApiShiftExchange) {
			return item.shiftModel;
		}
		if (item instanceof SchedulingApiTodaysShiftDescription) {
			if (!this.api.isLoaded()) return undefined;
			return this.api.data.shiftModels.get(item.id.shiftModelId);
		}

		this.console.warn('Could not get ShiftModel');
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public hexColor(item : PossibleItemTypes | null) : string | null {
		if (this.isLoading) return '#eee';

		// The color for when there is no value
		const NO_VALUE_COLOR = '#eeeeee00';

		if (this._hexColor !== null) {
			const HEX_COLOR_IS_INVALID = !this.hexColorIsValid(this._hexColor);
			if (HEX_COLOR_IS_INVALID) {
				this.console.error(`defined hexadecimal color »${this._hexColor}« is invalid`);
				return null;
			}
			return this._hexColor;
		}

		if (item === null) {
			const itemsColor = this.items?.get(0)?.color;
			if (!itemsColor) return NO_VALUE_COLOR;
			return itemsColor;
		}

		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition -- I dont now why this happens
		if (!item) return NO_VALUE_COLOR;

		if (Config.DEBUG && !this.items) {
			if (item instanceof SchedulingApiShiftModel || this.item instanceof TimeStampApiShiftModel) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [hexColor]="shiftModel.color" to make this a dump component.');
			}
			if (item instanceof SchedulingApiShift || item instanceof TimeStampApiShift) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [hexColor]="shift.color" to make this a dump component.');
			}
			if (item instanceof SchedulingApiShiftExchange) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [hexColor]="shiftExchange.color" to make this a dump component.');
			}
			if (item instanceof SchedulingApiTodaysShiftDescription) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [hexColor]="todaysShiftDescription.color" to make this a dump component.');
			}
		}

		const shiftModel = this.shiftModel(item);
		if (!shiftModel) return null;
		return shiftModel.color;
	}

	private isPacket(item : PossibleItemTypes | null) : boolean | undefined {
		if (this.isLoading) return undefined;

		if (this._isPacket !== null) return this._isPacket;

		if (this.items) {
			const firstShiftModel = this.items.get(0)!;
			if (this.items.length === 1) return firstShiftModel.isPacket;
			const firstShiftModelId = firstShiftModel.id;
			const allShiftModelsAreTheSame = this.items.every(shiftModel => shiftModel.id.equals(firstShiftModelId));
			if (allShiftModelsAreTheSame) {
				return firstShiftModel.isPacket;
			}
			return false;
		}

		if (!item) return undefined;

		if (item instanceof SchedulingApiShiftModel) {
			if (!item.repetition.rawData) return false;
			return item.isPacket;
		}

		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (item instanceof SchedulingApiShift && this._isPacket === null) {
			this.console.debug(`IMPROVE: Add [isPacket]="shift.packetShifts.length" instead of [item]="shift" to make this a dump component.`);
			return !!item.isPacket;
		}

		if (item instanceof SchedulingApiTodaysShiftDescription) {
			this.console.debug('IMPROVE: remove TodaysShiftDescription from color-marker to make it dumb');
			const shift = this.api.data.shifts.get(item.id);
			if (shift === null) throw new Error('Could not find shift');
			return !!shift.packetShifts.length;
		}

		return undefined;
	}

	private hexColorIsValid(input : string) : boolean {
		if (input === 'transparent') return true;
		if (!input.startsWith('#')) return false;
		if (!(input.length === 4 || input.length === 7)) return false;
		return true;
	}

	/**
	 * Determine the color for this item
	 */
	public backgroundColor(item : PossibleItemTypes) : string {
		let result : string;
		const hexColor = this.hexColor(item);
		assumeDefinedToGetStrictNullChecksRunning(hexColor, 'hexColor');
		if (this.hexColorIsValid(hexColor)) {
			result = hexColor;
		} else {
			result = `#${hexColor}`;
		}
		return result;
	}

	/**
	 * Title for this item
	 */
	public title(item : PossibleItemTypes | null = null) : string {
		if (this.isLoading) return '';
		if (this._title !== undefined) return this._title;
		if (item === null) return '';
		if (item instanceof SchedulingApiTodaysShiftDescription) {
			this.console.debug('IMPROVE: remove title(TodaysShiftDescription) from color-marker to make it dumb');
			const shiftModel = this.api.data.shiftModels.get(item.id.shiftModelId);
			if (!shiftModel) throw new Error('shiftModel is not defined');
			return shiftModel.name;
		}
		if (!this.items) {
			if (item instanceof SchedulingApiShiftModel) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [title]="shiftModel.name" to make this a dump component.');
			}
			if (item instanceof SchedulingApiShift) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [title]="shift.name" to make this a dump component.');
			}
			if (item instanceof SchedulingApiShiftExchange) {
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				this.console.debug('IMPROVE: Add [title]="shiftExchange.shiftModel.name" to make this a dump component.');
				return item.shiftModel!.name;
			}
			return item.name;
		}
		if (!(item instanceof SchedulingApiShiftExchange)) {
			return item.name;
		}
		throw new Error('This broke with the ng10 update.');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public hasDots(singleItem : PossibleItemTypes | null) : boolean {
		return !!this.isPacket(singleItem);
	}
}
