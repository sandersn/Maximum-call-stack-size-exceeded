import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Input, HostBinding, Component } from '@angular/core';
import { BootstrapSize, PThemeEnum } from '../bootstrap-styles.enum';
let PLedComponent = class PLedComponent {
    constructor() {
        /**
         * Does the LED has electricity?
         * true if not.
         */
        this.off = true;
        /**
         * What color style should the led have if turned on?
         */
        this.theme = PThemeEnum.SUCCESS;
        /**
         * Is it a big or small LED?
         */
        this.size = null;
        this.PThemeEnum = PThemeEnum;
    }
    get hasClassSmall() {
        return this.size === BootstrapSize.SM;
    }
    get hasClassLarge() {
        return this.size === BootstrapSize.LG;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PLedComponent.prototype, "off", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PLedComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PLedComponent.prototype, "size", void 0);
__decorate([
    HostBinding('class.small'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PLedComponent.prototype, "hasClassSmall", null);
__decorate([
    HostBinding('class.large'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PLedComponent.prototype, "hasClassLarge", null);
PLedComponent = __decorate([
    Component({
        selector: 'p-led',
        templateUrl: './p-led.component.html',
        styleUrls: ['./p-led.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PLedComponent);
export { PLedComponent };
//# sourceMappingURL=p-led.component.js.map