import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ToastsService } from '@plano/client/service/toasts.service';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { BootstrapRounded, PThemeEnum } from '../../bootstrap-styles.enum';
import { PInputComponent } from '../p-input/p-input.component';

@Component({
	selector: 'p-input-copy-string',
	templateUrl: './p-input-copy-string.component.html',
	styleUrls: ['./p-input-copy-string.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PInputCopyStringComponent implements PComponentInterface {
	@Input() public valueToCopy : string | null = null;

	public copiedToClipboard : string | number | null = null;

	private timeout : number | null = null;
	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Input() public type : PInputComponent['type'] = PApiPrimitiveTypes.string;

	constructor(
		public toasts : ToastsService,
		private zone : NgZone,
		private localize : LocalizePipe,
		private activeModal : NgbActiveModal,
	) {
	}

	public BootstrapRounded = BootstrapRounded;
	public PThemeEnum = PThemeEnum;

	/**
	 * Copy string to clipboard
	 */
	public copyString(input : string) : void {
		window.clearTimeout(this.timeout ?? undefined);

		// Create a dummy input to copy the string array inside it
		const dummy = document.createElement('input');
		// Output the array into it
		dummy.value = input;
		// Add it to the document
		document.body.appendChild(dummy);
		// Set its ID
		dummy.setAttribute('id', 'dummy_id');
		// Select it
		dummy.select();
		// Copy its contents
		document.execCommand('copy');
		// Remove it as its not needed anymore
		document.body.removeChild(dummy);

		this.toasts.addToast({
			content: this.localize.transform('Wurde in die Zwischenablage kopiert'),
			theme: PThemeEnum.SUCCESS,
			icon: 'clipboard',
			visibilityDuration: 'short',
		});

		this.copiedToClipboard = input;
		this.zone.runOutsideAngular(() => {
			this.timeout = window.setTimeout(() => {
				this.zone.run(() => {
					if (this.copiedToClipboard) {
						this.copiedToClipboard = null;
					}
					this.activeModal.close();
				});
			}, 1000);
		});
	}

	/**
	 * Close modal
	 */
	public close() : void {
		this.activeModal.close();
	}

	/**
	 * Dismiss modal
	 */
	public dismiss() : void {
		this.activeModal.dismiss();
	}

	/**
	 * Get icon for the 'copy' button
	 */
	public get icon() : FaIcon {
		if (this.isLoading) return PlanoFaIconPool.SYNCING;
		return this.copiedToClipboard === this.valueToCopy ? 'check' : 'clipboard';
	}

	/**
	 * Is the icon of the 'copy' button spinning?
	 */
	public get iconSpinning() : boolean {
		if (this.icon === PlanoFaIconPool.SYNCING) return true;
		return false;
	}

	/**
	 * Select whole text if someone sets focus inside.
	 * Be one step ahead the users thoughts ;)
	 */
	public onFocus(event : Event) : void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if ((event.target as any).select) (event.target as any).select();
	}
}
