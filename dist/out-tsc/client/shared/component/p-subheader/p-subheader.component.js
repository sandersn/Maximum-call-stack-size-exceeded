var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { BootstrapSize } from '../../bootstrap-styles.enum';
let PSubheaderComponent = class PSubheaderComponent {
    constructor(pRouterService, localize) {
        this.pRouterService = pRouterService;
        this.localize = localize;
        this.isNewItem = false;
        this.onNavBack = new EventEmitter();
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get text() {
        return this.isNewItem ? this.localize.transform('Verwerfen') : this.localize.transform('Zurück');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    navBack() {
        this.pRouterService.navBack();
        this.onNavBack.emit();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSubheaderComponent.prototype, "isNewItem", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PSubheaderComponent.prototype, "onNavBack", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PSubheaderComponent.prototype, "containerSize", void 0);
PSubheaderComponent = __decorate([
    Component({
        selector: 'p-subheader',
        templateUrl: './p-subheader.component.html',
        styleUrls: ['./p-subheader.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [PRouterService,
        LocalizePipe])
], PSubheaderComponent);
export { PSubheaderComponent };
//# sourceMappingURL=p-subheader.component.js.map