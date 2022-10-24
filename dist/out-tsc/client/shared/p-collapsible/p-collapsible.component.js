var _a;
import { __decorate, __metadata } from "tslib";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, Input, ViewChild, ElementRef, HostBinding, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ANIMATION_SPEED_FAST } from '../../../animations';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { BootstrapSize } from '../bootstrap-styles.enum';
export const pCollapsibleAnimationSpeed = ANIMATION_SPEED_FAST;
/**
 * @example with content
 * <p-collapsible>
 * 	<span trigger>Trigger</span>
 * 	<div content>Content</div>
 * </p-collapsible>
 *
 * @example without content
 * 	<p-collapsible #collapsibleTrigger>
 * 		<span trigger>Trigger</span>
 * 	</p-collapsible>
 * 	<div class="fancy-thing" *ngIf="!collapsibleTrigger.collapsed"></div>
 */
let PCollapsibleComponent = class PCollapsibleComponent {
    constructor() {
        this.hasDanger = false;
        this.borderPrimary = false;
        /**
         * Visual size of this component.
         * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
         */
        this.size = BootstrapSize.LG;
        this.collapsedChange = new EventEmitter();
        this._alwaysTrue = true;
        this.collapsed = true;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.hasContent = false;
    }
    get sizeIsSm() {
        return this.size === 'sm';
    }
    get hasShadowLg() {
        return !this.collapsed && this.size === BootstrapSize.LG;
    }
    get hasShadow() {
        return !this.collapsed && this.size === BootstrapSize.SM;
    }
    ngAfterContentInit() {
    }
    ngAfterViewInit() {
        assumeDefinedToGetStrictNullChecksRunning(this.ngContentContainer, 'ngContentContainer');
        this.hasContent = !!this.ngContentContainer.nativeElement.previousSibling;
    }
    /**
     * Toggle the state if this is collapsed or not.
     */
    setCollapsed(input) {
        this.collapsed = input.collapsedState;
        this.collapsedChange.emit(input);
    }
    /**
     * Toggle the state if this is collapsed or not.
     */
    toggle(event) {
        this.setCollapsed({ event: event, collapsedState: !this.collapsed });
    }
};
__decorate([
    HostBinding('class.border-danger'),
    Input(),
    __metadata("design:type", Boolean)
], PCollapsibleComponent.prototype, "hasDanger", void 0);
__decorate([
    HostBinding('class.border-primary'),
    Input(),
    __metadata("design:type", Boolean)
], PCollapsibleComponent.prototype, "borderPrimary", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PCollapsibleComponent.prototype, "size", void 0);
__decorate([
    ViewChild('ngContentContainer'),
    __metadata("design:type", typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object)
], PCollapsibleComponent.prototype, "ngContentContainer", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PCollapsibleComponent.prototype, "collapsedChange", void 0);
__decorate([
    HostBinding('class.card'),
    __metadata("design:type", Object)
], PCollapsibleComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.mb-1'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PCollapsibleComponent.prototype, "sizeIsSm", null);
__decorate([
    HostBinding('class.collapsed'),
    Input(),
    __metadata("design:type", Boolean)
], PCollapsibleComponent.prototype, "collapsed", void 0);
__decorate([
    HostBinding('class.shadow-lg'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PCollapsibleComponent.prototype, "hasShadowLg", null);
__decorate([
    HostBinding('class.shadow'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PCollapsibleComponent.prototype, "hasShadow", null);
__decorate([
    HostBinding('class.has-content'),
    __metadata("design:type", Boolean)
], PCollapsibleComponent.prototype, "hasContent", void 0);
PCollapsibleComponent = __decorate([
    Component({
        selector: 'p-collapsible',
        templateUrl: './p-collapsible.component.html',
        styleUrls: ['./p-collapsible.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        animations: [
            trigger('slideOpen', [
                state('false, void', style({ height: '0px', overflow: 'hidden' })),
                state('true', style({ height: '*' })),
                transition('true <=> false', [animate(pCollapsibleAnimationSpeed)]),
            ]),
        ],
    }),
    __metadata("design:paramtypes", [])
], PCollapsibleComponent);
export { PCollapsibleComponent };
//# sourceMappingURL=p-collapsible.component.js.map