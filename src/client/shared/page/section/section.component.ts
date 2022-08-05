
import { AfterViewInit } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { PThemeEnum } from '../../bootstrap-styles.enum';

export enum SectionWhitespace {
	MEDIUM, // TODO: Rename to MD
	NONE,
	LG, // Equal to p-tabs LG
}

@Component({
	selector: 'p-section',
	templateUrl: './section.component.html',
	styleUrls: ['./section.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PFormSectionComponent implements AfterViewInit {
	@HostBinding('class.d-block') protected _alwaysTrue = true;

	@Input() public label : string | null = null;
	@Input() public hasDanger : boolean = false;

	/**
	 * Background color of the whole Section
	 */
	@Input() public background : PThemeEnum.LIGHT | PThemeEnum.DARK | 'light-cold' | null = null;

	/**
	 * How much whitespace should there be horizontally?
	 */
	@Input() public whitespace : SectionWhitespace = SectionWhitespace.LG;

	constructor(
		private elementRef : ElementRef<HTMLElement>,
	) {
	}

	public ngAfterViewInit() : void {
		if (this.background !== null) this.elementRef.nativeElement.classList.add(`bg-${this.background}`);
		switch (this.whitespace) {
			case SectionWhitespace.MEDIUM:
				this.elementRef.nativeElement.classList.add('px-3', 'px-md-4', 'py-3');
				break;
			case SectionWhitespace.LG:
				this.elementRef.nativeElement.classList.add('px-4', 'px-md-5', 'py-4');
				break;
			case SectionWhitespace.NONE:
				this.elementRef.nativeElement.classList.add('p-0');
				break;

			default:
				break;
		}
	}
}
