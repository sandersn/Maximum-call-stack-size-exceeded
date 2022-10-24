import { __decorate, __metadata } from "tslib";
import { Subject, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailValidApiService } from '@plano/shared/api';
import { PPossibleErrorNames } from './validators.types';
/**
 * Custom validations for our forms
 */
let AsyncValidatorsService = class AsyncValidatorsService {
    constructor(emailValidApiService) {
        this.emailValidApiService = emailValidApiService;
    }
    /**
     * Checks if an email address is valid. This validator sets the validation-names "emailInvalid" and "emailUsed".
     * @param checkIsUsed If "true" is passed this validator also ensures that the email is
     * not already used by another user.
     * @param userId Pass user id for whom we are doing this test. don’t pass anything here
     * when are you creating a new user. This parameter is ignored when "checkIsUsed" is "false".
     */
    emailValidAsync(checkIsUsed = false, userId) {
        return (control) => {
            // don’t do anything if control ist not dirty. This is true e.g. if a form has just been initialized.
            if (!control.dirty)
                return of(null);
            // an empty string is valid according to this validator
            // (if it should not be valid a "required" validator has to be added to the input)
            if (control.value === undefined)
                return of(null);
            if (control.value === '')
                return of(null);
            if (control.value === null)
                return of(null);
            // delay request
            return timer(1000).pipe(switchMap(() => {
                const sendResult = new Subject();
                // queryParams
                let queryParams = new HttpParams()
                    .set('emails', encodeURIComponent(control.value));
                if (checkIsUsed)
                    queryParams = queryParams.set('checkIsUsed', '');
                // Don’t send an id if the entity is new. See email-valid api docs for more info.
                if (userId && !userId.isOfNewItem())
                    queryParams = queryParams.set('user', userId.rawData);
                // call api
                this.emailValidApiService.load({
                    success: () => {
                        if (this.emailValidApiService.data.invalid) {
                            sendResult.next({ [PPossibleErrorNames.EMAIL_INVALID]: {
                                    name: PPossibleErrorNames.EMAIL_INVALID,
                                    primitiveType: undefined,
                                    actual: control.value,
                                } });
                        }
                        else if (this.emailValidApiService.data.used) {
                            sendResult.next({ [PPossibleErrorNames.EMAIL_USED]: {
                                    name: PPossibleErrorNames.EMAIL_USED,
                                    primitiveType: undefined,
                                    actual: control.value,
                                } });
                        }
                        else {
                            sendResult.next(null);
                        }
                        sendResult.complete();
                    },
                    error: (error) => {
                        sendResult.error(error);
                    },
                    searchParams: queryParams,
                });
                return sendResult.asObservable();
            }));
        };
    }
};
AsyncValidatorsService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [EmailValidApiService])
], AsyncValidatorsService);
export { AsyncValidatorsService };
//# sourceMappingURL=async-validators.service.js.map