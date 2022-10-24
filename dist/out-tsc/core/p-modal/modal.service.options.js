export class ModalServiceOptions {
    constructor() {
        /**
         * Size of a new modal window.
         */
        this.size = null;
        /**
         * Custom class to append to the modal backdrop
         */
        this.theme = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.success = () => { };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.dismiss = () => { };
        this.finally = () => { };
    }
}
//# sourceMappingURL=modal.service.options.js.map