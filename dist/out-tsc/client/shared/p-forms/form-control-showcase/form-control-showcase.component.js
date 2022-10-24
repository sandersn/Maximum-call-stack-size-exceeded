import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { AngularDatePipeFormat, PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize, PTextColorEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { AttributeInfoComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
let FormControlShowcaseComponent = class FormControlShowcaseComponent extends AttributeInfoComponentBaseDirective {
    constructor(pCurrencyPipe, pDatePipe) {
        super(false, undefined);
        this.pCurrencyPipe = pCurrencyPipe;
        this.pDatePipe = pDatePipe;
        this.isLoading = false;
        this._label = null;
        this.description = null;
        this.descriptionHTML = null;
        this.appendContent = null;
        this._contentTheme = null;
        this._monospace = null;
        this.BootstrapSize = BootstrapSize;
    }
    get value() {
        var _a;
        if (this.isLoading)
            return null;
        if (this._content !== undefined)
            return this._content;
        if (!!((_a = this.attributeInfo) === null || _a === void 0 ? void 0 : _a.value))
            return this.attributeInfo.value;
        return null;
    }
    /**
     * Get content for this component.
     */
    get content() {
        if (this.isLoading)
            return '██████';
        if (this.value === null)
            return null;
        return this.getFormattedValue(this.value);
    }
    get primitiveType() {
        if (this._primitiveType !== undefined)
            return this._primitiveType;
        if (this.attributeInfo)
            return this.attributeInfo.primitiveType;
        return PApiPrimitiveTypes.string;
    }
    /**
     * Some content can be linked. Here comes the link. Null if 'unlinkable'.
     */
    get link() {
        if (this.primitiveType === PApiPrimitiveTypes.Email)
            return `mailto:${this.value}`;
        return null;
    }
    /**
     * You can either set an icon, or this component will try to figure out the best icon based on primitiveType
     */
    get icon() {
        if (this._icon !== undefined)
            return this._icon;
        if (this.primitiveType === PApiPrimitiveTypes.Email)
            return PlanoFaIconPool.EMAIL_NOTIFICATION;
        return null;
    }
    getFormattedValue(input) {
        switch (this.primitiveType) {
            case PApiPrimitiveTypes.Currency:
                return this.pCurrencyPipe.transform(input, undefined, undefined, undefined, undefined, undefined, true);
            case PApiPrimitiveTypes.Id:
                return input.toString();
            case PApiPrimitiveTypes.DateTime:
                return `${this.pDatePipe.transform(input, AngularDatePipeFormat.SHORT_DATE)}, ${this.pDatePipe.transform(input, AngularDatePipeFormat.SHORT_TIME)}`;
            default:
                return input.toString();
        }
    }
    /**
     * Get label for this component.
     */
    get label() {
        if (this._label !== null)
            return this._label;
        if (!!this.attributeInfo)
            return this.attributeInfo.name;
        return null;
    }
    /**
     * Get a theme for the content
     */
    get contentTheme() {
        if (this._contentTheme !== null)
            return this._contentTheme;
        if (this.primitiveType !== PApiPrimitiveTypes.Currency)
            return null;
        const value = this.value;
        if (value > 0)
            return PThemeEnum.SUCCESS;
        if (value < 0)
            return PThemeEnum.DANGER;
        return PTextColorEnum.MUTED;
    }
    /**
     * Get a text-color for the content
     */
    get contentThemeClass() {
        if (this.contentTheme === null)
            return '';
        return `text-${this.contentTheme}`;
    }
    /**
     * Should this be shown as monospace or not?
     */
    get isMonospaceType() {
        switch (this.primitiveType) {
            case PApiPrimitiveTypes.Currency:
            case PApiPrimitiveTypes.Id:
            case PApiPrimitiveTypes.DateTime:
            case PApiPrimitiveTypes.number:
            case PApiPrimitiveTypes.Integer:
                return true;
            default:
                return false;
        }
    }
    /**
     * Should this be shown as monospace or not?
     */
    get monospaceClass() {
        if (this._monospace !== null)
            return this._monospace ? 'text-monospace' : '';
        return this.isMonospaceType ? 'text-monospace' : '';
    }
    /**
     * Some content, e.g. html-email-content, should be styled different than string.
     */
    get cardClasses() {
        if (this.primitiveType === 'longText')
            return 'px-3 border-left border-info';
        return '';
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "isLoading", void 0);
__decorate([
    Input('label'),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "_label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "description", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "descriptionHTML", void 0);
__decorate([
    Input('content'),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "_content", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "appendContent", void 0);
__decorate([
    Input('icon'),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "_icon", void 0);
__decorate([
    Input('primitiveType'),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "_primitiveType", void 0);
__decorate([
    Input('contentTheme'),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "_contentTheme", void 0);
__decorate([
    Input('monospace'),
    __metadata("design:type", Object)
], FormControlShowcaseComponent.prototype, "_monospace", void 0);
FormControlShowcaseComponent = __decorate([
    Component({
        selector: 'p-form-control-showcase',
        templateUrl: './form-control-showcase.component.html',
        styleUrls: ['./form-control-showcase.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
    /**
     * In situations where a lot data must be shown but the user will never be able to edit them (like our transactions)
     * we want to show them in another visual style than a input in 'readMode'. The input can be interpreted as indicator
     * that the data can be edited in some other setting. We want to prevent that confusion.
     *
     * @example
     *   <p-form-control-showcase
     *     label="FooBar" i18n-label
     *     [attributeInfo]="item.attributeInfoFooBar"
     *   ></p-form-control-showcase>
     */
    ,
    __metadata("design:paramtypes", [PCurrencyPipe,
        PDatePipe])
], FormControlShowcaseComponent);
export { FormControlShowcaseComponent };
//# sourceMappingURL=form-control-showcase.component.js.map