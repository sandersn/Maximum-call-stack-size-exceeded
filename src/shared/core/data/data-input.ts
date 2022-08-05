import { Subject } from 'rxjs';
import { NgZone } from '@angular/core';
import { DataInputBase } from './data-input-base';

export class DataInput extends DataInputBase {

	/**
	 * The value is the property name which changed.
	 */
	public readonly onChange : Subject<string | null> = new Subject<string | null>();
	private _dataVersion : number = 0;

	constructor(protected zone : NgZone) {
		super();
	}

	/**
	 * @param change What has changed?
	 */
	public changed(change : string | null | undefined) : void {
		++this._dataVersion;

		// don’t trigger change detection for performance reasons
		this.zone.runOutsideAngular(() => {
			this.onChange.next(change ?? null);
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get dataVersion() : number {
		return this._dataVersion;
	}
}
