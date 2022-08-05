import { Component, ChangeDetectionStrategy, Directive, TemplateRef, Inject, forwardRef } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

/**
 * Usage:
 * <p-sidebar-item>
 *   <div *sidebarItemHeader>Hallo</span>
 *   <div *sidebarItemContent>Content</div>
 * </p-sidebar-item>
 */
@Component({
	selector: 'p-sidebar-item',
	templateUrl: './sidebar-item.component.html',
	styleUrls: ['./sidebar-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class SidebarItemComponent {
	@Output() public onAdd : EventEmitter<Event> = new EventEmitter<Event>();
	@Input() public collapsed : boolean = false;
	@Output() public collapsedChange : EventEmitter<boolean> = new EventEmitter<boolean>();

	public contentTemplate : TemplateRef<unknown> | null = null;
	public headerTemplate : TemplateRef<unknown> | null = null;
	public optionsTemplate : TemplateRef<unknown> | null = null;

	constructor(
		public me : MeService,
		public api : SchedulingApiService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	private get hasOnAddBinding() : boolean {
		return this.onAdd.observers.length > 0;
	}
}

@Directive({
	/* eslint-disable-next-line @angular-eslint/directive-selector */
	selector: '[sidebarItemHeader]',
})
export class SidebarItemHeaderDirective {
	constructor(
		private templateRef : TemplateRef<unknown>,
		@Inject(forwardRef(() => SidebarItemComponent)) private parent : SidebarItemComponent,
	) {
		this.parent.headerTemplate = this.templateRef;
	}
}

@Directive({
	/* eslint-disable-next-line @angular-eslint/directive-selector */
	selector: '[sidebarItemContent]',
})
export class SidebarItemContentDirective {
	constructor(
		private templateRef : TemplateRef<unknown>,
		@Inject(forwardRef(() => SidebarItemComponent)) private parent : SidebarItemComponent,
	) {
		this.parent.contentTemplate = this.templateRef;
	}
}

@Directive({
	/* eslint-disable-next-line @angular-eslint/directive-selector */
	selector: '[sidebarItemOptions]',
})
export class SidebarItemOptionsDirective {
	constructor(
		private templateRef : TemplateRef<unknown>,
		@Inject(forwardRef(() => SidebarItemComponent)) private parent : SidebarItemComponent,
	) {
		this.parent.optionsTemplate = this.templateRef;
	}
}
