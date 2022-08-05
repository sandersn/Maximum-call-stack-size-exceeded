export class CallByRef<T> {
	public val : T | null = null;

	// eslint-disable-next-line @typescript-eslint/naming-convention, jsdoc/require-jsdoc
	public CallByRef(value : T | null = null) : void {
		this.val = value;
	}
}
