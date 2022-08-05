import { AfterContentInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { BootstrapSize } from '../../../../client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { PComponentInterface } from '../../interfaces/component.interface';

@Component({
	selector: 'p-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements PComponentInterface, AfterContentInit {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;
	@Input() public radiusSize ?: BootstrapSize.LG;

	// @HostBinding('class.card') protected _alwaysTrue = true;

	constructor(
	) {
	}

	public ngAfterContentInit() : void {
		if (Config.DEBUG) this.validateContent();
	}

	private validateContent() : void {
		// if (!this.elementRef.nativeElement.children.length) return;
		// for (const child of this.elementRef.nativeElement.children) {
		// 	if (child.classList.contains('col') || child.classList.value.match(/col-[\w-]*/)) return;
		// 	this.console.error('Ups. There is a child of a <p-grid> which has no col class.');
		// }
	}

	@HostBinding('class.rounded-lg') private get _hasClassBorderLG() : boolean {
		return this.radiusSize === BootstrapSize.LG;
	}
}
