import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PFormControlComponentChildInterface } from '../../p-form-control.interface';

@Component({
	selector: 'p-form-control-switch-item[label]',
	templateUrl: './p-form-control-switch-item.component.html',
	styleUrls: ['./p-form-control-switch-item.component.scss'],
})
export class PFormControlSwitchItemComponent implements PFormControlComponentChildInterface {
	@Input() public value : PFormControlComponentChildInterface['value'];
	@Input() public icon : PFormControlComponentChildInterface['icon'] = null;
	@Input() public label ! : PFormControlComponentChildInterface['label'];
	@Input() public description : PFormControlComponentChildInterface['description'] = null;
	@Input() public active : PFormControlComponentChildInterface['active'] = null;
	@Input() public disabled : PFormControlComponentChildInterface['disabled'] = false;
	@Input() public cannotEditHint : PFormControlComponentChildInterface['cannotEditHint'] = null;
	@Output() public onClick : EventEmitter<unknown> = new EventEmitter();

	constructor() { }

}
