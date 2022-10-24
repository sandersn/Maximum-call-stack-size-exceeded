var _a, _b;
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { LogService } from '../../log.service';
import { ModalService } from '../../p-modal/modal.service';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';
let PInfoCircleComponent = class PInfoCircleComponent {
    constructor(changeDetectorRef, localize, console, modalService) {
        this.changeDetectorRef = changeDetectorRef;
        this.localize = localize;
        this.console = console;
        this.modalService = modalService;
        this.headline = null;
        this.placement = 'auto';
        this.icon = PlanoFaIconPool.MORE_INFO_TOOLTIP;
        this.theme = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isMobile() {
        if (this._isMobile !== undefined)
            return this._isMobile;
        return Config.IS_MOBILE;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get label() {
        if (this.headline)
            return this.headline;
        switch (this.theme) {
            case PThemeEnum.WARNING:
                return this.localize.transform('Warnung');
            case PThemeEnum.DANGER:
                return this.localize.transform('Achtung');
            case PThemeEnum.INFO:
                return this.localize.transform('Info');
            case PThemeEnum.DARK:
            case PThemeEnum.LIGHT:
            case PThemeEnum.PRIMARY:
            case PThemeEnum.SECONDARY:
            case PThemeEnum.SUCCESS:
            case undefined:
                if (this.headline)
                    return this.headline;
                return this.localize.transform('Info');
            default:
                this.console.error(`${this.headline} not supported yet`);
                return this.localize.transform('Info');
        }
    }
    ngAfterViewInit() {
        this.changeDetectorRef.detectChanges();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClickIcon(pop) {
        var _a;
        if (!this.isMobile) {
            pop.hide();
        }
        else {
            if (!this.ngContentRef) {
                this.console.error('ngContentRef not defined');
                return;
            }
            if (!this.ngContentRef.nativeElement) {
                this.console.error('ngContentRef.nativeElement not defined');
                return;
            }
            if (!this.ngContentRef.nativeElement.innerHTML) {
                this.console.error('ngContentRef.nativeElement.innerHTML not defined');
                return;
            }
            this.modalService.openDefaultModal({
                modalTitle: this.label,
                description: this.ngContentRef.nativeElement.innerHTML,
            }, {
                theme: (_a = this.theme) !== null && _a !== void 0 ? _a : null,
                centered: true,
            });
        }
    }
};
__decorate([
    Input('isMobile'),
    __metadata("design:type", Boolean)
], PInfoCircleComponent.prototype, "_isMobile", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInfoCircleComponent.prototype, "headline", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PInfoCircleComponent.prototype, "placement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInfoCircleComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInfoCircleComponent.prototype, "theme", void 0);
__decorate([
    ViewChild('ngContentRef', { static: true }),
    __metadata("design:type", typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object)
], PInfoCircleComponent.prototype, "ngContentRef", void 0);
PInfoCircleComponent = __decorate([
    Component({
        selector: 'p-info-circle',
        templateUrl: './info-circle.component.html',
        styleUrls: ['./info-circle.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, LocalizePipe,
        LogService,
        ModalService])
], PInfoCircleComponent);
export { PInfoCircleComponent };
//# sourceMappingURL=info-circle.component.js.map