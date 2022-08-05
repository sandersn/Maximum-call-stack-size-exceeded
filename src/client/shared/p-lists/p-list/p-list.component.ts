import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'p-list',
	templateUrl: './p-list.component.html',
	styleUrls: ['./p-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PListComponent {
	constructor(
	) {
	}
}
