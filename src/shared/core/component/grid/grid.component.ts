import { AfterContentInit} from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, HostBinding, ElementRef } from '@angular/core';
import { Config } from '../../config';
import { PComponentInterface } from '../../interfaces/component.interface';
import { LogService } from '../../log.service';

@Component({
	selector: 'p-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements PComponentInterface, AfterContentInit {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Input() public justifyContent : 'center' | 'stretch' | null = null;

	constructor(
		private elementRef : ElementRef<HTMLElement>,
		private console : LogService,
	) {
	}

	public ngAfterContentInit() : void {
		if (Config.DEBUG) this.validateContent();
	}

	private validateContent() : void {
		if (!this.elementRef.nativeElement.children.length) return;
		for (const child of this.elementRef.nativeElement.children) {
			if (child.classList.contains('col') || child.classList.value.match(/col-[\w-]*/)) return;
			let hint = child.textContent ?? child.classList.value;
			if (!hint) hint = `${child.innerHTML.slice(0, 100)}…`;
			this.console.error(`Ups. There is a child of a <p-grid> which has no col class. This may help to find it: ${hint}`);
		}
	}

	@HostBinding('class.align-items-center') private get _hasClassAlignItemsCenter() : boolean {
		return this.justifyContent === 'center';
	}
	@HostBinding('class.align-items-stretch') private get _hasClassAlignItemsStretch() : boolean {
		return this.justifyContent === 'stretch';
	}
}
