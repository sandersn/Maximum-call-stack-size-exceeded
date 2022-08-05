/* eslint-disable max-statements */
/* eslint-disable indent */
/* eslint-disable max-lines */
import { HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShiftModel, SchedulingApiBookingBase, SchedulingApiShiftBase, SchedulingApiShiftModelCoursePaymentMethod, SchedulingApiShiftModelCourseTariff} from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiBookingDesiredDateSetting, SchedulingApiBookingState, SchedulingApiCourseType, SchedulingApiPaymentMethodType} from '@plano/shared/api';
import { SchedulingApiShiftRepetitionType} from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ShiftId } from './../shift-id/shift-id';
import { SchedulingApiBooking } from '../../../../client/scheduling/shared/api/scheduling-api-booking.service';
import { CallByRef } from '../../../core/call-by-ref';
import { assumeNonNull } from '../../../core/null-type-utils';
import { ApiTestingUtils } from '../../base/api-testing-utils';

describe('#SchedulingApiService #needsapi', () => {
	const getActivePaymentMethod = (shiftModel : SchedulingApiShiftModel) : SchedulingApiShiftModelCoursePaymentMethod => {
		// find non-trashed payment-method
		for (let i = 0; i < shiftModel.coursePaymentMethods.length; ++i) {
			const paymentMethod = shiftModel.coursePaymentMethods.get(0)!;
			if (	!paymentMethod.trashed	&&
			paymentMethod.type === SchedulingApiPaymentMethodType.MISC) { // prefer MISC as Paypal for example need extra authentication before it can be used
				return paymentMethod;
			}
		}

		// alternative create a new one
		const newPaymentMethod = shiftModel.coursePaymentMethods.createNewItem();
		newPaymentMethod.name = 'New Payment-Method';
		newPaymentMethod.description = 'Description';
		newPaymentMethod.type = SchedulingApiPaymentMethodType.MISC;

		return newPaymentMethod;
	};

	let api : SchedulingApiService;
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	const apiTestingUtils = new ApiTestingUtils();

	const getApiQueryParams = (dataType : string) : HttpParams => {
		// start/end
		// Hack: data.shifts currently returns shifts of the whole day. workingTimes/absences not. So, to be consistent, start/end should be start/end of day
		const start = pMoment.m().subtract(1, 'week').startOf('day').valueOf().toString();
		const end = pMoment.m().add(1, 'week').startOf('day').valueOf().toString();

		return new HttpParams()
			.set('data', dataType)
			.set('start', start)
			.set('end', end)
			.set('bookingsStart', start)
			.set('bookingsEnd', end)
			.set('bookingsByShiftTime', 'true');
	};

	describe('booking', () => {
		let courseShiftModel ! : SchedulingApiShiftModel;
		let courseShiftId ! : ShiftId;

		beforeAll(async () => {
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('calendar'));

			// find a course shift-model
			for (const shiftModel of api.data.shiftModels.iterable()) {
				// Kindergeburtstag is course and bookingPersonCanGiveDesiredDate === false
				if (shiftModel.name === 'Kindergeburtstag') {
					courseShiftModel = shiftModel;
					break;
				}
			}

			// find a shift of this course shift-model
			for (const shift of api.data.shifts.iterable()) {
				if (shift.shiftModelId.equals(courseShiftModel.id)) {
					courseShiftId = shift.id;
					break;
				}
			}

			// load data === "bookings" to have now bookings available
			await testingUtils.loadApi(SchedulingApiService, null, getApiQueryParams('bookings'));
		});

		/** ***********************************************************************************/
		describe('tariff/payment-method changing-has-no-side-effects', () => {
			interface DoTestArgs {
				paymentMethod : CallByRef<SchedulingApiShiftModelCoursePaymentMethod>;
				tariff : CallByRef<SchedulingApiShiftModelCourseTariff>;
				createObj : (shiftModel : SchedulingApiShiftModel) => void;
				changeObj : (booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, done : any) => void;
				testBooking1 : (booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => void;
				testBooking2 : (booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => void;
				done : any;
			}

			const doTest = ({paymentMethod, tariff, createObj, changeObj, testBooking1, testBooking2, done} : DoTestArgs) : void => {
				// create object
				createObj(courseShiftModel);

				api.save(
				{
					success: () => {
						// create two bookings with this payment-method
						const booking1 = api.data.bookings.createNewItem();

						apiTestingUtils.initNewBooking(	booking1
													,	courseShiftModel.courseType!
													,	courseShiftModel
													,	courseShiftId
													,	paymentMethod.val!
													,	tariff.val!
													,	courseShiftModel.onlyWholeCourseBookable
													,	false);

						const booking2 = api.data.bookings.createNewItem();

						apiTestingUtils.initNewBooking(	booking2
													,	courseShiftModel.courseType!
													,	courseShiftModel
													,	courseShiftId
													,	paymentMethod.val!
													,	tariff.val!
													,	courseShiftModel.onlyWholeCourseBookable
													,	false);

						api.save(
						{
							success: () => {
								// change object
								changeObj(booking1, booking2, () => {
									api.save(
									{
										success: () => {
											// do tests
											courseShiftModel.loadDetailed(
											{
												searchParams: getApiQueryParams('bookings'),
												success: () => {
													// test booking 2
													booking2.loadDetailed(
													{
														searchParams: getApiQueryParams('bookings'),
														success: () => {
															testBooking2(booking1, booking2, courseShiftModel);

															// booking 1
															booking1.loadDetailed(
															{
																searchParams: getApiQueryParams('bookings'),
																success: () => {
																	testBooking1(booking1, booking2, courseShiftModel);

																	done();
																},
															});
														},
													});
												},
											});
										},
									});
								});
							},
						});
					},
				});
			};

			describe('payment-method', () => {
				const paymentMethod = new CallByRef<SchedulingApiShiftModelCoursePaymentMethod>();
				const tariff = new CallByRef<SchedulingApiShiftModelCourseTariff>();
				const origPaymentMethodName = testingUtils.getRandomString(30);

				const createObj = (shiftModel : SchedulingApiShiftModel) : void => {
					for (const currTariff of shiftModel.courseTariffs.iterable()) {
						if (!currTariff.trashed) {
							tariff.val = currTariff;
							break;
						}
					}

					if (!tariff.val)
						throw new Error('No active tariff could be found.');

					paymentMethod.val = shiftModel.coursePaymentMethods.createNewItem();
					paymentMethod.val.type = SchedulingApiPaymentMethodType.MISC;
					paymentMethod.val.name = origPaymentMethodName;
					paymentMethod.val.description = 'asd';
				};

				it('changing-in-a-booking-a-non-trashed-payment-method', (done : any) => {
					doTest(
					{
						paymentMethod: paymentMethod,
						tariff: tariff,
						createObj: createObj,
						changeObj: (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, done : any) => {
							paymentMethod.val!.description = testingUtils.getRandomString(20);
							paymentMethod.val!.applyToBooking = booking1.id!;

							done();
						},
						testBooking1 : (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							const booking1PaymentMethod = shiftModel.coursePaymentMethods.get(booking1.paymentMethodId)!;
							expect(booking1PaymentMethod.trashed).toBeTruthy();
						},
						testBooking2 : (booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							expect(testingUtils.safeEquals(booking2.paymentMethodId, booking1.paymentMethodId)).toBeFalsy();

							const booking2PaymentMethod = shiftModel.coursePaymentMethods.get(booking2.paymentMethodId)!;
							expect(booking2PaymentMethod.name).toEqual(origPaymentMethodName);
							expect(booking2PaymentMethod.trashed).toBeFalsy();
						},
						done: done,
					});
				});

				it('changing-in-a-booking-a-trashed-payment-method', (done : any) => {
					doTest(
					{
						paymentMethod: paymentMethod,
						tariff: tariff,
						createObj: createObj,
						changeObj: (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, done : any) => {
							paymentMethod.val!.trashed = true;
							paymentMethod.val!.applyToBooking = null;

							api.save(
							{
								success: () => {
									paymentMethod.val!.description = testingUtils.getRandomString(20);
									paymentMethod.val!.applyToBooking = booking1.id!;

									done();
								},
							});
						},
						testBooking1 : (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							const booking1PaymentMethod = shiftModel.coursePaymentMethods.get(booking1.paymentMethodId)!;
							expect(booking1PaymentMethod.trashed).toBeTruthy();
						},
						testBooking2 : (booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							expect(testingUtils.safeEquals(booking2.paymentMethodId, booking1.paymentMethodId)).toBeFalsy();

							const booking2PaymentMethod = shiftModel.coursePaymentMethods.get(booking2.paymentMethodId)!;
							expect(booking2PaymentMethod.name).toEqual(origPaymentMethodName);
							expect(booking2PaymentMethod.trashed).toBeTruthy();
						},
						done: done,
					});
				});

				it('changing-in-shift-model-a-non-trashed-payment-method', (done : any) => {
					doTest(
					{
						paymentMethod: paymentMethod,
						tariff: tariff,
						createObj: createObj,
						changeObj: (_booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, done : any) => {
							paymentMethod.val!.description = testingUtils.getRandomString(20);
							paymentMethod.val!.applyToBooking = null;

							done();
						},
						testBooking1 : (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							expect(testingUtils.safeEquals(booking1.paymentMethodId, paymentMethod.val!.id)).toBeFalsy();

							const booking1PaymentMethod = shiftModel.coursePaymentMethods.get(booking1.paymentMethodId)!;
							expect(booking1PaymentMethod.name).toEqual(origPaymentMethodName);
							expect(booking1PaymentMethod.trashed).toBeTruthy();
						},
						testBooking2 : (_booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							expect(testingUtils.safeEquals(booking2.paymentMethodId, paymentMethod.val!.id)).toBeFalsy();

							const booking2PaymentMethod = shiftModel.coursePaymentMethods.get(booking2.paymentMethodId)!;
							expect(booking2PaymentMethod.name).toEqual(origPaymentMethodName);
							expect(booking2PaymentMethod.trashed).toBeTruthy();
						},
						done: done,
					});
				});
			});

			describe('tariff', () => {
				const paymentMethod = new CallByRef<SchedulingApiShiftModelCoursePaymentMethod>();
				const tariff = new CallByRef<SchedulingApiShiftModelCourseTariff>();

				const origTariffName = testingUtils.getRandomString(30);

				const createObj = (shiftModel : SchedulingApiShiftModel) : void => {
					paymentMethod.val = getActivePaymentMethod(shiftModel);

					tariff.val = shiftModel.courseTariffs.createNewItem();
					tariff.val.name = origTariffName;
					tariff.val.description = 'asd';
					const fee = tariff.val.fees.createNewItem();
					fee.fee = testingUtils.getRandomNumber(1, 9999, 0);
					fee.perXParticipants = 1;
					fee.taxPercentage = 19;
				};

				it('changing-in-a-booking-a-non-trashed-tariff', (done : any) => {
					doTest(
					{
						paymentMethod: paymentMethod,
						tariff: tariff,
						createObj: createObj,
						changeObj: (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, done : any) => {
							tariff.val!.fees.get(0)!.fee = testingUtils.getRandomNumber(1, 9999, 0);
							tariff.val!.applyToBooking = booking1.id!;
							tariff.val!.applyToParticipant = null;

							done();
						},
						testBooking1 : (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							const booking1Tariff = shiftModel.courseTariffs.get(booking1.overallTariffId)!;
							expect(booking1Tariff.trashed).toBeTruthy();
						},
						testBooking2 : (booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							expect(testingUtils.safeEquals(booking2.overallTariffId, booking1.overallTariffId)).toBeFalsy();

							const booking2Tariff = shiftModel.courseTariffs.get(booking2.overallTariffId)!;
							expect(booking2Tariff.name).toEqual(origTariffName);
							expect(booking2Tariff.trashed).toBeFalsy();
						},
						done: done,
					});
				});

				it('changing-in-a-booking-a-trashed-tariff', (done : any) => {
					doTest(
					{
						paymentMethod: paymentMethod,
						tariff: tariff,
						createObj: createObj,
						changeObj: (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, done : any) => {
							tariff.val!.trashed = true;
							tariff.val!.applyToBooking = null;
							tariff.val!.applyToParticipant = null;

							api.save(
							{
								success: () => {
									tariff.val!.fees.get(0)!.fee = testingUtils.getRandomNumber(1, 9999, 0);
									tariff.val!.applyToBooking = booking1.id!;
									tariff.val!.applyToParticipant = null;

									done();
								},
							});
						},
						testBooking1 : (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							const booking1Tariff = shiftModel.courseTariffs.get(booking1.overallTariffId)!;
							expect(booking1Tariff.trashed).toBeTruthy();
						},
						testBooking2 : (booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							expect(testingUtils.safeEquals(booking2.overallTariffId, booking1.overallTariffId)).toBeFalsy();

							const booking2Tariff = shiftModel.courseTariffs.get(booking2.overallTariffId)!;
							expect(booking2Tariff.name).toEqual(origTariffName);
							expect(booking2Tariff.trashed).toBeTruthy();
						},
						done: done,
					});
				});

				it('changing-in-shift-model-a-non-trashed-tariff', (done : any) => {
					doTest(
					{
						paymentMethod: paymentMethod,
						tariff: tariff,
						createObj: createObj,
						changeObj: (_booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, done : any) => {
							tariff.val!.fees.get(0)!.fee = testingUtils.getRandomNumber(1, 9999, 0);
							tariff.val!.applyToBooking = null;
							tariff.val!.applyToParticipant = null;

							done();
						},
						testBooking1 : (booking1 : SchedulingApiBookingBase, _booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							expect(testingUtils.safeEquals(booking1.overallTariffId, tariff.val!.id)).toBeFalsy();

							const booking1Tariff = shiftModel.courseTariffs.get(booking1.overallTariffId)!;
							expect(booking1Tariff.name).toEqual(origTariffName);
							expect(booking1Tariff.trashed).toBeTruthy();
						},
						testBooking2 : (_booking1 : SchedulingApiBookingBase, booking2 : SchedulingApiBookingBase, shiftModel : SchedulingApiShiftModel) => {
							expect(testingUtils.safeEquals(booking2.overallTariffId, tariff.val!.id)).toBeFalsy();

							const booking2Tariff = shiftModel.courseTariffs.get(booking2.overallTariffId)!;
							expect(booking2Tariff.name).toEqual(origTariffName);
							expect(booking2Tariff.trashed).toBeTruthy();
						},
						done: done,
					});
				});
			});
		});

		/** ***********************************************************************************/
		describe('cancellation-policy', () => {
			let bookingCancellationPolicyRawData : any[];
			let booking : SchedulingApiBooking;

			it('new-booking-uses-current-cancellation-policy', (done) => {
				// create booking
				booking = api.data.bookings.createNewItem();
				apiTestingUtils.initNewBooking(booking,
					courseShiftModel.courseType!,
					courseShiftModel,
					courseShiftId,
					getActivePaymentMethod(courseShiftModel),
					courseShiftModel.courseTariffs.get(0)!,
					courseShiftModel.onlyWholeCourseBookable,
					false);

				// new booking uses current cancellation policy?
				api.save({
					success: () => {
						booking.loadDetailed({
							success: () => {
								expect(booking.cancellationPolicyId.equals(courseShiftModel.currentCancellationPolicyId)).toBeTruthy();

								// remember bookings cancellation policy data
								const bookingsCancellationPolicy = courseShiftModel.cancellationPolicies.get(booking.cancellationPolicyId)!;
								bookingCancellationPolicyRawData = apiTestingUtils.copyRawData(bookingsCancellationPolicy);

								done();
							},
						});
					},
				});
			});

			it('change-cancellation-policy', (done) => {
				const cancellationPolicy = courseShiftModel.currentCancellationPolicy!;

				// change withdrawal period
				cancellationPolicy.withdrawalEnabled = true;
				cancellationPolicy.withdrawalPeriod = testingUtils.getRandomNumber(10, 30);

				// change fee periods
				const feePeriods = cancellationPolicy.feePeriods;
				feePeriods.clear();

				const feePeriod1 = feePeriods.createNewItem();
				feePeriod1.start = null;
				feePeriod1.feeFix = testingUtils.getRandomNumber(1, 40);
				feePeriod1.feePercentage = testingUtils.getRandomNumber(0, 100);

				const feePeriod2 = feePeriods.createNewItem();
				feePeriod2.start = testingUtils.getRandomNumber(1, 30);
				feePeriod2.feeFix = testingUtils.getRandomNumber(1, 40);
				feePeriod2.feePercentage = testingUtils.getRandomNumber(0, 100);

				// save changes and check if new cancellation policy was saved correctly
				const newCancellationPolicyRawData = apiTestingUtils.copyRawData(courseShiftModel.currentCancellationPolicy!);

				api.save({
					success: () => {
						// New cancellation policy is equal the data we saved?

						// Remove fee-period end values from rawData as backend dont send them
						const feePeriodsRawData = newCancellationPolicyRawData[api.consts.SHIFT_MODEL_CANCELLATION_POLICY_FEE_PERIODS];
						for (let i = 1; i < feePeriodsRawData.length; ++i)
							feePeriodsRawData[i].splice(api.consts.SHIFT_MODEL_CANCELLATION_POLICY_FEE_PERIOD_END, 1);

						// We must ignore any ids because the new cancellation-policy is saved as a new object
						apiTestingUtils.expectRawDataEqualsIgnoringIds(courseShiftModel.currentCancellationPolicy!, newCancellationPolicyRawData);
						done();
					},
				});
			});

			it('cancellation-policy-changes-have-not-affected-booking', (done) => {
				booking.loadDetailed({
					success: () => {
						const bookingsCancellationPolicy = courseShiftModel.cancellationPolicies.get(booking.cancellationPolicyId)!;
						apiTestingUtils.expectRawDataEqualsIgnoringIds(bookingsCancellationPolicy, bookingCancellationPolicyRawData);

						done();
					},
				});
			});

		});

		/** ***********************************************************************************/
		describe('shift-model', () => {
			//
			//	Define test methods
			//
			let shiftId : ShiftId;

			const testShift = (	courseType : SchedulingApiCourseType
							,	shiftModel : CallByRef<SchedulingApiShiftModel>) : void => {
				describe('shift', () => {
					let shift : SchedulingApiShiftBase;

					it('create', (done : any) => {
						api.data.shifts.createNewShift(shiftModel.val!
													,	pMoment.m().startOf('day')
													,	getApiQueryParams('calendar')
													,	(newShift : SchedulingApiShiftBase ) => {
							expect().nothing();
							api.save({success: () => {
								shift = newShift;
								shiftId = newShift.id;

								done();
							}});
						});
					});

					it('set-offline', (done : any) => {
						shift.isCourseOnline = false;
						api.save({success: () => {expect(shift.isCourseOnline).toBeFalsy(); done();}});
					});

					it('set-online', (done : any) => {
						shift.isCourseOnline = true;
						api.save({success: () => {expect(shift.isCourseOnline).toBeTruthy(); done();}});
					});

					it('cancel', (done : any) => {
						shift.isCourseCanceled = true;
						api.save({success: () => {expect(shift.isCourseCanceled).toBeTruthy(); done();}});
					});

					it('revert-cancel', (done : any) => {
						shift.isCourseCanceled = false;
						api.save({success: () => {expect(shift.isCourseCanceled).toBeFalsy(); done();}});
					});

					if (courseType !== SchedulingApiCourseType.NO_BOOKING) {
						describe('max-participant-count', () => {
							it('unlimited', (done : any) => {
								shift.maxCourseParticipantCount = null;
								api.save({success: () => {expect(shift.maxCourseParticipantCount).toBeNull(); done();}});
							});

							it('limited', (done : any) => {
								const newValue = testingUtils.getRandomNumber(5, 10, 0);
								shift.maxCourseParticipantCount = newValue;
								api.save({success: () => {expect(shift.maxCourseParticipantCount).toBe(newValue); done();}});
							});
						});

						describe('min-participant-count', () => {
							it('change', (done : any) => {
								const newValue = testingUtils.getRandomNumber(1, shift.maxCourseParticipantCount!, 0);
								shift.minCourseParticipantCount = newValue;
								api.save({success: () => {expect(shift.minCourseParticipantCount).toBe(newValue); done();}});
							});
						});
					}
				});
			};

			const testBooking = (	courseType : SchedulingApiCourseType
							,	bookingPersonCanGiveDesiredDate : boolean
							,	onlyWholeCourseBookable : boolean
							,	shiftModel : CallByRef<SchedulingApiShiftModel>) : void => {
				if (courseType === SchedulingApiCourseType.NO_BOOKING)
					return;

				describe('booking', () => {
					apiTestingUtils.doDefaultListTests({
						searchParams: getApiQueryParams('bookings'),
						removeMethod: 'none',
						getApi : () => { return api; },
						getList : () => {
							return api.data.bookings;
						},
						changeItem : (booking : SchedulingApiBookingBase) => {
							// create booking
							if (booking.isNewItem()) {
								assumeNonNull(shiftModel.val);
								apiTestingUtils.initNewBooking(	booking
											,	courseType
											,	shiftModel.val
											,	shiftId
											,	getActivePaymentMethod(shiftModel.val)
											,	shiftModel.val.courseTariffs.get(0)!
											,	onlyWholeCourseBookable
											,	bookingPersonCanGiveDesiredDate);
							}
						},
						afterTestCreateNewItem: (booking : CallByRef<SchedulingApiBooking>) => {
							if (courseType === SchedulingApiCourseType.ONLINE_INQUIRY) {
								it('decline-inquiry', (done : any) => {
									assumeNonNull(booking.val);
									booking.val.state = SchedulingApiBookingState.INQUIRY_DECLINED;
									api.save({success: () => {expect(booking.val!.state).toBe(SchedulingApiBookingState.INQUIRY_DECLINED); done();}});
								});

								it('accept-inquiry', (done : any) => {
									assumeNonNull(booking.val);
									booking.val.state = SchedulingApiBookingState.BOOKED;

									if (bookingPersonCanGiveDesiredDate)
										booking.val.courseSelector = shiftId;

									api.save({success: () => {expect(booking.val!.state).toBe(SchedulingApiBookingState.BOOKED); done();}});
								});
							}

							it('cancel', (done : any) => {
								assumeNonNull(booking.val);
								booking.val.state = SchedulingApiBookingState.CANCELED;
								api.save({success: () => {expect(booking.val!.state).toBe(SchedulingApiBookingState.CANCELED); done();}});
							});

							it('revert-cancel', (done : any) => {
								assumeNonNull(booking.val);
								booking.val.state = SchedulingApiBookingState.BOOKED;
								api.save({success: () => {expect(booking.val!.state).toBe(SchedulingApiBookingState.BOOKED); done();}});
							});
						},
					});
				});
			};

			const testCourse = (	courseType : SchedulingApiCourseType
							,	bookingPersonCanGiveDesiredDate : boolean
							,	onlyWholeCourseBookable : boolean) : void => {
				describe(`(case ${courseType} ${bookingPersonCanGiveDesiredDate} ${onlyWholeCourseBookable})`, () => {
					apiTestingUtils.doDefaultListTests({
						searchParams: getApiQueryParams('calendar'),
						getApi : () => { return api; },
						getList : () => {
							return api.data.shiftModels;
						},
						changeItem : (shiftModel : SchedulingApiShiftModel) => {
							shiftModel.name = testingUtils.getRandomString(10);
							shiftModel.color = 'FF0000';
							shiftModel.parentName = testingUtils.getRandomString(10);
							shiftModel.neededMembersCountConf.neededMembersCount = testingUtils.getRandomNumber(0, 3, 0);
							shiftModel.neededMembersCountConf.perXParticipants = testingUtils.getRandomNumber(1, 7, 0);
							shiftModel.neededMembersCountConf.isZeroNotReachedMinParticipantsCount = true;
							shiftModel.description = testingUtils.getRandomString(20);
							shiftModel.workingTimeCreationMethod = testingUtils.getRandomNumber(1, 2, 0);

							// time
							shiftModel.time.start = 1;
							shiftModel.time.end = 1000;

							// repetition
							shiftModel.repetition.type = SchedulingApiShiftRepetitionType.EVERY_X_DAYS;
							shiftModel.repetition.x = testingUtils.getRandomNumber(20, 40, 0);
							shiftModel.repetition.endsAfterDate = pMoment.m().add(2, 'month').valueOf();

							// packet repetition
							shiftModel.repetition.packetRepetition.type = SchedulingApiShiftRepetitionType.EVERY_X_DAYS;
							shiftModel.repetition.packetRepetition.x = testingUtils.getRandomNumber(2, 3, 0);
							shiftModel.repetition.packetRepetition.endsAfterRepetitionCount = 3;

							// assignable members
							const newAssignableMember = api.data.members.get(0);

							if (shiftModel.isNewItem()) {
								// add new assignable member
								const assignableMember = shiftModel.assignableMembers.createNewItem();
								assignableMember.hourlyEarnings = testingUtils.getRandomNumber(0, 15, 0);
								assumeNonNull(newAssignableMember);
								assignableMember.memberId = newAssignableMember.id;
							}

							// assigned members
							if (shiftModel.isNewItem()) {
								// add newAssignableMember new assigned member.
								// So, we make sure assigned member is also assignable.
								assumeNonNull(newAssignableMember);
								const memberId = newAssignableMember.id;
								shiftModel.assignedMemberIds.push(memberId);
							}

							//
							//	Course stuff
							//
							shiftModel.isCourse = true;
							shiftModel.courseGroup = testingUtils.getRandomString(10);
							shiftModel.courseCodePrefix = testingUtils.getRandomString(45);
							shiftModel.isCourseOnline = true;
							shiftModel.courseType = courseType;
							shiftModel.courseTitle = testingUtils.getRandomString(10);
							shiftModel.courseSubtitle = testingUtils.getRandomString(10);
							shiftModel.courseDescription = testingUtils.getRandomString(10);
							shiftModel.courseEquipmentRequirements = testingUtils.getRandomString(10);
							shiftModel.courseSkillRequirements = testingUtils.getRandomString(10);
							shiftModel.courseLocation = testingUtils.getRandomString(10);
							shiftModel.courseContactName = testingUtils.getRandomString(10);
							shiftModel.courseContactEmail = testingUtils.getRandomEmail();
							shiftModel.courseContactPhone = testingUtils.getRandomString(10);
							shiftModel.bookingDesiredDateSetting = bookingPersonCanGiveDesiredDate ?
								SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_OPTIONAL	:
								SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_NOT_ALLOWED;

							shiftModel.onlyWholeCourseBookable = onlyWholeCourseBookable;
							shiftModel.arrivalTimeBeforeCourse = testingUtils.getRandomNumber(1, 1000000, 0);
							shiftModel.courseBookingDeadlineUntil = (shiftModel.courseType === SchedulingApiCourseType.NO_BOOKING) ? null :
								testingUtils.getRandomNumber(1, 1000000, 0);
							shiftModel.minCourseParticipantCount = testingUtils.getRandomNumber(1, 5, 0);
							shiftModel.maxCourseParticipantCount = testingUtils.getRandomNumber(shiftModel.minCourseParticipantCount,
								shiftModel.minCourseParticipantCount + 10,
								0);

							// highlights
							if (shiftModel.isNewItem()) {
								const highlight = shiftModel.courseHighlights.createNewItem();
								highlight.text = testingUtils.getRandomString(10);
							} else {
								shiftModel.courseHighlights.remove(0);
							}

							// tariff
							if (shiftModel.isNewItem()) {
								const tariff = shiftModel.courseTariffs.createNewItem();
								tariff.name = testingUtils.getRandomString(10);
								tariff.description = testingUtils.getRandomString(10);
								tariff.isInternal = testingUtils.getRandomBoolean();
								tariff.forCourseDatesFrom = +pMoment.m();
								tariff.forCourseDatesUntil = tariff.forCourseDatesFrom + 1000;
								tariff.negateForCourseDatesInterval = testingUtils.getRandomBoolean();

								const fee = tariff.fees.createNewItem();
								fee.fee = testingUtils.getRandomNumber(1, 10, 0);
								fee.perXParticipants = onlyWholeCourseBookable ? 3 : 1;
								fee.taxPercentage = testingUtils.getRandomNumber(1, 20, 0);
							}

							// payment method
							if (shiftModel.isNewItem()) {
								const paymentMethod = shiftModel.coursePaymentMethods.createNewItem();
								paymentMethod.name = testingUtils.getRandomString(10);
								paymentMethod.description = testingUtils.getRandomString(10);
								paymentMethod.isInternal = testingUtils.getRandomBoolean();
								paymentMethod.type = SchedulingApiPaymentMethodType.MISC; // don’t set PAYPAL as this needs third party authorization
							} else {
								shiftModel.coursePaymentMethods.get(0)!.applyToBooking = null;
								shiftModel.coursePaymentMethods.get(0)!.trashed = true;
							}

							// cancellation-policy
							shiftModel.currentCancellationPolicy!.withdrawalEnabled = true;
							shiftModel.currentCancellationPolicy!.withdrawalPeriod = testingUtils.getRandomNumber(1, 10000);

							const feePeriods = shiftModel.currentCancellationPolicy!.feePeriods;
							if (shiftModel.isNewItem()) {
								const newFeePeriod = feePeriods.createNewItem();
								newFeePeriod.feeFix = 3;
								newFeePeriod.feePercentage = 2;
								newFeePeriod.start = null;
							} else {
								const newFeePeriod = feePeriods.createNewItem();
								newFeePeriod.feeFix = 4;
								newFeePeriod.feePercentage = 3;
								newFeePeriod.start = null;

								feePeriods.get(1)!.start = 3;
							}

							// automatic course mails
							if (shiftModel.isNewItem()) {
								shiftModel.automaticBookableMailIds.push(api.data.customBookableMails.get(0)!.id);
							} else {
								shiftModel.automaticBookableMailIds.remove(0);
							}

						},
						removeMethod: 'trash',
						afterTestCreateNewItem: (shiftModel : CallByRef<SchedulingApiShiftModel>) => {
							testShift(courseType, shiftModel);
							testBooking(courseType, bookingPersonCanGiveDesiredDate, onlyWholeCourseBookable, shiftModel);
						},
						beforeRawDataCompare: (_shiftModel : SchedulingApiShiftModel, rawDataBeforeSave : any) => {
							// Remove paymentMethod.applyToBooking from raw data
							const paymentMethodsRawData = rawDataBeforeSave[api.consts.SHIFT_MODEL_COURSE_PAYMENT_METHODS];

							for (let i = 1; i < paymentMethodsRawData.length; ++i) {
								paymentMethodsRawData[i].splice(api.consts.SHIFT_MODEL_COURSE_PAYMENT_METHOD_APPLY_TO_BOOKING, 1);
							}

							// Remove tariff.applyToBooking/tariff.applyToParticipant from raw data
							const tariffsRawData = rawDataBeforeSave[api.consts.SHIFT_MODEL_COURSE_TARIFFS];

							for (let i = 1; i < tariffsRawData.length; ++i) {
								tariffsRawData[i].splice(api.consts.SHIFT_MODEL_COURSE_TARIFF_APPLY_TO_PARTICIPANT, 1);
								tariffsRawData[i].splice(api.consts.SHIFT_MODEL_COURSE_TARIFF_APPLY_TO_BOOKING, 1);
							}

							// ignore raw-data compare for cancellation-fees. Is kind of complicated because backend
							// creates a copy on every change
							rawDataBeforeSave[api.consts.SHIFT_MODEL_CURRENT_CANCELLATION_POLICY_ID] =
								_shiftModel.rawData[api.consts.SHIFT_MODEL_CURRENT_CANCELLATION_POLICY_ID];
							rawDataBeforeSave[api.consts.SHIFT_MODEL_CANCELLATION_POLICIES] = _shiftModel.rawData[api.consts.SHIFT_MODEL_CANCELLATION_POLICIES];
						},
					});
				});
			};

			//
			//	Do tests
			//
			testCourse(SchedulingApiCourseType.NO_BOOKING, false, false);

			testCourse(SchedulingApiCourseType.ONLINE_BOOKABLE, false, false);
			testCourse(SchedulingApiCourseType.ONLINE_BOOKABLE, false, true);

			testCourse(SchedulingApiCourseType.ONLINE_INQUIRY, false, false);
			testCourse(SchedulingApiCourseType.ONLINE_INQUIRY, false, true);
			testCourse(SchedulingApiCourseType.ONLINE_INQUIRY, true, false);
			testCourse(SchedulingApiCourseType.ONLINE_INQUIRY, true, true);
		});
	});
 });
