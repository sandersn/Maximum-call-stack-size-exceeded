import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { PAssignmentProcessIcon } from '../../p-sidebar/p-assignment-processes/assignment-process-icon';
import { AssignmentProcessesService } from '../../p-sidebar/p-assignment-processes/assignment-processes.service';

@Component({
	selector: 'p-assignment-process-icon',
	templateUrl: './p-assignment-process-icon.component.html',
	styleUrls: ['./p-assignment-process-icon.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PAssignmentProcessIconComponent {
	@Input() public state : SchedulingApiAssignmentProcessState | null = null;
	@Input() private process : SchedulingApiAssignmentProcess | null = null;
	@Input('isOwner') private _isOwner ?: boolean;

	constructor(
		private assignmentProcessesService : AssignmentProcessesService,
		private rightsService : RightsService,
		private console : LogService,
	) {
	}

	private get isOwner() : boolean | null {
		if (this._isOwner !== undefined) return this._isOwner;
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		this.console.debug('IMPROVE: Add [isOwner]="boolean" to make this a dump component.');
		return this.rightsService.isOwner;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get icon() : PAssignmentProcessIcon | null {
		if (this.state === SchedulingApiAssignmentProcessState.NOT_STARTED) {
			if (this.isOwner) return ['far', 'clone'];
			if (this.process === null) {
				this.console.error('process is not defined');
				return null;
			}
			if (!this.rightsService.userCanEditAssignmentProcess(this.process)) return null;
			return ['far', 'clone'];
		}

		if (this.state === null) return null;
		return this.assignmentProcessesService.getIcon(this.state);
	}
}
