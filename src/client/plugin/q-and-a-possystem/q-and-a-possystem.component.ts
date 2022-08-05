import { Component, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';

@Component({
	selector: 'p-q-and-a-possystem',
	templateUrl: './q-and-a-possystem.component.html',
	styleUrls: ['./q-and-a-possystem.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PQAndAPossystemComponent {
	private timeout : number | null = null;
	public copiedToClipboard : string | number | null = null;

	constructor(
		private localize : LocalizePipe,
		public toasts : ToastsService,
		private zone : NgZone,
	) {
	}

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

		this.copiedToClipboard = input;

		this.toasts.addToast({
			title: this.localize.transform('OK!'),
			content: this.localize.transform('Wurde in die Zwischenablage kopiert'),
			// + ` und kann mit <code>STRG + V</code> bzw. <code>⌘ + V</code> eingefügt werden.`,
			theme: PThemeEnum.SUCCESS,
			icon: 'clipboard',
			visibilityDuration: 'short',
		});

		this.zone.runOutsideAngular(() => {
			this.timeout = window.setTimeout(() => {
				this.zone.run(() => {
					if (this.copiedToClipboard) this.copiedToClipboard = null;
				});
			}, 4500);
		});
	}

}
