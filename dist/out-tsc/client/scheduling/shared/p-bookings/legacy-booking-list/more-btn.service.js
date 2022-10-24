var _a;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { LogService } from '../../../../../shared/core/log.service';
import { assumeNonNull } from '../../../../../shared/core/null-type-utils';
let PMoreBtnService = class PMoreBtnService {
    constructor(console) {
        this.console = console;
        this.visibleItemsCounterSteps = null;
        this.visibleItemsCounter = null;
        /**
         * How many items are available all in all?
         */
        this.totalItemsCounter = null;
    }
    /**
     * Set some default values for properties that are not defined yet
     */
    initValues(itemsCounter) {
        if (this.visibleItemsCounter === null)
            this.visibleItemsCounter = 50;
        if (this.visibleItemsCounterSteps === null)
            this.visibleItemsCounterSteps = this.visibleItemsCounter;
        if (itemsCounter !== undefined)
            this.totalItemsCounter = itemsCounter;
    }
    /**
     * Validate if required attributes are set and
     * if the set values work together / make sense / have a working implementation.
     */
    validateValues() {
        assumeNonNull(this.totalItemsCounter, 'totalItemsCounter');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    resetValues(itemsCounter) {
        this.validateValues();
        this.visibleItemsCounter = this.visibleItemsCounterSteps;
        this.totalItemsCounter = itemsCounter;
    }
    /**
     * What is the counter of the next item that will be loaded in the next section if items
     */
    get nextSectionIndexStart() {
        this.validateValues();
        if (this.visibleItemsCounter === null)
            return null;
        return this.visibleItemsCounter + 1;
    }
    /**
     * How many items will be visible after user loaded the next section
     */
    get nextSectionIndexEnd() {
        this.validateValues();
        if (this.nextSectionIndexStart === null)
            return null;
        if (this.visibleItemsCounterSteps === null)
            return null;
        if (this.totalItemsCounter === null)
            return null;
        if (this.visibleItemsCounter === null)
            return null;
        if ((this.nextSectionIndexStart + this.visibleItemsCounterSteps) >= this.totalItemsCounter)
            return this.totalItemsCounter;
        return this.visibleItemsCounter + this.visibleItemsCounterSteps;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get btnTextObj() {
        var _a, _b, _c, _d, _e, _f;
        this.validateValues();
        if (this.nextSectionIndexStart && this.nextSectionIndexEnd && this.nextSectionIndexStart > this.nextSectionIndexEnd) {
            this.console.error('More-Button: SectionEnd ist higher than SectionStart 🤔');
        }
        return {
            index1: (_b = (_a = this.nextSectionIndexStart) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null,
            index2: (_d = (_c = this.nextSectionIndexEnd) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null,
            index3: (_f = (_e = this.totalItemsCounter) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : null,
        };
    }
    /**
     * Counter of how many items should be visible.
     */
    get visibleItemsAmount() {
        return this.visibleItemsCounter;
    }
    /**
     * Run this when user clicks button
     */
    showMore() {
        this.validateValues();
        if (this.visibleItemsCounterSteps === null)
            return;
        if (this.visibleItemsCounter === null)
            return;
        this.visibleItemsCounter = this.visibleItemsCounter + this.visibleItemsCounterSteps;
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this.visibleItemsCounter = null;
        this.visibleItemsCounterSteps = null;
    }
};
PMoreBtnService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof LogService !== "undefined" && LogService) === "function" ? _a : Object])
], PMoreBtnService);
export { PMoreBtnService };
//# sourceMappingURL=more-btn.service.js.map