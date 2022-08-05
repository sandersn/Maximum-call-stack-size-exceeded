
import { Subscription } from 'rxjs';
import { OnDestroy, AfterContentInit } from '@angular/core';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import { ReportFilterService } from '@plano/client/report/report-filter.service';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { FilterService } from '../../filter.service';

@Component({
	selector: 'p-no-items',
	templateUrl: './p-no-items.component.html',
	styleUrls: ['./p-no-items.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PNoItemsComponent implements OnDestroy, AfterContentInit {

	/**
	 * If specific filters have effect on the list, then provide a boolean if some filter settings are active.
	 * If not set, only filterService will be considered.
	 */
	@Input() private hasFilterSettings : boolean | null = null;

	/**
	 * If user clicks a button to reset all filters, this event will be triggered.
	 */
	@Output() private onResetFilter = new EventEmitter<void>();

	@Input() private handleGlobalFilterService : boolean = true;

	private subscription : Subscription | null = null;

	constructor(
		private filterService : FilterService,
		private changeDetectorRef : ChangeDetectorRef,
		private schedulingFilterService : SchedulingFilterService,
		private reportFilterService : ReportFilterService,
	) {
		this.setObservers();
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	@ViewChild('ngContent', { static: true }) public ngContent ! : ElementRef<HTMLDivElement>;

	/**
	 * Has someone set content like in the following code?
	 *     <p-no-items …>Hello World!</p-no-items>
	 */
	public get hasNgContent() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.ngContent.nativeElement, 'this.ngContent.nativeElement');
		return this.ngContent.nativeElement.childNodes.length > 0;
	}

	public ngAfterContentInit() : void {
		// hasNgContent is initially false, even if there is content. Next line fixes hasNgContent value.
		this.changeDetectorRef.detectChanges();
	}

	private setObservers() : void {
		if (!this.handleGlobalFilterService) return;
		this.subscription = this.filterService.onChange.subscribe(() => {
			this.changeDetectorRef.detectChanges();
		});
		this.subscription = this.schedulingFilterService.onChange.subscribe(() => {
			this.changeDetectorRef.detectChanges();
		});
		this.subscription = this.reportFilterService.onChange.subscribe(() => {
			this.changeDetectorRef.detectChanges();
		});
	}

	public ngOnDestroy() : void {
		this.subscription?.unsubscribe();
	}

	/**
	 * Reset all Filter settings
	 */
	public resetFilters() : void {
		if (this.handleGlobalFilterService) {
			this.filterService.unload();
			this.filterService.initValues();
		}
		this.onResetFilter.emit();
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * Are there any active filter settings?
	 */
	public get hasSomeFilterSettings() : boolean | null {
		if (this.hasFilterSettings === true) return true;
		if (!this.handleGlobalFilterService) return null;
		return !this.filterService.isSetToShowAll;
	}
}
