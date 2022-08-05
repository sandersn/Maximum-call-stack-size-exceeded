import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export interface ModalContentComponent {

	/**
	 * Initialize this component. Fill all necessary properties with values.
	 * First param is the reference to the Modal, needed in order to be able to close and dismiss inside the component.
	 */
	initModalContentComponent : (
		modalRef : NgbModalRef,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...other : any[] // beliebig viele weitere params
	) => void;

	/**
	 * Dismiss the modal
	 */
	dismissModal : (input ?: Event) => void,

	/**
	 * Close the modal
	 */
	closeModal : (reason : ModalContentComponentCloseReason) => void,
}

export enum ModalContentComponentCloseReason {
	REMOVE,
	ADD,
}
