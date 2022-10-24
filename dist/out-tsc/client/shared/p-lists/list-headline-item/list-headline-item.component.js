var _a;
import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { Input } from '@angular/core';
export var ListSortDirection;
(function (ListSortDirection) {
    ListSortDirection[ListSortDirection["UP"] = 0] = "UP";
    ListSortDirection[ListSortDirection["DOWN"] = 1] = "DOWN";
    ListSortDirection[ListSortDirection["INACTIVE"] = 2] = "INACTIVE";
})(ListSortDirection || (ListSortDirection = {}));
let ListHeadlineItemComponent = class ListHeadlineItemComponent {
    constructor() {
        this.isLoading = null;
        /**
         * Icon for the label of this item
         */
        this.labelIcon = null;
        /**
         * Text of this item
         */
        this.label = null;
        /**
         * Effects some icon.
         * If set to undefined/null, it will hide the icon and disable click events.
         */
        this.sortDirection = ListSortDirection.INACTIVE;
        /**
         * Emits the new SortDirection when changed
         */
        this.onToggle = new EventEmitter();
        /**
         * Is it possible to sort the list by this?
         */
        this.disabled = false;
        this.ListSortDirection = ListSortDirection;
    }
    clicked() {
        this.sortDirection = this.sortDirection === ListSortDirection.DOWN ? ListSortDirection.UP : ListSortDirection.DOWN;
        return this.onToggle.emit(this.sortDirection);
    }
    /**
     * Is it possible to sort the list by this
     */
    get isClickable() {
        if (this.disabled)
            return false;
        if (!this.onToggle.observers.length)
            return false;
        return true;
    }
};
__decorate([
    HostBinding('class.text-skeleton-animated'),
    Input(),
    __metadata("design:type", Object)
], ListHeadlineItemComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListHeadlineItemComponent.prototype, "labelIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListHeadlineItemComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], ListHeadlineItemComponent.prototype, "sortDirection", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], ListHeadlineItemComponent.prototype, "onToggle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ListHeadlineItemComponent.prototype, "disabled", void 0);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ListHeadlineItemComponent.prototype, "clicked", null);
__decorate([
    HostBinding('class.clickable'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ListHeadlineItemComponent.prototype, "isClickable", null);
ListHeadlineItemComponent = __decorate([
    Component({
        selector: 'p-list-headline-item',
        templateUrl: './list-headline-item.component.html',
        styleUrls: ['./list-headline-item.component.scss'],
    }),
    __metadata("design:paramtypes", [])
], ListHeadlineItemComponent);
export { ListHeadlineItemComponent };
//# sourceMappingURL=list-headline-item.component.js.map