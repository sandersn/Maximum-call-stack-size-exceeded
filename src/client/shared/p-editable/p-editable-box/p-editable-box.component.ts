import { AfterViewInit } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

@Component({
	selector: 'p-editable-box-header',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PEditableBoxHeaderComponent {
	constructor() {}
}

@Component({
	selector: 'p-editable-box-showroom',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PEditableBoxShowroomComponent {
	@HostBinding('class.d-block')
	@HostBinding('class.w-100') protected _alwaysTrue = true;

	constructor() {}
}

@Component({
	selector: 'p-editable-box-form',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PEditableBoxFormComponent {
	@HostBinding('class.d-block')
	@HostBinding('class.w-100') protected _alwaysTrue = true;

	constructor(
	) {}
}

@Component({
	selector: 'p-editable-box',
	templateUrl: './p-editable-box.component.html',
	styleUrls: ['./p-editable-box.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PEditableBoxComponent implements AfterViewInit, EditableControlInterface {
	@ViewChild('showroom', { static: true }) private showroom ! : ElementRef<HTMLElement>;
	public showShowroom : boolean = false;
	public boxEditMode : boolean = false;

	/**
	 * If the box is initially invalid the form must be visible till the next boxEditMode update comes
	 */
	public initialInvalid : boolean = false;

	@Input() public label : string | null = null;

	@Input() public disabled : boolean = false;
	@Output() public onRemoveItemClick : EventEmitter<undefined> = new EventEmitter();

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);
	// public get isValid() : boolean {
	// 	return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
	// }

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private console : LogService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	public ngAfterViewInit() : void {
		this.initialInvalid = !this.valid;
		this.showShowroom = this.showroom.nativeElement.children.length > 0;
		this.changeDetectorRef.detectChanges();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public updateEditMode(event : boolean) : void {
		this.console.log('updateEditMode');
		this.boxEditMode = event;
		this.editMode.emit(event);
	}
}
