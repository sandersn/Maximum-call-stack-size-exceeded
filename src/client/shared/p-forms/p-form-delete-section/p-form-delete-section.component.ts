import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { SectionWhitespace } from '../../page/section/section.component';

/**
 * @deprecated
 * Use a p-dropdown in the p-subheader instead.
 *
 * TODO: find another solution for p-form-delete-section for tariffs or paymentmethods
 */
@Component({
	selector: 'p-form-delete-section',
	templateUrl: './p-form-delete-section.component.html',
	styleUrls: ['./p-form-delete-section.component.scss'],
})
export class PFormDeleteSectionComponent {
	public readonly CONFIG : typeof Config = Config;

	@Output() public onRemove : EventEmitter<Event> = new EventEmitter<Event>();
	@Input('label') private _label : string | null = null;
	@Input('btnLabel') private _btnLabel : string | null = null;
	@Input() public disabled : boolean = false;
	@Input('modalText') private _modalText : string | null = null;

	constructor(
		private localize : LocalizePipe,
	) {}

	public SectionWhitespace = SectionWhitespace;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get label() : string {
		if (this._label) return this._label;
		if (this._btnLabel) return this._btnLabel;
		return this.localize.transform('Löschen');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get btnLabel() : string {
		if (this._btnLabel) return this._btnLabel;
		return this.label;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get modalText() : string {
		if (this._modalText) return this._modalText;
		if (this._label) return this._label;
		return this.localize.transform('Löschen');
	}
}
