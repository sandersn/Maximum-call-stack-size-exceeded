var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiWorkingTime } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { PMomentService } from '../../shared/p-moment.service';
let DetailFormComponent = class DetailFormComponent {
    constructor(api, validators, me, pFormsService, pRouterService, console, rightsService, localize, pMomentService) {
        this.api = api;
        this.validators = validators;
        this.me = me;
        this.pFormsService = pFormsService;
        this.pRouterService = pRouterService;
        this.console = console;
        this.rightsService = rightsService;
        this.localize = localize;
        this.pMomentService = pMomentService;
        this.onAddItem = new EventEmitter();
        this.PPossibleErrorNames = PPossibleErrorNames;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.PThemeEnum = PThemeEnum;
        this.formGroup = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get pageTitle() {
        return this.localize.transform('Arbeitseinsatz ${editOrCreate}', {
            editOrCreate: this.localize.transform(this.item.isNewItem() ? 'eintragen' : 'bearbeiten'),
        });
    }
    /**
     * Initialize the formGroup for this component
     */
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
        const tempFormGroup = this.pFormsService.group({});
        this.pFormsService.addControl(tempFormGroup, 'shiftModelId', {
            value: this.item.shiftModelId,
            disabled: false,
        }, [
            this.validators.required(this.item.attributeInfoShiftModelId.primitiveType),
            this.validators.idDefined(),
        ], (value) => {
            this.item.shiftModelId = value;
            this.refreshInitialEarnings();
        });
        if (!this.item.rawData)
            throw new Error('PLANO-24037');
        this.pFormsService.addControl(tempFormGroup, 'comment', {
            value: this.item.comment,
            disabled: !this.item.attributeInfoComment.canEdit,
        }, []);
        this.pFormsService.addControl(tempFormGroup, 'memberId', {
            value: this.item.memberId,
            disabled: !this.userCanWrite,
        }, [
            this.validators.required(this.item.attributeInfoMemberId.primitiveType),
            this.validators.idDefined(),
        ], (value) => {
            this.refreshInitialEarnings();
            this.item.memberId = value;
            if (this.item.attributeInfoComment.canEdit) {
                tempFormGroup.get('comment').enable();
            }
            else {
                tempFormGroup.get('comment').disable();
            }
        });
        this.pFormsService.addControl(tempFormGroup, 'regularPauseDuration', {
            value: this.item.regularPauseDuration,
            disabled: !this.userCanWrite,
        }, [
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
            new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: (control) => {
                    const start = this.item.time.start;
                    const end = this.item.time.end;
                    // @ts-expect-error -- fix this after `Maximum call stack size exceeded` has been fixed
                    return this.maxPauseValidator(start, end, control.value);
                } }),
        ], value => {
            if (this.item.regularPauseDuration === value)
                return;
            if (value !== '' && !Number.isNaN(+value)) {
                this.item.regularPauseDuration = value;
            }
            else {
                this.item.regularPauseDuration = -1;
            }
        });
        this.pFormsService.addControl(tempFormGroup, 'hourlyEarnings', {
            value: (this.item.attributeInfoHourlyEarnings.value) !== null ? this.item.hourlyEarnings : undefined,
            disabled: !this.userCanWrite,
        }, [
            this.validators.required(this.item.attributeInfoHourlyEarnings.primitiveType),
            this.validators.number(this.item.attributeInfoHourlyEarnings.primitiveType),
        ], value => { this.item.hourlyEarnings = value; });
        this.pFormsService.addControl(tempFormGroup, 'start', {
            value: this.item.time.start,
            disabled: !this.userCanWrite,
        }, [
            this.validators.required(PApiPrimitiveTypes.DateTime),
            new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: (control) => {
                    const limit = this.item.time.end;
                    assumeDefinedToGetStrictNullChecksRunning(limit, 'limit');
                    return this.validators.max(this.item.time.end, true, this.item.time.attributeInfoStart.primitiveType).fn(control);
                } }),
        ], value => { this.item.time.start = value; });
        this.pFormsService.addControl(tempFormGroup, 'end', {
            value: this.item.time.end,
            disabled: !this.userCanWrite,
        }, [
            this.validators.required(PApiPrimitiveTypes.DateTime),
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: (control) => {
                    const limit = this.item.time.start;
                    assumeDefinedToGetStrictNullChecksRunning(limit, 'limit');
                    return this.validators.min(this.item.time.start, true, this.item.time.attributeInfoEnd.primitiveType).fn(control);
                } }),
        ], value => { this.item.time.end = value; });
        this.formGroup = tempFormGroup;
    }
    /**
     * Exists in the following components:
     * - DetailFormComponent
     * - StopwatchComponent
     */
    maxPauseValidator(start, end, value) {
        if (!start)
            return null;
        if (!end)
            return null;
        const duration = end - start;
        const limitAsMinutes = this.pMomentService.d(duration).asMinutes();
        const controlValueAsMinutes = this.pMomentService.d(value).asMinutes();
        return this.validators.max(limitAsMinutes, true, PApiPrimitiveTypes.Minutes, undefined, 'Die Pause war länger als die Arbeitszeit? Witzbold ;)').fn({ value: controlValueAsMinutes });
    }
    refreshInitialEarnings() {
        var _a, _b, _c;
        assumeNonNull(this.formGroup);
        if (!this.formGroup.get('hourlyEarnings'))
            return;
        if (!((_a = this.formGroup.get('memberId')) === null || _a === void 0 ? void 0 : _a.value))
            return;
        if (!((_b = this.formGroup.get('shiftModelId')) === null || _b === void 0 ? void 0 : _b.value))
            return;
        const SHIFTMODEL_ID = this.formGroup.get('shiftModelId').value;
        const SHIFTMODEL = this.api.data.shiftModels.get(SHIFTMODEL_ID);
        if (!SHIFTMODEL) {
            this.console.error(`Could not find shiftModel ${SHIFTMODEL_ID.toString()} in list of ${this.api.data.shiftModels.length} shiftModels`);
            return;
        }
        const memberId = this.formGroup.get('memberId').value;
        const ASSIGNABLE_MEMBER = SHIFTMODEL.assignableMembers.getByMemberId(memberId);
        // Member is not assignable?
        // NOTE: Mil: Man kann (gewollt) alle Mitarbeiter für alle Tätigkeiten auswählen. Auch die die nicht assignable sind.
        // Deswegen ist das ein valider Fall.
        if (ASSIGNABLE_MEMBER === null) {
            if (this.item.isNewItem())
                (_c = this.formGroup.get('hourlyEarnings')) === null || _c === void 0 ? void 0 : _c.setValue(undefined);
            return;
        }
        const HOURLY_EARNINGS = ASSIGNABLE_MEMBER.attributeInfoHourlyEarnings.value;
        if (HOURLY_EARNINGS !== null) {
            this.formGroup.get('hourlyEarnings').setValue(HOURLY_EARNINGS);
        }
        else {
            if (this.item.isNewItem())
                this.formGroup.get('hourlyEarnings').setValue(undefined);
        }
    }
    /**
     * Init modal
     */
    ngAfterContentInit() {
        this.initComponent();
    }
    /**
     * Load and set everything that is necessary for this component
     */
    initComponent(success) {
        if (!this.item.isNewItem()) {
            this.item.loadDetailed({
                success: () => {
                    this.initFormGroup();
                    if (success) {
                        success();
                    }
                },
            });
        }
        else {
            this.initFormGroup();
            if (success) {
                success();
            }
        }
    }
    /**
     * Remove Item of this Detail page
     */
    removeItem() {
        this.formGroup = null;
        this.api.data.workingTimes.removeItem(this.item);
        this.pRouterService.navBack();
        this.api.save({
            success: () => {
            },
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showForm() {
        if (!this.me.isLoaded())
            return false;
        if (!this.api.isLoaded())
            return false;
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        if (!this.item) {
            this.console.error('type definition wrong?');
            return false;
        }
        if (!this.item.rawData)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get memberName() {
        if (!this.item.attributeInfoMemberId.value)
            return '';
        assumeDefinedToGetStrictNullChecksRunning(this.item.memberId, 'this.item.memberId');
        if (!this.api.isLoaded())
            return '';
        const MEMBER = this.api.data.members.get(this.item.memberId);
        if (MEMBER)
            return `${MEMBER.firstName} ${MEMBER.lastName}`;
        return null;
    }
    /**
     * Save this item
     */
    saveItem() {
        if (!this.item.isNewItem())
            return;
        this.onAddItem.emit(this.item);
        this.pRouterService.navBack();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get userCanWrite() {
        return !!this.rightsService.isOwner;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftModelsForDropdown() {
        return this.api.data.shiftModels.filterBy(item => !item.trashed);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get relatedShiftModel() {
        if (!this.item.attributeInfoShiftModelId.value)
            return null;
        if (!this.api.isLoaded())
            return null;
        const model = this.api.data.shiftModels.get(this.item.shiftModelId);
        if (!model)
            return null;
        return model;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftModelColor() {
        var _a;
        if (!((_a = this.relatedShiftModel) === null || _a === void 0 ? void 0 : _a.color))
            return null;
        return `#${this.relatedShiftModel.color}`;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftModelName() {
        if (!this.relatedShiftModel)
            return undefined;
        return this.relatedShiftModel.name;
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiWorkingTime !== "undefined" && SchedulingApiWorkingTime) === "function" ? _c : Object)
], DetailFormComponent.prototype, "item", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], DetailFormComponent.prototype, "onAddItem", void 0);
DetailFormComponent = __decorate([
    Component({
        selector: 'p-detail-form[item]',
        templateUrl: './detail-form.component.html',
        styleUrls: ['./detail-form.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, ValidatorsService,
        MeService,
        PFormsService,
        PRouterService,
        LogService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, LocalizePipe,
        PMomentService])
], DetailFormComponent);
export { DetailFormComponent };
//# sourceMappingURL=detail-form.component.js.map