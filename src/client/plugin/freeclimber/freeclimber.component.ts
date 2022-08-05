import { AfterContentInit, OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiPosSystem } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PApiPrimitiveTypes } from '../../../shared/api/base/generated-types.ag';

@Component({
	selector: 'p-freeclimber',
	templateUrl: './freeclimber.component.html',
	styleUrls: ['./freeclimber.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class FreeclimberComponent implements AfterContentInit, OnInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	constructor(
		public api : SchedulingApiService,
		private schedulingService : SchedulingService,
		public accountApi : AccountApiService,
		private localize : LocalizePipe,
		public meService : MeService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	private initialActivePosSystem : SchedulingApiPosSystem | null = null;

	public ngOnInit() : void {
		// Make sure we have some data as basis for this item
		if (!this.api.isLoaded()) {
			this.schedulingService.updateQueryParams();
			this.api.load({
				searchParams: this.schedulingService.queryParams,
				success: () => {
					this.initValues();
				},
			});
		} else {
			this.initValues();
		}

		// Make sure we have some data as basis for this item
		if (!this.accountApi.isLoaded()) {
			this.accountApi.load();
		}
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.initialActivePosSystem = this.api.data.posSystem;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showUnlinkHint() : boolean {
		if (this.initialActivePosSystem !== SchedulingApiPosSystem.FREECLIMBER) return false;
		if (this.api.data.posSystem) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get posSystemIsActive() : boolean {
		return this.api.data.posSystem === SchedulingApiPosSystem.FREECLIMBER;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get otherPosSystemIsActive() : boolean {
		return !!this.api.data.posSystem && this.api.data.posSystem !== SchedulingApiPosSystem.FREECLIMBER;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public activatePosSystem(input : boolean) : void {
		if (!input) {
			this.api.data.posSystem = null;
			return;
		}
		this.api.data.posSystem = SchedulingApiPosSystem.FREECLIMBER;
		this.initValues();
	}

	public currentPosSystem : string | null = null;

	public ngAfterContentInit() : void {
		if (this.api.data.posSystem === SchedulingApiPosSystem.BOULDERADO) this.currentPosSystem = 'Boulderado';
		if (this.api.data.posSystem === SchedulingApiPosSystem.FREECLIMBER) this.currentPosSystem = this.posName;
		this.currentPosSystem = '-';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModels() : SchedulingApiShiftModels {
		return this.api.data.shiftModels;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get posName() : string {
		return 'Freeclimber';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get activePosSystemName() : string | undefined {
		switch ((this.api.data.posSystem as SchedulingApiPosSystem | 0 | undefined)) {
			case SchedulingApiPosSystem.BOULDERADO :
				return 'Boulderado';
			case SchedulingApiPosSystem.FREECLIMBER :
				return 'Freeclimber';
			case 0 :
			default :
				const RESULT : never = this.api.data.posSystem as never;
				throw new Error(RESULT);
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get valueText() : string {
		return this.localize.transform('Schnittstelle zu ${posName} verwenden', {
			posName: this.posName,
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public scrollToElement(el : HTMLElement) : void {
		// console.log(element);
		el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
	}
}
