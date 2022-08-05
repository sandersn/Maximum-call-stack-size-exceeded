import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';

export class ModalServiceOptions {

	/**
	 * Whether to close the modal when escape key is pressed (true by default).
	 */
	public keyboard ?: NgbModalOptions['keyboard'];
	public centered ?: NgbModalOptions['centered'];

	/**
	 * Size of a new modal window.
	 */
	public size ?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' | null = null;

	/**
	 * A custom class to append to the modal window.
	 */
	public windowClass ?: NgbModalOptions['windowClass'];

	/**
	 * Whether a backdrop element should be created for a given modal (true by default).
	 * Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.
	 */
	public backdrop ?: NgbModalOptions['backdrop'];

	/**
	 * Custom class to append to the modal backdrop
	 */
	public backdropClass ?: NgbModalOptions['backdropClass'];

	/**
	 * Custom class to append to the modal backdrop
	 */
	public theme ?: PThemeEnum | null = null;

	/**
	 * Scrollable modal content (false by default).
	 *
	 * @since 5.0.0
	 */
	public scrollable ?: NgbModalOptions['scrollable'];

	/**
	 * If `true`, modal opening and closing will be animated.
	 */
	public animation ?: NgbModalOptions['animation'];

	constructor() {
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public success ?: (result : any) => void = () => {};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public dismiss ?: (reason : any) => void = () => {};
	public finally ?: () => void = () => {};
}
