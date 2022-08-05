import * as _ from 'underscore';
import { Injectable } from '@angular/core';
import {
	RightsService,
	SchedulingApiAssignmentProcessState,
} from '@plano/shared/api';
import { PFaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PAssignmentProcessIcon } from './assignment-process-icon';

@Injectable()
export class AssignmentProcessesService {
	private readonly STATES_ARRAY : {
		state : SchedulingApiAssignmentProcessState;
		description : PDictionarySourceString;
		icon : PAssignmentProcessIcon;
	}[] = [
			{
				state: SchedulingApiAssignmentProcessState.APPROVE,
				description: 'Muss veröffentlicht werden',
				icon: 'bullhorn',
			},
			{
				state: SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES,
				description: 'Schichtwünsche anfordern',
				icon: ['far', PlanoFaIconPool.ITEMS_ASSIGNMENT_PROCESS],
			},
			{
				state: SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED,
				description: 'Vorgang abschließen',
				icon: 'check',
			},
			{
				state: SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING,
				description: 'Für Angestellte freigeben',
				icon: 'early-bird',
			},
			{
				state: SchedulingApiAssignmentProcessState.MANUAL_SCHEDULING,
				description: 'Schichten manuell besetzen',
				icon: ['far', 'hand-point-up'],
			},
			{
				state: SchedulingApiAssignmentProcessState.NEEDING_APPROVAL,
				description: 'Dr.&nbsp;Plano hat verteilt',
				// icon : 'dr-plano'
				icon: 'magic',
			},
			{
				state: SchedulingApiAssignmentProcessState.NOT_STARTED,
				description: 'Schichten für Verteilung auswählen',
				icon: ['far', 'clone'],
			},
		];

	constructor(private rightsService : RightsService) {}

	/**
	 * Find a icon for the provided state if possible
	 */
	public getIcon(
		state : SchedulingApiAssignmentProcessState,
	) : PFaIcon | 'early-bird' | 'dr-plano' | null {
		const object = _.findWhere(this.STATES_ARRAY, {
			state: state,
		});
		if (!object) return null;
		return object.icon;
	}

	/**
	 * Find a description for the provided state if possible
	 */
	public getDescription(
		state : SchedulingApiAssignmentProcessState,
		userCanEditAssignmentProcess ?: boolean,
	) : PDictionarySourceString | null {
		if (
			state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES &&
			!userCanEditAssignmentProcess
		) {
			return 'Schichtwünsche abgeben';
		}

		const object = _.findWhere(this.STATES_ARRAY, { state: state });
		if (!object) return null;
		return object.description;
	}
}
