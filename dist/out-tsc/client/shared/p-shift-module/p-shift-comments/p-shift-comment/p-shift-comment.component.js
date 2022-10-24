var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../../shared/core/null-type-utils';
let PShiftCommentComponent = class PShiftCommentComponent {
    constructor(api, modalService, textToHtmlService) {
        this.api = api;
        this.modalService = modalService;
        this.textToHtmlService = textToHtmlService;
        this.todaysShiftDescription = null;
        this.shift = null;
        this.userCanWrite = false;
        this.config = Config;
        this.PThemeEnum = PThemeEnum;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get item() {
        if (this.shift)
            return this.shift;
        if (this.todaysShiftDescription)
            return this.todaysShiftDescription;
        return null;
    }
    textToHtml(text, doNotCut) {
        return this.textToHtmlService.textToHtml(text, doNotCut, doNotCut);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    innerHTML(doNotCut = false) {
        if (!this.api.isLoaded())
            return undefined;
        assumeNonNull(this.item);
        assumeDefinedToGetStrictNullChecksRunning(this.item.description, 'this.item.description');
        const description = this.textToHtml(this.item.description, doNotCut);
        if (description)
            return description;
        return '…';
    }
    /**
     * Modal with question if comments should be removed
     */
    removeDescriptionPrompt(removeMemoModalContent) {
        this.modalService.openModal(removeMemoModalContent, {
            theme: PThemeEnum.DANGER,
            success: () => {
                this.removeDescriptionAndSave();
            },
        });
    }
    /**
     * Remove a comment
     */
    removeDescriptionAndSave() {
        this.removeDescription();
        this.api.save();
    }
    removeDescription() {
        if (this.shift)
            this.shift.description = '';
        if (this.todaysShiftDescription)
            this.todaysShiftDescription.description = '';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftModel() {
        if (this.shift) {
            return this.api.data.shiftModels.get(this.shift.id.shiftModelId);
        }
        if (this.todaysShiftDescription)
            return this.api.data.shiftModels.get(this.todaysShiftDescription.id.shiftModelId);
        return null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get title() {
        if (this.shift)
            return this.shift.name;
        if (this.shiftModel)
            return this.shiftModel.name;
        if (this.todaysShiftDescription)
            return this.todaysShiftDescription.name;
        return '';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get start() {
        if (this.shift)
            return this.shift.start;
        if (this.todaysShiftDescription)
            return this.todaysShiftDescription.shiftStart;
        return undefined;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftCommentComponent.prototype, "todaysShiftDescription", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftCommentComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftCommentComponent.prototype, "userCanWrite", void 0);
PShiftCommentComponent = __decorate([
    Component({
        selector: 'p-shift-comment',
        templateUrl: './p-shift-comment.component.html',
        styleUrls: ['./p-shift-comment.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, ModalService, typeof (_b = typeof TextToHtmlService !== "undefined" && TextToHtmlService) === "function" ? _b : Object])
], PShiftCommentComponent);
export { PShiftCommentComponent };
//# sourceMappingURL=p-shift-comment.component.js.map