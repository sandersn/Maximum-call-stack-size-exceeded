import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { Beta7Component } from './beta7/beta7.component';
import { BoulderadoComponent } from './boulderado/boulderado.component';
import { FaqOnlinePaymentComponent } from './faq-online-payment/faq-online-payment.component';
import { FreeclimberComponent } from './freeclimber/freeclimber.component';
import { PInputFreeclimberArticleIdComponent } from './freeclimber/p-input-freeclimber-article-id/p-input-freeclimber-article-id.component';
import { InterfaceCardComponent } from './interface-cards/interface-card/interface-card.component';
import { InterfaceCardsComponent } from './interface-cards/interface-cards.component';
import { KletterszeneComponent } from './kletterszene/kletterszene.component';
import { PBookingPluginPreviewComponent } from './p-booking-plugin-preview/p-booking-plugin-preview.component';
import { PCustomCourseEmailsModule } from './p-custom-course-emails/p-custom-course-emails.module';
import { PPluginSettingsComponent } from './p-plugin-settings/p-plugin-settings.component';
import { PayPalComponent } from './paypal/paypal.component';
import { PluginRoutingModule } from './plugin-routing.module';
import { PluginComponent } from './plugin.component';
import { PQAndAPossystemComponent } from './q-and-a-possystem/q-and-a-possystem.component';
import { RoutesManagerComponent } from './routes-manager/routes-manager.component';
import { VoucherRedirectComponent } from './voucher-redirect/voucher-redirect.component';
import { VoucherSettingsComponent } from './voucher-settings/voucher-settings.component';
import { PCardModule } from '../../shared/core/component/card/card.module';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { PCollapsibleModule } from '../shared/p-collapsible/p-collapsible.module';
import { PEditableFormsModule } from '../shared/p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '../shared/p-editable/p-editable.module';
import { PLedModule } from '../shared/p-led/p-led.module';
import { PShiftExchangeModule } from '../shared/p-shift-exchange/p-shift-exchange.module';
import { PTabsModule } from '../shared/p-tabs/p-tabs.module';
import { PageModule } from '../shared/page/page.module';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PageModule,
		PCardModule,
		PCollapsibleModule,
		PCustomCourseEmailsModule,
		PEditableFormsModule,
		PEditableModule,
		PFormsModule,
		PGridModule,
		PLedModule,
		PluginRoutingModule,
		PShiftExchangeModule,
		PTabsModule,
		ScrollShadowBoxModule,
		SharedModule,
	],
	declarations: [
		Beta7Component,
		BoulderadoComponent,
		FaqOnlinePaymentComponent,
		FreeclimberComponent,
		InterfaceCardComponent,
		InterfaceCardsComponent,
		KletterszeneComponent,
		PayPalComponent,
		PBookingPluginPreviewComponent,
		PInputFreeclimberArticleIdComponent,
		PluginComponent,
		PPluginSettingsComponent,
		PQAndAPossystemComponent,
		RoutesManagerComponent,
		VoucherRedirectComponent,
		VoucherSettingsComponent,
	],
	providers: [
	],
	exports: [
		InterfaceCardComponent,
		InterfaceCardsComponent,
		PluginComponent,
	],
})
export class PluginModule {}
