import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-assign-shiftmodels[member]',
	templateUrl: './assign-shiftmodels.component.html',
	styleUrls: ['./assign-shiftmodels.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class AssignShiftmodelsComponent implements AfterContentInit {
	public readonly CONFIG : typeof Config = Config;

	@Input() public member ! : SchedulingApiMember;
	private now ! : NgbDateStruct;
	@Input() public changeSelector : NgbDateStruct | null = null;
	public shiftModelsForForm : SchedulingApiShiftModels[] = [];
	@Input('disabled') private _disabled : boolean | null = null;

	constructor(
		public ngbFormats : NgbFormatsService,
		public modalService : ModalService,
		private me : MeService,
		public api : SchedulingApiService, // TODO: Get rid of this to make Component testable
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get boxDisabled() : boolean {
		if (Config.IS_MOBILE) return true;
		if (this._disabled !== null) return this._disabled;
		if (!this.me.isLoaded()) return true;
		if (!this.me.data.isOwner) return true;
		if (!this.api.data.shiftModels.hasUntrashedItem) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onChangeEditMode() : void {
		this.shiftModelsForForm = this.api.data.shiftModels.groupByParentName;
	}

	public ngAfterContentInit() : void {
		this.shiftModelsForForm = this.api.data.shiftModels.groupByParentName;

		this.now = this.ngbFormats.timestampToDateStruct(Date.now(), Config.LOCALE_ID) as NgbDateStruct;
		this.setChangeSelectorDateToCurrentDate();
	}

	private _itemsForList = new Data<SchedulingApiShiftModels>(this.api);

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get itemsForList() : SchedulingApiShiftModels {
		return this._itemsForList.get(() => {
			if (!this.api.isLoaded()) return new SchedulingApiShiftModels(null, false);

			// TODO: why is rawData necessary here? is this related to PLANO-1638?
			if (this.member.assignableShiftModels.rawData) {
				return this.member.assignableShiftModels.shiftModels.filterBy(shiftModel => !shiftModel.trashed);
			}

			return new SchedulingApiShiftModels(null, false);
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get noShiftModelsCreatedYet() : boolean {
		return this.me.isLoaded() && this.me.data.isOwner && !this.api.data.shiftModels.filterBy(item => !item.trashed).length;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasUntrashedItem() : boolean {
		return this.api.data.shiftModels.hasUntrashedItem;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isOwner() : boolean {
		return this.me.isLoaded() && this.me.data.isOwner;
	}

	/**
	 * Add passed item to List of Assignable ShiftModels
	 * @param shiftModel Selected item
	 */
	private addNewAssignableShiftModel(shiftModel : SchedulingApiShiftModel) : void {
		const isAlreadyAdded = this.member.assignableShiftModels.containsShiftModel(shiftModel);
		if (isAlreadyAdded) return;

		const tempAssignableShiftModel = this.member.assignableShiftModels.createNewItem();
		tempAssignableShiftModel.hourlyEarnings = 0;
		tempAssignableShiftModel.shiftModelId = shiftModel.id;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public earningValidNumber(shiftModel : SchedulingApiShiftModel) : boolean {
		const earnings = this.member.assignableShiftModels.getByShiftModel(shiftModel)!.hourlyEarnings;
		return typeof earnings === 'number';
	}

	/**
	 * Toggle passed item in List of Assignable ShiftModels
	 * @param shiftModel Selected item
	 */
	public toggleAssignableShiftModel(shiftModel : SchedulingApiShiftModel) : void {
		const isAlreadyAdded = this.member.assignableShiftModels.containsShiftModel(shiftModel);

		if (!isAlreadyAdded) {
			this.addNewAssignableShiftModel(shiftModel);
			return;
		}

		this.member.assignableShiftModels.removeShiftModel(shiftModel);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setChangeSelector() : void {
		this.member.changeSelector.start = this.ngbFormats.dateTimeObjectToTimestamp(this.changeSelector)!;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setChangeSelectorDateToCurrentDate() : void {
		this.changeSelector = this.now;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selectedDateIsCurrentDate() : boolean {
		if (this.changeSelector === null) return false;
		const sameYear = this.changeSelector.year === this.now.year;
		const sameMonth = this.changeSelector.month === this.now.month;
		const sameDay = this.changeSelector.day === this.now.day;
		return sameYear && sameMonth && sameDay;
	}

}
