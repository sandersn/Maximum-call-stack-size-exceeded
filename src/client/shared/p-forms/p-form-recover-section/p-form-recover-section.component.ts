import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { SectionWhitespace } from '../../page/section/section.component';

@Component({
	selector: 'p-form-recover-section',
	templateUrl: './p-form-recover-section.component.html',
	styleUrls: ['./p-form-recover-section.component.scss'],
})
export class PFormRecoverSectionComponent {
	public readonly CONFIG : typeof Config = Config;

	@Output() public onOpenModal : EventEmitter<Event> = new EventEmitter<Event>();
	@Output() public onRecover : EventEmitter<Event> = new EventEmitter<Event>();
	@Output() public onDismiss : EventEmitter<Event> = new EventEmitter<Event>();
	@Input('label') private _label : string | null = null;
	@Input('btnLabel') private _btnLabel : string | null = null;
	@Input() public disabled : boolean = false;
	@Input('modalText') private _modalText : string | null = null;
	@Input() public valid : boolean = true;

	constructor(
		private localize : LocalizePipe,
	) {}

	public SectionWhitespace = SectionWhitespace;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get label() : string {
		if (this._label) return this._label;
		if (this._btnLabel) return this._btnLabel;
		return this.localize.transform('Wiederherstellen');
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
		return this.localize.transform('Wiederherstellen');
	}
}
