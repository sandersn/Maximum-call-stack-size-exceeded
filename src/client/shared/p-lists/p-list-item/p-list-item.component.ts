import { Component, Input, EventEmitter, Output, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'p-list-item',
	templateUrl: './p-list-item.component.html',
	styleUrls: ['./p-list-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PListItemComponent {
	@HostListener('click', ['$event']) private _handleClick(event : Event) : void {
		this.onClick.emit(event);
	}

	@Input('class') private cssClasses : string | null = null;
	@Input() private hideListItemStyle : boolean = false;

	@HostBinding('class.list-group-item') private get _hasListGroupItem() : boolean {
		return !this.hideListItemStyle;
	}

	@HostBinding('class.list-group-item-action')
	@HostBinding('class.clickable') private get _hasOnClickBinding() : boolean {
		return this.onClick.observers.length > 0;
	}

	@HostBinding('class.p-0') private get _hasP0() : boolean { return this.size === 'frameless'; }
	@HostBinding('class.p-1') private get _hasP1() : boolean { return this.size === 'small'; }
	@HostBinding('class.p-2') private get _hasP2() : boolean { return this.size === 'medium'; }
	@HostBinding('class.p-3') private get _hasP3() : boolean { return this.size === 'large'; }

	@HostBinding('class.align-items-stretch') private get _hasAlignItemsStretch() : boolean {
		if (!this.cssClasses) return false;
		if (this.cssClasses.includes('align-items-')) return false;
		return true;
	}

	@Input() private size : 'small' | 'medium' | 'large' | 'frameless' = 'medium';

	@Output() private onClick : EventEmitter<Event> = new EventEmitter<Event>();

	constructor() {
	}
}

@Component({
	selector: 'p-list-item-append',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PListItemAppendAppendComponent {
	@HostBinding('class.p-list-item-append') private _alwaysTrue = true;

	constructor() {}
}
