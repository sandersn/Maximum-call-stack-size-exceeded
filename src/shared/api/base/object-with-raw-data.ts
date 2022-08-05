/**
 * The base class for api objects with raw data.
 */
export abstract class ObjectWithRawData {
	protected data : any;

	/**
	 * The raw-data communicated between frontend and backend.
	 */
	public get rawData() : any {
		return this.data;
	}
}
