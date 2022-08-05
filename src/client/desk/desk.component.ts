import { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, HostBinding, Component } from '@angular/core';
import { SchedulingApiShiftExchanges } from '../../shared/api';
import { PComponentInterface } from '../../shared/core/interfaces/component.interface';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';
import { PThemeEnum } from '../shared/bootstrap-styles.enum';
import { ShiftExchangesService } from '../shift-exchanges/shift-exchanges.service';

@Component({
	selector: 'p-desk',
	templateUrl: './desk.component.html',
	styleUrls: ['./desk.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DeskComponent implements PComponentInterface, OnInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative')
	@HostBinding('class.bg-dark') protected _alwaysTrue = true;

	constructor(
		private api : SchedulingApiService,
		private shiftExchangesService : ShiftExchangesService,
	) {
	}

	public PThemeEnum = PThemeEnum;

	/** @see PComponentInterface['isLoading'] */
	public get isLoading() : boolean {
		return !this.api.isLoaded() || this.api.isLoadOperationRunning;
	}

	public ngOnInit() : void {
		this.initValues();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.loadNewData();
	}

	/**
	 * Load new absences and workingTimes
	 */
	private loadNewData(success : (() => void) | null = null) : void {
		this.shiftExchangesService.updateQueryParams();
		assumeNonNull(this.shiftExchangesService.queryParams);
		this.api.load({
			searchParams: this.shiftExchangesService.queryParams,
			success: success,
		});
	}

	/** @see PSidebarDeskComponent['shiftExchanges'] */
	public get shiftExchanges() : SchedulingApiShiftExchanges {
		if (!this.api.isLoaded()) return new SchedulingApiShiftExchanges(null, false);
		return this.api.data.shiftExchanges;
	}
}
