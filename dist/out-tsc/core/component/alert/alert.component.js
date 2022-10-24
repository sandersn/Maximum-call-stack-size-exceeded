var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { PAlertTheme, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';
/**
 * A type for Alerts, that defines mainly the the color of a alert component
 */
let AlertComponent = class AlertComponent {
    constructor() {
        /**
         * Some visual style for the overall look of this ui element.
         */
        this.theme = PThemeEnum.WARNING;
        /**
         * Gets emitted when the user clicks some kind of close-button. E.g. a `×` on the top right.
         */
        this.dismiss = new EventEmitter();
        this._role = 'alert';
        this._alwaysTrue = true;
        this.visible = true;
    }
    get _isHidden() {
        return !this.visible;
    }
    get _alertDanger() { return this.theme === 'danger'; }
    get _alertDark() { return this.theme === 'dark'; }
    get _alertInfo() { return this.theme === 'info'; }
    get _alertLight() { return this.theme === 'light'; }
    get _alertPlain() { return this.theme === 'plain'; }
    get _alertPrimary() { return this.theme === 'primary'; }
    get _alertSecondary() {
        return this.theme === 'secondary';
    }
    get _alertSuccess() { return this.theme === 'success'; }
    get _alertWarning() { return this.theme === 'warning'; }
    /**
     * Icon to show inside the box.
     */
    get icon() {
        if (this._icon !== undefined)
            return this._icon;
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
    /**
     * when user clicked close
     */
    onClose() {
        this.visible = false;
        this.dismiss.emit();
    }
};
__decorate([
    Input('icon'),
    __metadata("design:type", Object)
], AlertComponent.prototype, "_icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof PAlertTheme !== "undefined" && PAlertTheme) === "function" ? _a : Object)
], AlertComponent.prototype, "theme", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], AlertComponent.prototype, "dismiss", void 0);
__decorate([
    HostBinding('class.alert-dismissible'),
    Input(),
    __metadata("design:type", Object)
], AlertComponent.prototype, "dismissable", void 0);
__decorate([
    HostBinding('attr.role'),
    __metadata("design:type", String)
], AlertComponent.prototype, "_role", void 0);
__decorate([
    HostBinding('class.alert'),
    __metadata("design:type", Boolean)
], AlertComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.d-none'),
    HostBinding('hidden'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_isHidden", null);
__decorate([
    HostBinding('class.alert-danger'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertDanger", null);
__decorate([
    HostBinding('class.alert-dark'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertDark", null);
__decorate([
    HostBinding('class.alert-info'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertInfo", null);
__decorate([
    HostBinding('class.alert-light'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertLight", null);
__decorate([
    HostBinding('class.alert-plain'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertPlain", null);
__decorate([
    HostBinding('class.alert-primary'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertPrimary", null);
__decorate([
    HostBinding('class.alert-secondary'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertSecondary", null);
__decorate([
    HostBinding('class.alert-success'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertSuccess", null);
__decorate([
    HostBinding('class.alert-warning'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], AlertComponent.prototype, "_alertWarning", null);
AlertComponent = __decorate([
    Component({
        selector: 'p-alert',
        templateUrl: './alert.component.html',
        styleUrls: ['./alert.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        animations: [SLIDE_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [])
], AlertComponent);
export { AlertComponent };
//# sourceMappingURL=alert.component.js.map