import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { Config } from '../../../shared/core/config';
import { PlanoFaIconPool } from '../../../shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '../../../shared/core/router.service';
import { BootstrapSize, PThemeEnum } from '../../shared/bootstrap-styles.enum';



@Component({
	selector: 'p-faq-online-payment',
	templateUrl: './faq-online-payment.component.html',
	styleUrls: ['./faq-online-payment.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class FaqOnlinePaymentComponent implements OnDestroy {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	public Config = Config;

	constructor(
		private pRouterService : PRouterService,
	) {
		this.navigationSubscription = this.pRouterService.handleAnchorLinks();
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;

	private navigationSubscription : Subscription | null = null;

	/**
	 * true if theres a discount active
	 */
	public get isDiscountActive() : boolean {
		return Date.now() < Config.ONBOARDING_DISCOUNT_DATE;
	}

	public ngOnDestroy() : void {
		this.navigationSubscription?.unsubscribe();
	}

}
