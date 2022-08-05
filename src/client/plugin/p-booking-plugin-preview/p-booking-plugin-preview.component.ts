import * as $ from 'jquery';
import { AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';

@Component({
	selector: 'p-booking-plugin-preview',
	templateUrl: './p-booking-plugin-preview.component.html',
	styleUrls: ['./p-booking-plugin-preview.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PBookingPluginPreviewComponent implements AfterViewInit, OnDestroy, OnChanges {
	@Input() public shiftModel : SchedulingApiShiftModel | null = null;

	constructor(
		private me : MeService,
		private console : LogService,
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get widgetUrl() : string | undefined {
		if (this.me.isLoaded() && this.me.data.clientId.toString()) {
			return `${Config.FRONTEND_URL_LOCALIZED}/static/booking-plugin/code.js`;
		}
		return undefined;
	}

	private insertScript() : void {
		this.me.isLoaded(() => {
			const script = `<script id="drp-script" src="${this.widgetUrl}" data-backend-url="${Config.BACKEND_URL}" data-id="${this.me.data.clientId.toString()}" data-frontend-url="${Config.FRONTEND_URL_LOCALIZED}"></script>`; // NOTE: No i18n
			$(script).insertAfter('#drp-booking');
		});
	}

	/** ngOnChanges */
	public ngOnChanges() : void {
		this.insertScript();
	}

	public ngAfterViewInit() : void {
		// angular removes script tags from templates. So, as workaround we add booking-plugin script manually
		this.insertScript();
	}

	public ngOnDestroy() : void {
	}

}
