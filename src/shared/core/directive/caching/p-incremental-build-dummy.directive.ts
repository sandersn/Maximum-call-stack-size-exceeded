import { Directive, Input } from '@angular/core';
@Directive({
	/* eslint-disable @angular-eslint/directive-selector */
	selector: '[ngIncrementalBuild]',
})
export class PIncrementalBuildDummyDirective {
// eslint-disable-next-line jsdoc/require-jsdoc
	@Input() public set ngIncrementalBuild(_input : number) {
	}
}
