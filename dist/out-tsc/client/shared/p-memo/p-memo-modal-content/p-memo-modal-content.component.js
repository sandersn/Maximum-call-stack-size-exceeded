var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, Input, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
let PMemoModalContentComponent = class PMemoModalContentComponent {
    constructor(api, changeDetectorRef, textToHtmlService, pMoment) {
        this.api = api;
        this.changeDetectorRef = changeDetectorRef;
        this.textToHtmlService = textToHtmlService;
        this.pMoment = pMoment;
        this.memo = null;
        this.memoModalDay = null;
        this._showDateInput = true;
        /**
         * Theme defines the background color/style of the Modal
         */
        this.theme = null;
        this.onClose = new EventEmitter();
        this.dismiss = new EventEmitter();
        /** maximum date and time of this input in timestamp format */
        this.max = 0;
        /** minimum date and time of this input in timestamp format */
        this.min = 0;
        this.CONFIG = Config;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showDateInput() {
        if (!this._showDateInput)
            return false;
        if (!this.userCanEditMemos)
            return false;
        return true;
    }
    ngOnInit() {
        this.initValues();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    initValues() {
        this.initMemoModalDay();
        this.initMemo();
    }
    initMemoModalDay() {
        var _a;
        if (this.memoModalDay)
            return;
        if ((_a = this.memo) === null || _a === void 0 ? void 0 : _a.start) {
            this.memoModalDay = this.memo.start;
        }
    }
    initMemo() {
        if (this.memo)
            return;
        // No given memo? Get one by time
        if (!this.memoModalDay)
            return;
        this.clearPrevMemo();
        this.memo = this.api.data.memos.getByDay(this.memoModalDay);
        this.changeDetectorRef.markForCheck();
        // Can not get a memo? Create one.
        if (!this.memo)
            this.createMemo();
    }
    clearPrevMemo() {
        var _a;
        if ((_a = this.memo) === null || _a === void 0 ? void 0 : _a.isNewItem())
            this.api.data.memos.removeItem(this.memo);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onDateChange(input) {
        var _a;
        this.memoModalDay = input;
        if ((_a = this.memo) === null || _a === void 0 ? void 0 : _a.isNewItem()) {
            this.api.data.memos.removeItem(this.memo);
        }
        this.memo = null;
        this.initMemo();
    }
    createMemo() {
        this.clearPrevMemo();
        this.memo = this.api.data.memos.createNewItem();
        // this.changeDetectorRef.markForCheck();
        const momentDay = this.pMoment.m(this.memoModalDay).startOf('day');
        this.memo.start = momentDay.valueOf();
        this.memo.end = momentDay.add(1, 'day').valueOf();
        this.memo.message = '';
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onDismiss() {
        var _a;
        if ((_a = this.memo) === null || _a === void 0 ? void 0 : _a.isNewItem())
            this.api.data.memos.removeItem(this.memo);
        this.memo = null;
        this.dismiss.emit();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onRemoveMemo() {
        assumeNonNull(this.memo);
        this.memo.message = '';
        this.onClose.emit();
    }
    /**
     * Turn the text into html [and crop it if wanted]
     */
    textToHtml(text) {
        return this.textToHtmlService.textToHtml(text, false, false);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showBlockquote() {
        // if (Config.IS_MOBILE) return true;
        if (!this.userCanEditMemos)
            return true;
        return false;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMemoModalContentComponent.prototype, "memo", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMemoModalContentComponent.prototype, "memoModalDay", void 0);
__decorate([
    Input('showDateInput'),
    __metadata("design:type", Boolean)
], PMemoModalContentComponent.prototype, "_showDateInput", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PMemoModalContentComponent.prototype, "userCanEditMemos", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMemoModalContentComponent.prototype, "theme", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PMemoModalContentComponent.prototype, "onClose", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PMemoModalContentComponent.prototype, "dismiss", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PMemoModalContentComponent.prototype, "max", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PMemoModalContentComponent.prototype, "min", void 0);
PMemoModalContentComponent = __decorate([
    Component({
        selector: 'p-memo-modal-content[userCanEditMemos]',
        templateUrl: './p-memo-modal-content.component.html',
        // styleUrls: ['./p-led.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, typeof (_c = typeof TextToHtmlService !== "undefined" && TextToHtmlService) === "function" ? _c : Object, PMomentService])
], PMemoModalContentComponent);
export { PMemoModalContentComponent };
//# sourceMappingURL=p-memo-modal-content.component.js.map