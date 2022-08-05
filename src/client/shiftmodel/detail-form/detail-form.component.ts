/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PRouterService } from '@plano/shared/core/router.service';

@Component({
	selector: 'detail-form[shiftModel]',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent { // implements DetailFormComponentInterface<SchedulingApiShiftModel<'validated' | 'draft'>>
	@Input() public shiftModel ! : SchedulingApiShiftModel<'draft' | 'validated'>;

	constructor(
		public api : SchedulingApiService,
		private pRouterService : PRouterService,
		public me : MeService,
		private activatedRoute : ActivatedRoute,
		private toastsService : ToastsService,
		private localize : LocalizePipe,
		private console : LogService,
	) {
	}

	public PThemeEnum = PThemeEnum;

	@Output() public onAddItem : EventEmitter<SchedulingApiShiftModel> = new EventEmitter<SchedulingApiShiftModel>();

	/**
	 * Save this item
	 */
	public saveItem() : void {
		if (!this.shiftModel.isNewItem()) return;
		this.onAddItem.emit(this.shiftModel);
		this.navBack();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public navBack() : void {
		this.pRouterService.navBack();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get routeId() : Id | undefined {
		if (!this.activatedRoute.snapshot.paramMap.has('id')) return undefined;
		const ID_AS_STRING = this.activatedRoute.snapshot.paramMap.get('id');
		if (ID_AS_STRING === '0') return undefined;
		return Id.create(+ID_AS_STRING!);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isCopy() : boolean {
		return this.pRouterService.url.includes('copy/');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get routeIdItem() : SchedulingApiShiftModel | null {
		if (!this.api.isLoaded()) return null;
		return this.api.data.shiftModels.get(this.routeId!);
	}

	private navToCopyPage(event : Id | null = null) : void {
		if (event === null) {
			this.pRouterService.navigate([`/client/shiftmodel/0`], { replaceUrl: true });
			return;
		}
		this.pRouterService.navigate([`/client/shiftmodel/copy/${event.toString()}`], { replaceUrl: true });
	}

	private _shiftModelToCopy : Id | null = null;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelToCopy() : Id {
		return this._shiftModelToCopy!;
	}
	public set shiftModelToCopy(input : Id) {
		this._shiftModelToCopy = input;
		const SHIFTMODEL = this.api.data.shiftModels.get(input);
		let title : string | null = null;
		let description : string;
		if (!SHIFTMODEL) {
			this.console.error('shiftModel is not defined ( … , anymore ?)');
			title = null;
			description = this.localize.transform('Formular wurde befüllt');
		} else {
			title = this.localize.transform('Formular wurde befüllt');
			description = this.localize.transform('…mit Werten aus der Tätigkeit »${name}«', {
				name: SHIFTMODEL.name,
			});

		}
		this.toastsService.addToast({
			title: title,
			content: description,
			visibilityDuration: 'medium',
			theme: PThemeEnum.SUCCESS,
		});
		this.navToCopyPage(input);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelsForInput() : SchedulingApiShiftModels {
		return this.api.data.shiftModels.filterBy((item) => {
			if (item.isNewItem()) return false;
			if (item.trashed) return false;
			return true;
		});
	}
}
