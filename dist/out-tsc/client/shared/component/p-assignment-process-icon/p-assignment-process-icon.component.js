var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { AssignmentProcessesService } from '../../p-sidebar/p-assignment-processes/assignment-processes.service';
let PAssignmentProcessIconComponent = class PAssignmentProcessIconComponent {
    constructor(assignmentProcessesService, rightsService, console) {
        this.assignmentProcessesService = assignmentProcessesService;
        this.rightsService = rightsService;
        this.console = console;
        this.state = null;
        this.process = null;
    }
    get isOwner() {
        if (this._isOwner !== undefined)
            return this._isOwner;
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        this.console.debug('IMPROVE: Add [isOwner]="boolean" to make this a dump component.');
        return this.rightsService.isOwner;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get icon() {
        if (this.state === SchedulingApiAssignmentProcessState.NOT_STARTED) {
            if (this.isOwner)
                return ['far', 'clone'];
            if (this.process === null) {
                this.console.error('process is not defined');
                return null;
            }
            if (!this.rightsService.userCanEditAssignmentProcess(this.process))
                return null;
            return ['far', 'clone'];
        }
        if (this.state === null)
            return null;
        return this.assignmentProcessesService.getIcon(this.state);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PAssignmentProcessIconComponent.prototype, "state", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PAssignmentProcessIconComponent.prototype, "process", void 0);
__decorate([
    Input('isOwner'),
    __metadata("design:type", Boolean)
], PAssignmentProcessIconComponent.prototype, "_isOwner", void 0);
PAssignmentProcessIconComponent = __decorate([
    Component({
        selector: 'p-assignment-process-icon',
        templateUrl: './p-assignment-process-icon.component.html',
        styleUrls: ['./p-assignment-process-icon.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [AssignmentProcessesService, typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object, LogService])
], PAssignmentProcessIconComponent);
export { PAssignmentProcessIconComponent };
//# sourceMappingURL=p-assignment-process-icon.component.js.map