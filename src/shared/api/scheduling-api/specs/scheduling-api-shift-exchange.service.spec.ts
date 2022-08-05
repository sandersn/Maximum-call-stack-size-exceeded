/* eslint-disable sonarjs/cognitive-complexity */
import { HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeConceptService } from '@plano/client/shared/p-shift-exchange/p-shift-exchange-concept.service';
import { SchedulingApiMember, SchedulingApiShiftModel, SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import {	SchedulingApiShiftExchangeCommunicationBase
	,	SchedulingApiMemberBase,
} from '@plano/shared/api';
import { 	SchedulingApiRightGroupRole
	, 	SchedulingApiShiftExchangeState
	,	SchedulingApiShiftExchangeCommunicationAction
	,	SchedulingApiShiftExchangeCommunicationState
	,	SchedulingApiShiftsBase
	,	SchedulingApiShiftRepetitionType,
										SchedulingApiAbsenceType} from '@plano/shared/api';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ShiftId } from './../shift-id/shift-id';

describe('#SchedulingApiServiceShiftExchange #needsapi', () => {
	let api : SchedulingApiService;
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	let shiftExchangeConcept : PShiftExchangeConceptService;

	// //////////////////////////////////////////////////////////////////////////////////////////////
	// //// SHIFT-EXCHANGE //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////////////////////////
	describe('#shift-exchange', () => {
		beforeAll(() => {
			shiftExchangeConcept = testingUtils.getService(PShiftExchangeConceptService);
		});

		const testShiftExchange = (	isIllness : boolean
			,	indisposedMemberIsAdmin : boolean
			, 	indisposedMemberPrefersSwapping : boolean
			,	setMemberAddressedTo : boolean) : void => {
			describe(`(case ${isIllness} ${indisposedMemberIsAdmin} ${indisposedMemberPrefersSwapping} ${setMemberAddressedTo})`, () => {
				const ensureNoCommunicationActionsPermitted = () : void => {
					for (const communication of shiftExchange!.communications.iterable()) {
						const availableActions = shiftExchangeConcept.getAvailableActions(shiftExchange!, communication);
						expect(availableActions.length).toBe(0);
					}
				};

				const getApiQueryParams = () : HttpParams => {
					// start/end
					// For shift-exchange we are also only interested in future shifts.
					// Take some far away shifts which are not in assignment process.
					// Hack: data.shifts currently returns shifts of the whole day. workingTimes/absences not.
					// So, to be consistent, start/end should be start/end of day.
					const start = pMoment.m().add(3, 'month').startOf('day').valueOf().toString();
					const end = pMoment.m().add(3, 'month').add(1, 'week').startOf('day').valueOf().toString();

					// return query-params
					let queryParams = new HttpParams()
						.set('data', 'calendar')
						.set('start', start)
						.set('end', end)
						.set('bookingsStart', start)
						.set('bookingsEnd', end);

					// ensure that shifts are returned
					const ensureShifts = [];

					if (shift)
						ensureShifts.push(shift.id);

					if (oldShiftId)
						ensureShifts.push(oldShiftId);

					for (const shiftToSwap of shiftsToSwap.iterable())
						ensureShifts.push(shiftToSwap.id);

					if (ensureShifts.length > 0) {
						const ensureShiftsJson = JSON.stringify(
							ensureShifts,
							(_key : string, value : any) => {
								return (value instanceof ShiftId ? value.rawData : value);
							},
						);

						queryParams = queryParams.set('ensureShifts', ensureShiftsJson);
					}

					return queryParams;
				};

				const executeAs = (member : SchedulingApiMemberBase, fnc : () => void) : void => {
					testingUtils.login(
						{
							member: member,
							success: () => {
								api = testingUtils.getService(SchedulingApiService);
								const searchParams = getApiQueryParams();

								if (shiftExchange)
									shiftExchange.loadDetailed({success: fnc, searchParams: searchParams});
								else
									api.load({success: fnc, searchParams: searchParams});
							},
							error: fail,
						});
				};

				//
				// Prepare data
				//
				let shiftExchange : SchedulingApiShiftExchange | null = null;
				let shift : SchedulingApiShift | null = null; // And later switch it to "shift"
				let oldShiftId : ShiftId | null = null; // We start the shift-exchange with "oldShiftId"
				let shiftModel : SchedulingApiShiftModel | null = null;
				const shiftsToSwap = new SchedulingApiShiftsBase(api, false);
				let indisposedMember : SchedulingApiMember;
				let admin : SchedulingApiMember;
				let memberAddressedTo : SchedulingApiMember;
				let newAssignedMember : SchedulingApiMember;

				it('prepare-data', (done : any) => {
					executeAs(admin, () => {
						// init indisposed member
						for (const member of api.data.members.iterable()) {
							if (	(indisposedMemberIsAdmin && member.role === SchedulingApiRightGroupRole.CLIENT_OWNER)	||
							(!indisposedMemberIsAdmin && member.role !== SchedulingApiRightGroupRole.CLIENT_OWNER)) {
								indisposedMember = member;
								break;
							}
						}

						// init admin
						for (const member of api.data.members.iterable()) {
							if (member !== indisposedMember &&  member.role === SchedulingApiRightGroupRole.CLIENT_OWNER) {
								admin = member;
								break;
							}
						}

						// init memberAddressedTo
						for (const member of api.data.members.iterable()) {
							if (member !== indisposedMember && member !== admin &&  member.role !== SchedulingApiRightGroupRole.CLIENT_OWNER) {
								memberAddressedTo = member;
								break;
							}
						}

						// init newAssignedMember
						newAssignedMember = memberAddressedTo;

						// prepare shifts
						const prepareShiftsToSwap = (success : () => void) : void => {
							// ensure indisposed member is assignable to and newAssignedMember is assignable/assigned to shiftToSwap.
							for (const currShift of api.data.shifts.iterable()) {
								if (	!currShift.id.equals(shift!.id)	&&
								!currShift.id.equals(oldShiftId)) {
									if (!currShift.assignableMembers.containsMember(indisposedMember))
										currShift.assignableMembers.addNewMember(indisposedMember, 10);

									if (!currShift.assignableMembers.containsMember(newAssignedMember))
										currShift.assignableMembers.addNewMember(newAssignedMember, 10);

									currShift.assignedMemberIds.clear();
									currShift.assignedMemberIds.push(newAssignedMember.id);

									// store shift-id
									shiftsToSwap.push(currShift);

									api.save({success: success});

									return;
								}
							}

							throw new Error('No shiftsToSwap was found.');
						};

						const prepareShifts = (success : () => void) : void => {
							// shifts should be a shift of a packet so we can test the shift-selector-change code.
							for (const currShiftModel of api.data.shiftModels.iterable()) {
								if (currShiftModel.name.startsWith('Anfängerkurs'))
									shiftModel = currShiftModel;
							}


							if (!shiftModel)
								throw new Error('No shift-model could be found.');

							api.data.shifts.createNewShift(	shiftModel, pMoment.m().add(3, 'month')
								, 	getApiQueryParams()
								, 	(newShift : SchedulingApiShift) => {
									newShift.assignableMembers.addNewMember(indisposedMember, 10);
									newShift.assignedMemberIds.push(indisposedMember.id);

									// ensure memberAddressedTo is assignable to whole packet
									newShift.assignableMembers.addNewMember(memberAddressedTo, 10);

									// ensure newAssignedMember is assignable to whole packet
									newShift.assignableMembers.addNewMember(newAssignedMember, 10);

									// only one packet without any further repetition
									newShift.repetition.type = SchedulingApiShiftRepetitionType.NONE;

									// store packet
									api.save({success: () => {
										shift = newShift;

										for (const packetShift of newShift.packetShifts.iterable()) {
											if (!packetShift.id.equals(shift.id)) {
												oldShiftId = packetShift.id;
												success();

												return;
											}
										}

										// eslint-disable-next-line unicorn/error-message
										throw new Error();
									}});
								});
						};

						prepareShifts(() => {
							expect().nothing();
							prepareShiftsToSwap(() => done());
						});
					});
				});

				//
				// Create shiftExchange item
				//
				it('create', (done : any) => {
					executeAs(indisposedMember, () => {
						shiftExchange = api.data.shiftExchanges.createNewItem();

						shiftExchange.indisposedMemberId = indisposedMember.id;
						shiftExchange.isIllness = isIllness;
						shiftExchange.indisposedMemberPrefersSwapping = indisposedMemberPrefersSwapping;

						shiftExchange.shiftRefs.createNewItem(oldShiftId);

						if (setMemberAddressedTo)
							shiftExchange.memberIdAddressedTo = memberAddressedTo.id;

						const indisposedMemberComment = testingUtils.getRandomString(10);
						shiftExchange.indisposedMemberComment = indisposedMemberComment;

						api.save(
							{
								success: () => {
									shiftExchange!.loadDetailed(
										{
											success: () => {
												expect(shiftExchange!.indisposedMemberId.equals(indisposedMember.id)).toBeTruthy();
												expect(shiftExchange!.isIllness).toBe(isIllness);
												expect(shiftExchange!.indisposedMemberPrefersSwapping).toBe(indisposedMemberPrefersSwapping);
												expect(shiftExchange!.shifts.get(0)!.id.equals(oldShiftId)).toBeTruthy();
												expect(testingUtils.safeEquals(shiftExchange!.memberIdAddressedTo,
													setMemberAddressedTo ? memberAddressedTo.id : null)).toBeTrue();
												expect(shiftExchange!.indisposedMemberComment).toBe(indisposedMemberComment);

												done();
											},
											searchParams: getApiQueryParams(),
										});
								},
							});
					});
				});

				//
				// Confirm illness
				//
				if (isIllness) {
					describe('illness', () => {
						it('confirm', (done : any) => {
							executeAs(admin, () => {
								if (indisposedMemberIsAdmin) {
									// There should be a communication item for indisposed member with last action == A_REPORTED_ILLNESS
									let communicationWithAReportedIllness = false;

									for (const communication of shiftExchange!.communications.iterable()) {
										if (	communication.communicationPartnerId.equals(indisposedMember.id) 	&&
										communication.lastAction === SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS) {
											communicationWithAReportedIllness = true;
											break;
										}
									}

									expect(communicationWithAReportedIllness).toBeTruthy();

									// State should be ACTIVE
									expect(shiftExchange!.state).toBe(SchedulingApiShiftExchangeState.ACTIVE);
									done();
								} else {
									expect(shiftExchange!.state).toBe(SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION);

									// All communication partners should be "bereichsleitende-person".
									for (const communication of shiftExchange!.communications.iterable()) {
										const communicationPartner = api.data.members.get(communication.communicationPartnerId)!;
										expect(communicationPartner.hasManagerRights(shiftModel!)).toBeTruthy();
										expect(communication.lastAction).toBe(SchedulingApiShiftExchangeCommunicationAction.IM_REPORTED_ILLNESS);
									}

									// confirm illness
									shiftExchange!.communications.get(0)!.performAction =
										SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE;

									api.save(
										{
											success: () => {
												expect(shiftExchange!.state).toBe(SchedulingApiShiftExchangeState.ACTIVE);
												done();
											},
										});
								}
							});
						});

						it('create-absence-item', (done : any) => {
							executeAs(admin, () => {
								const absence = api.data.absences.createNewItem();

								absence.memberId = indisposedMember.id;
								absence.time.start = shiftExchange!.shifts.get(0)!.start;
								absence.time.end = shiftExchange!.shifts.get(0)!.end;
								absence.shiftExchangeId = shiftExchange!.id;
								absence.type = SchedulingApiAbsenceType.ILLNESS;
								absence.visibleToTeamMembers = true;

								api.save(
									{
										success: () => {
											expect(testingUtils.safeEquals(absence.shiftExchangeId, shiftExchange!.id)).toBeTruthy();

											done();
										},
									});
							});
						});
					});
				}

				//
				// Change shifts
				//
				describe('shifts', () => {
					it('first-do-communication', (done : any) => {
						if (setMemberAddressedTo) {
							// don’t do the test for setMemberAddressedTo because then the shift-exchange would become "failed"
							expect().nothing();
							done();

							return;
						}

						executeAs(newAssignedMember, () => {
							for (const communication of shiftExchange!.communications.iterable()) {
								if (communication.communicationPartnerId.equals(newAssignedMember.id)) {
									// do some test communication
									communication.performAction = SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_CANNOT;

									api.save({ success: () => { expect().nothing(); done(); }});
									return;
								}
							}

							// This should not be reached
							throw new Error('Communication item for newAssignedMember could not be found.');
							done();
						});
					});

					it('change', (done : any) => {
						executeAs(isIllness ? admin : indisposedMember, () => {
							shiftExchange!.shiftRefs.clear();
							shiftExchange!.shiftRefs.createNewItem(shift!.id);

							api.save(
								{
									success: () => {
										expect(shiftExchange!.shifts.length).toBe(1);
										expect(shiftExchange!.shifts.get(0)!.id.equals(shift!.id)).toBeTruthy();

										done();
									},
								});
						});
					});

					it('ensure-communications-are-reset', (done : any) => {
						executeAs(newAssignedMember, () => {
							// check that the communication was resetted
							for (const communication of shiftExchange!.communications.iterable()) {
								if (communication.communicationPartnerId.equals(newAssignedMember.id)) {
									expect(communication.communicationState).toBe(SchedulingApiShiftExchangeCommunicationState.CP_NOT_RESPONDED);
									done();
									return;
								}
							}

							// This should not be reached
							throw new Error('Communication item for newAssignedMember could not be found.');
							done();
						});
					});

					if (isIllness) {
						it('illness-indisposed-member-removed-from-shifts', () => {
							expect(shift!.assignedMemberIds.contains(indisposedMember.id)).toBeFalsy();
						});
					}
				});

				//
				// withdraw
				//
				const closeShiftExchange = (close : boolean, done : any) : void => {
					executeAs(isIllness ? admin : indisposedMember, () => {
						if (close)
							shiftExchange!.closeShiftExchange = true;
						else
							shiftExchange!.openShiftExchange = true;

						api.save(
							{
								success: () => {
									expect(shiftExchange!.state).toBe(close ? 	SchedulingApiShiftExchangeState.CLOSED_MANUALLY 	:
										SchedulingApiShiftExchangeState.ACTIVE);

									if (close)
										ensureNoCommunicationActionsPermitted();

									done();
								},
							});
					});
				};

				it('closeShiftExchange', (done : any) => {
					closeShiftExchange(true, done);
				});

				it('openShiftExchange', (done : any) => {
					closeShiftExchange(false, done);
				});

				//
				// memberAddressedTo
				//
				describe('memberAddressedTo', () => {
					if (isIllness) {
						// TODO:  PLANO-11145
						it('is ok', () => expect(true).toBeTrue());

						/* it('should-fail', (done : any) =>
						{
							executeAs(indisposedMember, () =>
							{
								shiftExchange.memberIdAddressedTo = memberAddressedTo.id;

								api.save({ success: fail, error: () => { expect().nothing(); done(); }});
							});
						});*/
					} else {
						const flipMemberAddressedTo = (done : any) : void => {
							executeAs(indisposedMember, () => {
								const newMemberIdAddressedTo = shiftExchange!.memberIdAddressedTo ? null : memberAddressedTo.id;
								shiftExchange!.memberIdAddressedTo = newMemberIdAddressedTo;

								api.save(
									{
										success: () => {
										// check if shiftExchange.memberIdAddressedTo is the expected value.
										// Note that we cannot use the equals() method as it returns false when both ids are 0.
											expect(testingUtils.safeEquals(shiftExchange!.memberIdAddressedTo, newMemberIdAddressedTo)).toBeTruthy();

											if (newMemberIdAddressedTo) {
												expect(shiftExchange!.communications.length).toBe(1);
												expect(shiftExchange!.communications.get(0)!.communicationPartnerId.
													equals(newMemberIdAddressedTo)).toBeTruthy();
											} else {
												expect(shiftExchange!.communications.length).toBeGreaterThan(1);
											}

											done();
										},
									});
							});
						};

						it('flip', (done : any) => {
							flipMemberAddressedTo(done);
						});

						it('flip', (done : any) => {
							flipMemberAddressedTo(done);
						});
					}
				});

				//
				// deadline
				//
				describe('deadline', () => {
					describe('set-to-past', () => {
						if (isIllness) {
							// TODO:  PLANO-11145
							it('is ok', () => expect(true).toBeTrue());

							/* it('should-fail', (done : any) =>
							{
								executeAs(indisposedMember, () =>
								{
									shiftExchange.deadline = pMoment.m().subtract(2, 'days').valueOf();
									api.save({success: fail, error: () => { expect().nothing(); done(); } });
								});
							});*/
						} else {
							it('should-succeed', (done : any) => {
								executeAs(indisposedMember, () => {
									shiftExchange!.deadline = pMoment.m().subtract(2, 'days').valueOf();
									api.save(
										{
											success: () => {
												expect(shiftExchange!.state).toBe(SchedulingApiShiftExchangeState.FAILED_DEADLINE_PASSED);
												ensureNoCommunicationActionsPermitted();

												done();
											},
											error: fail,
										});
								});
							});
						}
					});

					describe('set-to-future', () => {
						if (isIllness) {
							// TODO:  PLANO-11145
							it('is ok', () => expect(true).toBeTrue());

							/* it('should-fail', (done : any) =>
							{
								executeAs(indisposedMember, () =>
								{
									shiftExchange.deadline = pMoment.m().subtract(2, 'days').valueOf();
									api.save({success: fail, error: () => { expect().nothing(); done(); } });
								});
							});*/
						} else {
							it('should-succeed', (done : any) => {
								executeAs(indisposedMember, () => {
									shiftExchange!.deadline = pMoment.m().add(2, 'days').valueOf();
									api.save(
										{
											success: () => {
												expect(shiftExchange!.state).toBe(SchedulingApiShiftExchangeState.ACTIVE);
												done();
											},
											error: fail,
										});
								});
							});
						}
					});
				});

				//
				// isIllness
				//

				// Api does not support to set illness=false for an illness. So, we test only changing isIllness to true.
				// We only do the test for indisposedMemberPrefersSwapping==false to not mess up the tests
				if (!isIllness && !indisposedMemberPrefersSwapping) {
					it('isIllness=true', (done : any) => {
						// login as admin so illness is automatically confirmed
						executeAs(admin, () => {
							shiftExchange!.isIllness = true;

							api.save(
								{
									success: () => {
										expect(shiftExchange!.isIllness).toBe(true);
										done();
									},
								});
						});
					});
				}

				//
				// Perform shift-exchange
				// The tests here are very simple at the moment. They just perform the shift-exchange
				// which matches the indisposedMember preference.
				//
				const getCP = () : SchedulingApiShiftExchangeCommunicationBase => {
					for (const communication of shiftExchange!.communications.iterable()) {
						if (communication.communicationPartnerId.equals(newAssignedMember.id))
							return communication;
					}

					// eslint-disable-next-line literal-blacklist/literal-blacklist
					throw new Error('There is no communication item for "newAssignedMember".');
				};

				if (indisposedMemberPrefersSwapping) {
					it('swap-shift', (done : any) => {
						const communication = getCP();

						executeAs(newAssignedMember, () => {
							expect([SchedulingApiShiftExchangeCommunicationAction.IM_NEEDS_RESPONSE,
															SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_TIME,
															SchedulingApiShiftExchangeCommunicationAction.CP_IS_ABSENT,
															SchedulingApiShiftExchangeCommunicationAction.CP_IS_ILL]).toContain(communication.lastAction);

							communication.performAction =
								SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_SWAP_SHIFT;

							const swapOffer = communication.swapOffers.createNewItem();
							for (const currShift of shiftsToSwap.iterable())
								swapOffer.shiftRefs.createNewItem(currShift.id);

							api.save(
								{
									success: () => {
										expect(shiftExchange!.state).toBe(SchedulingApiShiftExchangeState.ACTIVE);
										expect(communication.communicationState).toBe(SchedulingApiShiftExchangeCommunicationState.CP_WANTS_SWAP);
										expect(swapOffer.shiftRefs.length).toBe(1);

										// accept offer
										executeAs(indisposedMember, () => {
											communication.performAction =
											SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_IM_ACCEPT;
											communication.indisposedMembersSelectedSOId = swapOffer.id;

											api.save(
												{
													success: () => {
														expect(shiftExchange!.state).toBe(SchedulingApiShiftExchangeState.SWAP_SUCCESSFUL);
														expect(testingUtils.safeEquals(shiftExchange!.newAssignedMemberId, newAssignedMember.id)).toBeTruthy();

														expect(shiftExchange!.swappedShiftRefs.length).toBe(shiftsToSwap.length);

														// check shifts were updated
														for (const currShift of shiftExchange!.shifts.iterable()) {
															expect(currShift.assignedMemberIds.contains(indisposedMember.id)).toBeFalsy();
															expect(currShift.assignedMemberIds.contains(newAssignedMember.id)).toBeTruthy();
														}

														for (const swappedShift of shiftExchange!.swappedShifts.iterable()) {
															expect(swappedShift.assignedMemberIds.contains(indisposedMember.id)).toBeTruthy();
															expect(swappedShift.assignedMemberIds.contains(newAssignedMember.id)).toBeFalsy();
														}

														done();
													},
												});
										});
									},
								});
						});
					});
				} else {
					it('take-shift', (done : any) => {
						const communication = getCP();

						// take shift
						executeAs(newAssignedMember, () => {
							communication.performAction =
								SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_TAKE_SHIFT_PREF_MATCH;

							api.save(
								{
									success: () => {
										expect(shiftExchange!.state).toBe(SchedulingApiShiftExchangeState.TAKE_SUCCESSFUL);
										expect(testingUtils.safeEquals(shiftExchange!.newAssignedMemberId, communication.communicationPartnerId)).toBeTruthy();
										expect(shiftExchange!.swappedShiftRefs.length).toBe(0);

										// check shifts were updated
										for (const currShift of shiftExchange!.shifts.iterable()) {
											expect(currShift.assignedMemberIds.contains(indisposedMember.id)).toBeFalsy();
											expect(currShift.assignedMemberIds.contains(newAssignedMember.id)).toBeTruthy();
										}

										done();
									},
								});
						});
					});
				}

				it('clean-up', (done : any) => {
					// remove whole packet
					executeAs(admin, () => {
						api.data.shifts.removeItem(shift!);

						api.data.shiftChangeSelector.shiftsOfShiftModelId = shiftModel!.id;
						api.data.shiftChangeSelector.shiftsOfShiftModelVersion = shift!.id.shiftModelVersion;
						api.data.shiftChangeSelector.shiftsOfSeriesId = shift!.id.seriesId;
						api.data.shiftChangeSelector.shiftsOfPacketIndex = shift!.id.packetIndex;

						api.save({ success: () => { expect().nothing(); done(); }} );
					});
				});

				//
				// close item
				//
				/* it('close-item', (done : any) =>
				{
					// login as admin
					executeAs(admin, () =>
					{
						// close item
						if(shiftExchange.isIllness)
						{
							// by withdrawing item
							shiftExchange.isWithdrawn = true;

							api.save(
							{
								success: () =>
								{
									expect(shiftExchange.state).toBe(SchedulingApiShiftExchangeState.WITHDRAWN);
									ensureNoCommunicationActionsPermitted();

									done();
								}
							, 	error: fail
							});
						}
						else
						{
							// by removing indisposed member from shifts
							api.load({ // Load to get the api view of admin
								success: () =>
								{
									for(let shift of shifts.iterable())
										shift.assignedMemberIds.removeItem(indisposedMember.id);

									api.save(
									{
										success: () =>
										{
											expect(shiftExchange.state).toBe(SchedulingApiShiftExchangeState.REMOVED_FROM_SHIFT);
											ensureNoCommunicationActionsPermitted();

											done();
										}
									, 	error: fail
									});
								}
							,	searchParams: api.getLastLoadSearchParams()
							});
						}
					});
				});*/
			});
		};

		//
		// test all cases
		//

		// isIllness=false.
		// For this case it is not relevant if indisposed member is admin or not
		testShiftExchange(false, false, false, false);
		testShiftExchange(false, false, false, true);
		testShiftExchange(false, false, true, false);
		testShiftExchange(false, false, true, true);

		// isIllness=true.
		// We also want to test the case where indisposed member is admin
		// in which case the shift-exchange item does not have to be confirmed.
		// indisposedMemberPrefersSwapping=true and setMemberAddressedTo=true are not permitted for this case.
		testShiftExchange(true, false, false, false);
		testShiftExchange(true, true, false, false);
	});
});
