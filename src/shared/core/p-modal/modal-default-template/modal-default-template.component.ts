import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef, EmbeddedViewRef } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding, ViewContainerRef, ViewChild } from '@angular/core';
import { PThemeEnum } from '../../../../client/shared/bootstrap-styles.enum';
import { FaIcon } from '../../component/fa-icon/fa-icon-types';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { ModalServiceOptions } from '../modal.service.options';

/** All the properties that can be set for e.g. open a confirm modal. */
export interface ModalContentOptions {
	description ?: string | TemplateRef<unknown>;
	modalTitle ?: string | TemplateRef<unknown> | null;

	/**
	 * The label of the button that closes the modal successfully.
	 * This will be set when user opens the Modal.
	 * If you want the possibility to change the text during a lifecycle of a Modal, provide a fn : () => string here.
	 */
	closeBtnLabel ?: (string | (() => string)) | null;

	/**
	 * Visual Theme of the close button
	 */
	closeBtnTheme ?: PThemeEnum.DANGER | PThemeEnum.PRIMARY;

	/**
	 * Is the close button disabled?
	 */
	closeBtnDisabled ?: () => boolean;

	dismissBtnLabel ?: string;

	/**
	 * The template that should be rendered as content of this component.
	 */
	contentTemplateRef ?: TemplateRef<unknown>;

	/**
	 * The template that should be rendered as footer of this component.
	 */
	footerTemplateRef ?: TemplateRef<unknown>;

	/**
	 * The context of .contentTemplateRef
	 * More Info: https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/#templatecontext
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	contentTemplateContext ?: {[key : string] : any};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	footerTemplateContext ?: {[key : string] : any};

	/**
	 * Should the dismiss button be visible on the footer?
	 * If set to true it will still be possible to dismiss with the × button or a click outside the modal.
	 * @default true
	 */
	hideDismissBtn ?: boolean;

	icon ?: FaIcon;
}

@Component({
	selector: 'p-modal-default-template',
	templateUrl: './modal-default-template.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PModalDefaultTemplateComponent {
	@HostBinding('class.flex-grow-1') protected _alwaysTrue = true;

	constructor(
		private activeModal : NgbActiveModal,
		private localize : LocalizePipe,
	) {}

	public modalContentOptions : ModalContentOptions = {};
	public theme ?: ModalServiceOptions['theme'] = null;

	@ViewChild('content', { read: ViewContainerRef, static: true }) private contentViewContainerRef ! : ViewContainerRef;
	@ViewChild('footer', { read: ViewContainerRef, static: true }) private footerViewContainerRef ! : ViewContainerRef;


	/**
	 * Initializes the Modal with the necessary properties from its parent component.
	 */
	public initModal(
		options : ModalContentOptions,
		theme : ModalServiceOptions['theme'],
	) : void {
		if (!!options.description === !!options.contentTemplateRef) throw new Error('Please set either description or contentTemplateRef');

		this.modalContentOptions = options;
		if (this.modalContentOptions.hideDismissBtn === undefined) this.modalContentOptions.hideDismissBtn = true;
		if (!this.modalContentOptions.dismissBtnLabel) this.modalContentOptions.dismissBtnLabel = this.localize.transform('Nein');
		if (theme) this.theme = theme;
		if (this.modalContentOptions.closeBtnLabel === null) this.modalContentOptions.closeBtnLabel = this.localize.transform('Ok');

		if (!!options.contentTemplateRef) {
			this.embeddedContentView = options.contentTemplateRef.createEmbeddedView(!!options.contentTemplateContext ? options.contentTemplateContext : {});
			this.contentViewContainerRef.insert(this.embeddedContentView);
		}

		if (!!options.footerTemplateRef) {
			this.embeddedFooterView = options.footerTemplateRef.createEmbeddedView(!!options.footerTemplateContext ? options.footerTemplateContext : {});
			this.footerViewContainerRef.insert(this.embeddedFooterView);
		}

		this.showCustomFooter = !!options.footerTemplateRef;
	}

	/** @deprecated HACK: quick fix for modals that have no footer, since i implemented support for .footerViewContainerRef in modal-default-template */
	public showCustomFooter : boolean | null = null;

	/**
	 * A handle to control the embedded view inside this component.
	 *
	 * NOTE: 	Do not handle this.embeddedView ( e.g. .destroy() ) inside this component.
	 *  			Handle it where a modal has been opened.
	 */
	public embeddedContentView : EmbeddedViewRef<unknown> | undefined;

	public embeddedFooterView : EmbeddedViewRef<unknown> | undefined;

	/**
	 * Close this modal
	 */
	public onClose() : void {
		this.activeModal.close();
	}

	/**
	 * Dismiss this modal
	 */
	public onDismiss() : void {
		this.activeModal.dismiss();
	}

	/** Is close button disabled? */
	public get closeBtnDisabled() : boolean {
		return !!this.modalContentOptions.closeBtnDisabled?.();
	}
}
