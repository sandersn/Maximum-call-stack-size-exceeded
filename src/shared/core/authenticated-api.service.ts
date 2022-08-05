import { Injectable } from '@angular/core';
import { AuthenticatedApiService} from '@plano/shared/api';
import { AuthenticatedApiRootBase, AuthenticatedApiRole } from '@plano/shared/api';

@Injectable()
export class AuthenticatedApiRoot extends AuthenticatedApiRootBase {
	constructor( api : AuthenticatedApiService | null ) {
		super(api);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isOwner() : boolean {
		if (!this.rawData) throw new Error(`Please load AuthenticatedApi first [PLANO-FE-9X]`);
		return this.role === AuthenticatedApiRole.CLIENT_OWNER;
	}

}
