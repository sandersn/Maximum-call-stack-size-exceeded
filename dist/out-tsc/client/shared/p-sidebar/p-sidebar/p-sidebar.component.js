import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, HostListener, Input, ChangeDetectionStrategy } from '@angular/core';
import { PSidebarService } from '@plano/client/shared/p-sidebar/p-sidebar.service';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';
let PSidebarComponent = class PSidebarComponent {
    constructor(pSidebarService, localize) {
        this.pSidebarService = pSidebarService;
        this.localize = localize;
        this._alwaysTrue = true;
        this.showStickyNoteIcon = false;
        this.showStickyNoteIconDot = false;
        this.showFilterIcon = false;
        this.badgeContent = null;
        this.config = Config;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this.initValues();
    }
    get collapsed() {
        return !!this.pSidebarService.mainSidebarIsCollapsed;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hideIfCollapsed() {
        return !Config.IS_MOBILE;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get mobileMode() {
        return Config.IS_MOBILE;
    }
    get _classUncollapsed() { return !this.collapsed; }
    _onClick() {
        if (!this.collapsed)
            return;
        this.toggleCollapsed();
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    toggleCollapsed(event) {
        if (event)
            event.stopPropagation();
        this.pSidebarService.mainSidebarIsCollapsed = !this.pSidebarService.mainSidebarIsCollapsed;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showFilterIconPopover() {
        if (!this.showFilterIcon)
            return this.localize.transform('Filter aus');
        return this.localize.transform('Filter sind aktiv');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get badgeContentPopover() {
        return this.localize.transform('${amount} To-dos vorhanden', { amount: this.badgeContent.toString() });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showStickyNoteIconPopover() {
        if (!this.showStickyNoteIcon)
            return this.localize.transform('Kein Kommentar für dich vorhanden');
        return this.localize.transform('Kommentare für dich vorhanden');
    }
};
__decorate([
    HostBinding('class.d-flex'),
    __metadata("design:type", Object)
], PSidebarComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.p-0'),
    HostBinding('class.btn-frameless'),
    HostBinding('class.btn-dark'),
    HostBinding('class.border-right'),
    HostBinding('class.btn')
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    ,
    HostBinding('class.collapsed'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PSidebarComponent.prototype, "collapsed", null);
__decorate([
    HostBinding('class.desktop-mode'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PSidebarComponent.prototype, "hideIfCollapsed", null);
__decorate([
    HostBinding('class.mobile-mode'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PSidebarComponent.prototype, "mobileMode", null);
__decorate([
    HostBinding('class.uncollapsed'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PSidebarComponent.prototype, "_classUncollapsed", null);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PSidebarComponent.prototype, "_onClick", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSidebarComponent.prototype, "showStickyNoteIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSidebarComponent.prototype, "showStickyNoteIconDot", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSidebarComponent.prototype, "showFilterIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSidebarComponent.prototype, "badgeContent", void 0);
PSidebarComponent = __decorate([
    Component({
        selector: 'p-sidebar',
        templateUrl: './p-sidebar.component.html',
        styleUrls: ['./p-sidebar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [PSidebarService,
        LocalizePipe])
], PSidebarComponent);
export { PSidebarComponent };
//# sourceMappingURL=p-sidebar.component.js.map