import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LocationChangeEvent } from '@angular/common';
import { PlatformLocation } from '@angular/common';
import { ElementRef, TemplateRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { CurrentModalsService } from './current-modals.service';
import { PModalDefaultTemplateComponent } from './modal-default-template/modal-default-template.component';
import { ModalContentOptions } from './modal-default-template/modal-default-template.component';
import { ModalServiceOptions } from './modal.service.options';
import { assumeNonNull } from '../null-type-utils';
import { PDictionarySourceString } from '../pipe/localize.dictionary';
import { LocalizePipe } from '../pipe/localize.pipe';

@Injectable({ providedIn: 'root' })
export class ModalService {
	constructor(
		private modal : NgbModal,
		private currentModals : CurrentModalsService,
		private location : PlatformLocation,
		private localize : LocalizePipe,
	) {
		this.location.onPopState((event : LocationChangeEvent) => {
			// ensure that modal is opened
			if (this.modalRef === null) return;
			(event as unknown as Event).preventDefault();
			this.modalRef.dismiss();
		});
	}

	public modalRef : NgbModalRef | null = null;
	public modalServiceOptions : ModalServiceOptions = new ModalServiceOptions();

	private modalServiceOptionsToNgbModalOptions(input : ModalServiceOptions) : NgbModalOptions {
		const centered = input.centered !== undefined ? input.centered : (input.size === 'sm');
		const scrollable = input.scrollable !== undefined ? input.scrollable : true;
		const animation = input.animation !== undefined ? input.animation : input.size !== 'fullscreen';

		const theme = input.theme;
		// const theme = input.theme !== undefined ? input.theme : PThemeEnum.LIGHT;
		if (theme !== undefined) {
			input.windowClass += ` modal-${theme}`;
		}

		let backdropClass = '';
		backdropClass += (input.backdropClass ?? '');
		backdropClass += (input.backdrop === 'static' ? ' not-clickable bg-white' : '');
		return {
			size: input.size!,
			windowClass: input.windowClass!,
			backdrop: input.backdrop!,
			backdropClass: backdropClass,
			keyboard: input.keyboard!,
			centered: centered,
			scrollable: scrollable,
			animation: animation,
		};
	}

	/**
	 * Open a new Modal with the provided content and options
	 */
	public openModal(
		// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
		modalContent : TemplateRef<unknown> | ElementRef<unknown> | unknown,
		inputOptions : ModalServiceOptions | null = null,
	) : NgbModalRef {
		if (inputOptions === null) inputOptions = this.modalServiceOptions;
		if ( !inputOptions.success ) inputOptions.success = () => {};
		if ( !inputOptions.dismiss ) inputOptions.dismiss = () => {};

		const ngbModalServiceOptions = this.modalServiceOptionsToNgbModalOptions(inputOptions);
		this.currentModals.addModal();
		this.modalRef = this.modal.open(modalContent, ngbModalServiceOptions);

		this.modalRef.result.then((result) => {
			assumeNonNull(inputOptions);
			this.currentModals.removeModal();
			inputOptions.success?.(result);
		}, (error) => {
			assumeNonNull(inputOptions);
			this.currentModals.removeModal();
			inputOptions.dismiss?.(error);
		}).finally(inputOptions.finally);
		// HACK: This is a hack for the modal-over-modal scroll issue.
		// More Info: https://github.com/ng-bootstrap/ng-bootstrap/issues/643
		this.modalRef.result.then(() => {
			if (document.querySelector('body > .modal.open')) {
				document.body.classList.add('modal-open');
			}
		}).catch(() => {
			if (document.querySelector('body.modal-open')) {
				document.body.classList.remove('modal-open');
			}
		});

		return this.modalRef;
	}

	/**
	 * Opens a confirm modal without the need to provide a template for the inner content
	 * If you don’t provide a dismiss handler, the Dismiss-Button in the footer will be hidden.
	 */
	public confirm(
		content : ModalContentOptions,
		options : {
			success ?: ModalServiceOptions['success'],
			dismiss ?: ModalServiceOptions['dismiss'],
			theme ?: ModalServiceOptions['theme'],
			size ?: ModalServiceOptions['size'],
		} = {},
	) : void {
		if (content.closeBtnLabel === null) content.closeBtnLabel = this.localize.transform('Ja');
		if (content.dismissBtnLabel === undefined) content.dismissBtnLabel = this.localize.transform('Nein');
		const pConfirmModalComponent = this.openModal(PConfirmModalComponent, {
			size: options.size ?? 'sm',
			theme: options.theme ?? null,
			centered: true,
			success: (result) => {
				if (options.success) options.success(result);
			},
			dismiss: (result) => {
				if (options.dismiss) options.dismiss(result);
			},
		}).componentInstance as PConfirmModalComponent;

		pConfirmModalComponent.initModal(content, options.theme);
	}

	/**
	 * Opens a themed modal without the need to provide a template for the inner content
	 * This has no callbacks. It is made for situations where we e.g. just want to block a functionality.
	 */
	public openDefaultModal(
		modalContentOptions : ModalContentOptions,
		options : ModalServiceOptions | null = null,
	) : NgbModalRef {
		if (options === null) options = {};
		if (!options.size) options.size = 'lg';
		const modalRef = this.openModal(PModalDefaultTemplateComponent, {
			...options,
			success : (result) => {
				assumeNonNull(options);
				options.success?.(result);

				defaultModalComponent.embeddedContentView?.destroy();
				defaultModalComponent.embeddedFooterView?.destroy();
			},
			dismiss : (result) => {
				assumeNonNull(options);
				// It is important to destroy before you run options.dismiss.
				// Imagine: Dismiss could remove things from api which embeddedContentView relies on.
				defaultModalComponent.embeddedContentView?.destroy();
				defaultModalComponent.embeddedFooterView?.destroy();

				options.dismiss?.(result);
			},
		});
		const defaultModalComponent = modalRef.componentInstance as PModalDefaultTemplateComponent;
		defaultModalComponent.initModal(modalContentOptions, options.theme);
		return modalRef;
	}

	/**
	 * Shorthand to open a modal for Attribute Info’s `cannotEditHint`
	 */
	public openCannotEditHintModal(
		cannotEditHint : PDictionarySourceString,
	) : void {
		this.openDefaultModal({
			modalTitle: null,
			description: this.localize.transform(cannotEditHint),
			closeBtnLabel: this.localize.transform('Nagut 🙄'),
		}, {
			// theme: BootstrapStyleEnum.,
			size: 'sm',
			centered: true,
		});
	}

	/**
	 * Opens a warning modal without the need to provide a template for the inner content
	 * It is made for situations where we e.g. just want to block a functionality.
	 */
	public warn(
		modalContentOptions : ModalContentOptions,
		success ?: ModalServiceOptions['success'],
	) : void {
		if (!modalContentOptions.modalTitle) modalContentOptions.modalTitle = this.localize.transform('Achtung');
		const options : ModalServiceOptions = {
			theme: PThemeEnum.WARNING,
			centered: true,
		};

		if (success) options.success = success;
		this.openDefaultModal(modalContentOptions, options);
	}

	/**
	 * Opens a info modal without the need to provide a template for the inner content
	 * It is made for situations where we e.g. just want to block a functionality.
	 */
	public info(
		modalContentOptions : ModalContentOptions,
		success ?: ModalServiceOptions['success'],
	) : void {
		if (!modalContentOptions.modalTitle) modalContentOptions.modalTitle = this.localize.transform('Hinweis');
		const options : ModalServiceOptions = {
			theme: PThemeEnum.INFO,
			centered: true,
		};

		if (success) options.success = success;
		this.openDefaultModal(modalContentOptions, options);
	}

	/**
	 * Opens a error modal without the need to provide a template for the inner content
	 * This has no callbacks. It is made for situations where we e.g. just want to block a functionality.
	 */
	public error(
		modalContentOptions : ModalContentOptions,
	) : void {
		if (!modalContentOptions.modalTitle) modalContentOptions.modalTitle = this.localize.transform('Fehler!');
		this.openDefaultModal(modalContentOptions, {
			theme: PThemeEnum.DANGER,
			centered: true,
		});
	}

	/**
	 * This is a shorthand for bringing a templateRef of a modal-content into a structure that fits
	 * into the saveChangesHook attribute of an pEditable
	 */
	public getEditableHook(
		modalContent : unknown,
		options : {
			success ?: ModalServiceOptions['success'],
			dismiss ?: ModalServiceOptions['dismiss'],
			size ?: ModalServiceOptions['size'],
			theme ?: ModalServiceOptions['theme'],
		} = {},
	) : (
			success ?: () => void,
			dismiss ?: () => void,
		) => void {
		if ( !options.success ) { options.success = () => {}; }
		if ( !options.dismiss ) { options.dismiss = () => {}; }

		return (
			// This will be filled from inside the pEditable
			success = () => {},
			// This will be filled from inside the pEditable
			dismiss = () => {},
		) : void => {
			this.openModal(
				modalContent,
				{
					success: (result) => {
						options.success?.(result);
						success();
					},
					dismiss: (reason) => {
						options.dismiss?.(reason);
						dismiss();
					},
					size: options.size ?? null,
					theme: options.theme ?? null,
				},
			);
		};
	}
}
