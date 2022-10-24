import { __decorate, __metadata } from "tslib";
import { Directive, Input, HostBinding } from '@angular/core';
// const pulseAnimation = animation([
// 	style({ transform: 'scale(1)' }),
// 	animate(
// 		'{{ timings }}',
// 		keyframes([
// 			style({ transform: 'scale(1)', offset: 0 }),
// 			style({ transform: 'scale({{ scale }})', offset: 0.5 }),
// 			style({ transform: 'scale(1)', offset: 1 })
// 		])
// 	)
// ]);
let SelectedDirective = class SelectedDirective {
    constructor(
    // private builder : AnimationBuilder,
    // private el : ElementRef
    ) {
        // public player : AnimationPlayer;
        this._selected = false;
    }
    set isSelected(input) {
        this._selected = input;
        // if (this.player) {
        // 	this.player.destroy();
        // }
        //
        // const metadata = show ? [
        // 	useAnimation(pulseAnimation, {
        // 		params: {
        // 			timings: '150ms cubic-bezier(.11,.99,.83,.43)',
        // 			scale: 1.05,
        // 		}
        // 	})
        // 	// style({ opacity: 0 }),
        // 	// animate('400ms ease-in', style({ opacity: 1 })),
        // ] : [
        // 	// useAnimation(pulseAnimation, {
        // 	// 	params: {
        // 	// 		timings: '400ms cubic-bezier(.11,.99,.83,.43)',
        // 	// 		scale: 1.05
        // 	// 	}
        // 	// })
        // 	// style({ opacity: '*' }),
        // 	// animate('400ms ease-in', style({ opacity: 0 })),
        // ];
        //
        // const factory = this.builder.build(metadata);
        // const player = factory.create(this.el.nativeElement);
        //
        // player.play();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isSelected() {
        return this._selected;
    }
};
__decorate([
    HostBinding('class.selected'),
    Input('selected'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], SelectedDirective.prototype, "isSelected", null);
SelectedDirective = __decorate([
    Directive({
        /* eslint-disable @angular-eslint/directive-selector */
        selector: '[selected]',
    }),
    __metadata("design:paramtypes", [])
], SelectedDirective);
export { SelectedDirective };
//# sourceMappingURL=selected.directive.js.map