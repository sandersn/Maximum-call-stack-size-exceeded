
import { HttpParams } from '@angular/common/http';
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiRightGroup } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { LogService } from '../../shared/core/log.service';

@Component({
	selector: 'p-accesscontrol',
	templateUrl: './accesscontrol.component.html',
	styleUrls: ['./accesscontrol.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class AccessControlComponent {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	public selectedRightGroup : SchedulingApiRightGroup | null = null;
	public isSaving : boolean = false;
	public selectedTab : string = 'settings';

	constructor(
		public api : SchedulingApiService,
		public toasts : ToastsService,
		private localize : LocalizePipe,
		private console : LogService,
	) {
		const queryParams = new HttpParams()
			.set('data', 'rights');

		this.api.load({
			searchParams: queryParams,
			success: () => {
				const firstRightGroup = api.data.rightGroups.get(0);
				if (firstRightGroup === null) {
					this.console.error('There should have been at least one rightGroup');
					return;
				}
				this.selectedRightGroup = firstRightGroup;
			},
		});
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	/**
	 * Open Toast that tells user that data has been saved
	 */
	public openToast() : void {
		this.toasts.addToast({
			content: this.localize.transform('Änderung der Rechte wurde gespeichert'),
			theme: PThemeEnum.SUCCESS,
		});
	}

	// HACK: PLANO-9873 direct binding of groupByParentName causes problems
	private _shiftModelsForList : SchedulingApiShiftModels[] | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelsForList() : SchedulingApiShiftModels[] {
		if (!this._shiftModelsForList) {
			this._shiftModelsForList = this.api.data.shiftModels.groupByParentName;
		}
		return this._shiftModelsForList;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isOwnerGroup(rightGroup : SchedulingApiRightGroup) : boolean {
		return rightGroup.role === SchedulingApiRightGroupRole.CLIENT_OWNER;
	}
}
