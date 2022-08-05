import * as $ from 'jquery';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ApiListWrapper, ApiObjectWrapper, SchedulingApiBookingBase, SchedulingApiShiftModel, SchedulingApiShiftModelCoursePaymentMethod, SchedulingApiShiftModelCourseTariff} from '@plano/shared/api';
import { SchedulingApiBookingState, SchedulingApiCourseType, ShiftId } from '@plano/shared/api';
import { ApiBase } from '@plano/shared/api/base/api-base';
import { Id } from '@plano/shared/api/base/id';
import { CallByRef } from '@plano/shared/core/call-by-ref';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PSupportedLocaleIds } from './generated-types.ag';
import { ObjectWithRawData } from './object-with-raw-data';
import { PMomentService } from '../../../client/shared/p-moment.service';
import { notNull } from '../../core/null-type-utils';

interface DefaultListTestsArgs<T> {

	/**
	 * A method which returns the api.
	 */
	getApi : () => ApiBase;

	/**
	 * A method which returns the list to be tested.
	 */
	getList : () => ApiListWrapper<T>;

	/**
	 * A method which modifies a list item.
	 */
	changeItem : (item : T) => void;

	/**
	 * The search params used for any load operation.
	 */
	searchParams : HttpParams;

	/**
	 * Optional method to define custom new item creation.
	 */
	createNewItem ?: null | (() => Promise<T>);

	/**
	 * An optional handler being called after the item was created.
	 */
	afterItemCreated ?: null | ((item : T) => void);

	/**
	 * And optional method which is called after "it('should create new item', …);". Use this to add further tests at
	 * this point.
	 */
	afterTestCreateNewItem ?: null | ((item : CallByRef<T>) => void);

	/**
	 * An optional handler being called after the item was removed.
	 * note that in some cases the removed item is returned again by the api (i.e. marked as trashed).
	 * But as the wrapper is not anymore included in the api lists its raw data will not be updated.
	 * So the wrapper remains on the old data. So, we pass only its id. The handler
	 * can optionally search for the new wrapper with this id which will also have the updated data.
	 */
	afterItemRemoved ?: null | ((removedItemId : Id) => void);

	/**
	 * An optional handler being called before comparing raw data of item.
	 */
	beforeRawDataCompare ?: null | ((item : T, rawDataBeforeSave : any[]) => void);

	/**
	 * Remove methods. Possible values are "remove", "trash" and "none".
	 */
	removeMethod ?: string | ((item : T) => void);
}


export class ApiTestingUtils {
	private pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	private testingUtils = new TestingUtils();

	/**
	 * Do tests for default list operations (get/edit/add/remove).
	 * @param getApi The api is normally initialized delayed. Thus, we have a method which returns the current api.
	 * @param getList Currently a list wrapper object becomes invalid when new data is loaded.
	 * 		Thus, we need to have a method which always returns the actual wrapper object.
	 * @param changeItem A method which changes the detailed view of an item.
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	public doDefaultListTests<T extends ApiObjectWrapper<T, any>>(	{
		getApi
		,	getList
		, 	changeItem
		,	searchParams
		,	createNewItem = null
		,	afterItemCreated = null
		,	afterTestCreateNewItem = null
		,	afterItemRemoved = null
		,	beforeRawDataCompare = null
		,	removeMethod = 'remove',
	} : DefaultListTestsArgs<T>) : void {

		/**
		 * At the moment all tests work on the same backend data. Thus, we need to ensure that tests do no long term changes
		 * to data so the tests remain independent. To ensure this, we first create a new list element, then edit it and
		 * then finally remove the new element.
		 */
		const newItem = new CallByRef<T>();

		it('should create new item', async () => {
			// load api with given searchParams to ensure correct data "context"
			await getApi().load({ searchParams: searchParams } );

			const testCreateNewItem = async () : Promise<void> => {
				// HACK: That strange type casts and stuff in the next line is a result of a TS bug. See: https://github.com/microsoft/TypeScript/issues/50066
				const value = notNull(newItem.val as ApiObjectWrapper<T, any> | null) as T;
				changeItem(value);

				await value.api!.save();

				// new item available?
				expect(getList().contains(value)).toBeTruthy();

				if (afterItemCreated)
					await afterItemCreated(value);

			};

			// custom (async) createNewItem method?
			if (createNewItem) {
				newItem.val = await createNewItem();
				await testCreateNewItem();
			} else {
				// Use default createNewItem() method
				newItem.val = getList().createNewItem();
				await testCreateNewItem();
			}
		});

		if (afterTestCreateNewItem)
			afterTestCreateNewItem(newItem);

		it('should load/save detailed', (done : any) => {
			// HACK: That strange type casts and stuff in the next line is a result of a TS bug. See: https://github.com/microsoft/TypeScript/issues/50066
			notNull(newItem.val as ApiObjectWrapper<T, any> | null).loadDetailed(
				{
					searchParams: searchParams,
					success: () => {
						// change item
						// HACK: That strange type casts and stuff in the next line is a result of a TS bug. See: https://github.com/microsoft/TypeScript/issues/50066
						const value = notNull(newItem.val as ApiObjectWrapper<T, any> | null) as T;
						changeItem(value);
						const rawDataBeforeSave = $.extend(true, [], value.rawData);

						value.saveDetailed(
							{
								success: () => {
									// data saved correctly?
									newItem.val!.loadDetailed(
										{
											searchParams: searchParams,
											success: () => {
												if (beforeRawDataCompare)
													beforeRawDataCompare(newItem.val!, rawDataBeforeSave);

												expect(newItem.val!.rawData).toEqual(rawDataBeforeSave);

												done();
											},
										});
								},
							});
					},
					error: (response : HttpErrorResponse) => {
						const testingUtils = new TestingUtils();
						testingUtils.logApiError(response);

						done();
					},
				});
		});

		it('should remove item', (done : any) => {
			// remove item
			if (removeMethod === 'none') {
				expect().nothing(); done();
				return;
			} else if (removeMethod === 'trash') {
				(newItem.val! as any).trashed = true;
			} else if (removeMethod === 'remove') {
				getList().removeItem(newItem.val!);
			} else if (typeof removeMethod === 'function') {
				removeMethod(newItem.val!);
			} else {
				throw new TypeError('unsupported');
			}

			getApi().save(
				{
					success: () => {
					// do tests
						if (removeMethod === 'trash')
							expect((newItem.val as any).trashed).toBeTruthy();
						else
							expect(getList().contains(newItem.val!)).toBeFalsy();

						// callback
						if (afterItemRemoved)
							afterItemRemoved(newItem.val!.id!);

						done();
					},
					error: fail,
				});
		});
	}

	/**
	 * @returns Returns a copy of the raw data of `object`.
	 */
	public copyRawData(object : ObjectWithRawData) : any[] {
		return $.extend(true, [], object.rawData);
	}

	/**
	 * Are the raw-data of `object` equal `rawData` when ignoring all ids?
	 * If not this method will fail the current running test.
	 */
	public expectRawDataEqualsIgnoringIds(object : ObjectWithRawData, rawData : any[]) : void {
		// make copy of the raw data
		rawData = $.extend(true, [], rawData);
		const currRawData = this.copyRawData(object);

		// remove all meta data (including ids)
		const removeMetaData = (data : any[]) : void => {
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
	public initNewBooking(	booking : SchedulingApiBookingBase
		, 	courseType : SchedulingApiCourseType
		,	shiftModel : SchedulingApiShiftModel
		,	shiftId : ShiftId
		,	paymentMethod : SchedulingApiShiftModelCoursePaymentMethod
		,	tariff : SchedulingApiShiftModelCourseTariff
		,	onlyWholeCourseBookable : boolean
		,	bookingPersonCanGiveDesiredDate : boolean) : void {


		booking.state = (courseType === SchedulingApiCourseType.ONLINE_INQUIRY) ? SchedulingApiBookingState.INQUIRY 	:
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
		} else {
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
		} else {
			booking.courseSelector = shiftId;
		}
	}
}
