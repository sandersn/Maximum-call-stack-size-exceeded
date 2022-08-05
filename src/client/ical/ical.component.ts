import { HttpParams } from '@angular/common/http';
import { TemplateRef } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { LogService } from '../../shared/core/log.service';
import { SchedulingApiShiftModels, SchedulingApiService, SchedulingApiShiftModel } from '../scheduling/shared/api/scheduling-api.service';
import { ToastsService } from '../service/toasts.service';
import { BootstrapSize, PThemeEnum } from '../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-ical',
	templateUrl: './ical.component.html',
	styleUrls: ['./ical.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class IcalComponent {
	public readonly CONFIG : typeof Config = Config;
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	public copiedToClipboard : string | number | null = null;
	private timeout : number | null = null;

	/**
	 * Set of ShiftModels that should be synchronized additionally to those where the user has write access.
	 */
	private additionalShiftModels : SchedulingApiShiftModels = new SchedulingApiShiftModels(null, false);

	constructor(
		public api : SchedulingApiService,
		public me : MeService,
		private zone : NgZone,
		private console : LogService,
		private modalService : ModalService,
		public toasts : ToastsService,
		private localize : LocalizePipe,
	) {
		this.initApi();
	}

	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;

	private initApi() : void {
		if (this.api.isLoaded()) return;

		const queryParams = new HttpParams()
			.set('data', 'rights');

		this.api.load({
			searchParams: queryParams,
			success: () => {
			},
		});
	}

	/**
	 * Copy string to clipboard
	 */
	private copyString(input : string) : void {
		window.clearTimeout(this.timeout ?? undefined);

		// Create a dummy input to copy the string array inside it
		const dummy = document.createElement('input');
		// Output the array into it
		dummy.value = input;
		// Add it to the document
		document.body.appendChild(dummy);
		// Set its ID
		dummy.setAttribute('id', 'dummy_id');
		// Select it
		dummy.select();
		// Copy its contents
		document.execCommand('copy');
		// Remove it as its not needed anymore
		document.body.removeChild(dummy);

		this.toasts.addToast({
			content: this.localize.transform('Wurde in die Zwischenablage kopiert'),
			theme: PThemeEnum.SUCCESS,
			icon: 'clipboard',
			visibilityDuration: 'medium',
		});

		this.copiedToClipboard = input;
		this.zone.runOutsideAngular(() => {
			this.timeout = window.setTimeout(() => {
				this.zone.run(() => {
					if (this.copiedToClipboard) this.copiedToClipboard = null;
				});
			}, 4500);
		});
	}

	private get icalUrl() : string {
		if (!this.me.isLoaded()) throw new Error('Can not get icalUrl, when id is not defined');
		return `${Config.BACKEND_URL}/ical?id=${this.me.data.id.rawData}&s=${this.me.data.secureToken}`;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get icalUrlWithAdditionalShiftModels() : string {
		let result = this.icalUrl;

		if (this.additionalShiftModels.length) {
			result += '&additionalShiftModels=';
			let i = 0;
			for (const shiftModel of this.additionalShiftModels.iterable() ) {
				result += shiftModel.id.toString();
				i++;
				if (i !== this.additionalShiftModels.length) result += ',';
			}
		}

		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isAdditionalShiftModel(input : SchedulingApiShiftModel | SchedulingApiShiftModels) : boolean | null {
		if (input instanceof SchedulingApiShiftModel) {
			return this.additionalShiftModels.contains(input);
		}

		if (input instanceof SchedulingApiShiftModels) {
			for (const shiftModel of input.iterable()) {
				if (!this.additionalShiftModels.contains(shiftModel)) return false;
			}
			return true;
		}
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleAdditionalItems(input : SchedulingApiShiftModel | SchedulingApiShiftModels) : void {
		if (input instanceof SchedulingApiShiftModel) {
			this.toggleAdditionalShiftModel(input);
			return;
		}
		if (input instanceof SchedulingApiShiftModels) {
			for (const shiftModel of input.iterable()) {
				if (!this.isAdditionalShiftModel(shiftModel)) {
					this.addAllToAdditionalShiftModels(input);
					return;
				}
			}
			this.removeAllToAdditionalShiftModels(input);
		}
	}

	private toggleAdditionalShiftModel(shiftModel : SchedulingApiShiftModel) : void {
		if (this.isAdditionalShiftModel(shiftModel)) {
			this.additionalShiftModels.removeItem(shiftModel);
		} else {
			this.additionalShiftModels.push(shiftModel);
		}
	}

	private addAllToAdditionalShiftModels(shiftModels : SchedulingApiShiftModels) : void {
		for (const shiftModel of shiftModels.iterable()) {
			if (!this.isAdditionalShiftModel(shiftModel)) {
				this.additionalShiftModels.push(shiftModel);
			}
		}
	}

	private removeAllToAdditionalShiftModels(shiftModels : SchedulingApiShiftModels) : void {
		for (const shiftModel of shiftModels.iterable()) {
			this.additionalShiftModels.removeItem(shiftModel);
		}
	}

	// HACK: PLANO-9873 direct binding of groupByParentName causes problems
	private _shiftModelsForList : SchedulingApiShiftModels[] = [];
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelsForList() : SchedulingApiShiftModels[] {
		if (!this._shiftModelsForList.length && this.api.isLoaded()) {
			this._shiftModelsForList = this.api.data.shiftModels.filterBy(shiftModel => {
				if (shiftModel.trashed) return false;
				return true;
			}).groupByParentName;
		}
		return this._shiftModelsForList;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public openLinkGenerator(modalContent : TemplateRef<unknown>, resultModalContent : TemplateRef<unknown>) : void {
		this.modalService.openModal(modalContent, {
			success: () => {
				this.modalService.openModal(resultModalContent, {
					success: () => {
						this.copyString(this.icalUrlWithAdditionalShiftModels);
					},
				});
			},
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public translatedListHeadlineText(shiftModels : SchedulingApiShiftModels) : string {
		const firstItem = shiftModels.get(0);
		if (!firstItem) throw new Error('Could not find firstItem');
		if (firstItem.parentName) return firstItem.parentName;
		return this.localize.transform('Sonstige');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get closeBtnLabel() : string {
		if (!Config.IS_MOBILE) return this.localize.transform('In die Zwischenablage kopieren');
		return this.localize.transform('URL kopieren');
	}
}
