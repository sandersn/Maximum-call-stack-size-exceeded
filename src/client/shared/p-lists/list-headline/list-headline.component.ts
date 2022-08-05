import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { PThemeEnum } from '../../bootstrap-styles.enum';

/**
 * @deprecated remove the darf/macht stuff from this component or use another one.
 */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'list-headline',
	templateUrl: './list-headline.component.html',
	styleUrls: ['./list-headline.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHeadlineComponent {
	@Input() public text : string = '';
	@Input() public textTooltipHtml : string | undefined = undefined;
	@Input() public showMembersHeadlineCardOptions : boolean = false;
	@Input() public showHearts : boolean = false;
	@Input() public headlineIconAlign : 'left' | null = null;
	@Input() public theme : PThemeEnum.DANGER | null = null;

	@Output() public onClick : EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

	constructor() {}

	public PThemeEnum = PThemeEnum;

	/**
	 * Is there a (onClick)="…" on this component?
	 */
	public get hasOnClickBinding() : boolean {
		return this.onClick.observers.length > 0;
	}
}
