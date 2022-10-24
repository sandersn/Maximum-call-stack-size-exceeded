var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
import { Data } from '@plano/shared/core/data/data';
import { PrimitiveDataInput } from '@plano/shared/core/data/primitive-data-input';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PThemeEnum } from '../../bootstrap-styles.enum';
let DayCommentComponent = class DayCommentComponent {
    constructor(me, api, modalService, textToHtmlService, pMoment) {
        this.me = me;
        this.api = api;
        this.modalService = modalService;
        this.textToHtmlService = textToHtmlService;
        this.pMoment = pMoment;
        this.dayStart = null;
        this.showDateInput = false;
        this.clickable = true;
        // TODO: Its not intuitive that these are true by default
        this.maxLines = true;
        this.maxTextLength = true;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this._memo = new Data(this.api, new PrimitiveDataInput(() => this.dayStart));
    }
    /** ngOnChanges */
    ngOnChanges() {
        // When nothing is set it means "today"
        if (!this.dayStart) {
            this.dayStart = +this.pMoment.m().startOf('day');
        }
        Assertions.ensureIsDayStart(this.dayStart);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get memo() {
        const memo = this.api.data.memos.getByDay(this.dayStart);
        if (!memo)
            return null;
        return this._memo.get(() => memo);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasMemo() {
        return this.api.isLoaded() && !!this.memo && !!this.memo.message;
    }
    /**
     * Modal with question if memo should be removed
     */
    removeMemoPrompt(removeMemoModalContent) {
        this.modalService.openModal(removeMemoModalContent, {
            theme: PThemeEnum.DANGER,
            success: () => {
                assumeNonNull(this.memo);
                this.removeEditableMemo(this.memo);
                this.api.save();
            },
        });
    }
    /**
     * Turn the text into html [and crop it if wanted]
     */
    textToHtml(text) {
        return this.textToHtmlService.textToHtml(text, this.maxTextLength, this.maxLines);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get blockquoteIsClickable() {
        if (!this.clickable)
            return false;
        if (!this.userCanEditMemos && !this.hasMemo)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get userCanEditMemos() {
        return this.api.data.memos.attributeInfoThis.canEdit;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    openMemo(modalContent) {
        this.api.createDataCopy();
        if (!this.hasMemo)
            this.createMemo();
        this.modalService.openModal(modalContent, {
            success: () => {
                this.api.mergeDataCopy();
                assumeNonNull(this.memo);
                if (!this.memo.message.length)
                    this.removeEditableMemo(this.memo);
                // HACK: Sometimes there are memos without a message. i don’t know why. ¯\_(ツ)_/¯
                for (const item of this.api.data.memos.iterable()) {
                    if (item.message.length)
                        continue;
                    this.api.data.memos.removeItem(item);
                }
                this.api.save();
            },
            dismiss: () => {
                this.api.dismissDataCopy();
            },
        });
    }
    createMemo() {
        const newMemo = this.api.data.memos.createNewItem();
        newMemo.start = this.dayStart;
        newMemo.end = this.pMoment.m(this.dayStart).add(1, 'day').valueOf();
        newMemo.message = '';
    }
    /**
     * Remove a memo
     */
    removeEditableMemo(memo) {
        // HACK: Sometimes there are memos without a message. i don’t know why. ¯\_(ツ)_/¯
        for (const item of this.api.data.memos.iterable()) {
            if (item.message.length)
                continue;
            this.api.data.memos.removeItem(item);
        }
        this.api.data.memos.removeItem(memo);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], DayCommentComponent.prototype, "dayStart", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], DayCommentComponent.prototype, "showDateInput", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], DayCommentComponent.prototype, "clickable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DayCommentComponent.prototype, "maxLines", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DayCommentComponent.prototype, "maxTextLength", void 0);
DayCommentComponent = __decorate([
    Component({
        selector: 'p-day-comment',
        templateUrl: './day-comment.component.html',
        styleUrls: ['./day-comment.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [MeService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, ModalService, typeof (_b = typeof TextToHtmlService !== "undefined" && TextToHtmlService) === "function" ? _b : Object, PMomentService])
], DayCommentComponent);
export { DayCommentComponent };
//# sourceMappingURL=day-comment.component.js.map