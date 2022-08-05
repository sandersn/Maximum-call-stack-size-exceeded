import { trigger, state, style, animate, transition } from '@angular/animations';
import { AfterContentInit, AfterViewInit} from '@angular/core';
import { Component, Input, ViewChild, ElementRef, HostBinding, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ANIMATION_SPEED_FAST } from '../../../animations';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { BootstrapSize } from '../bootstrap-styles.enum';

export type PCollapsibleEvent = {event : MouseEvent, collapsedState : boolean};

export const pCollapsibleAnimationSpeed = ANIMATION_SPEED_FAST;

/**
 * @example with content
 * <p-collapsible>
 * 	<span trigger>Trigger</span>
 * 	<div content>Content</div>
 * </p-collapsible>
 *
 * @example without content
 * 	<p-collapsible #collapsibleTrigger>
 * 		<span trigger>Trigger</span>
 * 	</p-collapsible>
 * 	<div class="fancy-thing" *ngIf="!collapsibleTrigger.collapsed"></div>
 */

@Component({
	selector: 'p-collapsible',
	templateUrl: './p-collapsible.component.html',
	styleUrls: ['./p-collapsible.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger(
			'slideOpen',
			[
				state('false, void', style({ height: '0px', overflow: 'hidden' })),
				state('true', style({ height: '*' })),
				transition( 'true <=> false', [animate(pCollapsibleAnimationSpeed)]),
			],
		),
	],
})
export class PCollapsibleComponent implements AfterContentInit, AfterViewInit {
	@HostBinding('class.border-danger')
	@Input() public hasDanger : boolean = false;

	@HostBinding('class.border-primary')
	@Input() public borderPrimary : boolean = false;

	/**
	 * Visual size of this component.
	 * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
	 */
	@Input() public size : BootstrapSize.SM | BootstrapSize.LG = BootstrapSize.LG;

	@ViewChild('ngContentContainer') private ngContentContainer ?: ElementRef<HTMLElement>;

	@Output() public collapsedChange = new EventEmitter<PCollapsibleEvent>();

	constructor() {
	}

	@HostBinding('class.card') private _alwaysTrue = true;

	@HostBinding('class.mb-1') private get sizeIsSm() : boolean {
		return this.size === 'sm';
	}


	@HostBinding('class.collapsed')
	@Input() public collapsed : boolean = true;

	@HostBinding('class.shadow-lg')
	private get hasShadowLg() : boolean {
		return !this.collapsed && this.size === BootstrapSize.LG;
	}

	@HostBinding('class.shadow')
	private get hasShadow() : boolean {
		return !this.collapsed && this.size === BootstrapSize.SM;
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	public ngAfterContentInit() : void {
	}

	@HostBinding('class.has-content')
	public hasContent : boolean = false;

	public ngAfterViewInit() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.ngContentContainer, 'ngContentContainer');
		this.hasContent = !!this.ngContentContainer.nativeElement.previousSibling;
	}

	/**
	 * Toggle the state if this is collapsed or not.
	 */
	private setCollapsed(input : PCollapsibleEvent) : void {
		this.collapsed = input.collapsedState;
		this.collapsedChange.emit(input);
	}

	/**
	 * Toggle the state if this is collapsed or not.
	 */
	public toggle(event : MouseEvent) : void {
		this.setCollapsed({event: event, collapsedState: !this.collapsed});
	}

	// /**
	//  * Makes this component more accessible
	//  */
	// public handleKeyup(event : KeyboardEvent) : void {
	// 	event.stopPropagation();
	// 	switch (event.key) {
	// 		case 'Enter':
	// 			this.toggle();
	// 			break;
	// 		case 'Escape':
	// 			this.setCollapsed(true);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }
}
