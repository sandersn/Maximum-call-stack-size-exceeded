import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PBackgroundColorEnum, PThemeEnum } from '../../bootstrap-styles.enum';
const initialBackgroundStyle = PBackgroundColorEnum.WHITE;
let StickyNoteComponent = class StickyNoteComponent {
    constructor() {
        this.showDot = false;
        this._backgroundColor = initialBackgroundStyle;
        this.height = '24';
        this.displayBlock = false;
        this.PBackgroundColorEnum = PBackgroundColorEnum;
        this.PThemeEnum = PThemeEnum;
    }
    /**
     * The defined backgroundColor decides which icon should be shown for best contrast results
     */
    set backgroundColor(input) {
        if (input === null) {
            if (this._backgroundColor !== initialBackgroundStyle)
                this._backgroundColor = initialBackgroundStyle;
            return;
        }
        this._backgroundColor = input;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get backgroundColor() {
        return this._backgroundColor;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], StickyNoteComponent.prototype, "showDot", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], StickyNoteComponent.prototype, "backgroundColor", null);
__decorate([
    Input(),
    __metadata("design:type", String)
], StickyNoteComponent.prototype, "height", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], StickyNoteComponent.prototype, "displayBlock", void 0);
StickyNoteComponent = __decorate([
    Component({
        selector: 'p-sticky-note',
        templateUrl: './sticky-note.component.html',
        styleUrls: ['./sticky-note.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], StickyNoteComponent);
export { StickyNoteComponent };
//# sourceMappingURL=sticky-note.component.js.map