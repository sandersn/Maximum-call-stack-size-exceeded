import { Component, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { Input } from '@angular/core';
import { PFaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';

export enum ListSortDirection {
	UP,
	DOWN,
	INACTIVE,
}

@Component({
	selector: 'p-list-headline-item',
	templateUrl: './list-headline-item.component.html',
	styleUrls: ['./list-headline-item.component.scss'],
})
export class ListHeadlineItemComponent implements PComponentInterface {

	@HostBinding('class.text-skeleton-animated')
	@Input() public isLoading : PComponentInterface['isLoading'] = null;

	/**
	 * Icon for the label of this item
	 */
	@Input() public labelIcon : PFaIcon | null = null;

	/**
	 * Text of this item
	 */
	@Input() public label : string | null = null;

	/**
	 * Effects some icon.
	 * If set to undefined/null, it will hide the icon and disable click events.
	 */
	@Input() public sortDirection : ListSortDirection = ListSortDirection.INACTIVE;

	/**
	 * Emits the new SortDirection when changed
	 */
	@Output() public onToggle : EventEmitter<ListSortDirection> = new EventEmitter<ListSortDirection>();

	/**
	 * Is it possible to sort the list by this?
	 */
	@Input() public disabled : boolean = false;

	@HostListener('click') private clicked() : void {
		this.sortDirection = this.sortDirection === ListSortDirection.DOWN ? ListSortDirection.UP : ListSortDirection.DOWN;
		return this.onToggle.emit(this.sortDirection);
	}

	/**
	 * Is it possible to sort the list by this
	 */
	@HostBinding('class.clickable') public get isClickable() : boolean {
		if (this.disabled) return false;
		if (!this.onToggle.observers.length) return false;
		return true;
	}

	constructor() { }

	public ListSortDirection = ListSortDirection;
}
