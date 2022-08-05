import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrentModalsService {
	private modals : string[] = [];

	constructor(
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isModalOpened() : boolean {
		return !!this.modals.length;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public addModal() : void {
		this.modals.push('foo');
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public removeModal() : void {
		this.modals.pop();
	}
}
