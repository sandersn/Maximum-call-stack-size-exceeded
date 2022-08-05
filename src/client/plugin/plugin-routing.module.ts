import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { Beta7Component } from './beta7/beta7.component';
import { BoulderadoComponent } from './boulderado/boulderado.component';
import { FaqOnlinePaymentComponent } from './faq-online-payment/faq-online-payment.component';
import { FreeclimberComponent } from './freeclimber/freeclimber.component';
import { KletterszeneComponent } from './kletterszene/kletterszene.component';
import { PayPalComponent } from './paypal/paypal.component';
import { PluginComponent } from './plugin.component';
import { RoutesManagerComponent } from './routes-manager/routes-manager.component';
import { VoucherRedirectComponent } from './voucher-redirect/voucher-redirect.component';

export const ROUTES : Routes = [
	{ path: 'paypal', component: PayPalComponent },
	{ path: 'boulderado', component: BoulderadoComponent },
	{ path: 'freeclimber', component: FreeclimberComponent },
	{ path: 'beta7', component: Beta7Component },
	{ path: 'routes-manager', component: RoutesManagerComponent },
	{ path: 'kletterszene', component: KletterszeneComponent },
	{ path: 'faq-online-payment', component: FaqOnlinePaymentComponent },
	{ path: 'voucher/:id', component: VoucherRedirectComponent },
	{ path: ':opentab', component: PluginComponent },
	{ path: '', component: PluginComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class PluginRoutingModule { }
