import * as $ from 'jquery';
import { SchedulingApiBookingState, SchedulingApiCourseType } from '@plano/shared/api';
import { CallByRef } from '@plano/shared/core/call-by-ref';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PSupportedLocaleIds } from './generated-types.ag';
import { PMomentService } from '../../../client/shared/p-moment.service';
import { notNull } from '../../core/null-type-utils';
export class ApiTestingUtils {
    constructor() {
        this.pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
        this.testingUtils = new TestingUtils();
    }
    /**
     * Do tests for default list operations (get/edit/add/remove).
     * @param getApi The api is normally initialized delayed. Thus, we have a method which returns the current api.
     * @param getList Currently a list wrapper object becomes invalid when new data is loaded.
     * 		Thus, we need to have a method which always returns the actual wrapper object.
     * @param changeItem A method which changes the detailed view of an item.
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    doDefaultListTests({ getApi, getList, changeItem, searchParams, createNewItem = null, afterItemCreated = null, afterTestCreateNewItem = null, afterItemRemoved = null, beforeRawDataCompare = null, removeMethod = 'remove', }) {
        /**
         * At the moment all tests work on the same backend data. Thus, we need to ensure that tests do no long term changes
         * to data so the tests remain independent. To ensure this, we first create a new list element, then edit it and
         * then finally remove the new element.
         */
        const newItem = new CallByRef();
        it('should create new item', async () => {
            // load api with given searchParams to ensure correct data "context"
            await getApi().load({ searchParams: searchParams });
            const testCreateNewItem = async () => {
                // HACK: That strange type casts and stuff in the next line is a result of a TS bug. See: https://github.com/microsoft/TypeScript/issues/50066
                const value = notNull(newItem.val);
                changeItem(value);
                await value.api.save();
                // new item available?
                expect(getList().contains(value)).toBeTruthy();
                if (afterItemCreated)
                    await afterItemCreated(value);
            };
            // custom (async) createNewItem method?
            if (createNewItem) {
                newItem.val = await createNewItem();
                await testCreateNewItem();
            }
            else {
                // Use default createNewItem() method
                newItem.val = getList().createNewItem();
                await testCreateNewItem();
            }
        });
        if (afterTestCreateNewItem)
            afterTestCreateNewItem(newItem);
        it('should load/save detailed', (done) => {
            // HACK: That strange type casts and stuff in the next line is a result of a TS bug. See: https://github.com/microsoft/TypeScript/issues/50066
            notNull(newItem.val).loadDetailed({
                searchParams: searchParams,
                success: () => {
                    // change item
                    // HACK: That strange type casts and stuff in the next line is a result of a TS bug. See: https://github.com/microsoft/TypeScript/issues/50066
                    const value = notNull(newItem.val);
                    changeItem(value);
                    const rawDataBeforeSave = $.extend(true, [], value.rawData);
                    value.saveDetailed({
                        success: () => {
                            // data saved correctly?
                            newItem.val.loadDetailed({
                                searchParams: searchParams,
                                success: () => {
                                    if (beforeRawDataCompare)
                                        beforeRawDataCompare(newItem.val, rawDataBeforeSave);
                                    expect(newItem.val.rawData).toEqual(rawDataBeforeSave);
                                    done();
                                },
                            });
                        },
                    });
                },
                error: (response) => {
                    const testingUtils = new TestingUtils();
                    testingUtils.logApiError(response);
                    done();
                },
            });
        });
        it('should remove item', (done) => {
            // remove item
            if (removeMethod === 'none') {
                expect().nothing();
                done();
                return;
            }
            else if (removeMethod === 'trash') {
                newItem.val.trashed = true;
            }
            else if (removeMethod === 'remove') {
                getList().removeItem(newItem.val);
            }
            else if (typeof removeMethod === 'function') {
                removeMethod(newItem.val);
            }
            else {
                throw new TypeError('unsupported');
            }
            getApi().save({
                success: () => {
                    // do tests
                    if (removeMethod === 'trash')
                        expect(newItem.val.trashed).toBeTruthy();
                    else
                        expect(getList().contains(newItem.val)).toBeFalsy();
                    // callback
                    if (afterItemRemoved)
                        afterItemRemoved(newItem.val.id);
                    done();
                },
                error: fail,
            });
        });
    }
    /**
     * @returns Returns a copy of the raw data of `object`.
     */
    copyRawData(object) {
        return $.extend(true, [], object.rawData);
    }
    /**
     * Are the raw-data of `object` equal `rawData` when ignoring all ids?
     * If not this method will fail the current running test.
     */
    expectRawDataEqualsIgnoringIds(object, rawData) {
        // make copy of the raw data
        rawData = $.extend(true, [], rawData);
        const currRawData = this.copyRawData(object);
        // remove all meta data (including ids)
        const removeMetaData = (data) => {
            if (Array.isArray(data)) {
                data[0] = null;
                // continue recursively
                for (let i = 1; i < data.length; ++i)
                    removeMetaData(data[i]);
            }
        };
        removeMetaData(currRawData);
        removeMetaData(rawData);
        // compare
        expect(currRawData).toEqual(rawData);
    }
    /**
     * Initializes `booking` with initial data.
     */
    initNewBooking(booking, courseType, shiftModel, shiftId, paymentMethod, tariff, onlyWholeCourseBookable, bookingPersonCanGiveDesiredDate) {
        booking.state = (courseType === SchedulingApiCourseType.ONLINE_INQUIRY) ? SchedulingApiBookingState.INQUIRY :
            SchedulingApiBookingState.BOOKED;
        booking.shiftModelId = shiftModel.id;
        booking.ownerComment = this.testingUtils.getRandomString(10);
        booking.firstName = this.testingUtils.getRandomString(10);
        booking.lastName = this.testingUtils.getRandomString(10);
        booking.dateOfBirth = +this.pMoment.m().subtract(1, 'year');
        booking.streetAndHouseNumber = this.testingUtils.getRandomString(10);
        booking.city = this.testingUtils.getRandomString(10);
        booking.postalCode = String(this.testingUtils.getRandomNumber(11111, 99999, 0));
        booking.email = this.testingUtils.getRandomEmail();
        booking.phoneMobile = this.testingUtils.getRandomString(10);
        booking.phoneLandline = this.testingUtils.getRandomString(10);
        booking.paymentMethodId = paymentMethod.id;
        booking.bookingComment = this.testingUtils.getRandomString(10);
        booking.company = this.testingUtils.getRandomString(10);
        booking.wantsNewsletter = this.testingUtils.getRandomBoolean();
        booking.cancellationFee = 0;
        if (onlyWholeCourseBookable) {
            booking.ageMin = 10;
            booking.ageMax = 20;
        }
        // participants / overallTariff
        if (onlyWholeCourseBookable) {
            booking.overallTariffId = tariff.id;
            booking.participantCount = 2;
            if (tariff.additionalFieldLabel)
                booking.additionalFieldValue = this.testingUtils.getRandomString(10);
        }
        else {
            const participant = booking.participants.createNewItem();
            participant.firstName = this.testingUtils.getRandomString(10);
            participant.lastName = this.testingUtils.getRandomString(10);
            participant.email = this.testingUtils.getRandomEmail();
            participant.dateOfBirth = +this.pMoment.m().startOf('day');
            participant.tariffId = tariff.id;
            if (tariff.additionalFieldLabel)
                participant.additionalFieldValue = this.testingUtils.getRandomString(10);
        }
        // which course?
        if (bookingPersonCanGiveDesiredDate) {
            booking.desiredDate = this.testingUtils.getRandomString(10);
            booking.courseSelector = null;
        }
        else {
            booking.courseSelector = shiftId;
        }
    }
}
//# sourceMappingURL=api-testing-utils.js.map