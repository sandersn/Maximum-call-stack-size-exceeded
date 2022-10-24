var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { MeService } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PRouterService } from '@plano/shared/core/router.service';
let DetailFormComponent = class DetailFormComponent {
    constructor(api, pRouterService, me, activatedRoute, toastsService, localize, console) {
        this.api = api;
        this.pRouterService = pRouterService;
        this.me = me;
        this.activatedRoute = activatedRoute;
        this.toastsService = toastsService;
        this.localize = localize;
        this.console = console;
        this.PThemeEnum = PThemeEnum;
        this.onAddItem = new EventEmitter();
        this._shiftModelToCopy = null;
    }
    /**
     * Save this item
     */
    saveItem() {
        if (!this.shiftModel.isNewItem())
            return;
        this.onAddItem.emit(this.shiftModel);
        this.navBack();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    navBack() {
        this.pRouterService.navBack();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get routeId() {
        if (!this.activatedRoute.snapshot.paramMap.has('id'))
            return undefined;
        const ID_AS_STRING = this.activatedRoute.snapshot.paramMap.get('id');
        if (ID_AS_STRING === '0')
            return undefined;
        return Id.create(+ID_AS_STRING);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isCopy() {
        return this.pRouterService.url.includes('copy/');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get routeIdItem() {
        if (!this.api.isLoaded())
            return null;
        return this.api.data.shiftModels.get(this.routeId);
    }
    navToCopyPage(event = null) {
        if (event === null) {
            this.pRouterService.navigate([`/client/shiftmodel/0`], { replaceUrl: true });
            return;
        }
        this.pRouterService.navigate([`/client/shiftmodel/copy/${event.toString()}`], { replaceUrl: true });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftModelToCopy() {
        return this._shiftModelToCopy;
    }
    set shiftModelToCopy(input) {
        this._shiftModelToCopy = input;
        const SHIFTMODEL = this.api.data.shiftModels.get(input);
        let title = null;
        let description;
        if (!SHIFTMODEL) {
            this.console.error('shiftModel is not defined ( … , anymore ?)');
            title = null;
            description = this.localize.transform('Formular wurde befüllt');
        }
        else {
            title = this.localize.transform('Formular wurde befüllt');
            description = this.localize.transform('…mit Werten aus der Tätigkeit »${name}«', {
                name: SHIFTMODEL.name,
            });
        }
        this.toastsService.addToast({
            title: title,
            content: description,
            visibilityDuration: 'medium',
            theme: PThemeEnum.SUCCESS,
        });
        this.navToCopyPage(input);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftModelsForInput() {
        return this.api.data.shiftModels.filterBy((item) => {
            if (item.isNewItem())
                return false;
            if (item.trashed)
                return false;
            return true;
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShiftModel !== "undefined" && SchedulingApiShiftModel) === "function" ? _c : Object)
], DetailFormComponent.prototype, "shiftModel", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], DetailFormComponent.prototype, "onAddItem", void 0);
DetailFormComponent = __decorate([
    Component({
        selector: 'detail-form[shiftModel]',
        templateUrl: './detail-form.component.html',
        styleUrls: ['./detail-form.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PRouterService,
        MeService, typeof (_b = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _b : Object, ToastsService,
        LocalizePipe,
        LogService])
], DetailFormComponent);
export { DetailFormComponent };
//# sourceMappingURL=detail-form.component.js.map