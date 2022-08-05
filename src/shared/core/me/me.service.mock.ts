import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatedApiRole } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';

@Injectable()
export class FakeMeService {
	// eslint-disable-next-line jsdoc/require-jsdoc
	public isLoaded() : boolean {
		return true;
	}

	/**
	 * 	@param _basicAuthValue credential basic-auth value
	 *  @param _changeCookies Should cookie values be touched?
	 *  @param success Success event when credentials were set successfully.
	 *  @param _error Error event when credentials could not be set.
	 */
	public login(
		_basicAuthValue : string,
		_changeCookies : boolean,
		_loggedInFromLoginForm : boolean,
		success : (() => void) | null,
		_error : (response : HttpErrorResponse | 'not_ascii') => void,
	) : void {
		if (success) success();
	}

	public data = {
		id: Id.create(133713371337),
		isOwner: true,
		firstName: 'Maria Magdalena',
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		lastName: 'Ipsum',
		companyName: 'Boulder Bar GmbH',
		role: AuthenticatedApiRole.CLIENT_OWNER,
	};
}
