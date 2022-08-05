export interface PComponentInterface {

	/**
   * Is this component loading?
   * Can be used to show a spinner or skeleton.
   * @example [isLoading]="!api.isLoaded()"
   */
	isLoading : boolean | null;
}
