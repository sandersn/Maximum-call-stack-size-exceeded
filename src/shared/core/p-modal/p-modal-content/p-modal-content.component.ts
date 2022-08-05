import { AfterContentChecked } from '@angular/core';
import { ViewChild, Output, EventEmitter, Input, Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { assumeNonNull } from '../../null-type-utils';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { ExtractFromUnion } from '../../typescript-utils-types';
import { ModalContentOptions } from '../modal-default-template/modal-default-template.component';
import { ModalServiceOptions } from '../modal.service.options';

/**
 * @example
 * 	<p-modal-content
 * 		(onDismiss)="dismiss('no')"
 * 		(onClose)="success('yep')"
 * 	>
 * 		<p-modal-content-body>
 * 			Hallo Welt
 * 		</p-modal-content-body>
 *  </p-modal-content>
 */
@Component({
	selector: 'p-modal-content',
	templateUrl: './p-modal-content.component.html',
	styleUrls: ['./p-modal-content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PModalContentComponent implements AfterContentChecked {
	@Input() public modalBodyHeight : string | null = null;

	/**
	 * Effects spacing inside the modal.
	 */
	@Input() public size ?: 'frameless' | ExtractFromUnion<'fullscreen', ModalServiceOptions['size']> | BootstrapSize;

	@HostBinding('class.h-100') protected _alwaysTrue = true;

	@Input() public theme ?: PThemeEnum | null = null;
	@Input() public modalTitle : ModalContentOptions['modalTitle'] = null;

	/**
	 * Written to the dismiss button.
	 * Default: No
	 */
	@Input() public dismissBtnLabel : string | null = null;

	/**
	 * Written to the close button. »Close« means 'successful' here.
	 * Default: Yes
	 */
	@Input() public closeBtnLabel : (string | (() => string)) | null = null;

	@Input() public closeBtnTheme : ModalContentOptions['closeBtnTheme'] | (
		PThemeEnum.SECONDARY |
		PThemeEnum.LIGHT |
		PThemeEnum.DARK |
		PThemeEnum.SUCCESS
	);

	@Input() public closeBtnDisabled ?: boolean = false;
	@Input() public hideDismissBtn ?: boolean = false;

	/**
	 * Happens when the user closes the modal with some kind of success/ok button
	 */
	@Output() public onClose : EventEmitter<string> = new EventEmitter();

	/**
	 * Happens when the user closes the modal with some kind of cancel button.
	 * E.g. a × icon in the top right corner.
	 * This also triggers if the user clicks outside the modal (if outside-click is not disabled by any config)
	 */
	@Output() public onDismiss : EventEmitter<string> = new EventEmitter();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@ViewChild('footer', { static: true }) private footer ! : any;

	// HACK: quick fix for modals that have no footer, since i implemented support for .footerViewContainerRef in modal-default-template
	@Input('showCustomFooter') private _showCustomFooter : boolean | null = null;

	constructor(
		private localize : LocalizePipe,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public Config = Config;
	public PThemeEnum = PThemeEnum;

	public ngAfterContentChecked() : void {
		this.initValues();
	}

	/**	closeBtnLabel can be a fn which returns a string */
	public get closeBtnLabelAsString() : string | undefined {
		if (typeof this.closeBtnLabel === 'string') return this.closeBtnLabel;
		assumeNonNull(this.closeBtnLabel);
		return this.closeBtnLabel();
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		if (this.modalTitle === undefined) this.modalTitle = this.localize.transform('Sicher?');
		if (this.dismissBtnLabel === null) this.dismissBtnLabel = this.localize.transform('Nein');
		if (this.closeBtnLabel === null) this.closeBtnLabel = this.localize.transform('Ja');
	}


	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showCustomFooter() : boolean {
		if (this._showCustomFooter !== null) return this._showCustomFooter;
		return this.footer.nativeElement && this.footer.nativeElement.children.length > 0;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get textWhite() : boolean {
		return !!this.theme && this.theme !== PThemeEnum.WARNING && this.theme !== PThemeEnum.LIGHT;
	}
}

@Component({
	selector: 'p-modal-content-body',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PModalContentBodyComponent {
	@HostBinding('class.d-block') protected _alwaysTrue = true;

	constructor(
	) {
		// @Inject(PModalContentComponent) parent : PModalContentComponent;
	}
}

@Component({
	selector: 'p-modal-content-footer',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PModalContentFooterComponent {
	@HostBinding('class.modal-footer')
	@HostBinding('class.d-flex') protected _alwaysTrue = true;
	@HostBinding('class.justify-content-between') private classJustifyContentBetween = true;
	@HostBinding('class.align-items-center') private classAlignItemsCenter = true;

	constructor() {}
}
