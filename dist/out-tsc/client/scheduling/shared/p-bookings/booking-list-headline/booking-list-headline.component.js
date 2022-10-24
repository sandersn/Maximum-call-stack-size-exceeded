import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ListSortDirection } from '@plano/client/shared/p-lists/list-headline-item/list-headline-item.component';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '../../../../../shared/core/plano-fa-icon-pool.enum';
import { BookingsSortedByEmum } from '../booking-list/booking-list.component';
let BookingListHeadlineComponent = class BookingListHeadlineComponent {
    constructor() {
        this.isLoading = null;
        this.sortedBy = null;
        this.sortedByChange = new EventEmitter();
        this.sortedReverse = null;
        this.sortedReverseChange = new EventEmitter();
        this.groupByCourses = true;
        this.BookingsSortedByEmum = BookingsSortedByEmum;
        this.ListSortDirection = ListSortDirection;
        this.Config = Config;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this._alwaysTrue = true;
    }
    /**
     * Set new sortedBy value and update sortedRevers value.
     */
    setSorter(input) {
        if (this.sortedBy === input) {
            this.sortedReverse = !this.sortedReverse;
        }
        else {
            this.sortedReverse = false;
            this.sortedBy = input;
        }
        this.sortedByChange.emit(this.sortedBy);
        this.sortedReverseChange.emit(this.sortedReverse);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], BookingListHeadlineComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], BookingListHeadlineComponent.prototype, "sortedBy", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], BookingListHeadlineComponent.prototype, "sortedByChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], BookingListHeadlineComponent.prototype, "sortedReverse", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], BookingListHeadlineComponent.prototype, "sortedReverseChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], BookingListHeadlineComponent.prototype, "groupByCourses", void 0);
__decorate([
    HostBinding('class.rounded'),
    HostBinding('class.d-flex'),
    HostBinding('class.bg-light-cold'),
    __metadata("design:type", Object)
], BookingListHeadlineComponent.prototype, "_alwaysTrue", void 0);
BookingListHeadlineComponent = __decorate([
    Component({
        selector: 'p-booking-list-headline',
        templateUrl: './booking-list-headline.component.html',
        styleUrls: ['./booking-list-headline.component.scss'],
    }),
    __metadata("design:paramtypes", [])
], BookingListHeadlineComponent);
export { BookingListHeadlineComponent };
//# sourceMappingURL=booking-list-headline.component.js.map