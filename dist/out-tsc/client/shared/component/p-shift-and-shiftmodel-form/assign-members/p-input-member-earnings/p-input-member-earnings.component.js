var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { SchedulingApiMember } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
let PInputMemberEarningsComponent = class PInputMemberEarningsComponent {
    constructor(pFormsService) {
        this.pFormsService = pFormsService;
        this.formGroup = null;
        this._earnings = null;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
    }
    ngAfterContentInit() {
        this.initFormGroup();
    }
    get assignableMember() {
        return this.formItem.assignableMembers.getByMember(this.member);
    }
    /**
     * Initialize the formGroup for this component
     */
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
        const newFormGroup = this.pFormsService.group({});
        this.pFormsService.addPControl(newFormGroup, 'hourlyEarnings', {
            formState: {
                value: this.assignableMember ? this.assignableMember.hourlyEarnings : undefined,
                disabled: false,
            },
            subscribe: (value) => {
                if (typeof value !== 'number') {
                    if (value === undefined || value === null) {
                        this.formItem.assignableMembers.removeMember(this.member);
                        this.formItem.assignedMemberIds.removeItem(this.member.id);
                    }
                    return;
                }
                if (!this.assignableMember) {
                    this.formItem.assignableMembers.addNewMember(this.member, value);
                    return;
                }
                this.assignableMember.hourlyEarnings = value;
            },
        });
        this.formGroup = newFormGroup;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get earnings() {
        if (this.assignableMember !== null) {
            const earnings = this.assignableMember.attributeInfoHourlyEarnings.value;
            if (earnings !== null)
                this._earnings = earnings;
        }
        return this._earnings;
    }
    set earnings(input) {
        if (this.assignableMember !== null &&
            typeof this._earnings === 'number') {
            this.assignableMember.hourlyEarnings = input;
        }
        this._earnings = input;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputMemberEarningsComponent.prototype, "formItem", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiMember !== "undefined" && SchedulingApiMember) === "function" ? _c : Object)
], PInputMemberEarningsComponent.prototype, "member", void 0);
PInputMemberEarningsComponent = __decorate([
    Component({
        selector: 'p-input-member-earnings[formItem][member]',
        templateUrl: './p-input-member-earnings.component.html',
        styleUrls: ['./p-input-member-earnings.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [PFormsService])
], PInputMemberEarningsComponent);
export { PInputMemberEarningsComponent };
//# sourceMappingURL=p-input-member-earnings.component.js.map