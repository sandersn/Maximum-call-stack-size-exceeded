var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessType, SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { AssignmentProcessesService } from '../../assignment-processes.service';
let PAssignmentProcessTypeCaptionComponent = class PAssignmentProcessTypeCaptionComponent {
    constructor(console, localize, assignmentProcessesService) {
        this.console = console;
        this.localize = localize;
        this.assignmentProcessesService = assignmentProcessesService;
        this._type = null;
        this._state = null;
        this.types = SchedulingApiAssignmentProcessType;
        this.states = SchedulingApiAssignmentProcessState;
        this.keyIsOpen = false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get type() {
        if (this._type)
            return this._type;
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        this.console.warn('Add [type]="process.type" on p-assignment-process-type-caption.');
        return this.process.type;
    }
    get state() {
        if (this._state)
            return this._state;
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        this.console.warn('Add [state]="process.state" on p-assignment-process-type-caption.');
        return this.process.state;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get typeTitle() {
        switch (this.type) {
            case SchedulingApiAssignmentProcessType.DR_PLANO:
                return this.localize.transform('Automatische Verteilung');
            case SchedulingApiAssignmentProcessType.EARLY_BIRD:
                return this.localize.transform('Der frühe Vogel');
            case SchedulingApiAssignmentProcessType.MANUAL:
                return this.localize.transform('Manuelle Verteilung');
            default:
                return undefined;
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    processHasReached(state) {
        if (state === SchedulingApiAssignmentProcessState.NOT_STARTED)
            return true;
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (state) {
            case SchedulingApiAssignmentProcessState.APPROVE:
                return (this.state === SchedulingApiAssignmentProcessState.APPROVE ||
                    this.state === SchedulingApiAssignmentProcessState.NEEDING_APPROVAL);
            default:
                return this.state >= state;
        }
    }
    /** @see AssignmentProcessesService['getDescription'] */
    getDescription(input) {
        return this.assignmentProcessesService.getDescription(input);
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof SchedulingApiAssignmentProcess !== "undefined" && SchedulingApiAssignmentProcess) === "function" ? _a : Object)
], PAssignmentProcessTypeCaptionComponent.prototype, "process", void 0);
__decorate([
    Input('type'),
    __metadata("design:type", Object)
], PAssignmentProcessTypeCaptionComponent.prototype, "_type", void 0);
__decorate([
    Input('state'),
    __metadata("design:type", Object)
], PAssignmentProcessTypeCaptionComponent.prototype, "_state", void 0);
PAssignmentProcessTypeCaptionComponent = __decorate([
    Component({
        selector: 'p-assignment-process-type-caption[process]',
        templateUrl: './p-assignment-process-type-caption.component.html',
        styleUrls: ['./p-assignment-process-type-caption.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [LogService,
        LocalizePipe,
        AssignmentProcessesService])
], PAssignmentProcessTypeCaptionComponent);
export { PAssignmentProcessTypeCaptionComponent };
//# sourceMappingURL=p-assignment-process-type-caption.component.js.map