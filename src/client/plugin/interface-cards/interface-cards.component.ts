import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { SchedulingApiService } from '../../../shared/api';
import { Config } from '../../../shared/core/config';
import { PMomentService } from '../../shared/p-moment.service';

export enum PSupportedPosSystems {
	BOULDERADO = 'boulderado',
	FREECLIMBER = 'freeclimber',
}
export enum PSupportedPaymentSystems {
	PAYPAL = 'paypal',
}
export enum PSupportedRouteDatabases {
	BETA7 = 'beta7',
	ROUTES_MANAGER = 'routes-manager',
}
export enum PSupportedGymDatabases {
	KLETTERSZENE = 'kletterszene',
}

export type PSupportedInterfaces = PSupportedPosSystems | PSupportedPaymentSystems | PSupportedRouteDatabases | PSupportedGymDatabases;

@Component({
	selector: 'p-interface-cards',
	templateUrl: './interface-cards.component.html',
	styleUrls: ['./interface-cards.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class InterfaceCardsComponent {
	@Output() public onClick : EventEmitter<PSupportedInterfaces> = new EventEmitter<PSupportedInterfaces>();
	public paymentSystems = PSupportedPaymentSystems;
	public posSystems = PSupportedPosSystems;
	public routeDatabases = PSupportedRouteDatabases;
	public gymDatabases = PSupportedGymDatabases;

	@Input() public paymentSystem ?: PSupportedPaymentSystems;
	@Input() public posSystem : PSupportedPosSystems | null = null;
	@Input() public isUsingBeta7 : boolean = false;
	@Input() public isUsingRoutesManager : boolean = false;
	@Input() public isUsingKletterszene : boolean = false;

	constructor(
		public api : SchedulingApiService,
		private pMoment : PMomentService,
	) {
	}

	/**
	 * @returns Should the paypal card be shown?
	 */
	public get showPaypal() : boolean {
		if (!this.api.data.isPaypalAvailable) return false;
		const now = +this.pMoment.m();
		return now <= Config.PAYPAL_SHUTDOWN_DATE;
	}
}
