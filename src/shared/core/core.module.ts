import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { TooltipModule, TooltipConfig } from 'ngx-bootstrap/tooltip';
import { CookieService } from 'ngx-cookie-service';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { NgxPrintModule } from 'ngx-print';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { getTooltipConfig, getPopoverConfig } from '@plano/ngx-bootstrap.config';
import { CoreComponentsModule } from './component/core-components.module';
import { PFaIconModule } from './component/fa-icon/fa-icon.module';
import { PContrastPipe } from './contrast.service';
import { AffectedDirective } from './directive/affected.directive';
import { AutofocusDirective } from './directive/autofocus.directive';
import { PIncrementalBuildDummyDirective } from './directive/caching/p-incremental-build-dummy.directive';
import { ChangeDetectionDirective } from './directive/change-detection.directive';
import { PCropOnOverflowDirective } from './directive/crop-on-overflow.directive';
import { DeprecatedRowDirective } from './directive/deprecated-row.directive';
import { ExternalLinkDirective } from './directive/external-link.directive';
import { MutedDirective } from './directive/muted.directive';
import { SelectedDirective } from './directive/selected.directive';
import { PTooltipDirective } from './directive/tooltip.directive';
import { LoginFormComponent } from './me/login-form/login-form.component';
import { PModalModule } from './p-modal/modal.module';
import { CorePipesModule } from './pipe/core-pipes.module';
import { LocalizeFilePipe } from './pipe/localize-file.pipe';
import { LocalizePipe } from './pipe/localize.pipe';
import { PCurrencyPipe } from './pipe/p-currency.pipe';
import { PDatePipe } from './pipe/p-date.pipe';
import { TranslatePipe } from './pipe/translate.pipe';
import { PProgressbarService } from './progressbar.service';
import { ApiErrorService } from '../api/api-error.service';
import { PSentryModule } from '../sentry/sentry.module';

@NgModule({
	imports: [
		CommonModule,
		CoreComponentsModule,
		CorePipesModule,
		FormsModule,
		HttpClientModule,
		NgxPopperjsModule,
		TooltipModule.forRoot(),
		NgxPrintModule,
		PFaIconModule,
		PModalModule,
		PopoverModule,
		PSentryModule,
		ReactiveFormsModule,
		RouterModule,
	],
	declarations: [
		AffectedDirective,
		AutofocusDirective,
		ChangeDetectionDirective,
		DeprecatedRowDirective,
		ExternalLinkDirective,
		LoginFormComponent,
		MutedDirective,
		PCropOnOverflowDirective,
		PIncrementalBuildDummyDirective,
		PTooltipDirective,
		// TODO: 	Add note here why this must be declared in core module.
		// 				Adding this component here also means: if you want to load the simple SelectedDirective, you need to have
		// 				the LoginFormComponent available. This seems illogical.
		SelectedDirective,
	],
	providers: [
		// TODO: Move to another module with all api-related stuff(PApiModule?)
		ApiErrorService,
		{
			provide: TooltipConfig,
			useFactory: getTooltipConfig,
		},
		{
			provide: PopoverConfig,
			useFactory: getPopoverConfig,
		},
		ApiErrorService,
		CookieService,
		CurrencyPipe,
		DatePipe,
		LocalizeFilePipe,
		LocalizePipe,
		PCurrencyPipe,
		PProgressbarService,
		TranslatePipe,
	],
	exports: [
		AffectedDirective,
		AutofocusDirective,
		ChangeDetectionDirective,
		CommonModule,
		CoreComponentsModule,
		CorePipesModule,
		DeprecatedRowDirective,
		ExternalLinkDirective,
		FormsModule,
		LocalizeFilePipe,
		LocalizePipe,
		LoginFormComponent,
		MutedDirective,
		NgxPrintModule,
		PContrastPipe,
		PCropOnOverflowDirective,
		PCurrencyPipe,
		PDatePipe,
		PFaIconModule,
		PIncrementalBuildDummyDirective,
		PModalModule,
		PopoverModule,
		PTooltipDirective,
		ReactiveFormsModule,
		RouterModule,
		SelectedDirective,
		TooltipModule,
		TranslatePipe,
	],
})
export class CoreModule {}
