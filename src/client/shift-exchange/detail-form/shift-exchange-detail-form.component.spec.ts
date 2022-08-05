import { SchedulingApiShiftExchange, SchedulingApiShiftExchangeCommunication, SchedulingApiShiftExchangeCommunications } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiShiftExchangeState, SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeCommunicationAction } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ShiftExchangeDetailFormComponent } from './shift-exchange-detail-form.component';

describe('ShiftExchangeDetailFormComponent #needsapi', () => {
	let component : ShiftExchangeDetailFormComponent;
	const testingUtils = new TestingUtils();
	let me : MeService;

	testingUtils.init({ imports : [] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				me = testingUtils.getService(MeService);
				component = testingUtils.createComponent(ShiftExchangeDetailFormComponent);
				done();
			},
		});
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('.formIsDisabled', () => {
		it('should be true if shiftExchange is closed', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.CLOSED_MANUALLY;

			component.item = shiftExchange;
			expect(component.formIsDisabled).toBeTruthy();
		});
	});
	describe('.formIsDisabledForMember(id)', () => {
		it('should be false if user is the indisposedMember and the shiftExchange is not new', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.ACTIVE;
			component.item = shiftExchange;
			const member = new SchedulingApiMember(null, 4);
			component.item.indisposedMemberId = member.id;
			const result = component.formIsDisabledForMember(member.id);
			expect(result).toBeFalsy();
		});
		it('should be false if user is the indisposedMember and the shiftExchange is unconfirmed', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION;
			component.item = shiftExchange;
			const member = new SchedulingApiMember(null, 4);
			component.item.indisposedMemberId = member.id;
			expect(component.formIsDisabledForMember(member.id)).toBeFalsy();
		});
		it('should be true if user is the indisposedMember and the shiftExchange is confirmed', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.ILLNESS_ACCEPT_WITHOUT_SHIFT_EXCHANGE;
			component.item = shiftExchange;
			const member = new SchedulingApiMember(null, 4);
			component.item.indisposedMemberId = member.id;
			expect(component.formIsDisabledForMember(member.id)).toBeTruthy();
		});
		it('should be true if user is NOT the indisposedMember and the shiftExchange is not new', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.ACTIVE;
			component.item = shiftExchange;
			const member = new SchedulingApiMember(null, 4);
			component.item.indisposedMemberId = member.id;
			expect(component.formIsDisabledForMember((new SchedulingApiMember(null, 5)).id)).toBeTruthy();
		});
	});

	describe('.generateAbsencesIsPossible', () => {
		it('should be false if shiftExchange is a confirmed illness', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.isIllness = true;
			shiftExchange.shiftRefs.push(new SchedulingApiShiftExchangeShiftRef(null, 4000));
			shiftExchange.shiftRefs.push(new SchedulingApiShiftExchangeShiftRef(null, 4001));

			const managerResponseCommunication = new SchedulingApiShiftExchangeCommunication(null);
			const actionEnum = SchedulingApiShiftExchangeCommunicationAction;
			managerResponseCommunication.lastAction = actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE;

			const confirmations = new SchedulingApiShiftExchangeCommunications(null, false);
			confirmations.push(managerResponseCommunication);
			shiftExchange.communicationsTestSetter = confirmations;
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.ACTIVE;

			component.item = shiftExchange;
			expect(component.generateAbsencesIsPossible).toBeFalsy();
		});
	});
	describe('.generateShiftExchangesIsPossible', () => {
		let shiftExchange : SchedulingApiShiftExchange;

		beforeEach(() => {
			shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.isIllness = true;

			const shiftRef1 = new SchedulingApiShiftExchangeShiftRef(null, 4000);
			const shiftRef2 = new SchedulingApiShiftExchangeShiftRef(null, 4000);
			shiftExchange.shiftRefs.push(shiftRef1);
			shiftExchange.shiftRefs.push(shiftRef2);
		});

		it('should be true if shiftExchange reported by IM', () => {
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.ACTIVE;

			component.item = shiftExchange;
			expect(component.generateShiftExchangesIsPossible).toBeTruthy();
		});

		it('should be false if shiftExchange is a confirmed illness', () => {
			const managerResponseCommunication = new SchedulingApiShiftExchangeCommunication(null);
			const actionEnum = SchedulingApiShiftExchangeCommunicationAction;
			managerResponseCommunication.lastAction = actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE;

			const confirmations = new SchedulingApiShiftExchangeCommunications(null, false);
			confirmations.push(managerResponseCommunication);
			shiftExchange.communicationsTestSetter = confirmations;
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.ACTIVE;

			component.item = shiftExchange;
			expect(component.generateShiftExchangesIsPossible).toBeFalsy();
		});
		it('should be false if shiftExchange is a illness reported by admin', () => {
			const managerResponseCommunication = new SchedulingApiShiftExchangeCommunication(null);
			const actionEnum = SchedulingApiShiftExchangeCommunicationAction;
			managerResponseCommunication.lastAction = actionEnum.A_REPORTED_ILLNESS;

			const confirmations = new SchedulingApiShiftExchangeCommunications(null, false);
			confirmations.push(managerResponseCommunication);
			shiftExchange.communicationsTestSetter = confirmations;
			shiftExchange.stateTestSetter = SchedulingApiShiftExchangeState.ACTIVE;

			component.item = shiftExchange;
			expect(component.generateShiftExchangesIsPossible).toBeFalsy();
		});
	});

	describe('.showIndisposedMemberCommentInMainForm', () => {
		it('should be true if isNewItem and not an illness', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null);
			shiftExchange.indisposedMemberId = me.data.id;
			shiftExchange.isIllness = false;
			component.item = shiftExchange;
			expect(component.showIndisposedMemberCommentInMainForm).toBeTruthy();
		});
		it('should be false if creater is admin or manager', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.indisposedMemberId = me.data.id;
			component.item = shiftExchange;
			expect(component.showIndisposedMemberCommentInMainForm).toBeFalsy();
		});
		describe('owner creates non-illness, leaves comment and then owner looks at created entry comment', () => {
			it('comment should be visible', () => {
				const shiftExchange = new SchedulingApiShiftExchange(null, 3);
				shiftExchange.indisposedMemberId = me.data.id;
				shiftExchange.isIllness = false;
				shiftExchange.indisposedMemberComment = 'Hello World';
				component.item = shiftExchange;
				expect(component.showIndisposedMemberCommentInMainForm).toBeTruthy();
			});
		});
	});
});
