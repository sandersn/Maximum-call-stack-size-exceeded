var _a;
import { __decorate, __metadata } from "tslib";
import { Md5 } from 'ts-md5/dist/md5';
import { Component, HostBinding, Input, ChangeDetectionStrategy, ViewChild, HostListener } from '@angular/core';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { assumeNonNull } from '../../null-type-utils';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';
let PToastComponent = class PToastComponent {
    constructor(toasts, localize) {
        this.toasts = toasts;
        this.localize = localize;
        this._alwaysTrue = true;
        this.progressBar = null;
        this.subscription = null;
        this.visible = true;
    }
    get _hasFoo() {
        return !this.toast.visibleOnMobile;
    }
    _mouseover(_event) {
        this.toast.progressPaused$.next(true);
    }
    _mouseleave(_event) {
        this.toast.progressPaused$.next(false);
    }
    /** @see NgProgressComponent['speed'] */
    get progressbarSpeed() {
        return this.toasts.PROGRESSBAR_SPEED;
    }
    ngAfterViewInit() {
        var _a;
        const visibilityDuration = this.toasts.visibilityDurationToNumber((_a = this.toast.visibilityDuration) !== null && _a !== void 0 ? _a : 'infinite');
        if (visibilityDuration !== null) {
            if (!this.notFirefox)
                return;
            assumeNonNull(this.progressBar);
            this.progressBar.color = '#ffffffaa';
            this.subscription = this.toast.progressChange$.subscribe((input) => {
                var _a, _b, _c;
                switch (input) {
                    case 'start':
                        (_a = this.progressBar) === null || _a === void 0 ? void 0 : _a.start();
                        break;
                    case 'complete':
                        (_b = this.progressBar) === null || _b === void 0 ? void 0 : _b.complete();
                        break;
                    default:
                        (_c = this.progressBar) === null || _c === void 0 ? void 0 : _c.set(input);
                }
            });
        }
    }
    /**
     * A type for Alerts, that defines mainly the the color of a alert component
     */
    get theme() {
        if (this._theme !== undefined)
            return this._theme;
        if (this.toast.theme !== undefined)
            return this.toast.theme;
        return PThemeEnum.PRIMARY;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get icon() {
        if (this.toast.icon !== undefined)
            return this.toast.icon;
        if (this.theme === 'primary')
            return PlanoFaIconPool.PUSH_NOTIFICATION;
        if (this.theme === 'warning')
            return 'exclamation-triangle';
        if (this.theme === 'info')
            return PlanoFaIconPool.MORE_INFO;
        if (this.theme === 'danger')
            return PlanoFaIconPool.NOT_POSSIBLE;
        if (this.theme === 'success')
            return 'thumbs-up';
        return null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get title() {
        if (this.toast.title !== undefined)
            return this.toast.title;
        switch (this.theme) {
            case 'warning':
                return this.localize.transform('Achtung');
            case 'info':
                return this.localize.transform('Info');
            case 'danger':
                return this.localize.transform('Fehler!');
            case 'success':
                return this.localize.transform('Yeah!');
            case 'primary':
            default:
                return this.localize.transform('Hey…');
        }
    }
    /**
     * when user clicked dismiss cross or btn
     */
    onDismiss() {
        this.visible = false;
        this.toasts.removeToast(this.toast);
    }
    /**
     * when user clicked close btn
     */
    onClose() {
        this.onDismiss();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get textWhite() {
        return this.theme !== 'plain' && this.theme !== 'light';
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /**
     * Create unique hash that can be used as id
     */
    get titleHash() {
        var _a;
        const unHashedString = (_a = this.toast.title) !== null && _a !== void 0 ? _a : this.toast.content;
        return Md5.hashStr(unHashedString);
    }
    /** Only show progressbar if this is not Firefox PLANO-149796 */
    get notFirefox() {
        return Config.browser.name !== 'firefox';
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PToastComponent.prototype, "toast", void 0);
__decorate([
    Input('theme'),
    __metadata("design:type", String)
], PToastComponent.prototype, "_theme", void 0);
__decorate([
    HostBinding('class.d-md-block'),
    HostBinding('class.d-none'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PToastComponent.prototype, "_hasFoo", null);
__decorate([
    HostBinding('class.mb-3'),
    __metadata("design:type", Object)
], PToastComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    ViewChild('progressBar', { static: false }),
    __metadata("design:type", Object)
], PToastComponent.prototype, "progressBar", void 0);
__decorate([
    HostListener('mouseover'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], PToastComponent.prototype, "_mouseover", null);
__decorate([
    HostListener('mouseleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], PToastComponent.prototype, "_mouseleave", null);
PToastComponent = __decorate([
    Component({
        selector: 'p-toast[toast]',
        templateUrl: './p-toast.component.html',
        styleUrls: ['./p-toast.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [ToastsService,
        LocalizePipe])
], PToastComponent);
export { PToastComponent };
//# sourceMappingURL=p-toast.component.js.map