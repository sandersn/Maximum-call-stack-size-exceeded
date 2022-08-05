import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PBackgroundColorEnum, PThemeEnum } from '../../bootstrap-styles.enum';

export type StickyNoteBackgroundStyles = PThemeEnum.PRIMARY | PThemeEnum.DARK | PBackgroundColorEnum.WHITE;
const initialBackgroundStyle : StickyNoteBackgroundStyles = PBackgroundColorEnum.WHITE;

@Component({
	selector: 'p-sticky-note',
	templateUrl: './sticky-note.component.html',
	styleUrls: ['./sticky-note.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyNoteComponent {
	@Input() public showDot : boolean = false;

	private _backgroundColor : StickyNoteBackgroundStyles = initialBackgroundStyle;

	/**
	 * The defined backgroundColor decides which icon should be shown for best contrast results
	 */
	@Input() public set backgroundColor(input : StickyNoteBackgroundStyles | null) {
		if (input === null) {
			if (this._backgroundColor !== initialBackgroundStyle) this._backgroundColor = initialBackgroundStyle;
			return;
		}
		this._backgroundColor = input;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get backgroundColor() : StickyNoteBackgroundStyles | null {
		return this._backgroundColor;
	}
	@Input() public height : string = '24';
	@Input() public displayBlock : boolean = false;

	constructor() {
	}

	public PBackgroundColorEnum = PBackgroundColorEnum;
	public PThemeEnum = PThemeEnum;
}
