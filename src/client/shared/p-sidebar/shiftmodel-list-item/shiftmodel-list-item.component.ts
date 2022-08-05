import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Component, Input, EventEmitter, Output, HostBinding, ChangeDetectionStrategy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '@plano/client/shared/filter.service';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShiftModel } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { Id } from '../../../../shared/api/base/id';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { ApiListWrapperListItemComponent } from '../../component/member-list-item/member-list-item.component';

/** @deprecated */
@Component({

	/** @deprecated */
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'shiftmodel-list-item[shiftModel]',

	templateUrl: './shiftmodel-list-item.component.html',
	styleUrls: ['./shiftmodel-list-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

/** @deprecated */
export class ShiftmodelListItemComponent implements ApiListWrapperListItemComponent, OnInit, OnDestroy {
	@HostBinding('id') private get hasId() : string {
		return `scroll-target-id-${this.shiftModel?.id.toString()}`;
	}

	@HostBinding('class.rounded') protected _alwaysTrue = true;
	@HostBinding('class.muted-item') private get _muteItem() : boolean {
		if (!this.shiftModel) return false;
		if (this.highlightService.isMuted(this.shiftModel)) return true;
		return false;
	}

	@Input() public editFilterModeActive : boolean = false;
	@Input() public editListItemsMode : boolean = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	@HostListener('mouseover') public onHover() : void {
		if (this.hover === true) return;
		this.hover = true;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	@HostListener('mouseleave') public onHoverLeave() : void {
		if (this.hover === false) return;
		this.hover = false;
	}

	@Input() public shiftModel : SchedulingApiShiftModel | null = null;
	@Output() public onItemClick : EventEmitter<SchedulingApiShiftModel> = new EventEmitter();

	@Input() public hideMultiSelectBtn : boolean = true;

	@Output() public onSelectInCalendarClick : EventEmitter<Id> = new EventEmitter<Id>();

	public hover : boolean = false;

	constructor(
		private api : SchedulingApiService,
		public highlightService : HighlightService,
		private filterService : FilterService,
		private router : Router,
		private rightsService : RightsService,
		private console : LogService,
		private changeDetectorRef : ChangeDetectorRef,
	) {
		this.console.deprecated('shiftmodel-list-item is deprecated. Use p-shiftmodel-list-item instead.');

	}

	public PlanoFaIconPool = PlanoFaIconPool;

	private subscription : Subscription | null = null;

	public ngOnInit() : void {
		this.subscription = this.filterService.onChange.subscribe(() => {
			this.changeDetectorRef.detectChanges();
		});
	}

	/**
	 * Decide if the multi-select-checkbox should be visible or not
	 */
	public get showMultiSelectCheckbox() : boolean {
		if (this.hideMultiSelectBtn) return false;

		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		if (this.hover) return true;
		if (this.highlightService.isHighlighted(this.shiftModel)) return true;
		if (this.shiftModel.selected) return true;
		if (this.api.data.shiftModels.hasSelectedItem) return true;
		// if (this.api.hasSelectedItems) return true;

		return false;
	}

	/**
	 * Open Modal for specific shiftModel
	 */
	public showDetails() : void {
		if (this.shiftModel) {
			this.router.navigate([`/client/shiftmodel/${this.shiftModel.id.toString()}`]);
		} else {
			this.router.navigate(['/client/shiftmodel/']);
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public selectInCalendar(event : Event) : void {
		event.stopPropagation();
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		this.onSelectInCalendarClick.emit(this.shiftModel.id);
	}

	/**
	 * Check if user can write given shiftModel
	 */
	public get userCanWrite() : boolean | null {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		return this.rightsService.userCanWrite(this.shiftModel);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get affected() : boolean {
		return !!this.shiftModel?.affected;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selected() : boolean {
		return !!this.shiftModel?.selected;
	}


	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasOnItemClickBinding() : boolean {
		return this.onItemClick.observers.length > 0;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showDetailsBtn() : boolean {
		if (!this.editListItemsMode) return false;
		if (this.userCanWrite) return true;
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		if (this.rightsService.userCanRead(this.shiftModel)) return true;

		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get color() : string {
		if (!this.shiftModel) this.console.error('[PLANO-17835]');
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		return `#${this.shiftModel.color}`;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isVisible() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		return this.filterService.isVisible(this.shiftModel);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleItem() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		this.filterService.toggleItem(this.shiftModel);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelName() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
		if (!this.shiftModel.name) return '████ █████████';
		return this.shiftModel.name;
	}

	public ngOnDestroy() : void {
		this.subscription?.unsubscribe();
	}

	/** Get the color of this shiftModel as hexadecimal string */
	public get shiftModelColor() : string | null {
		if (!this.shiftModel) return null;
		if (!this.shiftModel.rawData) {
			this.console.warn('ShiftModel is gone PLANO-FE-2M4');
			return null;
		}
		if (!this.shiftModel.color) return null;
		return `#${this.shiftModel.color}`;
	}
}
