import { AccountApiService } from '@plano/shared/api';
import { AccountApiRootBase } from '@plano/shared/api';

export class AccountApiRoot<ValidationMode extends 'draft' | 'validated' = 'validated'> extends AccountApiRootBase<ValidationMode> {

	/**
	 * Are we currently transforming an test account into a paid account. In current implementation this is the case
	 * when the <testaccount> component ist open.
	 */
	public transformingToPaidAccount : boolean | null = null;

	constructor( api : AccountApiService<ValidationMode> | null) {
		super(api);
	}
}
