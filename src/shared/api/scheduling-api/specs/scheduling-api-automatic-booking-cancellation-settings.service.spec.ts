/* eslint-disable indent */
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService, SchedulingApiTransactionType, SchedulingApiTransactionPaymentMethodType, SchedulingApiCourseType} from '@plano/shared/api';
import { Currency} from '@plano/shared/api/base/generated-types.ag';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { SchedulingApiBooking } from '../../../../client/scheduling/shared/api/scheduling-api-booking.service';
import { SchedulingApiShift, SchedulingApiShiftModel } from '../../../../client/scheduling/shared/api/scheduling-api.service';
import { ApiTestingUtils } from '../../base/api-testing-utils';
import { SchedulingApiBookingDesiredDateSetting, SchedulingApiPaymentMethodType, SchedulingApiShiftRepetitionType, SchedulingApiWorkingTimeCreationMethod } from '../scheduling-api.service.ag';

describe('#SchedulingApiService #needsapi', () => {
	let api : SchedulingApiService;
	let shiftModel : SchedulingApiShiftModel;
	let shift : SchedulingApiShift;
	let bookingWithOnlineBalance : SchedulingApiBooking;
	let bookingWithoutOnlineBalance : SchedulingApiBooking;
	const TRANSACTION_INTERNAL_COMMENT = 'Automatic cancellation';

	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	const apiTestingUtils = new ApiTestingUtils();

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));

		// create a new shift-model with cancellation fees
		shiftModel = api.data.shiftModels.createNewItem();
		shiftModel.name = testingUtils.getRandomString(20);
		shiftModel.parentName = testingUtils.getRandomString(20);
		shiftModel.isCourse = true;
		shiftModel.courseTitle = 'test';
		shiftModel.color = 'ffffff';
		shiftModel.minCourseParticipantCount = 1;
		shiftModel.onlyWholeCourseBookable = true;
		shiftModel.repetition.type = SchedulingApiShiftRepetitionType.NONE;
		shiftModel.repetition.packetRepetition.type = SchedulingApiShiftRepetitionType.NONE;
		shiftModel.bookingDesiredDateSetting = SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_NOT_ALLOWED;
		shiftModel.workingTimeCreationMethod = SchedulingApiWorkingTimeCreationMethod.TIME_STAMP;

		shiftModel.time.start = 1;
		shiftModel.time.end = 1000;

		shiftModel.neededMembersCountConf.neededMembersCount = 1;
		shiftModel.neededMembersCountConf.perXParticipants = null;
		shiftModel.neededMembersCountConf.isZeroNotReachedMinParticipantsCount = false;

		const paymentMethod = shiftModel.coursePaymentMethods.createNewItem();
		paymentMethod.type = SchedulingApiPaymentMethodType.ONLINE_PAYMENT;
		paymentMethod.name = 'Online-Zahlung';

		const tariff = shiftModel.courseTariffs.createNewItem();
		tariff.name = 'Tariff';
		const fee = tariff.fees.createNewItem();
		fee.fee = 5;
		fee.perXParticipants = 1;
		fee.taxPercentage = 0.19;

		const cancellationFeePeriod = shiftModel.currentCancellationPolicy!.feePeriods.createNewItem();
		cancellationFeePeriod.start = null;
		cancellationFeePeriod.feeFix = 1;
		cancellationFeePeriod.feePercentage = 1;

		await api.save();
	});

	beforeEach(async () => {
		// create new shift
		shift = await api.data.shifts.createNewShift(shiftModel
			, 	pMoment.m().startOf('day')
			,	testingUtils.getApiQueryParams('calendar'));
		await api.save();
		await shift.loadDetailed();

		// create a booking with online balance (which can automatically be online refunded)
		bookingWithOnlineBalance = api.data.bookings.createNewItem();
		apiTestingUtils.initNewBooking(bookingWithOnlineBalance,
					SchedulingApiCourseType.ONLINE_BOOKABLE,
					shiftModel,
					shift.id,
					shiftModel.coursePaymentMethods.get(0)!,
					shiftModel.courseTariffs.get(0)!,
					true,
					false);

		const onlineTransaction = api.data.transactions.createNewItem();
		onlineTransaction.type = SchedulingApiTransactionType.PAYMENT;
		onlineTransaction.paymentMethodType = SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT;
		onlineTransaction.bookingId = bookingWithOnlineBalance.id!;
		onlineTransaction.absAmount = 10;

		// create a booking with only MISC balance (which cannot automatically be online refunded)
		bookingWithoutOnlineBalance = api.data.bookings.createNewItem();
		apiTestingUtils.initNewBooking(bookingWithoutOnlineBalance,
					SchedulingApiCourseType.ONLINE_BOOKABLE,
					shiftModel,
					shift.id,
					shiftModel.coursePaymentMethods.get(0)!,
					shiftModel.courseTariffs.get(0)!,
					true,
					false);

		const miscTransaction = api.data.transactions.createNewItem();
		miscTransaction.type = SchedulingApiTransactionType.PAYMENT;
		miscTransaction.paymentMethodType = SchedulingApiTransactionPaymentMethodType.MISC;
		miscTransaction.miscPaymentMethodName = 'Bezahlung vor Ort';
		miscTransaction.bookingId = bookingWithoutOnlineBalance.id!;
		miscTransaction.absAmount = 10;

		await api.save();
	});

	const doTest = (action : 'cancel' | 'remove',
			noCancellationFees : boolean,
			automaticOnlineRefund : boolean) : void => {
		it(`automatic-booking-cancellation-settings ${action} noCancellationFees=${noCancellationFees} automaticOnlineRefund=${automaticOnlineRefund}`, async () => {
			const bookingWithOnlineBalancePrevCancellationFee = bookingWithOnlineBalance.cancellationFee;
			const bookingWithOnlineBalancePrevCurrentlyPaid = bookingWithOnlineBalance.currentlyPaid;

			const bookingWithoutOnlineBalancePrevCancellationFee = bookingWithoutOnlineBalance.cancellationFee;
			const bookingWithoutOnlineBalancePrevCurrentlyPaid = bookingWithoutOnlineBalance.currentlyPaid;

			// perform action
			const settings = api.data.automaticBookingCancellationSettings;
			const transactionInternalComment = automaticOnlineRefund ? TRANSACTION_INTERNAL_COMMENT : '';

			settings.noCancellationFees = noCancellationFees;
			settings.automaticOnlineRefund = automaticOnlineRefund;
			settings.transactionInternalComment = transactionInternalComment;

			if (action === 'cancel')
				shift.isCourseCanceled = true;
			else
				shift.parent!.removeItem(shift);

			await api.save();

			// test bookings
			await testBooking(bookingWithOnlineBalance,
				bookingWithOnlineBalancePrevCancellationFee,
				bookingWithOnlineBalancePrevCurrentlyPaid,
				noCancellationFees,
				automaticOnlineRefund);

			await testBooking(bookingWithoutOnlineBalance,
				bookingWithoutOnlineBalancePrevCancellationFee,
				bookingWithoutOnlineBalancePrevCurrentlyPaid,
				noCancellationFees,
				false);
		});
	};

	const testBooking = async (booking : SchedulingApiBooking,
		prevCancellationFee : Currency,
		prevCurrentlyPaid : Currency,
		noCancellationFees : boolean,
		expectAutomaticRefund : boolean) : Promise<void> => {
		// load detailed while ensuring that other bookings remain loaded
		await booking.loadDetailed({searchParams: testingUtils.getApiQueryParams('bookings')});

		if (noCancellationFees)
			expect(booking.cancellationFee).toBe(prevCancellationFee);
		else
			expect(booking.cancellationFee).toBeGreaterThan(prevCancellationFee);

		// test automaticOnlineRefund
		expect(booking.currentlyPaid).toBe(expectAutomaticRefund ? 0 : prevCurrentlyPaid);

		// test transactionInternalComment
		if (expectAutomaticRefund) {
			const lastTransaction = booking.transactions.get(booking.transactions.length - 1)!;
			await lastTransaction.loadDetailed({searchParams: testingUtils.getApiQueryParams('bookings')});
			expect(lastTransaction.internalComment).toBe(TRANSACTION_INTERNAL_COMMENT);
		}
	};

	doTest('cancel', false, false);
	doTest('cancel', true, true);
	doTest('remove', true, true);
});
