import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { BootstrapSize } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-subheader',
	templateUrl: './p-subheader.component.html',
	styleUrls: ['./p-subheader.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PSubheaderComponent {
	@Input() public isNewItem ?: boolean = false;
	@Output() public onNavBack : EventEmitter<undefined> = new EventEmitter<undefined>();
	@Input() public containerSize ?: BootstrapSize.SM;

	constructor(
		private pRouterService : PRouterService,
		private localize : LocalizePipe,
	) {}

	public PlanoFaIconPool = PlanoFaIconPool;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get text() : string {
		return this.isNewItem ? this.localize.transform('Verwerfen') : this.localize.transform('Zurück');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public navBack() : void {
		this.pRouterService.navBack();
		this.onNavBack.emit();
	}
}
