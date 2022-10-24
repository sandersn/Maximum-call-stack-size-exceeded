var _a;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { PApiPrimitiveTypes } from '../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
let PShiftmodelTariffService = class PShiftmodelTariffService {
    constructor(fb, pFormsService, validators) {
        this.fb = fb;
        this.pFormsService = pFormsService;
        this.validators = validators;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    setChangeSelectors(tariff, booking = null, participant = null) {
        const getId = (item, oldId) => {
            const result = item ? item.id : null;
            if (result !== null && oldId) {
                throw new Error('A single tariff cannot be applied to multiple bookings/participants.');
            }
            return result;
        };
        tariff.applyToBooking = getId(booking, tariff.applyToBooking);
        tariff.applyToParticipant = getId(participant, tariff.applyToParticipant);
    }
    initTariffValues(item, formGroup) {
        item.isInternal = false;
        formGroup.get('isFreeCourse').setValue(false);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    tariffRadioIsDisabled(courseTariff, selectedTariff) {
        if (courseTariff.trashed && !courseTariff.id.equals(selectedTariff))
            return true;
        return false;
    }
    validateValues(formGroup) {
        if (formGroup.get('courseTariffs') === null) {
            throw new Error('[\'courseTariffs\'] must be defined for addTariff()');
        }
        if (formGroup.get('isFreeCourse') === null) {
            throw new Error('[\'isFreeCourse\'] must be defined for addTariff()');
        }
    }
    /**
     * Add Tariff to Form
     * If no tariff is provided a new one will be created
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity, max-lines-per-function
    addTariff(input) {
        var _a;
        const shiftModel = input.shiftModel;
        const modeIsEditShiftModel = input.modeIsEditShiftModel;
        const item = input.item;
        const formArray = input.formGroup.get('courseTariffs');
        const indexToInsert = input.indexToInsert !== undefined ? input.indexToInsert : formArray.length;
        const booking = (_a = input.booking) !== null && _a !== void 0 ? _a : null;
        const participant = input.participant;
        this.validateValues(input.formGroup);
        const newItem = item !== null && item !== void 0 ? item : (() => {
            const result = shiftModel.courseTariffs.createNewItem();
            // Set default values
            result.negateForCourseDatesInterval = false;
            return result;
        })();
        this.initTariffValues(newItem, input.formGroup);
        const newFormGroup = this.pFormsService.group({ fees: this.fb.array([]) });
        const id = participant ? participant.tariffId : (booking ? booking.overallTariffId : null);
        const referenceIsDisabled = this.tariffRadioIsDisabled(newItem, id);
        const FORM_GROUP_IS_DISABLED = (modeIsEditShiftModel && shiftModel.trashed) || !input.userCanWrite;
        this.pFormsService.addControl(newFormGroup, 'reference', {
            value: newItem,
            disabled: referenceIsDisabled && FORM_GROUP_IS_DISABLED,
        });
        this.pFormsService.addControl(newFormGroup, 'isInternal', {
            value: newItem.isInternal,
            disabled: FORM_GROUP_IS_DISABLED,
        }, [], (value) => {
            if (newItem.isInternal === value)
                return;
            this.setChangeSelectors(newItem, booking, participant);
            newItem.isInternal = value;
        });
        this.pFormsService.addControl(newFormGroup, 'forCourseDatesFrom', {
            value: newItem.forCourseDatesFrom,
            disabled: FORM_GROUP_IS_DISABLED,
        }, [], (value) => {
            if (newItem.forCourseDatesFrom === value)
                return;
            this.setChangeSelectors(newItem, booking, participant);
            newItem.forCourseDatesFrom = value;
        });
        this.pFormsService.addControl(newFormGroup, 'forCourseDatesUntil', {
            value: newItem.forCourseDatesUntil,
            disabled: FORM_GROUP_IS_DISABLED,
        }, [], (value) => {
            if (newItem.forCourseDatesUntil === value)
                return;
            this.setChangeSelectors(newItem, booking, participant);
            newItem.forCourseDatesUntil = value;
        });
        this.pFormsService.addControl(newFormGroup, 'negateForCourseDatesInterval', {
            value: newItem.negateForCourseDatesInterval,
            disabled: FORM_GROUP_IS_DISABLED,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => this.validators.required(PApiPrimitiveTypes.boolean).fn(control) }),
        ], (value) => {
            if (newItem.negateForCourseDatesInterval === value)
                return;
            this.setChangeSelectors(newItem, booking, participant);
            newItem.negateForCourseDatesInterval = value;
        });
        this.pFormsService.addControl(newFormGroup, 'id', {
            value: newItem.id,
            disabled: FORM_GROUP_IS_DISABLED,
        });
        this.pFormsService.addControl(newFormGroup, 'name', {
            value: newItem.name,
            disabled: FORM_GROUP_IS_DISABLED,
        }, [this.validators.required(newItem.attributeInfoName.primitiveType)], (value) => {
            if (newItem.name === value)
                return;
            this.setChangeSelectors(newItem, booking, participant);
            newItem.name = value;
        });
        this.pFormsService.addControl(newFormGroup, 'description', {
            value: newItem.description,
            disabled: FORM_GROUP_IS_DISABLED,
        }, [], (value) => {
            if (newItem.description === value)
                return;
            this.setChangeSelectors(newItem, booking, participant);
            newItem.description = value;
        });
        this.pFormsService.addControl(newFormGroup, 'trashed', {
            value: newItem.trashed,
            disabled: FORM_GROUP_IS_DISABLED,
        });
        // eslint-disable-next-line @typescript-eslint/ban-types
        const fees = newFormGroup.get('fees');
        fees.setValidators(() => {
            const result = fees.controls.length < 1;
            return result ? { minFees: {} } : null;
        });
        for (const fee of newItem.fees.iterable()) {
            this.addTariffFee({
                tariffFormGroup: newFormGroup,
                userCanWrite: input.userCanWrite,
                tariff: newItem,
                modeIsEditShiftModel: modeIsEditShiftModel,
                shiftModel: shiftModel,
                fee: fee,
                booking: booking,
                participant: participant !== null && participant !== void 0 ? participant : null,
            });
        }
        if (!newItem.fees.length && !shiftModel.onlyWholeCourseBookable) {
            this.addTariffFee({
                tariffFormGroup: newFormGroup,
                userCanWrite: input.userCanWrite,
                modeIsEditShiftModel: modeIsEditShiftModel,
                shiftModel: shiftModel,
                tariff: newItem,
                booking: booking,
                participant: participant !== null && participant !== void 0 ? participant : null,
            });
        }
        const fancyFee = this.getFancyFeeFormGroup(fees);
        this.pFormsService.addControl(newFormGroup, 'hasPerPersonFee', {
            value: !!fancyFee,
            disabled: FORM_GROUP_IS_DISABLED,
        }, [], (value) => {
            this.setChangeSelectors(newItem, booking, participant);
            if (!value) {
                const fancyFormGroup = this.getFancyFeeFormGroup(fees);
                if (!fancyFormGroup)
                    throw new Error('fancyFormGroup is undefined');
                this.removeTariffFee(
                // eslint-disable-next-line @typescript-eslint/ban-types
                newFormGroup.get('fees'), newFormGroup.get('reference').value, fancyFormGroup.get('reference').value, booking, participant !== null && participant !== void 0 ? participant : null);
            }
            else {
                this.addTariffFee({
                    tariffFormGroup: newFormGroup,
                    userCanWrite: input.userCanWrite,
                    modeIsEditShiftModel: modeIsEditShiftModel,
                    shiftModel: shiftModel,
                    tariff: newItem,
                    booking: booking,
                    participant: participant !== null && participant !== void 0 ? participant : null,
                });
            }
        });
        this.pFormsService.addControl(newFormGroup, 'additionalFieldLabel', {
            value: newItem.additionalFieldLabel,
            disabled: !newItem.additionalFieldLabel,
        }, [
            this.validators.maxLength(30, newItem.attributeInfoAdditionalFieldLabel.primitiveType),
        ], (value) => {
            this.setChangeSelectors(newItem, booking, participant);
            // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
            newItem.additionalFieldLabel = value ? value : '';
        });
        formArray.insert(indexToInsert, newFormGroup);
    }
    /**
     * Add a Tariff to the Form
     */
    addTariffFee(input) {
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        const newFee = input.fee ? input.fee : input.tariff.fees.createNewItem();
        const FORM_GROUP_IS_DISABLED = (input.modeIsEditShiftModel && input.shiftModel.trashed) || !input.userCanWrite;
        // eslint-disable-next-line @typescript-eslint/ban-types
        const formArray = input.tariffFormGroup.get('fees');
        const newFeeFormGroup = this.pFormsService.group({
            id: [newFee.id],
            reference: [newFee],
        });
        if (newFee.isNewItem()) {
            this.setChangeSelectors(input.tariff, input.booking, input.participant);
        }
        this.initTariffFeeValues(newFee);
        this.pFormsService.addPControl(newFeeFormGroup, 'name', {
            formState: {
                value: newFee.name,
                disabled: FORM_GROUP_IS_DISABLED,
            },
            subscribe: (value) => {
                if (newFee.name === value)
                    return;
                this.setChangeSelectors(input.tariff, input.booking, input.participant);
                newFee.name = value;
            },
        });
        this.pFormsService.addPControl(newFeeFormGroup, 'perXParticipants', {
            formState: {
                value: newFee.perXParticipants,
                disabled: FORM_GROUP_IS_DISABLED
            },
            validatorOrOpts: [
                this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
                this.validators.min(1, true, newFee.attributeInfoPerXParticipants.primitiveType),
                this.validators.required(newFee.attributeInfoPerXParticipants.primitiveType),
            ],
            subscribe: (value) => {
                if (newFee.perXParticipants === value)
                    return;
                this.setChangeSelectors(input.tariff, input.booking, input.participant);
                newFee.perXParticipants = value;
            },
        });
        this.pFormsService.addPControl(newFeeFormGroup, 'taxPercentage', {
            formState: {
                value: newFee.taxPercentage,
                disabled: FORM_GROUP_IS_DISABLED,
            },
            validatorOrOpts: [
                this.validators.number(PApiPrimitiveTypes.number),
            ],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            subscribe: (value) => {
                if (newFee.taxPercentage === +value)
                    return;
                this.setChangeSelectors(input.tariff, input.booking, input.participant);
                newFee.taxPercentage = +value;
            },
        });
        this.pFormsService.addPControl(newFeeFormGroup, 'fee', {
            formState: {
                value: newFee.fee,
                disabled: FORM_GROUP_IS_DISABLED,
            },
            validatorOrOpts: [
                this.validators.required(newFee.attributeInfoFee.primitiveType),
                this.validators.min(0, true, newFee.attributeInfoFee.primitiveType),
            ],
            subscribe: (value) => {
                if (newFee.fee === value)
                    return;
                this.setChangeSelectors(input.tariff, input.booking, input.participant);
                newFee.fee = value;
                input.tariffFormGroup.get('fees').updateValueAndValidity();
            },
        });
        formArray.push(newFeeFormGroup);
        // This must be set after the ['name'] and ['perXParticipants'] is filled
        newFeeFormGroup.get('name').setValidators([
            (control) => 
            // FIXME: PLANO-15096
            this.nameValidator(control, input.shiftModel.onlyWholeCourseBookable, formArray, input.tariff, input.booking, input.tariffFormGroup, newFee),
        ]);
        formArray.updateValueAndValidity();
        return newFeeFormGroup;
    }
    nameValidator(control, onlyWholeCourseBookable, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    formArray, tariff, booking = null, tariffFormGroup, newFee) {
        // This tariff can not have fees other then per person fee
        if (!onlyWholeCourseBookable)
            return null;
        const fancyFee = this.getFancyFeeFormGroup(formArray);
        if (!tariff.isNewItem() && !booking) {
            if (!fancyFee)
                return this.validators.required(PApiPrimitiveTypes.string).fn(control);
            if (fancyFee.get('reference').value !== newFee)
                return this.validators.required(PApiPrimitiveTypes.string).fn(control);
            return null;
        }
        const hasPerPersonFeeControl = tariffFormGroup.get('hasPerPersonFee');
        if (!hasPerPersonFeeControl)
            return null;
        if (hasPerPersonFeeControl.value === false)
            return this.validators.required(PApiPrimitiveTypes.string).fn(control);
        if (!fancyFee)
            throw new Error('fancyFee is not defined');
        if (fancyFee.get('reference').value !== newFee)
            return this.validators.required(PApiPrimitiveTypes.string).fn(control);
        return null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    removeTariffFee(
    // eslint-disable-next-line @typescript-eslint/ban-types
    feesFormArray, tariff, fee, booking, participant) {
        if (!fee.isNewItem()) {
            this.setChangeSelectors(tariff, booking, participant);
        }
        tariff.fees.removeItem(fee);
        const formGroupOfFee = feesFormArray.controls.find((control) => {
            if (!(control instanceof UntypedFormGroup))
                throw new Error(`Unexpected control type ${typeof control}`);
            return control.get('reference').value === fee;
        });
        assumeDefinedToGetStrictNullChecksRunning(formGroupOfFee, 'formGroupOfFee');
        const indexOfFormGroupToRemove = feesFormArray.controls.indexOf(formGroupOfFee);
        if (indexOfFormGroupToRemove > -1)
            feesFormArray.removeAt(indexOfFormGroupToRemove);
        feesFormArray.updateValueAndValidity();
    }
    getDefaultTax(fee) {
        var _a;
        if (!((_a = fee.api) === null || _a === void 0 ? void 0 : _a.isLoaded()))
            return 0;
        const POSSIBLE_TAXES = fee.api.data.possibleTaxes;
        if (!POSSIBLE_TAXES.length)
            throw new Error('No possible taxes but api is loaded.');
        const firstTax = POSSIBLE_TAXES.get(0);
        if (firstTax === null)
            throw new Error('Could not get first tax.');
        return firstTax;
    }
    /**
     * Set default values for fee if necessary
     */
    initTariffFeeValues(fee) {
        if (fee.attributeInfoTaxPercentage.value === null)
            fee.taxPercentage = this.getDefaultTax(fee);
        if (fee.attributeInfoPerXParticipants.value === null)
            fee.perXParticipants = 1;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    removeTariff(formGroup, i, tariff, shiftModel) {
        if (!tariff.isNewItem()) {
            this.setChangeSelectors(tariff);
        }
        if (tariff.isNewItem()) {
            shiftModel.courseTariffs.removeItem(tariff);
        }
        else {
            tariff.trashed = true;
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        const formArray = formGroup.get('courseTariffs');
        formArray.removeAt(i);
        formArray.updateValueAndValidity();
    }
    /**
     * Get reference for fancyFee
     */
    getFancyFeeFormGroup(formArray) {
        for (const item of formArray.controls) {
            if (item.get('name').value)
                continue;
            if (item.get('perXParticipants').value !== 1)
                continue;
            return item;
        }
        return undefined;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    hasCourseDatesData(negateForCourseDatesInterval, forCourseDatesFrom, forCourseDatesUntil) {
        if (negateForCourseDatesInterval === undefined)
            return false;
        if (negateForCourseDatesInterval === true)
            return true;
        if (forCourseDatesFrom)
            return true;
        if (forCourseDatesUntil)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    tariffIsAvailableAtDate(
    // TODO: Get rid of undefined here
    tariff, relevantDate) {
        // This code is more or less copy paste from:
        // https://drplano.atlassian.net/browse/PLANO-34855
        if (!tariff)
            return undefined;
        if (!relevantDate)
            return undefined;
        const from = tariff.forCourseDatesFrom;
        const until = tariff.forCourseDatesUntil;
        const negate = tariff.negateForCourseDatesInterval;
        const isInInterval = (!from || relevantDate >= from) && (!until || relevantDate < until);
        if (isInInterval === !negate)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isFreeCourse(courseTariffs, coursePaymentMethods) {
        return (!this.hasVisibleCourseTariffWithCosts(courseTariffs) ||
            // TODO: This should not be necessary.
            //       I think it is not possible to have a course with
            //       (tariff with costs) && (no paymentMethods)
            !this.hasVisiblePaymentMethod(coursePaymentMethods));
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    hasVisiblePaymentMethod(coursePaymentMethods) {
        const ACTIVE_PAYMENT_METHOD = coursePaymentMethods.findBy(coursePaymentMethod => {
            if (coursePaymentMethod.trashed)
                return false;
            if (coursePaymentMethod.isInternal)
                return false;
            return true;
        });
        return !!ACTIVE_PAYMENT_METHOD;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    hasVisibleCourseTariffWithCosts(courseTariffs) {
        const ACTIVE_TARIFF = courseTariffs.findBy(tariff => {
            if (tariff.trashed)
                return false;
            if (tariff.isInternal)
                return false;
            return !!tariff.fees.findBy(fee => fee.fee > 0);
        });
        return !!ACTIVE_TARIFF;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    hasInBookingPluginVisibleTariff(courseTariffs) {
        const IN_BOOKING_PLUGIN_VISIBLE_TARIFF = courseTariffs.findBy(tariff => {
            if (tariff.trashed)
                return false;
            if (tariff.isInternal)
                return false;
            return true;
        });
        return !!IN_BOOKING_PLUGIN_VISIBLE_TARIFF;
    }
};
PShiftmodelTariffService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof UntypedFormBuilder !== "undefined" && UntypedFormBuilder) === "function" ? _a : Object, PFormsService,
        ValidatorsService])
], PShiftmodelTariffService);
export { PShiftmodelTariffService };
//# sourceMappingURL=p-shiftmodel-tariff.service.js.map