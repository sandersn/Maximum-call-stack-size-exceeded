import { AfterContentChecked} from '@angular/core';
import { Input, Component, ChangeDetectionStrategy, TemplateRef, EventEmitter, Output } from '@angular/core';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';

@Component({
	selector: 'p-shiftmodel-list',
	templateUrl: './shiftmodel-list.component.html',
	styleUrls: ['./shiftmodel-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftmodelListComponent implements PComponentInterface, AfterContentChecked {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;
	@Input() public shiftModels : SchedulingApiShiftModels = new SchedulingApiShiftModels(null, false);
	@Input() public contentTemplate : TemplateRef<unknown> | null = null;

	@Input() public label : string | null = null;
	@Input() public selectedItemId : Id | null = null;

	@Output() public onItemClick : EventEmitter<SchedulingApiShiftModel> = new EventEmitter<SchedulingApiShiftModel>();

	public parentNames : string[] = [];

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasOnItemClickBinding() : boolean {
		return this.onItemClick.observers.length > 0;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClickItem(shiftModel : SchedulingApiShiftModel) : void {
		if (!this.hasOnItemClickBinding) return;
		this.selectedItemId = shiftModel.id;
		this.onItemClick.emit(shiftModel);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isSelected(shiftModel : SchedulingApiShiftModel) : boolean {
		return this.selectedItemId === shiftModel.id;
	}

	constructor(
	) {
	}

	public ngAfterContentChecked() : void {
		this.refreshParentNames();
	}

	private refreshParentNames() : void {
		this.parentNames = this.shiftModels.parentNames.sort();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getShiftModelsIterableByParentName(parentName : string) : SchedulingApiShiftModel[] {
		return this.shiftModels.filterBy(
			shiftModel => shiftModel.parentName === parentName,
		).iterableSortedBy(
			shiftModel => shiftModel.name,
		);
	}

}
