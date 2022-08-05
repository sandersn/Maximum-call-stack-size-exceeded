import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'p-placeholder-input',
	templateUrl: './p-placeholder-input.component.html',
	styleUrls: ['./p-placeholder-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PPlaceholderInputComponent {
	@Input() public placeholder : string | null = null;
	@Input() public description : string | null = null;

	constructor(
	) {
	}
}
