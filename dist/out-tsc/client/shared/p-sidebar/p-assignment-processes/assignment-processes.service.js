var _a;
import { __decorate, __metadata } from "tslib";
import * as _ from 'underscore';
import { Injectable } from '@angular/core';
import { RightsService, SchedulingApiAssignmentProcessState, } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
let AssignmentProcessesService = class AssignmentProcessesService {
    constructor(rightsService) {
        this.rightsService = rightsService;
        this.STATES_ARRAY = [
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
    }
    /**
     * Find a icon for the provided state if possible
     */
    getIcon(state) {
        const object = _.findWhere(this.STATES_ARRAY, {
            state: state,
        });
        if (!object)
            return null;
        return object.icon;
    }
    /**
     * Find a description for the provided state if possible
     */
    getDescription(state, userCanEditAssignmentProcess) {
        if (state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES &&
            !userCanEditAssignmentProcess) {
            return 'Schichtwünsche abgeben';
        }
        const object = _.findWhere(this.STATES_ARRAY, { state: state });
        if (!object)
            return null;
        return object.description;
    }
};
AssignmentProcessesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object])
], AssignmentProcessesService);
export { AssignmentProcessesService };
//# sourceMappingURL=assignment-processes.service.js.map