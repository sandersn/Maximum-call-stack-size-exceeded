import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessType, SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDictionarySourceString } from '../../../../../../shared/core/pipe/localize.dictionary';
import { AssignmentProcessesService } from '../../assignment-processes.service';

@Component({
	selector: 'p-assignment-process-type-caption[process]',
	templateUrl: './p-assignment-process-type-caption.component.html',
	styleUrls: ['./p-assignment-process-type-caption.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PAssignmentProcessTypeCaptionComponent {
	@Input() public process ! : SchedulingApiAssignmentProcess;
	@Input('type') private _type : SchedulingApiAssignmentProcessType | null = null;
	@Input('state') private _state : SchedulingApiAssignmentProcessState | null = null;

	public types : typeof SchedulingApiAssignmentProcessType = SchedulingApiAssignmentProcessType;
	public states : typeof SchedulingApiAssignmentProcessState = SchedulingApiAssignmentProcessState;

	constructor(
		private console : LogService,
		private localize : LocalizePipe,
		private assignmentProcessesService : AssignmentProcessesService,
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get type() : SchedulingApiAssignmentProcessType {
		if (this._type) return this._type;
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		this.console.warn('Add [type]="process.type" on p-assignment-process-type-caption.');
		return this.process.type;
	}

	private get state() : SchedulingApiAssignmentProcessState {
		if (this._state) return this._state;
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		this.console.warn('Add [state]="process.state" on p-assignment-process-type-caption.');
		return this.process.state;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get typeTitle() : string | undefined {
		switch (this.type) {
			case SchedulingApiAssignmentProcessType.DR_PLANO :
				return this.localize.transform('Automatische Verteilung');
			case SchedulingApiAssignmentProcessType.EARLY_BIRD :
				return this.localize.transform('Der frühe Vogel');
			case SchedulingApiAssignmentProcessType.MANUAL :
				return this.localize.transform('Manuelle Verteilung');
			default :
				return undefined;
		}
	}

	public keyIsOpen : boolean = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public processHasReached(state : SchedulingApiAssignmentProcessState) : boolean {
		if (state === SchedulingApiAssignmentProcessState.NOT_STARTED) return true;

		// eslint-disable-next-line sonarjs/no-small-switch
		switch (state) {
			case SchedulingApiAssignmentProcessState.APPROVE:
				return (
					this.state === SchedulingApiAssignmentProcessState.APPROVE ||
					this.state === SchedulingApiAssignmentProcessState.NEEDING_APPROVAL
				);
			default:
				return this.state >= state;
		}
	}

	/** @see AssignmentProcessesService['getDescription'] */
	public getDescription(input : SchedulingApiAssignmentProcessState) : PDictionarySourceString {
		return this.assignmentProcessesService.getDescription(input)!;
	}

}
