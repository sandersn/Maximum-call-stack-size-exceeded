var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RightsService } from '@plano/shared/api';
let ShiftCommentMetaComponent = class ShiftCommentMetaComponent {
    constructor(rightsService) {
        this.rightsService = rightsService;
        this.name = null;
        this.start = null;
        this.end = null;
        this.assignedMembers = null;
    }
    /**
     * Is this member the logged in user?
     * @param member Member that should be checked
     */
    isMe(member) {
        return !!this.rightsService.isMe(member.id);
    }
};
__decorate([
    Input('name'),
    __metadata("design:type", Object)
], ShiftCommentMetaComponent.prototype, "name", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentMetaComponent.prototype, "start", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentMetaComponent.prototype, "end", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftCommentMetaComponent.prototype, "assignedMembers", void 0);
ShiftCommentMetaComponent = __decorate([
    Component({
        selector: 'p-shift-comment-meta',
        templateUrl: './shift-comment-meta.component.html',
        styleUrls: ['./shift-comment-meta.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object])
], ShiftCommentMetaComponent);
export { ShiftCommentMetaComponent };
//# sourceMappingURL=shift-comment-meta.component.js.map