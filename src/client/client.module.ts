
/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
// NOTE: 	[PLANO-62957] It looks like sorting has effect on routing. Routing for /client breaks when i let eslint sort this file.
// 				Seems to me like something is wrong with the AppRoutingModule or ClientRoutingModule

import { NgProgressModule } from 'ngx-progressbar';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { PageNotFoundModule } from '@plano/shared/page-not-found/page-not-found.module';
import { AccesscontrolModule } from './accesscontrol/accesscontrol.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { HeaderComponent } from './header/header.component';
import { LogoutComponent } from './header/logout/logout.component';
import { ReportModule } from './report/report.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { NgbFormatsService } from './service/ngbformats.service';
import { PFormsService } from './service/p-forms.service';
import { ToastsService } from './service/toasts.service';
import { HighlightService } from './shared/highlight.service';
import { PFormsModule } from './shared/p-forms/p-forms.module';
import { PDurationPipe } from './shared/pipe/p-duration.pipe';
import { ShiftExchangeModule } from './shift-exchange/shift-exchange.module';
import { ShiftModule } from './shift/shift.module';
import { TimeStampModule } from './time-stamp/time-stamp.module';
import { CoreComponentsModule } from '../shared/core/component/core-components.module';

@NgModule({
	imports: [
		CoreModule,
		ClientSharedModule,
		PageNotFoundModule,
		ShiftModule,
		SchedulingModule,
		ReportModule,
		TimeStampModule,
		AccesscontrolModule,
		ClientRoutingModule,
		PFormsModule,
		// FIXME: Something with providedIn: 'root' is broken
		ShiftExchangeModule,
		CoreComponentsModule,
		NgProgressModule.withConfig({
			direction: 'ltr+',
			speed: 200,
			trickleSpeed: 300,
			debounceTime: 200, // Seems to have no effect.
			meteor: true,
			spinner: false,
			thick: false,
			fixed: true,
			min: 8,
			max: 100,
			ease: 'linear',
			color: '#525050',
		}),
	],
	declarations: [
		ClientComponent,
		HeaderComponent,
		LogoutComponent,
	],
	exports: [
		HeaderComponent,
	],
	providers: [
		// { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
		// SnotifyService
		NgbFormatsService,
		ToastsService,
		PFormsService,
		DecimalPipe,
		PercentPipe,
		PDurationPipe,
		HighlightService,
	],
})
export class ClientModule {}
