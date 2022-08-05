import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { PFormControlComponentChildInterface } from '../../p-form-control.interface';

@Component({
	selector: 'p-radios-radio[label]',
	templateUrl: './p-radios-radio.component.html',
	styleUrls: ['./p-radios-radio.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PRadiosRadioComponent implements PFormControlComponentChildInterface {
	@Input() public value : PFormControlComponentChildInterface['value'];
	@Input() public icon : PFormControlComponentChildInterface['icon'] = null;
	@Input() public label ! : PFormControlComponentChildInterface['label'];
	@Input() public description : PFormControlComponentChildInterface['description'] = null;
	@Input() public active : PFormControlComponentChildInterface['active'] = null;
	@Input() public cannotEditHint : PFormControlComponentChildInterface['cannotEditHint'] = null;

	@Output() public onClick : PFormControlComponentChildInterface['onClick'] = new EventEmitter();

	@Input() public popover : PopoverDirective['popover'];
	@Input() public triggers : PopoverDirective['triggers'] | null = null;
	@Input() public container : PopoverDirective['container'];
	@Input() public placement : PopoverDirective['placement'] | null = null;
	@Input() public disabled : boolean = false;

	constructor() {}
}
