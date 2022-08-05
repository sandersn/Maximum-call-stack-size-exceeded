/* eslint-disable @typescript-eslint/no-unused-vars */
// cSpell:ignore Makeba, Coltrain, amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua, Karlsson, vero eos et accusam et justo duo dolores et ea rebum Stet clita kasd gubergren, no sea takimata sanctus
import { Subject } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SHIFT_MODEL_COLOR_SHADES } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/available-color-shades';
import { PMoment} from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiCourseType, SchedulingApiNotificationsConf, SchedulingApiShiftRepetitionType, SchedulingApiRightGroupRole, SchedulingApiBookings, SchedulingApiBookingState, SchedulingApiTransactions, SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactionType, SchedulingApiAbsenceTime, ApiBase } from '@plano/shared/api';
import { SchedulingApiServiceBase, SchedulingApiShiftModelRepetitionPacket, AuthenticatedApiRole, ApiSaveArgs, SchedulingApiShiftAssignableMember} from '@plano/shared/api';
import { ApiLoadArgs } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { RandomValueUtils } from '@plano/shared/core/random-value-utils';
import { SchedulingApiShifts, SchedulingApiShiftModels, SchedulingApiShiftModel, SchedulingApiShift, SchedulingApiMembers, SchedulingApiMember, SchedulingApiRightGroup, SchedulingApiRightGroups, SchedulingApiAccountingPeriods, SchedulingApiAbsences, SchedulingApiShiftChangeSelector } from './scheduling-api.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { ValidatorsService } from '../../../../shared/core/validators.service';

class RandomShiftModelValueUtils {
	// eslint-disable-next-line jsdoc/require-jsdoc
	public getColor() : string {
		// eslint-disable-next-line unicorn/no-array-reduce
		const ALL_COLORS = Object.values(SHIFT_MODEL_COLOR_SHADES).reduce((a, b) => a.concat(b));
		const randomNumber = randomSchedulingValueUtils.getRandomNumber(0, ALL_COLORS.length);
		return ALL_COLORS[randomNumber];
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public getName() : string {
		const randomNr = Math.floor(Math.random() * 10);
		switch (Math.floor(Math.random() * 8)) {
			case 0 :
				return `Kindergeburtstag ${randomNr}`;
			case 1 :
				return `Anfängerkurs ${randomNr}`;
			case 2 :
				return `Shop Schicht ${randomNr}`;
			case 3 :
				return `Foo Kurs ${randomNr}`;
			case 4 :
				return `FooBar Schicht ${randomNr}`;
			case 5 :
				return `Lorem ${randomNr}`;
			case 6 :
				return `Ipsum ${randomNr}`;
			case 7 :
				return `Very long Edge Case Lorem Ipsum Foo Bar ${randomNr}`;
			default :
				throw new Error('error');
		}
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public getParentName() : string {
		switch (Math.floor(Math.random() * 3)) {
			case 0 :
				return `Kurse`;
			case 1 :
				return `Theke`;
			case 2 :
				return `Shop`;
			default :
				throw new Error('error');
		}
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public getFreeclimberArticleId() : number {
		return Math.floor(Math.random() * 100);
	}
}

class RandomMemberValueUtils {
	// eslint-disable-next-line jsdoc/require-jsdoc
	public getFirstName() : string {
		const randomNr = Math.floor(Math.random() * 10);
		switch (Math.floor(Math.random() * 8)) {
			case 0 :
				return `Jan ${randomNr}`;
			case 1 :
				return `Miriam ${randomNr}`;
			case 2 :
				return `John ${randomNr}`;
			case 3 :
				return `Kendrick ${randomNr}`;
			case 4 :
				return `Amy ${randomNr}`;
			case 5 :
				return `Bob ${randomNr}`;
			case 6 :
				return `Rio ${randomNr}`;
			case 7 :
				return `Very long Edge Case Lorem Ipsum Foo Bar ${randomNr}`;
			default :
				throw new Error('error');
		}
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public getLastName() : string {
		switch (Math.floor(Math.random() * 7)) {
			case 0 :
				return `Delay`;
			case 1 :
				return `Makeba`;
			case 2 :
				return `Coltrain`;
			case 3 :
				return `Lamar`;
			case 4 :
				return `Winehouse`;
			case 5 :
				return `Marley`;
			case 6 :
				return `Reiser`;
			default :
				throw new Error('error');
		}
	}
}

class RandomSchedulingValueUtils extends RandomValueUtils {
	public shiftModel = new RandomShiftModelValueUtils();
	public member = new RandomMemberValueUtils();
}

const randomSchedulingValueUtils = new RandomSchedulingValueUtils();

class FakeSchedulingApiShiftModel extends SchedulingApiShiftModel {
	public override loadDetailed({success = null, error = null, searchParams = null} : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		error;searchParams;
		if (success) success(new HttpResponse<unknown>());
		return new Promise(() => new HttpResponse());
	}
}

class FakeSchedulingApiShiftModels extends SchedulingApiShiftModels {
	public override createNewItem(id ?: Id) : FakeSchedulingApiShiftModel {
		return super.createNewItem(id);
	}

	public override get groupByParentName() : FakeSchedulingApiShiftModels[] {
		const result : FakeSchedulingApiShiftModels[] = [];
		for (const item of this.iterable()) {
			const setWithThisParentName = result.find(resultItem => resultItem.get(0)!.parentName === item.parentName);
			if (setWithThisParentName) {
				setWithThisParentName.push(item);
			} else {
				const newSetOfShiftModels = new FakeSchedulingApiShiftModels(null, false);
				newSetOfShiftModels.push(item);
				result.push(newSetOfShiftModels);
			}
		}
		return result;
	}

	/**
	 * Filters a list of ShiftModels by a function that returns a boolean.
	 * Returns a new list of ShiftModels.
	 */
	public override filterBy( fn : (item : FakeSchedulingApiShiftModel) => boolean ) : FakeSchedulingApiShiftModels {
		const result = new FakeSchedulingApiShiftModels(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

class FakeSchedulingApiMember extends SchedulingApiMember {
	public override loadDetailed({success = null, error = null, searchParams = null} : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		error;searchParams;
		if (success) success(new HttpResponse<unknown>());
		return new Promise(() => new HttpResponse());
	}
}

class FakeSchedulingApiMembers extends SchedulingApiMembers {
	public override createNewItem(id ?: Id) : FakeSchedulingApiMember {
		return super.createNewItem(id);
	}
}

export class FakeSchedulingApiShift extends SchedulingApiShift {
	public override loadDetailed({success = null, error = null, searchParams = null} : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		error;searchParams;
		if (success) success(new HttpResponse<unknown>());
		return new Promise(() => new HttpResponse());
	}
}

export class FakeSchedulingApiShiftChangeSelector extends SchedulingApiShiftChangeSelector {
}

class FakeSchedulingApiShifts extends SchedulingApiShifts {
	public override createNewShift(
		shiftModel : SchedulingApiShiftModel,
		seriesStart : PMoment.Moment,
		_searchParams : HttpParams | null,
		success : (newShift : SchedulingApiShift) => void) : Promise<SchedulingApiShift> {
		const newShift = new FakeSchedulingApiShift(this.api as unknown as SchedulingApiServiceBase, randomSchedulingValueUtils.getRandomNumber(1, 99999));
		newShift.shiftModelId = shiftModel.id;
		newShift.start = seriesStart.valueOf();
		newShift.end = newShift.start + (1000 * 60 * 60 * 5);

		// const assignableMembers = new SchedulingApiShiftAssignedMemberIds(null, false);
		// assignableMembers.push(this.data.members.get(0).id);
		// newShift.assignedMemberIdsTestSetter = assignableMembers;

		newShift.copyCommonValues(shiftModel);

		// eslint-disable-next-line literal-blacklist/literal-blacklist
		newShift.description = 'Eine ganz besondere Schicht. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ';

		this.push(newShift);

		success(newShift);
		return Promise.resolve(newShift);
	}
}

export class FakeSchedulingApiRightGroup extends SchedulingApiRightGroup {
	public override loadDetailed({success = null, error = null, searchParams = null} : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		error;searchParams;
		if (success) success(new HttpResponse<unknown>());
		return new Promise(() => new HttpResponse());
	}
}

class FakeSchedulingApiAccountingPeriods extends SchedulingApiAccountingPeriods {
}

class FakeSchedulingApiAbsences extends SchedulingApiAbsences {
}

class FakeSchedulingApiBookings extends SchedulingApiBookings {
}

class FakeSchedulingApiTransactions extends SchedulingApiTransactions {
}

class FakeSchedulingApiRightGroups extends SchedulingApiRightGroups {
	public override createNewItem(id ?: Id) : SchedulingApiRightGroup {
		const newItem = new FakeSchedulingApiRightGroup(this.api as unknown as SchedulingApiServiceBase, id);
		newItem.name = `Rechtegruppe ${randomSchedulingValueUtils.getRandomNumber(1, 99999)}`;
		newItem.role = SchedulingApiRightGroupRole.CLIENT_DEFAULT;

		const shiftModelRight = newItem.shiftModelRights.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
		shiftModelRight.canRead = true;
		shiftModelRight.canWrite = true;
		shiftModelRight.canWriteBookings = true;
		shiftModelRight.canGetManagerNotifications = true;
		shiftModelRight.shiftModelId = Id.create(1231231237777);

		this.push(newItem);
		return newItem;
	}
}

class FakeSchedulingApiRoot {
	public shifts ! : FakeSchedulingApiShifts;
	public shiftChangeSelector ! : FakeSchedulingApiShiftChangeSelector;
	public shiftModels ! : FakeSchedulingApiShiftModels;
	public members ! : FakeSchedulingApiMembers;
	public notificationsConf ! : SchedulingApiNotificationsConf;
	public api ! : SchedulingApiServiceBase;
	public rightGroups ! : FakeSchedulingApiRightGroups;
	public accountingPeriods ! : FakeSchedulingApiAccountingPeriods;
	public absences ! : FakeSchedulingApiAbsences;
	public bookings ! : FakeSchedulingApiBookings;
	public transactions ! : FakeSchedulingApiTransactions;

	constructor(api : SchedulingApiServiceBase) {
		this.api = api;
		this.initValues();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.initNotificationsConf();
		this.initMembers();
		this.initShiftModels();
		this.initShifts();
		this.initShiftChangeSelector();
		this.initRightGroups();
		this.initAccountingPeriods();
		this.initAbsences();
		this.initBookings();
		this.initTransactions();
	}

	private initNotificationsConf() : void {
		this.notificationsConf = new SchedulingApiNotificationsConf(null, 1);
	}

	private initMember(firstName : string, lastName : string) : void {
		const member = this.members.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
		member.firstName = firstName;
		member.lastName = lastName;
	}

	private initMembers() : void {
		this.members = new FakeSchedulingApiMembers(this.api, false);
		this.initMember('Nils', 'Karlsson');
		this.initMember('Milad', 'Sadinam');
		this.initMember('Mui', 'Sadinam');
		this.initMember('Masoud', 'Sadinam');
		for (const ITEM of [1, 2, 3, 4, 5, 6, 7, 8]) {
			this.initMember(
				randomSchedulingValueUtils.member.getFirstName(),
				randomSchedulingValueUtils.member.getLastName(),
			);
		}
	}

	private initShiftModelPacketRepetition(packetRepetition : SchedulingApiShiftModelRepetitionPacket) : void {
		const randomNumber = randomSchedulingValueUtils.getRandomNumber(1, 2);
		switch (randomNumber) {
			case 1:
				packetRepetition.type = SchedulingApiShiftRepetitionType.EVERY_X_YEARS;
				packetRepetition.x = 1;
				break;
			case 2:
				packetRepetition.type = SchedulingApiShiftRepetitionType.NONE;
				break;
			default:
				throw new Error(`Unexpected number ${randomNumber}`);

		}
	}

	private initShiftModel(id ?: Id) : FakeSchedulingApiShiftModel {
		const shiftModel = this.shiftModels.createNewItem(id ?? Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
		shiftModel.color = randomSchedulingValueUtils.shiftModel.getColor();
		shiftModel.name = randomSchedulingValueUtils.shiftModel.getName();
		shiftModel.parentName = randomSchedulingValueUtils.shiftModel.getParentName();
		shiftModel.isCourse = true;
		this.initShiftModelPacketRepetition(shiftModel.repetition.packetRepetition);
		shiftModel.courseType = SchedulingApiCourseType.ONLINE_INQUIRY;
		shiftModel.freeclimberArticleId = randomSchedulingValueUtils.shiftModel.getFreeclimberArticleId();
		return shiftModel;
	}

	private initShiftModels() : void {
		this.shiftModels = new FakeSchedulingApiShiftModels(this.api, false);
		this.initShiftModel(Id.create(1231231237777));
		const shiftModel1 = this.initShiftModel();
		shiftModel1.courseType = SchedulingApiCourseType.ONLINE_BOOKABLE;
		const shiftModel2 = this.initShiftModel();
		shiftModel2.courseType = SchedulingApiCourseType.ONLINE_INQUIRY;
		this.initShiftModel();
		this.initShiftModel();
		this.initShiftModel();
		this.initShiftModel();
		this.initShiftModel();
		this.initShiftModel();
		this.initShiftModel();
		this.initShiftModel();
		this.initShiftModel();
		this.initShiftModel();
	}

	private initShifts() : void {
		this.shifts = new FakeSchedulingApiShifts(this.api, false);

		for (const shiftModel of this.shiftModels.iterable()) {
			const randomNr = randomSchedulingValueUtils.getRandomNumber(10, 60);
			for (let i = 0; i < randomNr; i++) {
				this.initShift(shiftModel);
			}
		}
	}

	private initShiftChangeSelector() : void {
		this.shiftChangeSelector = new FakeSchedulingApiShiftChangeSelector(this.api);
	}

	private initShift(shiftModel : FakeSchedulingApiShiftModel) : void {
		const randomHours = randomSchedulingValueUtils.getRandomNumber(0, 23);
		const randomDays = randomSchedulingValueUtils.getRandomNumber(0, 40);
		this.shifts.createNewShift(
			shiftModel,
			new PMomentService(PSupportedLocaleIds.de_DE).m().set('seconds', 0).set('minutes', 0).set('hours', randomHours).add(randomDays, 'day'),
			null,
			(_newShift) => {
				// newShift.model.courseType;
			},
		);
	}

	private initBookings() : void {
		this.bookings = new FakeSchedulingApiBookings(this.api, false);
		this.initBooking();
		this.initBooking();
		this.initBooking();
		this.initBooking();
		this.initBooking();
		this.initBooking();
	}

	private initBooking() : void {
		const booking = this.bookings.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
		const shift = this.shifts.get(randomSchedulingValueUtils.getRandomNumber(1, this.shifts.length - 1));
		if (!shift) throw new Error('No Shift available');
		booking.courseSelector = shift.id;
		assumeDefinedToGetStrictNullChecksRunning(shift.shiftModelId, 'shift.shiftModelId');
		booking.shiftModelId = shift.shiftModelId;
		booking.state = SchedulingApiBookingState.BOOKED;
		const price = randomSchedulingValueUtils.getRandomNumber(100, 300);
		booking.currentlyPaidTestSetter = price / 3 * 2;
		booking.participantCount = randomSchedulingValueUtils.getRandomNumber(1, 24);

		const bookingPerson = this.members.get(randomSchedulingValueUtils.getRandomNumber(1, this.members.length - 1));
		if (!bookingPerson) throw new Error('No bookingPerson available');
		booking.firstName = bookingPerson.firstName;
		booking.lastName = bookingPerson.lastName;
		booking.bookingComment = randomSchedulingValueUtils.getRandomBoolean() ? 'Hallo Welt' : null;
		booking.ownerComment = randomSchedulingValueUtils.getRandomBoolean() ? 'Hallo Universum' : null;

		booking.bookingNumberTestSetter = randomSchedulingValueUtils.getRandomNumber(13001, 23023);
		booking.dateOfBookingTestSetter = Date.now();
		booking.firstShiftStartTestSetter = Date.now();
	}

	private initTransactions() : void {
		this.transactions = new FakeSchedulingApiTransactions(this.api, false);
		this.initTransaction();
		this.initTransaction();
		this.initTransaction();
		this.initTransaction();
		this.initTransaction();
		this.initTransaction();
	}

	private initTransaction() : void {
		const transaction = this.transactions.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
		transaction.absAmount = randomSchedulingValueUtils.getRandomNumber(1, 999);
		transaction.balanceTestSetter = randomSchedulingValueUtils.getRandomNumber(1, 100);
		transaction.bankAccountHintTestSetter = 'bankAccountHint';
		transaction.bankDescriptionTestSetter = 'Foo-Bank';

		const booking = this.bookings.get(randomSchedulingValueUtils.getRandomNumber(1, this.bookings.length - 1));
		if (!booking) throw new Error('No booking available');
		transaction.bookingId = booking.id;
		transaction.bookingNumberTestSetter = randomSchedulingValueUtils.getRandomNumber(1, 99999);

		const member1 = this.members.get(randomSchedulingValueUtils.getRandomNumber(1, this.members.length - 1));
		if (!member1) throw new Error('No member1 available');
		transaction.creatorIdTestSetter = member1.id;
		transaction.dateTimeTestSetter = Date.now();
		transaction.drPlanoFeeNetTestSetter = transaction.amount! / 100 * 0.5;
		transaction.miscPaymentMethodName = 'paymentMethodName';
		transaction.offerNameTestSetter = 'offerName';

		const typeKey = randomSchedulingValueUtils.getRandomNumber(
			0, Object.keys(SchedulingApiTransactionPaymentMethodType).length,
		);
		transaction.paymentMethodType = SchedulingApiTransactionPaymentMethodType[
			SchedulingApiTransactionPaymentMethodType[typeKey] as keyof typeof SchedulingApiTransactionPaymentMethodType
		];

		transaction.referencedPersonTestSetter = 'referenced Person';

		const shiftModel = this.shiftModels.get(randomSchedulingValueUtils.getRandomNumber(1, this.shiftModels.length - 1));
		if (!shiftModel) throw new Error('No shiftModel available');
		transaction.shiftModelIdTestSetter = shiftModel.id;
		if (transaction.amount! > 0) {
			transaction.type = SchedulingApiTransactionType.PAYMENT;
		} else if (transaction.amount! < 0) {
			transaction.type = SchedulingApiTransactionType.REFUND;
		} else {
			transaction.type = SchedulingApiTransactionType.PAYMENT_FAILED;
		}
		// transaction.voucherId = SchedulingApiTransactionType.PAYMENT;
	}

	private initRightGroups() : void {
		this.rightGroups = new FakeSchedulingApiRightGroups(this.api, false);
		this.rightGroups.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
		this.rightGroups.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
		this.rightGroups.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
	}

	private initAccountingPeriods() : void {
		this.accountingPeriods = new FakeSchedulingApiAccountingPeriods(this.api, false);
		this.accountingPeriods.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
	}

	private initAbsences() : void {
		this.absences = new FakeSchedulingApiAbsences(this.api, false);
		const newAbsence = this.absences.createNewItem(Id.create(randomSchedulingValueUtils.getRandomNumber(1, 99999)));
		const newTime = new SchedulingApiAbsenceTime(null, undefined);
		const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
		const dayStart = +pMoment.m().startOf('day');
		newTime.start = dayStart;
		newAbsence.timeTestSetter = newTime;
	}
}

@Injectable()
export class FakeSchedulingApiService { // extends SchedulingApiServiceBase // extends SchedulingApiService

	// constructor(
	// 	private httpClientTestingModule : HttpClientTestingModule,
	// 	public router : Router,
	// 	private apiErrorService : ApiErrorService,
	// 	private ngZone : NgZone,
	// ) {
	// 	super((httpClientTestingModule as HttpClient), router, apiErrorService, ngZone);
	// }

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public consts : { SHIFT_ASSIGNABLE_MEMBERS : SchedulingApiShiftAssignableMember[] } = {
		SHIFT_ASSIGNABLE_MEMBERS: [],
	};

	constructor( /* http : HttpClient, router : Router, apiError : ApiErrorService, zone : NgZone*/ ) {
		// super(http, router, apiError, zone);
		this.data = new FakeSchedulingApiRoot(this as unknown as SchedulingApiServiceBase);
	}

	public validators : ValidatorsService = new ValidatorsService();
	public readonly onDataLoaded : ApiBase['onDataLoaded'] = new Subject<void>();

	public rightsService = {
		requesterIs: (_input : AuthenticatedApiRole) => {
			return true;
		},
		isMe: (_input : SchedulingApiMember) => {
			return true;
		},
	};

	// eslint-disable-next-line jsdoc/require-jsdoc
	public getLastLoadSearchParams() : HttpParams {
		return new HttpParams();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public changed(_change : string) : void {

	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isLoaded() : boolean {
		return true;
	}

	private _hasDataCopy : boolean = false;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public hasDataCopy() : boolean {
		return this._hasDataCopy;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public createDataCopy() : void {
		// eslint-disable-next-line no-console
		console.debug('Fake createDataCopy()');
		this._hasDataCopy = true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public dismissDataCopy() : void {
		// eslint-disable-next-line no-console
		console.debug('Fake dismissDataCopy()');
		this._hasDataCopy = false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public mergeDataCopy() : void {
		// eslint-disable-next-line no-console
		console.debug('Fake mergeDataCopy()');
		this._hasDataCopy = false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public save({
		success = null,
	} : ApiSaveArgs = {}) : void {
		// eslint-disable-next-line no-console
		console.log('Fake save()');
		if (success) success(new HttpResponse({ status: 200, statusText: 'FooBar' }), false);
		this._hasDataCopy = false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public hasDataCopyChanged() : boolean {
		return true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public load({ success = null } : ApiLoadArgs = {}) : void {
		// eslint-disable-next-line no-console
		console.log('Fake load()');
		if (success) success(new HttpResponse());
	}

	public data ! : FakeSchedulingApiRoot;

	/**
	 * One method to rule them all
	 */
	public deselectAllSelections() : void {
		this.data.shiftModels.selectedItems.setSelected(false);
		this.data.shifts.selectedItems.setSelected(false);
		this.data.shiftModels.setSelected(false);
		this.data.members.setSelected(false);
		// this.data.assignmentProcesses.setSelected(false);
	}
}
