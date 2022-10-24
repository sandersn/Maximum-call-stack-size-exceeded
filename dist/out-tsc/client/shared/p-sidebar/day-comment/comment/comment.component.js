var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiService } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../../../../shared/core/null-type-utils';
let CommentComponent = class CommentComponent {
    constructor(api, modalService, textToHtmlService, console) {
        this.api = api;
        this.modalService = modalService;
        this.textToHtmlService = textToHtmlService;
        this.console = console;
        this.memo = null;
        this.showDateInput = false;
        this.clickable = true;
        // TODO: Its not intuitive that these are true by default
        this.maxLines = true;
        this.maxTextLength = true;
        this.onSave = new EventEmitter();
        this.onOpenModal = new EventEmitter();
        this.onModalSuccess = new EventEmitter();
        this.onModalDismiss = new EventEmitter();
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
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
                this.onSave.emit();
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
    openMemo(modalContent) {
        this.onOpenModal.emit();
        if (!this.hasMemo) {
            this.console.error('No memo available');
            return;
        }
        this.modalService.openModal(modalContent, {
            success: () => {
                this.onModalSuccess.emit();
            },
            dismiss: () => {
                this.onModalDismiss.emit();
            },
        });
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
], CommentComponent.prototype, "memo", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CommentComponent.prototype, "showDateInput", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CommentComponent.prototype, "clickable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CommentComponent.prototype, "maxLines", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CommentComponent.prototype, "maxTextLength", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CommentComponent.prototype, "userCanEditMemos", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], CommentComponent.prototype, "onSave", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], CommentComponent.prototype, "onOpenModal", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], CommentComponent.prototype, "onModalSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], CommentComponent.prototype, "onModalDismiss", void 0);
CommentComponent = __decorate([
    Component({
        selector: 'p-comment[userCanEditMemos]',
        templateUrl: './comment.component.html',
        styleUrls: ['./comment.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, ModalService, typeof (_b = typeof TextToHtmlService !== "undefined" && TextToHtmlService) === "function" ? _b : Object, LogService])
], CommentComponent);
export { CommentComponent };
//# sourceMappingURL=comment.component.js.map