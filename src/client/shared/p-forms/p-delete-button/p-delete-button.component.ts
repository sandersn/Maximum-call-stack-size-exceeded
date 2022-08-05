import { Component, Input, Output, EventEmitter, ViewChild, HostBinding, TemplateRef } from '@angular/core';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { ModalServiceOptions } from '@plano/shared/core/p-modal/modal.service.options';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PThemeEnum } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-delete-button',
	templateUrl: './p-delete-button.component.html',
	styleUrls: ['./p-delete-button.component.scss'],
})
export class PDeleteButtonComponent {

	/**
	 * Overwrite classes outside.
	 */
	@Input() @HostBinding() public class : string | null = null;

	@Output() private onModalSuccess : EventEmitter<Event> = new EventEmitter<Event>();
	@Output() private onModalDismiss : EventEmitter<Event> = new EventEmitter<Event>();
	@Input() public label : string | null = null;
	@Input('modalText') private _modalText : string | null = null;
	@Input() public disabled : boolean = false;

	@ViewChild('warningModalContentTemplate', { static: true }) private warningModalContentTemplate ! : TemplateRef<unknown>;

	constructor(
		private modalService : ModalService,
		private console : LogService,
		private localize : LocalizePipe,
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get modalText() : string {
		if (this._modalText) return this._modalText;
		if (this.label) return this.label;
		return this.localize.transform('Löschen');
	}

	public modalTheme : ModalServiceOptions['theme'] = PThemeEnum.DANGER;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onRemoveClick(event : Event) : void {
		this.modalService.openModal(this.warningModalContentTemplate, {
			theme: this.modalTheme ?? null,
			centered: true,
			success: () => {
				this.onModalSuccess.emit(event);
			},
			dismiss: () => {
				this.onModalDismiss.emit(event);
			},
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get translatedDeleteWarningModalCloseBtnLabel() : string {
		if (!this.label) return this.localize.transform('Ja');
		return this.localize.transform('Ja, ${label}', { label: this.label });
	}
}
