/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1550] */
var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShift, SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiShiftRepetitionType, SchedulingApiShiftRepetitionPacket, SchedulingApiShiftModelRepetitionPacket, SchedulingApiShiftRepetition, SchedulingApiShiftModelRepetition, SchedulingApiPaymentMethodType, SchedulingApiWorkingTimeCreationMethod, SchedulingApiCourseType, SchedulingApiBookingDesiredDateSetting } from '@plano/shared/api';
import { SchedulingApiShiftModelCourseTariff } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { LogService } from '../../../../shared/core/log.service';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PPossibleErrorNames, PValidatorObject } from '../../../../shared/core/validators.types';
import { PShiftmodelTariffService } from '../../p-forms/p-shiftmodel-tariff.service';
export var IntervalEndDateModes;
(function (IntervalEndDateModes) {
    IntervalEndDateModes[IntervalEndDateModes["NEVER"] = 0] = "NEVER";
    IntervalEndDateModes[IntervalEndDateModes["AFTER_X_TIMES"] = 1] = "AFTER_X_TIMES";
    IntervalEndDateModes[IntervalEndDateModes["ENDS_AFTER_DATE"] = 2] = "ENDS_AFTER_DATE";
})(IntervalEndDateModes || (IntervalEndDateModes = {}));
let PShiftAndShiftmodelFormService = class PShiftAndShiftmodelFormService {
    constructor(fb, pFormsService, rightsService, ngbFormats, validators, asyncValidators, pShiftmodelTariffService, pMoment, localize, modalService, console) {
        this.fb = fb;
        this.pFormsService = pFormsService;
        this.rightsService = rightsService;
        this.ngbFormats = ngbFormats;
        this.validators = validators;
        this.asyncValidators = asyncValidators;
        this.pShiftmodelTariffService = pShiftmodelTariffService;
        this.pMoment = pMoment;
        this.localize = localize;
        this.modalService = modalService;
        this.console = console;
        this.modeIsEditShift = null;
        this.modeIsEditShiftModel = null;
        this.modeIsCreateShift = null;
        this.modeIsCreateShiftModel = null;
        this.weekdaysAndTitlesArray = [
            { key: 'isRepeatingOnMonday', title: 'Mo' },
            { key: 'isRepeatingOnTuesday', title: 'Di' },
            { key: 'isRepeatingOnWednesday', title: 'Mi' },
            { key: 'isRepeatingOnThursday', title: 'Do' },
            { key: 'isRepeatingOnFriday', title: 'Fr' },
            { key: 'isRepeatingOnSaturday', title: 'Sa' },
            { key: 'isRepeatingOnSunday', title: 'So' },
        ];
        this.paymentMethodTypes = SchedulingApiPaymentMethodType;
        this.intervalEndDateModesIterable = [
            { title: this.localize.transform('Nie'), enum: IntervalEndDateModes.NEVER },
            { title: this.localize.transform('Nach X Wiederholungen'), enum: IntervalEndDateModes.AFTER_X_TIMES },
            { title: this.localize.transform('An dem Datum X'), enum: IntervalEndDateModes.ENDS_AFTER_DATE },
        ];
    }
    /**
     * Check all controls that are inside the interval box, to get a single "is valid" boolean.
     */
    // TODO: Get rid of this, and store all interval related controls inside one formGroup, so you can use formGroup.valid
    intervalSettingsAreValid(formGroup) {
        if (formGroup.get('isPacket').invalid)
            return false;
        if (formGroup.get('repetition_x').invalid)
            return false;
        if (formGroup.get('repetition_type').invalid)
            return false;
        if (formGroup.get('repetition_weekdays').invalid)
            return false;
        if (formGroup.get('repetition_endsAfterRepetitionCount').invalid)
            return false;
        if (formGroup.get('repetition_endsAfterDate').invalid)
            return false;
        return true;
    }
    /**
     * Initialize all formGroup values, states, validators, subscribers etc.
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity, max-lines-per-function
    initFormGroup(formItem, userCanWrite, notificationsConf, shiftModels, modalContentForIsCoronaSlotBooking, shiftModel) {
        var _a, _b, _c, _d;
        const model = formItem instanceof SchedulingApiShiftModel ? formItem : shiftModel;
        const tempFormGroup = this.pFormsService.group({});
        this.addControlsForBasis(tempFormGroup, formItem, userCanWrite, model);
        this.addControlsForTimeRelatedSettings(tempFormGroup, formItem, userCanWrite, model);
        this.pFormsService.addControl(tempFormGroup, 'workingTimeCreationMethodIsViaTimestamp', {
            value: formItem.workingTimeCreationMethod === SchedulingApiWorkingTimeCreationMethod.TIME_STAMP,
            disabled: (this.modeIsEditShiftModel && model.trashed) || !this.rightsService.isOwner || !userCanWrite,
        }, [this.validators.required(PApiPrimitiveTypes.boolean)], value => {
            if (value) {
                formItem.workingTimeCreationMethod = SchedulingApiWorkingTimeCreationMethod.TIME_STAMP;
            }
            else {
                formItem.workingTimeCreationMethod = SchedulingApiWorkingTimeCreationMethod.AUTOMATIC;
            }
        });
        const initialIsCourseOnline = (() => {
            // NOTE: If user wants to create a shift and model is ONLY_DESIRED_DATES, then isCourseOnline is always false,
            // because the booking person will never see shifts in the plugin.
            if (formItem instanceof SchedulingApiShift &&
                formItem.isNewItem() &&
                model.bookingDesiredDateSetting === SchedulingApiBookingDesiredDateSetting.ONLY_DESIRED_DATES)
                return false;
            if (formItem.attributeInfoIsCourseOnline.value !== null) {
                return formItem.isCourseOnline;
            }
            if (model.attributeInfoIsCourseOnline.value !== null) {
                return model.isCourseOnline;
            }
            return null;
        })();
        this.pFormsService.addControl(tempFormGroup, 'isCourseOnline', {
            value: initialIsCourseOnline,
            disabled: this.getIsCourseOnlineDisabled(model, userCanWrite),
        }, [], value => {
            formItem.isCourseOnline = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'isCoronaSlotBooking', {
            value: model.isCoronaSlotBooking,
            disabled: (_a = (this.formIsDisabled(model, userCanWrite) ||
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                this.modeIsEditShift || this.modeIsCreateShift)) !== null && _a !== void 0 ? _a : false,
        }, [], value => {
            if (value && this.modeIsCreateShiftModel) {
                this.modalService.openModal(modalContentForIsCoronaSlotBooking, {
                    success: () => {
                        model.isCoronaSlotBooking = value;
                    },
                    dismiss: () => {
                        tempFormGroup.get('isCoronaSlotBooking').setValue(false);
                    },
                });
            }
            else {
                model.isCoronaSlotBooking = value;
            }
        });
        this.pFormsService.addControl(tempFormGroup, 'isCourse', {
            value: model.isCourse,
            disabled: (_b = (this.formIsDisabled(model, userCanWrite) ||
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                this.modeIsEditShift || this.modeIsCreateShift)) !== null && _b !== void 0 ? _b : false,
        }, [], value => {
            model.isCourse = value;
            if (tempFormGroup.get('courseType') && !tempFormGroup.get('courseType').value) {
                tempFormGroup.get('courseType').setValue(SchedulingApiCourseType.ONLINE_BOOKABLE);
            }
            if (value && !tempFormGroup.get('courseTitle').value) {
                tempFormGroup.get('courseTitle').setValue(model.name);
            }
            tempFormGroup.get('courseDescription').updateValueAndValidity();
            if (value && !tempFormGroup.get('courseCodePrefix').value) {
                tempFormGroup.get('courseCodePrefix').setValue(this.getDefaultPrefix(formItem, shiftModels));
            }
            if (this.getIsCourseOnlineDisabled(model, userCanWrite)) {
                tempFormGroup.get('isCourseOnline').disable();
            }
            else {
                tempFormGroup.get('isCourseOnline').enable();
            }
        });
        this.pFormsService.addControl(tempFormGroup, 'courseCode', {
            disabled: this.formIsDisabled(model, userCanWrite),
        });
        this.pFormsService.addControl(tempFormGroup, 'courseCodePrefix', {
            value: model.courseCodePrefix,
            disabled: model.trashed || !userCanWrite,
        }, [
            this.validators.maxLength(6, model.attributeInfoCourseCodePrefix.primitiveType),
            this.validators.pattern(/^[\dA-Za-z]*$/),
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    if (!model.isCourse)
                        return null;
                    if (!(this.modeIsEditShiftModel || this.modeIsCreateShiftModel))
                        return null;
                    return this.validators.required(model.attributeInfoCourseCodePrefix.primitiveType).fn(control);
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.OCCUPIED, fn: (control) => {
                    if (!control.value)
                        return null;
                    if (!model.isCourse)
                        return null;
                    if (!(this.modeIsEditShiftModel || this.modeIsCreateShiftModel))
                        return null;
                    if (!this.prefixIsAlreadyOccupied(control.value, formItem, shiftModels))
                        return null;
                    return { [PPossibleErrorNames.OCCUPIED]: {
                            name: PPossibleErrorNames.OCCUPIED,
                            primitiveType: PApiPrimitiveTypes.string,
                        } };
                } }),
        ], (value) => {
            model.courseCodePrefix = value ? value.toUpperCase() : value;
        });
        this.pFormsService.addControl(tempFormGroup, 'freeclimberArticleId', {
            value: (_c = model.freeclimberArticleId) !== null && _c !== void 0 ? _c : undefined,
            disabled: model.trashed || !userCanWrite,
        }, [
            this.validators.freeclimberArticleId(PApiPrimitiveTypes.string),
        ], (value) => {
            if (!value || value === '0') {
                model.freeclimberArticleId = null;
                return;
            }
            model.freeclimberArticleId = +value;
        });
        this.pFormsService.addControl(tempFormGroup, 'bookingDesiredDateSetting', {
            value: model.bookingDesiredDateSetting,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    if (model.courseType !== SchedulingApiCourseType.ONLINE_INQUIRY)
                        return null;
                    return this.validators.required(model.attributeInfoBookingDesiredDateSetting.primitiveType).fn(control);
                } }),
        ], (value) => {
            model.bookingDesiredDateSetting = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseType', {
            value: model.courseType,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    // FIXME: PLANO-15096
                    if (!model.isCourse)
                        return null;
                    return this.validators.required(model.attributeInfoCourseType.primitiveType).fn(control);
                } }),
        ], value => {
            model.courseType = value;
            const SETTING_CONTROL = tempFormGroup.get('bookingDesiredDateSetting');
            assumeNonNull(SETTING_CONTROL);
            if (SETTING_CONTROL.value !== SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_NOT_ALLOWED &&
                value !== SchedulingApiCourseType.ONLINE_INQUIRY) {
                SETTING_CONTROL.setValue(undefined);
            }
            SETTING_CONTROL.updateValueAndValidity();
        });
        this.pFormsService.addControl(tempFormGroup, 'minCourseParticipantCount', {
            value: formItem.minCourseParticipantCount,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            this.validators.min(1, true, formItem.attributeInfoMinCourseParticipantCount.primitiveType),
            this.validators.maxDecimalPlacesCount(0, formItem.attributeInfoMinCourseParticipantCount.primitiveType),
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (!model.isCourse)
                        return null;
                    return this.validators.required(model.attributeInfoMinCourseParticipantCount.primitiveType).fn(control);
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: (control) => {
                    var _a;
                    // FIXME: PLANO-15096
                    if ((_a = tempFormGroup.get('maxCourseParticipantCount')) === null || _a === void 0 ? void 0 : _a.value) {
                        return this.validators.max(tempFormGroup.get('maxCourseParticipantCount').value, true, formItem.attributeInfoMinCourseParticipantCount.primitiveType).fn(control);
                    }
                    return null;
                } }),
        ], (value) => {
            if (formItem.minCourseParticipantCount === value)
                return;
            formItem.minCourseParticipantCount = value;
            tempFormGroup.get('maxCourseParticipantCount').updateValueAndValidity();
        });
        this.pFormsService.addControl(tempFormGroup, 'maxCourseParticipantCount', {
            value: formItem.maxCourseParticipantCount,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: (control) => {
                    var _a;
                    // FIXME: PLANO-15096
                    if ((_a = tempFormGroup.get('minCourseParticipantCount')) === null || _a === void 0 ? void 0 : _a.value) {
                        return this.validators.min(tempFormGroup.get('minCourseParticipantCount').value, true, formItem.attributeInfoMaxCourseParticipantCount.primitiveType).fn(control);
                    }
                    return null;
                } }),
        ], (value) => {
            // if (+value === 0) throw new Error(`[PLANO-20872] ${value}`);
            if (value !== null && value !== '' && !Number.isNaN(+value) && !Number.isNaN(value)) {
                if (formItem.maxCourseParticipantCount !== +value) {
                    formItem.maxCourseParticipantCount = +value;
                }
            }
            else {
                formItem.maxCourseParticipantCount = null;
            }
            tempFormGroup.get('minCourseParticipantCount').updateValueAndValidity();
        });
        this.addShiftModelCourseSpecificControls(tempFormGroup, formItem, userCanWrite, model);
        this.addShiftSpecificControls(tempFormGroup, formItem, userCanWrite, model);
        this.addShiftModelSpecificControls(tempFormGroup, formItem);
        this.pFormsService.addControl(tempFormGroup, 'isInterval', {
            value: this.getIsInterval(tempFormGroup),
            disabled: false,
        }, [], value => {
            if (!value) {
                this.clearRepetitionType(tempFormGroup);
            }
            else if (tempFormGroup.get('repetition_type').value === SchedulingApiShiftRepetitionType.NONE ||
                tempFormGroup.get('repetition_type').value === undefined) {
                if (tempFormGroup.get('packetRepetition_type').value ===
                    SchedulingApiShiftRepetitionType.EVERY_X_WEEKS) {
                    this.initRepetitionTypeMonth(tempFormGroup);
                }
                else {
                    this.initRepetitionTypeWeek(tempFormGroup);
                }
            }
        });
        if (formItem.isPacket === null)
            this.console.error('Could not get formItem.isPacket');
        this.setIntervalEndDateModesIterableTitle((_d = formItem.isPacket) !== null && _d !== void 0 ? _d : false);
        this.pFormsService.addControl(tempFormGroup, 'sendEmail', {
            value: notificationsConf.sendEmail,
            disabled: false,
        }, [this.validators.required(notificationsConf.attributeInfoSendEmail.primitiveType)], (value) => {
            notificationsConf.sendEmail = value;
        });
        return tempFormGroup;
    }
    addControlsForBasis(tempFormGroup, formItem, userCanWrite, model) {
        this.pFormsService.addControl(tempFormGroup, 'parentName', {
            value: model.parentName,
            disabled: (this.modeIsEditShiftModel && model.trashed) || !this.rightsService.isOwner,
        }, [this.validators.required(model.attributeInfoParentName.primitiveType)]);
        this.pFormsService.addControl(tempFormGroup, 'name', {
            value: model.name,
            disabled: (this.modeIsEditShiftModel && model.trashed) || !this.rightsService.isOwner,
        }, [this.validators.required(model.attributeInfoName.primitiveType)]);
        this.pFormsService.addControl(tempFormGroup, 'color', {
            value: model.color,
            disabled: (this.modeIsEditShiftModel && model.trashed) || !this.rightsService.isOwner,
        }, [this.validators.required(model.attributeInfoColor.primitiveType)], value => {
            model.color = value;
        });
        this.pFormsService.addFormGroup(tempFormGroup, 'neededMembersCountConf', this.getNeededMembersCountConfFormGroup(formItem, userCanWrite, model));
        this.pFormsService.addControl(tempFormGroup, 'description', {
            value: formItem.description,
            disabled: this.formIsDisabled(model, userCanWrite),
        });
    }
    addControlsForTimeRelatedSettings(tempFormGroup, formItem, userCanWrite, model) {
        if (!formItem.time.rawData)
            throw new Error('formItem.time has no data');
        this.pFormsService.addControl(tempFormGroup, 'startTime', {
            value: formItem.time.start,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: (control) => {
                    if (formItem.time.attributeInfoEnd.value === null)
                        return null;
                    return this.validators.max(formItem.time.attributeInfoEnd.value - (1000 * 60), true, PApiPrimitiveTypes.LocalTime).fn(control);
                } }),
            this.validators.required(PApiPrimitiveTypes.LocalTime),
        ], value => {
            if (formItem.time.start === value)
                return;
            formItem.time.start = value;
            tempFormGroup.get('endTime').updateValueAndValidity();
            tempFormGroup.updateValueAndValidity();
        });
        this.pFormsService.addControl(tempFormGroup, 'endTime', {
            value: formItem.time.end,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: (control) => {
                    if (formItem.time.attributeInfoStart.value === null)
                        return null;
                    return this.validators.min(formItem.time.attributeInfoStart.value + (1000 * 60), true, PApiPrimitiveTypes.LocalTime).fn(control);
                } }),
            this.validators.required(PApiPrimitiveTypes.LocalTime),
        ], value => {
            if (formItem.time.end === value)
                return;
            formItem.time.end = value;
            tempFormGroup.get('startTime').updateValueAndValidity();
            tempFormGroup.updateValueAndValidity();
        });
        this.addControlsForRepetition(tempFormGroup, formItem, userCanWrite, model);
        this.addControlsForPacketRepetition(tempFormGroup, formItem, userCanWrite, model);
    }
    addControlsForRepetition(tempFormGroup, formItem, userCanWrite, model) {
        this.pFormsService.addControl(tempFormGroup, 'repetition_type', {
            value: formItem.repetition.type,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            formItem.repetition.type = value;
            tempFormGroup.get('repetition_weekdays').updateValueAndValidity();
            tempFormGroup.get('repetition_x').updateValueAndValidity();
            // Set the isInterval. isInterval is needed for the ui checkbox.
            this.refreshIsInterval(tempFormGroup);
        });
        this.pFormsService.addControl(tempFormGroup, 'repetition_x', {
            value: formItem.repetition.x,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (formItem.repetition.attributeInfoType.value === null)
                        return null;
                    return this.validators.required(formItem.repetition.attributeInfoX.primitiveType).fn(control);
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (formItem.repetition.attributeInfoType.value === null)
                        return null;
                    if (formItem.repetition.attributeInfoType.value === SchedulingApiShiftRepetitionType.NONE)
                        return null;
                    return this.validators.min(1, true, formItem.repetition.attributeInfoX.primitiveType).fn(control);
                } }),
        ], value => {
            formItem.repetition.x = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'repetition_endsAfterRepetitionCount', {
            value: formItem.repetition.endsAfterRepetitionCount,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    const mode = tempFormGroup.get('selectedRepetitionEndDateMode');
                    if (!mode)
                        return null;
                    if (mode.value !== IntervalEndDateModes.AFTER_X_TIMES)
                        return null;
                    return this.validators.required(formItem.repetition.attributeInfoEndsAfterRepetitionCount.primitiveType).fn(control);
                } }),
        ], value => {
            // eslint-disable-next-line unicorn/prefer-number-properties
            if (!isNaN(value) && !Number.isNaN(+value)) {
                formItem.repetition.endsAfterRepetitionCount = +value;
            }
            formItem.repetition.endsAfterRepetitionCount = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'repetition_endsAfterDate', {
            // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
            value: formItem.repetition.endsAfterDate ? formItem.repetition.endsAfterDate : +this.pMoment.m(this.now).endOf('day'),
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            if (!value) {
                formItem.repetition.endsAfterDate = 0;
                return;
            }
            formItem.repetition.endsAfterDate = +this.pMoment.m(value).endOf('day');
        });
        const repetitionWeekdaysFormGroup = this.pFormsService.group({});
        tempFormGroup.addControl('repetition_weekdays', repetitionWeekdaysFormGroup);
        this.initWeekdaysFormGroup(repetitionWeekdaysFormGroup, formItem.repetition, userCanWrite, model);
        this.pFormsService.addControl(tempFormGroup, 'selectedRepetitionEndDateMode', {
            value: this.getSelectedRepetitionEndDateMode(tempFormGroup, formItem),
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            if (value === IntervalEndDateModes.AFTER_X_TIMES) {
                tempFormGroup.get('repetition_endsAfterRepetitionCount').setValue(1);
                tempFormGroup.get('repetition_endsAfterDate').setValue(0);
            }
            if (value === IntervalEndDateModes.ENDS_AFTER_DATE) {
                tempFormGroup.get('repetition_endsAfterRepetitionCount').setValue(0);
                tempFormGroup.get('repetition_endsAfterDate').setValue(this.now);
            }
            if (value === IntervalEndDateModes.NEVER) {
                tempFormGroup.get('repetition_endsAfterRepetitionCount').setValue(0);
                tempFormGroup.get('repetition_endsAfterDate').setValue(0);
            }
        });
    }
    addControlsForPacketRepetition(tempFormGroup, formItem, userCanWrite, model) {
        var _a, _b, _c, _d;
        this.pFormsService.addControl(tempFormGroup, 'packet_endsAfterRepetitionCount', {
            value: formItem.repetition.packetRepetition.endsAfterRepetitionCount,
            disabled: (_a = (this.formIsDisabled(model, userCanWrite) || this.modeIsEditShift)) !== null && _a !== void 0 ? _a : false,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (formItem.repetition.packetRepetition.type === SchedulingApiShiftRepetitionType.NONE)
                        return null;
                    return this.validators.required(formItem.repetition.packetRepetition.attributeInfoEndsAfterRepetitionCount.primitiveType).fn(control);
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (formItem.repetition.packetRepetition.type === SchedulingApiShiftRepetitionType.NONE)
                        return null;
                    return this.validators.min(1, true, formItem.repetition.packetRepetition.attributeInfoEndsAfterRepetitionCount.primitiveType).fn(control);
                } }),
        ], (value) => {
            if (!value || !(+value) || formItem.repetition.packetRepetition.endsAfterRepetitionCount > +value) {
                this.clearWeekdays(tempFormGroup.get('packet_weekdays'));
            }
            formItem.repetition.packetRepetition.endsAfterRepetitionCount = +value;
        });
        this.pFormsService.addControl(tempFormGroup, 'packet_x', {
            value: formItem.repetition.packetRepetition.x,
            disabled: (_b = (this.formIsDisabled(model, userCanWrite) || this.modeIsEditShift)) !== null && _b !== void 0 ? _b : false,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (formItem.repetition.packetRepetition.type === SchedulingApiShiftRepetitionType.NONE) {
                        return null;
                    }
                    return this.validators.required(formItem.repetition.packetRepetition.attributeInfoX.primitiveType).fn(control);
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (formItem.repetition.packetRepetition.type === SchedulingApiShiftRepetitionType.NONE) {
                        return null;
                    }
                    return this.validators.min(1, true, formItem.repetition.packetRepetition.attributeInfoX.primitiveType).fn(control);
                } }),
        ], value => {
            formItem.repetition.packetRepetition.x = Number.parseInt(value, 10);
        });
        this.pFormsService.addControl(tempFormGroup, 'packetRepetition_type', {
            value: formItem.repetition.packetRepetition.type,
            disabled: (_c = (this.formIsDisabled(model, userCanWrite) || this.modeIsEditShift)) !== null && _c !== void 0 ? _c : false,
        }, [], value => {
            formItem.repetition.packetRepetition.type = value;
            tempFormGroup.get('packet_weekdays').updateValueAndValidity();
        });
        this.pFormsService.addControl(tempFormGroup, 'isPacket', {
            value: formItem.isPacket,
            disabled: (_d = (this.formIsDisabled(model, userCanWrite) || this.modeIsEditShift)) !== null && _d !== void 0 ? _d : false,
        }, [this.validators.required(PApiPrimitiveTypes.boolean)], value => {
            this.setIntervalEndDateModesIterableTitle(value);
            if (!value) {
                tempFormGroup.get('packetRepetition_type').setValue(SchedulingApiShiftRepetitionType.NONE);
            }
            else if (tempFormGroup.get('packetRepetition_type').value === SchedulingApiShiftRepetitionType.NONE ||
                tempFormGroup.get('packetRepetition_type').value === undefined) {
                tempFormGroup.get('packetRepetition_type').setValue(SchedulingApiShiftRepetitionType.EVERY_X_WEEKS);
                tempFormGroup.get('packet_x').setValue(1);
                tempFormGroup.get('packet_endsAfterRepetitionCount').setValue(1);
                tempFormGroup.updateValueAndValidity();
            }
        });
        const packetWeekdaysFormGroup = this.pFormsService.group({});
        tempFormGroup.addControl('packet_weekdays', packetWeekdaysFormGroup);
        this.initWeekdaysFormGroup(packetWeekdaysFormGroup, formItem.repetition.packetRepetition, userCanWrite, model);
    }
    initWeekdaysFormGroup(weekdaysFormGroup, weekdaysObject, userCanWrite, model) {
        var _a;
        let weekdaysObjectType;
        if (weekdaysObject instanceof SchedulingApiShiftRepetition ||
            weekdaysObject instanceof SchedulingApiShiftModelRepetition) {
            weekdaysObjectType = SchedulingApiShiftRepetitionType;
        }
        else if (weekdaysObject instanceof SchedulingApiShiftRepetitionPacket ||
            weekdaysObject instanceof SchedulingApiShiftModelRepetitionPacket) {
            weekdaysObjectType = SchedulingApiShiftRepetitionType;
        }
        else {
            throw new TypeError('unsupported type.');
        }
        for (const weekdayObj of this.weekdaysAndTitlesArray) {
            this.pFormsService.addControl(weekdaysFormGroup, weekdayObj.key, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value: weekdaysObject[weekdayObj.key],
                disabled: (_a = (this.formIsDisabled(model, userCanWrite) || this.modeIsEditShift)) !== null && _a !== void 0 ? _a : false,
            }, [], value => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                weekdaysObject[weekdayObj.key] = value;
            });
        }
        weekdaysFormGroup.setValidators([
            (control) => {
                if (weekdaysObject.type !== weekdaysObjectType.EVERY_X_WEEKS)
                    return null;
                for (const key of Object.keys(control.controls)) {
                    if (control.controls[key].value === true)
                        return null;
                }
                return { min: { name: PPossibleErrorNames.MIN, primitiveType: PApiPrimitiveTypes.string, min: 1, actual: 0 } };
            },
            (control) => {
                if (weekdaysObject.type !== weekdaysObjectType.EVERY_X_WEEKS)
                    return null;
                const KEYS_OF_CONTROLS = Object.keys(control.controls);
                const counter = KEYS_OF_CONTROLS.filter(key => control.controls[key].value === true).length;
                let maxWeekdays;
                if (weekdaysObject.endsAfterRepetitionCount) {
                    maxWeekdays = weekdaysObject.endsAfterRepetitionCount;
                }
                else {
                    maxWeekdays = 7;
                }
                if (counter <= maxWeekdays)
                    return null;
                return { max: {
                        name: PPossibleErrorNames.MAX,
                        primitiveType: null,
                        max: weekdaysObject.endsAfterRepetitionCount,
                        actual: counter,
                    } };
            },
        ]);
    }
    addShiftModelSpecificControls(tempFormGroup, formItem) {
        if (!(formItem instanceof SchedulingApiShiftModel))
            return;
        this.pFormsService.addControl(tempFormGroup, 'costCentre', {
            value: formItem.costCentre,
            disabled: false,
        }, [], value => {
            formItem.costCentre = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'articleGroup', {
            value: formItem.articleGroup,
            disabled: false,
        }, [], value => {
            formItem.articleGroup = value;
        });
    }
    addShiftSpecificControls(tempFormGroup, formItem, userCanWrite, model) {
        if (!(formItem instanceof SchedulingApiShift))
            return;
        this.pFormsService.addControl(tempFormGroup, 'ngbStartDate', {
            value: this.ngbFormats.timestampToDateStruct(formItem.start),
            disabled: this.formIsDisabled(model, userCanWrite),
        });
        this.pFormsService.addControl(tempFormGroup, 'startDate', {
            value: formItem.start,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            this.validators.required(PApiPrimitiveTypes.DateTime),
            this.validators.max(formItem.end, true, formItem.attributeInfoStart.primitiveType),
        ], value => {
            formItem.start = value;
            const timestamp = this.ngbFormats.timestampToDateStruct(value);
            tempFormGroup.get('ngbStartDate').setValue(timestamp);
            tempFormGroup.get('ngbStartDate').updateValueAndValidity();
            tempFormGroup.get('workingTimeCreationMethodIsViaTimestamp').updateValueAndValidity();
        });
    }
    setIntervalEndDateModesIterableTitle(isPacket) {
        if (isPacket) {
            this.intervalEndDateModesIterable[1].title = this.localize.transform('Nach X Paketen');
        }
        else {
            this.intervalEndDateModesIterable[1].title = this.localize.transform('Nach X Schichten');
        }
    }
    getSelectedRepetitionEndDateMode(tempFormGroup, formItem) {
        if (formItem.repetition.endsAfterDate) {
            return IntervalEndDateModes.ENDS_AFTER_DATE;
        }
        if (formItem.repetition.endsAfterRepetitionCount ||
            tempFormGroup.get('repetition_endsAfterRepetitionCount').value === '') {
            return IntervalEndDateModes.AFTER_X_TIMES;
        }
        return IntervalEndDateModes.NEVER;
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    getNeededMembersCountConfFormGroup(formItem, userCanWrite, model) {
        const result = this.pFormsService.group({});
        const initialModeIsFixedMembersCountValue = !(!!formItem.neededMembersCountConf.perXParticipants && formItem.neededMembersCountConf.perXParticipants > 0);
        this.pFormsService.addControl(result, 'modeIsFixedMembersCount', {
            value: initialModeIsFixedMembersCountValue,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (formItem instanceof SchedulingApiShiftModel && formItem.isCourse) {
                        return this.validators.required(formItem.neededMembersCountConf.attributeInfoPerXParticipants.primitiveType).fn(control);
                    }
                    return null;
                } }),
        ], value => {
            if (value) {
                if (formItem.neededMembersCountConf.neededMembersCount < 1) {
                    formItem.neededMembersCountConf.neededMembersCount = 2;
                }
                if (result.get('perXParticipants')) {
                    result.get('perXParticipants').setValue(null);
                }
                else {
                    formItem.neededMembersCountConf.perXParticipants = null;
                }
            }
            else if (formItem.neededMembersCountConf.perXParticipants && formItem.neededMembersCountConf.perXParticipants < 1) {
                if (result.get('perXParticipants')) {
                    result.get('perXParticipants').setValue(8);
                }
                else {
                    formItem.neededMembersCountConf.perXParticipants = 8;
                }
            }
        });
        this.pFormsService.addControl(result, 'neededMembersCount', {
            value: formItem.neededMembersCountConf.neededMembersCount,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    if (!result.get('modeIsFixedMembersCount').value)
                        return null;
                    return this.validators.required(formItem.neededMembersCountConf.attributeInfoNeededMembersCount.primitiveType).fn(control);
                } }),
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
        ], (value) => {
            if (value === undefined || value === null) {
                formItem.neededMembersCountConf.neededMembersCount = 0;
                return;
            }
            formItem.neededMembersCountConf.neededMembersCount = +value;
        });
        this.pFormsService.addControl(result, 'perXParticipants', {
            value: formItem.neededMembersCountConf.perXParticipants > 0 ? formItem.neededMembersCountConf.perXParticipants : 0,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (!result.get('modeIsFixedMembersCount').value) {
                        return this.validators.required(PApiPrimitiveTypes.boolean).fn(control);
                    }
                    return null;
                } }),
        ], value => {
            if (value > 0) {
                formItem.neededMembersCountConf.perXParticipants = Number.parseInt(value, 10);
            }
            else {
                formItem.neededMembersCountConf.perXParticipants = -1;
            }
        });
        this.pFormsService.addControl(result, 'isZeroNotReachedMinParticipantsCount', {
            value: formItem.neededMembersCountConf.isZeroNotReachedMinParticipantsCount,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            formItem.neededMembersCountConf.isZeroNotReachedMinParticipantsCount = !!value;
        });
        return result;
    }
    getIsInterval(tempFormGroup) {
        let result = false;
        if (tempFormGroup.get('repetition_type').value === undefined) {
            result = false;
        }
        else {
            result = tempFormGroup.get('repetition_type').value !== SchedulingApiShiftRepetitionType.NONE;
        }
        return result;
    }
    /**
     * Shorthand to get some popover text.
     */
    getIsCourseOnlineDisabledTooltipContent(model) {
        if ((this.modeIsEditShift || this.modeIsCreateShift) &&
            model.bookingDesiredDateSetting === SchedulingApiBookingDesiredDateSetting.ONLY_DESIRED_DATES) {
            return this.localize.transform('Für »${name}« sollen Kunden Wunschtermine angeben. Die Schichten sind im Plugin nicht zu sehen.', { name: model.name });
        }
        return undefined;
    }
    getIsCourseOnlineDisabled(model, userCanWrite) {
        if (this.getIsCourseOnlineDisabledTooltipContent(model))
            return true;
        if (this.modeIsEditShiftModel && model.trashed)
            return true;
        if (!userCanWrite)
            return true;
        if ((this.modeIsEditShift || this.modeIsCreateShift) && !model.isCourseOnline)
            return true;
        if (!model.isCourse)
            return true;
        return false;
    }
    formIsDisabled(model, userCanWrite) {
        return (this.modeIsEditShiftModel && model.trashed) || !userCanWrite;
    }
    addShiftModelCourseSpecificControls(tempFormGroup, formItem, userCanWrite, model) {
        if (!(formItem instanceof SchedulingApiShiftModel))
            return;
        this.pFormsService.addControl(tempFormGroup, 'courseTitle', {
            value: model.courseTitle,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    if (!tempFormGroup.get('isCourse').value)
                        return null;
                    if (!this.modeIsEditShiftModel && !this.modeIsCreateShiftModel)
                        return null;
                    return this.validators.required(model.attributeInfoCourseTitle.primitiveType).fn(control);
                } }),
        ], value => {
            model.courseTitle = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseSubtitle', {
            value: model.courseSubtitle,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            model.courseSubtitle = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseDescription', {
            value: model.courseDescription,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
        // (control) => {
        // 	if (!tempFormGroup.get('isCourse')!.value) return null;
        // 	if (!(
        // 		this.modeIsCreateShiftModel || this.modeIsEditShiftModel
        // 	)) return null;
        //
        // 	return this.validators.required(control);
        // },
        ], value => {
            model.courseDescription = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseGroup', {
            value: model.courseGroup,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            model.courseGroup = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseSkillRequirements', {
            value: model.courseSkillRequirements,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            model.courseSkillRequirements = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseEquipmentRequirements', {
            value: model.courseEquipmentRequirements,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            model.courseEquipmentRequirements = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseLocation', {
            value: model.courseLocation,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            model.courseLocation = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseContactName', {
            value: model.courseContactName,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            model.courseContactName = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseContactEmail', {
            value: model.courseContactEmail,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            this.validators.email(),
        ], value => {
            model.courseContactEmail = value;
        }, this.asyncValidators.emailValidAsync());
        this.pFormsService.addControl(tempFormGroup, 'courseContactPhone', {
            value: model.courseContactPhone,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], value => {
            model.courseContactPhone = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'onlyWholeCourseBookable', {
            value: !!model.onlyWholeCourseBookable,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [], (value) => {
            model.onlyWholeCourseBookable = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseBookingDeadlineFrom', {
            value: model.courseBookingDeadlineFrom,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            this.validators.integerDaysDuration(),
            this.validators.min(0, true, model.attributeInfoCourseBookingDeadlineFrom.primitiveType),
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: (control) => {
                    // TODO: PLANO-151864 nils: this probably needs to be changed to draft mode value
                    if (!model.courseBookingDeadlineFrom || model.attributeInfoCourseBookingDeadlineFrom.value === null)
                        return null;
                    if (!model.courseBookingDeadlineUntil || model.attributeInfoCourseBookingDeadlineUntil.value === null)
                        return null;
                    return this.validators.min(model.courseBookingDeadlineUntil, true, model.attributeInfoCourseBookingDeadlineFrom.primitiveType).fn(control);
                } }),
        ], (value) => {
            // eslint-disable-next-line unicorn/prefer-number-properties
            if (isNaN(value))
                return;
            model.courseBookingDeadlineFrom = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'courseBookingDeadlineUntil', {
            value: model.courseBookingDeadlineUntil,
            disabled: this.formIsDisabled(model, userCanWrite),
        }, [
            this.validators.integerDaysDuration(),
            this.validators.min(0, true, model.attributeInfoCourseBookingDeadlineUntil.primitiveType),
            new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: (control) => {
                    // TODO: PLANO-151864 nils: this probably needs to be changed to draft mode value
                    if (!model.courseBookingDeadlineFrom || model.attributeInfoCourseBookingDeadlineFrom.value === null)
                        return null;
                    if (!model.courseBookingDeadlineUntil || model.attributeInfoCourseBookingDeadlineUntil.value === null)
                        return null;
                    return this.validators.max(model.courseBookingDeadlineFrom, true, model.attributeInfoCourseBookingDeadlineUntil.primitiveType).fn(control);
                } }),
        ], (value) => {
            // eslint-disable-next-line unicorn/prefer-number-properties
            if (isNaN(value))
                return;
            model.courseBookingDeadlineUntil = value;
        });
        this.initFormGroupForTariffsAndPaymentMethods(tempFormGroup, model, userCanWrite, formItem);
    }
    initFormGroupForTariffsAndPaymentMethods(tempFormGroup, model, userCanWrite, formItem) {
        tempFormGroup.addControl('courseTariffs', this.fb.array([]));
        if (!this.modeIsEditShiftModel && !this.modeIsCreateShiftModel)
            return;
        tempFormGroup.addControl('coursePaymentMethods', new UntypedFormArray([], [
            (_control) => {
                var _a;
                const shouldBeFree = (_a = tempFormGroup.get('isFreeCourse')) === null || _a === void 0 ? void 0 : _a.value;
                if (shouldBeFree)
                    return null;
                if (this.pShiftmodelTariffService.hasVisiblePaymentMethod(model.coursePaymentMethods))
                    return null;
                return { minpaymentmethods: {} };
            },
        ]));
        for (const coursePaymentMethod of model.coursePaymentMethods.iterable()) {
            if (coursePaymentMethod.trashed)
                continue;
            this.addCoursePaymentMethod(tempFormGroup, userCanWrite, model, coursePaymentMethod);
        }
        this.pFormsService.addControl(tempFormGroup, 'isFreeCourse', {
            value: this.calculateIsFreeCourse(formItem),
            disabled: false,
        }, [], _value => {
            tempFormGroup.get('coursePaymentMethods').updateValueAndValidity();
            tempFormGroup.get('courseTariffs').updateValueAndValidity();
        });
        tempFormGroup.get('courseTariffs').setValidators([
            () => {
                var _a;
                const shouldBeFree = (_a = tempFormGroup.get('isFreeCourse')) === null || _a === void 0 ? void 0 : _a.value;
                if (shouldBeFree) {
                    if (!this.pShiftmodelTariffService.hasVisibleCourseTariffWithCosts(model.courseTariffs))
                        return null;
                    return { maxtariffampunt: {} };
                }
                if (this.pShiftmodelTariffService.hasVisibleCourseTariffWithCosts(model.courseTariffs))
                    return null;
                return { mintariffampunt: {} };
            },
        ]);
        for (const tariff of model.courseTariffs.iterableSortedBy(item => item.name)) {
            if (tariff.trashed)
                continue;
            this.addTariff({
                formGroup: tempFormGroup,
                userCanWrite: userCanWrite,
                shiftModel: model,
                item: tariff,
            });
        }
    }
    calculateIsFreeCourse(model) {
        return this.pShiftmodelTariffService.isFreeCourse(model.courseTariffs, model.coursePaymentMethods);
    }
    refreshIsInterval(formGroup) {
        if (!formGroup.get('isInterval'))
            return;
        if (formGroup.get('repetition_type').value === undefined &&
            formGroup.get('isInterval').value !== false) {
            formGroup.get('isInterval').setValue(false);
            return;
        }
        const newValue = formGroup.get('repetition_type').value !== SchedulingApiShiftRepetitionType.NONE;
        if (formGroup.get('isInterval').value === newValue)
            return;
        formGroup.get('isInterval').setValue(newValue);
    }
    /**
     * Set all weekdays to false
     */
    clearWeekdays(formGroup) {
        formGroup.get('isRepeatingOnMonday').setValue(false);
        formGroup.get('isRepeatingOnTuesday').setValue(false);
        formGroup.get('isRepeatingOnWednesday').setValue(false);
        formGroup.get('isRepeatingOnThursday').setValue(false);
        formGroup.get('isRepeatingOnFriday').setValue(false);
        formGroup.get('isRepeatingOnSaturday').setValue(false);
        formGroup.get('isRepeatingOnSunday').setValue(false);
    }
    /**
     * Check if prefix is already used by another shiftModel
     */
    prefixIsAlreadyOccupied(input, formItem, shiftModels) {
        for (const shiftModel of shiftModels.iterable()) {
            if (shiftModel.courseCodePrefix !== input.toUpperCase())
                continue;
            if (shiftModel.isNewItem())
                continue;
            if (shiftModel.id.equals(formItem.id))
                continue;
            return true;
        }
        return false;
    }
    /**
     * Generate default value for course prefix
     */
    getDefaultPrefix(formItem, shiftModels) {
        let suggestion;
        suggestion = formItem.name ? `${formItem.name.slice(0, 1).toUpperCase()}K` : 'AA';
        const GET_RANDOM_LETTERS = (length) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let letters = '';
            for (let i = 0; i < length; i++) {
                letters += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return letters;
        };
        while (this.prefixIsAlreadyOccupied(suggestion, formItem, shiftModels)) {
            suggestion = `${suggestion}${GET_RANDOM_LETTERS(1)}`;
        }
        let result = suggestion;
        let index = 1;
        while (this.prefixIsAlreadyOccupied(result, formItem, shiftModels) && index < 10) {
            // e.g. SH[1…9]
            result = suggestion.slice(0, 2) + index.toString();
            ++index;
        }
        if (this.prefixIsAlreadyOccupied(result, formItem, shiftModels)) {
            // e.g. S
            while (this.prefixIsAlreadyOccupied(result, formItem, shiftModels) && index < 100) {
                // e.g. SH[10…99]
                result = suggestion.slice(0, 1) + index.toString();
                ++index;
            }
        }
        return result;
    }
    /**
     * Check if start and end is valid
     */
    startAndEndIsValid(formGroup) {
        if (formGroup.get('startTime').invalid)
            return false;
        if (formGroup.get('endTime').invalid)
            return false;
        return true;
    }
    /**
     * @see PShiftmodelTariffService['addTariff']
     */
    addTariff(input) {
        var _a, _b;
        this.pShiftmodelTariffService.addTariff({
            formGroup: input.formGroup,
            userCanWrite: input.userCanWrite,
            shiftModel: input.shiftModel,
            item: (_a = input.item) !== null && _a !== void 0 ? _a : null,
            indexToInsert: (_b = input.indexToInsert) !== null && _b !== void 0 ? _b : null,
            modeIsEditShiftModel: !!this.modeIsEditShiftModel,
        });
    }
    /**
     * Add coursePaymentMethod to Form
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    addCoursePaymentMethod(formGroup, userCanWrite, shiftModel, coursePaymentMethod) {
        const newCoursePaymentMethod = coursePaymentMethod !== null && coursePaymentMethod !== void 0 ? coursePaymentMethod : shiftModel.coursePaymentMethods.createNewItem();
        if (newCoursePaymentMethod.attributeInfoType.value === null)
            newCoursePaymentMethod.attributeInfoType.value = this.paymentMethodTypes.MISC;
        const newCoursePaymentMethodFormGroup = this.pFormsService.group({});
        this.pFormsService.addControl(newCoursePaymentMethodFormGroup, 'reference', {
            value: newCoursePaymentMethod,
            disabled: (this.modeIsEditShiftModel && shiftModel.trashed) || !userCanWrite,
        });
        this.pFormsService.addControl(newCoursePaymentMethodFormGroup, 'isInternal', {
            value: newCoursePaymentMethod.isInternal,
            disabled: (this.modeIsEditShiftModel && shiftModel.trashed) || !userCanWrite,
        }, [], (value) => {
            if (newCoursePaymentMethod.isInternal === value)
                return;
            this.setChangeSelectors(newCoursePaymentMethod);
            newCoursePaymentMethod.isInternal = value;
        });
        const typeAI = newCoursePaymentMethod.attributeInfoType;
        this.pFormsService.addControl(newCoursePaymentMethodFormGroup, typeAI.id, {
            value: typeAI.value,
            disabled: (this.modeIsEditShiftModel && shiftModel.trashed) || !userCanWrite || !typeAI.canEdit,
        }, [
            this.validators.required(newCoursePaymentMethod.attributeInfoType.primitiveType),
            ...typeAI.validations.map(item => item()).filter((item) => item instanceof PValidatorObject),
        ], (value) => {
            if (newCoursePaymentMethod.type === value)
                return;
            this.setChangeSelectors(newCoursePaymentMethod);
            newCoursePaymentMethod.type = value;
            if (newCoursePaymentMethodFormGroup.get('name')) {
                if (value === SchedulingApiPaymentMethodType.PAYPAL) {
                    newCoursePaymentMethodFormGroup.get('name').setValue('PayPal');
                }
                else if (value === SchedulingApiPaymentMethodType.ONLINE_PAYMENT) {
                    newCoursePaymentMethodFormGroup.get('name').setValue('Online-Zahlung');
                }
            }
            this.refreshDescription(newCoursePaymentMethodFormGroup.get('description'), value);
        });
        this.pFormsService.addControl(newCoursePaymentMethodFormGroup, 'description', {
            value: newCoursePaymentMethod.description,
            disabled: (this.modeIsEditShiftModel && shiftModel.trashed) || !userCanWrite,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    const typeControl = newCoursePaymentMethodFormGroup.get(typeAI.id);
                    if (typeControl === null)
                        throw new Error('typeControl could not be found [PLANO-FE-3NJ]');
                    if (typeControl.value !== this.paymentMethodTypes.PAYPAL &&
                        typeControl.value !== this.paymentMethodTypes.ONLINE_PAYMENT) {
                        return this.validators.required(newCoursePaymentMethod.attributeInfoDescription.primitiveType).fn(control);
                    }
                    return null;
                } }),
        ], (value) => {
            if (newCoursePaymentMethod.description === value)
                return;
            this.setChangeSelectors(newCoursePaymentMethod);
            newCoursePaymentMethod.description = value;
        });
        this.pFormsService.addControl(newCoursePaymentMethodFormGroup, 'name', {
            value: newCoursePaymentMethod.name,
            disabled: (this.modeIsEditShiftModel && shiftModel.trashed) || !userCanWrite,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    const typeControl = newCoursePaymentMethodFormGroup.get(typeAI.id);
                    if (typeControl === null)
                        throw new Error('typeControl could not be found');
                    if (typeControl.value !== this.paymentMethodTypes.PAYPAL &&
                        typeControl.value !== this.paymentMethodTypes.ONLINE_PAYMENT) {
                        return this.validators.required(newCoursePaymentMethod.attributeInfoName.primitiveType).fn(control);
                    }
                    return null;
                } }),
            // FIXME: PLANO-5865
            // (control) => {
            // 	if (!(control && control.value)) { return null; }
            // 	let array = <FormArray>formGroup.get('coursePaymentMethods');
            // 	let names : Array<string> = [];
            // 	for (let controlItem of array.controls) {
            // 		let formGroupItem = <PFormGroup>controlItem;
            // 		if (formGroupItem !== newCoursePaymentMethodFormGroup) {
            // 			names.push(formGroupItem.get('name').value);
            // 		}
            // 	}
            // 	if (names.indexOf(control.value) > -1) {
            // 		return {occupied : true};
            // 	}
            // 	return null;
            // }
        ], (value) => {
            if (newCoursePaymentMethod.name === value)
                return;
            this.setChangeSelectors(newCoursePaymentMethod);
            newCoursePaymentMethod.name = value;
        });
        this.pFormsService.addControl(newCoursePaymentMethodFormGroup, 'trashed', {
            value: newCoursePaymentMethod.trashed,
            disabled: (this.modeIsEditShiftModel && shiftModel.trashed) || !userCanWrite,
        }, [], (value) => {
            if (newCoursePaymentMethod.trashed === value)
                return;
            this.setChangeSelectors(newCoursePaymentMethod);
            newCoursePaymentMethod.trashed = value;
        });
        // eslint-disable-next-line @typescript-eslint/ban-types
        const formArray = formGroup.get('coursePaymentMethods');
        formArray.push(newCoursePaymentMethodFormGroup);
        formArray.updateValueAndValidity();
    }
    refreshDescription(control, value) {
        if (value === SchedulingApiPaymentMethodType.PAYPAL || value === SchedulingApiPaymentMethodType.ONLINE_PAYMENT) {
            control.setValue(undefined);
        }
        control.updateValueAndValidity();
    }
    /**
     * applyToBooking MUST ALWAYS be set when user changes any values.
     * applyToParticipant MUST ALWAYS be set when user changes any values on a courseTariff.
     */
    setChangeSelectors(input) {
        input.applyToBooking = null;
        if (input instanceof SchedulingApiShiftModelCourseTariff) {
            input.applyToParticipant = null;
        }
    }
    /**
     * Update related controls values
     */
    initRepetitionTypeMonth(formGroup) {
        if (formGroup.get('repetition_type').value !== SchedulingApiShiftRepetitionType.EVERY_X_MONTHS) {
            formGroup.get('repetition_type').setValue(SchedulingApiShiftRepetitionType.EVERY_X_MONTHS);
        }
        formGroup.get('repetition_x').setValue(1);
        formGroup.updateValueAndValidity();
    }
    /**
     * Update related controls values
     */
    clearRepetitionType(formGroup) {
        formGroup.get('repetition_type').setValue(SchedulingApiShiftRepetitionType.NONE);
        formGroup.get('repetition_type').updateValueAndValidity();
    }
    /**
     * Update related controls values
     */
    initRepetitionTypeWeek(formGroup) {
        if (formGroup.get('repetition_type').value !== SchedulingApiShiftRepetitionType.EVERY_X_WEEKS) {
            formGroup.get('repetition_type').setValue(SchedulingApiShiftRepetitionType.EVERY_X_WEEKS);
        }
        formGroup.get('repetition_x').setValue(1);
        formGroup.updateValueAndValidity();
    }
};
PShiftAndShiftmodelFormService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof UntypedFormBuilder !== "undefined" && UntypedFormBuilder) === "function" ? _a : Object, PFormsService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, NgbFormatsService,
        ValidatorsService,
        AsyncValidatorsService,
        PShiftmodelTariffService,
        PMomentService,
        LocalizePipe,
        ModalService,
        LogService])
], PShiftAndShiftmodelFormService);
export { PShiftAndShiftmodelFormService };
//# sourceMappingURL=p-shift-and-shiftmodel-form.service.js.map