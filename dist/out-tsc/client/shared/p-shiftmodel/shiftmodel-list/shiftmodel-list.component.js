var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Input, Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { SchedulingApiShiftModels } from '@plano/shared/api';
let PShiftmodelListComponent = class PShiftmodelListComponent {
    constructor() {
        this.isLoading = false;
        this.shiftModels = new SchedulingApiShiftModels(null, false);
        this.contentTemplate = null;
        this.label = null;
        this.selectedItemId = null;
        this.onItemClick = new EventEmitter();
        this.parentNames = [];
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasOnItemClickBinding() {
        return this.onItemClick.observers.length > 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onClickItem(shiftModel) {
        if (!this.hasOnItemClickBinding)
            return;
        this.selectedItemId = shiftModel.id;
        this.onItemClick.emit(shiftModel);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isSelected(shiftModel) {
        return this.selectedItemId === shiftModel.id;
    }
    ngAfterContentChecked() {
        this.refreshParentNames();
    }
    refreshParentNames() {
        this.parentNames = this.shiftModels.parentNames.sort();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getShiftModelsIterableByParentName(parentName) {
        return this.shiftModels.filterBy(shiftModel => shiftModel.parentName === parentName).iterableSortedBy(shiftModel => shiftModel.name);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftmodelListComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof SchedulingApiShiftModels !== "undefined" && SchedulingApiShiftModels) === "function" ? _a : Object)
], PShiftmodelListComponent.prototype, "shiftModels", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftmodelListComponent.prototype, "contentTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftmodelListComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftmodelListComponent.prototype, "selectedItemId", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PShiftmodelListComponent.prototype, "onItemClick", void 0);
PShiftmodelListComponent = __decorate([
    Component({
        selector: 'p-shiftmodel-list',
        templateUrl: './shiftmodel-list.component.html',
        styleUrls: ['./shiftmodel-list.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PShiftmodelListComponent);
export { PShiftmodelListComponent };
//# sourceMappingURL=shiftmodel-list.component.js.map