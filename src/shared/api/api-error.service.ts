import { ReplaySubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ApiErrorService {

	/**
	 * Register to this subject to be notified about all api errors.
	 */
	// eslint-disable-next-line rxjs/no-ignored-replay-buffer
	public readonly error : ReplaySubject<HttpErrorResponse> = new ReplaySubject<HttpErrorResponse>();
}
