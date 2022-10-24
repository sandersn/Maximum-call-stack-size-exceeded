import { __decorate, __metadata } from "tslib";
import { interval, Subject } from 'rxjs';
import { distinctUntilChanged, filter, finalize, flatMap, startWith, takeWhile, windowToggle } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { LogService } from '../../shared/core/log.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { PThemeEnum } from '../shared/bootstrap-styles.enum';
let ToastsService = class ToastsService {
    constructor(localize, console) {
        this.localize = localize;
        this.console = console;
        this.toasts = [];
        this.PROGRESSBAR_SPEED = 500;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get toastsAreAvailable() {
        return !!this.toasts.length;
    }
    /**
     * To be able to have this.toasts private, i added iterable() like we have it in ApiListWrapper
     */
    iterable() {
        return this.toasts;
    }
    getIndexOfItemWithSameContent(toastInput) {
        var _a, _b;
        for (let i = 0; i < this.toasts.length; i++) {
            if (this.toasts[i].content.toString() === toastInput.content.toString() &&
                ((_a = this.toasts[i].title) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = toastInput.title) === null || _b === void 0 ? void 0 : _b.toString())) {
                return i;
            }
        }
        return null;
    }
    initDefaultValues(toast) {
        if (toast.theme === undefined)
            toast.theme = PThemeEnum.PRIMARY;
        if (!toast.visibilityDuration) {
            switch (toast.theme) {
                case PThemeEnum.SUCCESS:
                    toast.visibilityDuration = 'short';
                    break;
                case PThemeEnum.WARNING:
                    toast.visibilityDuration = 'medium';
                    break;
                case PThemeEnum.DANGER:
                    toast.visibilityDuration = 'infinite';
                    break;
                default:
                    toast.visibilityDuration = 'medium';
                    break;
            }
        }
        if (toast.visibleOnMobile === undefined)
            toast.visibleOnMobile = true;
        if (toast.close !== undefined && toast.closeBtnLabel === undefined) {
            toast.closeBtnLabel = this.localize.transform('Ok');
        }
        if (toast.dismiss !== undefined && toast.dismissBtnLabel === undefined) {
            toast.dismissBtnLabel = this.localize.transform('Schließen');
        }
    }
    /**
     * Add a new Toast.
     */
    addToast(toastInput) {
        let index = this.getIndexOfItemWithSameContent(toastInput);
        if (index !== null) {
            this.runProgress(this.toasts[index]);
            return;
        }
        const toast = {
            progressChange$: new Subject(),
            progressPaused$: new Subject(),
            progressInterval: null,
            progressPercent: 0,
            ...toastInput,
        };
        this.initDefaultValues(toast);
        this.toasts.push(toast);
        this.runProgress(toast);
        index = this.getIndexOfItemWithSameContent(toast);
        if (index === null)
            this.console.warn('Could not find related toast');
    }
    runProgress(toast) {
        var _a;
        const visibilityDuration = this.visibilityDurationToNumber((_a = toast.visibilityDuration) !== null && _a !== void 0 ? _a : 'infinite');
        if (visibilityDuration === null)
            return;
        // If this progressbar is already running, just reset the interval
        if (toast.progressInterval !== null) {
            toast.progressPercent = 0;
            return;
        }
        toast.progressChange$.next(toast.progressPercent);
        const pause$ = toast.progressPaused$.pipe(startWith(false), distinctUntilChanged());
        const ons$ = pause$.pipe(filter(v => v));
        const offs$ = pause$.pipe(filter(v => !v));
        const oneStepPercentage = 100 / visibilityDuration * this.PROGRESSBAR_SPEED;
        toast.progressInterval = interval(this.PROGRESSBAR_SPEED).pipe(
        // Define whats happing after the interval.
        finalize(() => {
            this.removeToast(toast);
        }), 
        // Stop when 100 is reached
        // eslint-disable-next-line rxjs/no-ignored-takewhile-value
        takeWhile((_value) => toast.progressPercent < 100), 
        // Make progressbar stop depending on toast.progressPaused$ state
        windowToggle(offs$, () => ons$), flatMap(x => x)).subscribe(() => {
            const newPercent = toast.progressPercent + oneStepPercentage;
            toast.progressPercent = newPercent;
            toast.progressChange$.next(toast.progressPercent);
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    visibilityDurationToNumber(visibilityDuration) {
        switch (visibilityDuration) {
            case 'short':
                return 2500;
            case 'medium':
                return 5000;
            case 'long':
                return 10000;
            case 'infinite':
                return null;
        }
    }
    /** Remove one toast from the list of visible toasts */
    removeToast(input) {
        const index = this.getIndexOfItemWithSameContent(input);
        assumeNonNull(index, 'index', 'Could not find related toast');
        const toast = this.toasts[index];
        // If can’t find the ref, remove any.
        toast.progressChange$.next('complete');
        // window.clearTimeout(toast.timeout ?? undefined);
        this.toasts.splice(index, 1);
    }
    /** Hide all toasts immediately / remove them from the internal list */
    removeAllToasts() {
        this.toasts = [];
    }
};
ToastsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [LocalizePipe,
        LogService])
], ToastsService);
export { ToastsService };
//# sourceMappingURL=toasts.service.js.map