/* eslint-disable max-lines */
import { HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService} from '@plano/shared/api';
import { Meta } from '@plano/shared/api';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { 	SchedulingApiMemberBase
	,	SchedulingApiShiftModelBase
	,	SchedulingApiShiftBase
	,	SchedulingApiWorkingTimeBase
	,	SchedulingApiAbsenceBase
	,	SchedulingApiMemo
	,	SchedulingApiRightGroupBase
	,	SchedulingApiCustomBookableMail,
										SchedulingApiBookingDesiredDateSetting,
} from './../scheduling-api.service.ag';
import {	SchedulingApiShiftRepetitionType
	,	SchedulingApiAssignmentProcessState
	,	SchedulingApiWorkingTimeCreationMethod
	,	SchedulingApiAssignmentProcessType
	,	SchedulingApiGender
	,	SchedulingApiRightGroupRole,
} from './../scheduling-api.service.ag';
import { ShiftId } from './../shift-id/shift-id';
import { PMath } from '../../../core/math-utils';
import { assumeNonNull } from '../../../core/null-type-utils';
import { ApiTestingUtils } from '../../base/api-testing-utils';

describe('#SchedulingApiService #needsapi', () => {
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

	// //////////////////////////////////////////////////////////////////////////////////////////////
	// //// GENERAL /////////////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////////////////////////
	const createOrModifyShiftModel = (shiftModel : SchedulingApiShiftModelBase) : void => {
		shiftModel.name = testingUtils.getRandomString(10);
		shiftModel.color = testingUtils.getRandomString(6);
		shiftModel.parentName = testingUtils.getRandomString(10);
		shiftModel.description = testingUtils.getRandomString(20);
		shiftModel.workingTimeCreationMethod = testingUtils.getRandomNumber(1, 2, 0);
		shiftModel.bookingDesiredDateSetting = SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_NOT_ALLOWED;
		shiftModel.minCourseParticipantCount = 1;

		// time
		shiftModel.time.start = 1;
		shiftModel.time.end = 1000;

		// needed members count conf
		shiftModel.neededMembersCountConf.neededMembersCount = testingUtils.getRandomNumber(0, 3, 0);
		shiftModel.neededMembersCountConf.perXParticipants = null;
		shiftModel.neededMembersCountConf.isZeroNotReachedMinParticipantsCount = false;

		// controlling
		shiftModel.costCentre = testingUtils.getRandomString(10);
		shiftModel.articleGroup = testingUtils.getRandomString(10);

		// repetition
		shiftModel.repetition.type = SchedulingApiShiftRepetitionType.EVERY_X_DAYS;
		shiftModel.repetition.x = testingUtils.getRandomNumber(20, 40, 0);
		shiftModel.repetition.endsAfterDate = pMoment.m().add(2, 'month').valueOf();

		// packet repetition
		shiftModel.repetition.packetRepetition.type = SchedulingApiShiftRepetitionType.EVERY_X_WEEKS;
		shiftModel.repetition.packetRepetition.x = testingUtils.getRandomNumber(1, 3, 0);
		shiftModel.repetition.packetRepetition.endsAfterRepetitionCount = testingUtils.getRandomNumber(5, 10, 0);
		shiftModel.repetition.packetRepetition.isRepeatingOnThursday = true;
		shiftModel.repetition.packetRepetition.isRepeatingOnFriday = true;

		// assignable members
		const newAssignableMember = api.data.members.get(0);

		if (shiftModel.isNewItem()) {
			// add new assignable member
			const assignableMember = shiftModel.assignableMembers.createNewItem();
			assignableMember.hourlyEarnings = testingUtils.getRandomNumber(0, 15, 0);
			assignableMember.memberId = newAssignableMember!.id;
		} else {
			// remove one
			shiftModel.assignableMembers.remove(0);
		}

		// assigned members
		if (shiftModel.isNewItem()) {
			// add newAssignableMember new assigned member.
			// So, we make sure assigned member is also assignable.
			const memberId = newAssignableMember!.id;
			shiftModel.assignedMemberIds.push(memberId);
		} else {
			// remove one
			shiftModel.assignedMemberIds.remove(0);
		}
	};

	describe('general', () => {
		testingUtils.init(
			{
				imports: [],
				providers: [SchedulingApiService],
			});

		beforeAll(async () => {
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams(''));
		});

		/** ***********************************************************************************/
		describe('general-api-tests', () => {
			it('dismiss-copy', () => {
				const mem = api.data.members.get(0);
				api.createDataCopy();

				// modify value
				const oldValue = mem!.firstName;
				mem!.firstName = testingUtils.getRandomString(10);

				// dismiss changes
				api.dismissDataCopy();

				expect(() => { api.dismissDataCopy(); }).toThrowError(Error);
				expect(mem!.firstName).toBe(oldValue);
			});

			it('merge-copy', () => {
				const mem = api.data.members.get(0);
				api.createDataCopy();

				expect(() => { api.createDataCopy(); }).toThrowError(Error);

				// modify value
				const oldValue = mem!.firstName;
				const newValue = testingUtils.getRandomString(10);
				mem!.firstName = newValue;

				// dismiss changes
				api.mergeDataCopy();

				expect(() => { api.mergeDataCopy(); }).toThrowError(Error);
				expect(mem!.firstName).toBe(newValue);

				// set old value
				mem!.firstName = oldValue;
			});


			it('changes-are-not-lost', (done : any) => {
				const mem = api.data.members.get(0);
				const oldName = mem!.firstName;

				// save api
				const newNameAfterSave = testingUtils.getRandomString(15);

				mem!.firstName = testingUtils.getRandomString(10);
				api.save({success : () => {
					// make sure the new changes during save operation are not lost
					expect(mem!.firstName).toBe(newNameAfterSave);

					// set old value
					mem!.firstName = oldName;
					api.save({success: () => done()});
				}});

				// We immediately do more changes
				mem!.firstName = newNameAfterSave;
			});

			it('new-item-is-added-once', (done : any) => {
				api.console.warn('Current api implementation does not ensure »new-item-is-added-once« because saves are not queued anymore. So, a second is fired before backend responds with the final id.');
				expect().nothing();
				done();

				/*
				// create new member
				let newMem = api.data.members.createNewItem();
				newMem.email = testingUtils.getRandomEmail();
				newMem.firstName = testingUtils.getRandomString(10);
				newMem.lastName = testingUtils.getRandomString(10);
				newMem.employmentBegin = pMoment.m().valueOf();
				newMem.rightGroupIds.push(api.data.rightGroups.get(0).id);

				let expectedMemberCount = api.data.members.length;

				// new item should only be saved once
				let checkDoneCount = null;
				let checkIsSavedOnce = () =>
				{
					expect(api.data.members.length).toBe(expectedMemberCount);

					// have we done check twice?
					++checkDoneCount;

					if(checkDoneCount === 2)
					{
						// remove newly created item
						api.data.members.removeItem(newMem);
						api.save({success: () => done()});
					}
				};

				// Do tests
				api.save({success: checkIsSavedOnce});

				newMem.lastName = testingUtils.getRandomString(10); // change data otherwise no save will be executed
				api.save({success: checkIsSavedOnce});
				*/
			});

			it('new-created-item-has-db-id', (done : any) => {
				// A new created item should have after the creation the database id or otherwise
				// further api calls will result in the "loss" of the old item wrapper because
				// further api calls will not anymore send the new-item-id.

				// create new shift-model
				const shiftModel = api.data.shiftModels.createNewItem();

				createOrModifyShiftModel(shiftModel);

				api.save({
					success: () => {
						expect(Meta.getId(shiftModel.rawData)! > 0).toBeTrue();
						done();
					},
				});
			});

			it('new-item-wrapper-is-not-lost-when-calling-load-after-item-creation', (done : any) => {
				// Create a new item and call api.save() and before the response arrives call
				// api.load(). Ensure that the wrapper of the new created item is not lost (i.e. it still has
				// the raw-data of the item).
				// This is a typical pattern when e.g. creating a new shift-model and directly calling load
				// to load the calendar data.
				const shiftModel = api.data.shiftModels.createNewItem();
				createOrModifyShiftModel(shiftModel);
				api.save();

				// we want to ensure that load() is received by backend after save(). Otherwise the response of load() will
				// not contain the new shift-model data. Just calling them after each other
				// sometimes load() was responded by backend before save().
				window.setTimeout(() => {
					api.load({
						success: () => {
							expect(shiftModel.rawData).toBeDefined();
							done();
						},
						searchParams: getApiQueryParams('calendar'),
					});
				}, 10);
			});

			it('consecutive-save-call-changes-are-not-shadowed', (done : any) => {
				// When having the pattern change data -> save -> change data -> save -> ...
				// without waiting for the response of the api calls then we should ensure that
				// the following changes are not shadowed because the response of prior save does not contain
				// those changes.

				const fistMember = api.data.members.get(0);
				const secondMember = api.data.members.get(1);

				// change last-name of first member and save
				fistMember!.lastName = testingUtils.getRandomString(10);

				api.save({
					success: () => {
						// ensure that the response of this api does not "shadow" the last-name change of the second member
						// and that it is still visible
						expect(secondMember!.lastName).toBe(secondMemberLastName);
						done();
					},
				});

				// change last-name of second member and save without waiting for the first api call response
				const secondMemberLastName = testingUtils.getRandomString(10);
				secondMember!.lastName = secondMemberLastName;
				api.save();
			});

			it('copy()', () => {
				const shiftModelSource = api.data.shiftModels.get(0);
				const shiftModelCopy = shiftModelSource!.copy();

				// copied values correctly
				expect(shiftModelSource!.name).toEqual(shiftModelCopy.name);

				// copy has now new-item-id
				expect(shiftModelSource!.id.equals(shiftModelCopy.id)).toBeFalse();
				expect(shiftModelCopy.newItemId).toBeDefined();
			});

			// We check here parent attribute of sub-objects not added as a list item.
			// For list items there are tests in api-list-wrapper.spec.ts
			it('parent-attribute-of-objects', () => {
				expect(api.data.parent).toBeNull();
				expect(api.data.shiftChangeSelector.parent).toBe(api.data);
			});
		});
	});

	// //////////////////////////////////////////////////////////////////////////////////////////////
	// //// CALENDAR ////////////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////////////////////////
	describe('calendar', () => {
		let me : MeService;

		testingUtils.init(
			{
				imports: [],
				providers: [SchedulingApiService],
			});

		beforeAll(async () => {
			me = testingUtils.getService(MeService);
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('calendar'));
		});

		it('ensureShifts-query-param', (done : any) => {
			api.load(
				{
					success: () => {
						const shiftId = api.data.shifts.get(0)!.id;

						const queryParams = new HttpParams()
							.set('ensureShifts', JSON.stringify([shiftId], (_key : string, value : any) => (value instanceof ShiftId ? value.rawData : value) ));

						api.load(
							{
								success: () => {
									// api should have returned that one shift
									expect(api.data.shifts.length).toBe(1);
									expect(api.data.shifts.get(0)!.id.equals(shiftId));

									done();

								},
								searchParams: queryParams,
							});

					},
					searchParams: getApiQueryParams('calendar'),
				});
		});

		/** ***********************************************************************************/
		describe('members', () => {
			let newMemberAssignableShiftModelId : Id | undefined = undefined;
			const employmentBegin = pMoment.m().valueOf();

			apiTestingUtils.doDefaultListTests(
				{
					searchParams: getApiQueryParams('calendar'),
					getApi: () => { return api; },
					getList : () => {
						return api.data.members;
					},
					changeItem : (member : SchedulingApiMemberBase) => {
						member.firstName = testingUtils.getRandomString(10);
						member.lastName = testingUtils.getRandomString(10);
						member.phone = testingUtils.getRandomString(10);
						member.email = testingUtils.getRandomEmail();
						member.gender = SchedulingApiGender.DIVERSE;
						member.addressStreet = testingUtils.getRandomString(20);
						member.addressPostalCode = String(testingUtils.getRandomNumber(11111, 99999, 0));
						member.addressCity = testingUtils.getRandomString(20);
						member.personnelNumbers = testingUtils.getRandomString(10);
						member.placeOfBirth = testingUtils.getRandomString(10);
						member.socialSecurityNumber = testingUtils.getRandomString(10);
						member.taxId = testingUtils.getRandomString(10);
						member.healthInsurance = testingUtils.getRandomString(10);
						member.denomination = testingUtils.getRandomString(10);
						member.accountIBAN = testingUtils.getRandomString(10);
						member.accountOwner = testingUtils.getRandomString(10);
						member.comments = testingUtils.getRandomString(20);
						member.nationality = testingUtils.getRandomString(10);

						// right group ids
						if (member.isNewItem()) {
							member.rightGroupIds.push(api.data.rightGroups.get(0)!.id);
							member.rightGroupIds.push(api.data.rightGroups.get(1)!.id);
						} else {
							member.rightGroupIds.remove(0);
						}

						// employment contract
						member.minMonthlyEarnings = 1;
						member.desiredMonthlyEarnings = 450;
						member.maxMonthlyEarnings = 100000;
						member.employmentContractsComment = testingUtils.getRandomString(40);

						if (member.isNewItem())
							member.employmentBegin = employmentBegin;

						// modify assignable shift-models
						const assignableShiftModels = member.assignableShiftModels;
						if (member.isNewItem()) {
						// make this member assignable to two shift models
							let assignableShiftModel = assignableShiftModels.createNewItem();
							assignableShiftModel.hourlyEarnings = testingUtils.getRandomNumber(0, 15, 2);
							assignableShiftModel.shiftModelId = api.data.shiftModels.get(0)!.id;
							newMemberAssignableShiftModelId = assignableShiftModel.shiftModelId;

							assignableShiftModel = assignableShiftModels.createNewItem();
							assignableShiftModel.hourlyEarnings = testingUtils.getRandomNumber(0, 15, 2);
							assignableShiftModel.shiftModelId = api.data.shiftModels.get(1)!.id;
						} else {
						// remove last item
							assignableShiftModels.remove(assignableShiftModels.length - 1);
							member.changeSelector.start = pMoment.m().valueOf();
						}
					},
					afterItemCreated: async (member : SchedulingApiMemberBase) => {
						// The member should now be assignable to the shifts which are after his employment begin.
						for (const shift of api.data.shifts.iterable()) {
							if (	shift.start > employmentBegin	&&
									shift.shiftModelId.equals(newMemberAssignableShiftModelId!)) {
								// Check that the member is assignable to this shift
								await shift.loadDetailed({ searchParams: getApiQueryParams('calendar') });

								let memberIsAssignable = false;
								for (const assignableMember of shift.assignableMembers.iterable()) {
									if (assignableMember.memberId.equals(member.id)) {
										memberIsAssignable = true;
										break;
									}
								}

								if (!memberIsAssignable)
									throw new Error('Member is not assignable to this shift.');
							}
						}
					},
					removeMethod: 'none', // We have separate tests for trashing
					beforeRawDataCompare: (member : SchedulingApiMemberBase, rawDataBeforeSave : any) => {
						// Change-selector will not be returned by backend. So, copy it to pass tests
						rawDataBeforeSave[api.consts.MEMBER_CHANGE_SELECTOR] = member.changeSelector.rawData;
					},
				});

			/* describe('trashing', () =>
			{

				let member : SchedulingApiMemberBase;

				beforeAll(() =>
				{
					member = api.data.members.get(0);
				});

				it('trash-in-future', (done : any) =>
				{
					member.trashed = true;

					let trashDate = pMoment.m().add(5, 'days').valueOf();
					member.trashDate = trashDate;

					api.save(
					{
						success: () =>
						{
							expect(member.trashed).toBeFalsy();
							expect(member.trashDate).toBe(trashDate);
							done();
						}
					});
				});

				it('cancel-trash', (done : any) =>
				{
					member.trashDate = null;
					member.assignableStart = pMoment.m().add(5, 'days').valueOf();

					api.save(
					{
						success: () =>
						{
							expect(member.trashed).toBeFalsy();
							expect(member.trashDate).toBe(trashDate);
							done();
						}
					});
				});

				afterItemRemoved : (removedItemId : Id) =>
				{
					let removedMember = api.data.members.get(removedItemId);

					// Check that member is not anymore assignable to any shift models
					expect(removedMember.assignableShiftModels.length).toBe(0);
				}
			});*/

			it('apply-members-assignableMembers-changes-to-shifts', async () => {
				// change value and let it apply to some shifts
				const member = api.data.members.get(0)!;
				await member.loadDetailed({ searchParams: getApiQueryParams('calendar') });

				// change hourlyEarnings for "Frühschicht"
				const assignableShiftModel = member.assignableShiftModels.findBy(item => item.shiftModel.name === 'Frühschicht');

				if (!assignableShiftModel)
					throw new Error('Member is not assignable to shift-model »Frühschicht«.');

				const newEarnings = assignableShiftModel.hourlyEarnings + 1;
				assignableShiftModel.hourlyEarnings = newEarnings;

				// apply also to shifts
				const applyToShiftsFrom = pMoment.m().startOf('day').valueOf();
				member.changeSelector.start = applyToShiftsFrom;

				await member.saveDetailed();

				// have the shifts been updated?
				// As we need to get the detail view of a shift to check this we will
				// content ourself with only checking one shift before and one shift after "applyToShiftsFrom".
				// Note that currently loadDetailed() sets api data to undefined. So, it is important
				// that we do not call loadDetailed() when looping shifts data.
				let shiftBefore : SchedulingApiShiftBase | null = null;
				let shiftAfter : SchedulingApiShiftBase | null = null;

				for (const shift of api.data.shifts.iterable()) {
					// skip shifts that are not of the shift-model we modified
					if (!shift.shiftModelId.equals(assignableShiftModel.shiftModelId))
						continue;

					// find shift before
					if (shift.start < applyToShiftsFrom && !shiftBefore)
						shiftBefore = shift;

					// find shift after
					if (shift.start > applyToShiftsFrom && !shiftAfter)
						shiftAfter = shift;
				}

				if (!shiftBefore)
					throw new Error('shiftBefore could not be found.');

				if (!shiftAfter)
					throw new Error('shiftAfter could not be found.');

				// check shift before applyToShiftsFrom has NOT new value
				await shiftBefore.loadDetailed({ searchParams: getApiQueryParams('calendar') });

				expect(	!shiftBefore.assignableMembers.getByMember(member)	||
					shiftBefore.assignableMembers.getByMember(member)!.hourlyEarnings !== newEarnings).toBeTruthy();

				// check shift after applyToShiftsFrom has new value
				await shiftAfter.loadDetailed({ searchParams: getApiQueryParams('calendar') });

				expect(shiftAfter.assignableMembers.getByMember(member)!.hourlyEarnings).toBe(newEarnings);
			});
		});

		/** ***********************************************************************************/
		describe('shift-models', () => {
			apiTestingUtils.doDefaultListTests({
				searchParams: getApiQueryParams('calendar'),
				getApi : () => { return api; },
				getList : () => {
					return api.data.shiftModels;
				},
				changeItem : (shiftModel : SchedulingApiShiftModelBase) => {
					createOrModifyShiftModel(shiftModel);
				},
				removeMethod: 'trash',
			});

			it('apply-shiftModels-assignableMembers-changes-to-shifts', async () => {
				// change value for shift-model "Frühschicht" and let it apply to some shifts
				const shiftModel = api.data.shiftModels.findBy(item => item.name === 'Frühschicht');

				if (!shiftModel)
					throw new Error('Shift-Model »Frühschicht« could not be found.');

				await shiftModel.loadDetailed({ searchParams: getApiQueryParams('calendar') });

				// change hourlyEarnings
				const assignableMember = shiftModel.assignableMembers.get(0);
				const member = api.data.members.get(assignableMember!.memberId)!;

				const newEarnings = PMath.roundToDecimalPlaces(assignableMember!.hourlyEarnings + 0.1, 2);
				assignableMember!.hourlyEarnings = newEarnings;

				// apply also to shifts
				const applyToShiftsFrom = pMoment.m().startOf('day').valueOf();
				shiftModel.changeSelector.start = applyToShiftsFrom;

				await shiftModel.saveDetailed();

				// have the shifts been updated?
				// As we need to get the detail view of a shift to check this we will
				// content ourself with only checking one shift before and one shift after "applyToShiftsFrom".
				// Note that currently loadDetailed() sets api data to undefined. So, it is important
				// that we do not call loadDetailed() when looping shifts data.
				let shiftBefore : SchedulingApiShiftBase | null = null;
				let shiftAfter : SchedulingApiShiftBase | null = null;

				for (const shift of api.data.shifts.iterable()) {
					// skip shifts that are not of the shift-model we modified
					if (!shift.shiftModelId.equals(shiftModel.id))
						continue;

					// find shift before
					if (shift.start < applyToShiftsFrom && !shiftBefore)
						shiftBefore = shift;

					// find shift after
					if (shift.start > applyToShiftsFrom && !shiftAfter)
						shiftAfter = shift;
				}

				if (!shiftBefore)
					throw new Error('shiftBefore could not be found.');

				if (!shiftAfter)
					throw new Error('shiftAfter could not be found.');

				// check shift before applyToShiftsFrom has NOT new value
				await shiftBefore.loadDetailed({ searchParams: getApiQueryParams('calendar') });

				expect(	!shiftBefore.assignableMembers.getByMember(member)	||
					shiftBefore.assignableMembers.getByMember(member)!.hourlyEarnings !== newEarnings).toBeTruthy();

				// check shift after applyToShiftsFrom has new value
				await shiftAfter.loadDetailed({ searchParams: getApiQueryParams('calendar') });
				expect(shiftAfter.assignableMembers.getByMember(member)!.hourlyEarnings).toBe(newEarnings);
			});
		});

		/** ***********************************************************************************/
		describe('shifts', () => {
			it('should-be-defined', () => {
				expect(api.data.shifts.length > 0).toBeTruthy();
			});

			apiTestingUtils.doDefaultListTests({
				searchParams: getApiQueryParams('calendar'),
				getApi : () => { return api; },
				getList : () => {
					return api.data.shifts;
				},
				changeItem : (shift : SchedulingApiShiftBase) => {
					shift.neededMembersCount = testingUtils.getRandomNumber(0, 3, 0);
					shift.neededMembersCountConf.neededMembersCount = shift.neededMembersCount;
					shift.neededMembersCountConf.perXParticipants = null;
					shift.neededMembersCountConf.isZeroNotReachedMinParticipantsCount = false;

					shift.description = testingUtils.getRandomString(20);
					shift.workingTimeCreationMethod = testingUtils.getRandomNumber(1, 2, 0);

					// startTime/endTime
					const timeMax = 24 * 60 * 60 * 1000;

					shift.time.start = testingUtils.getRandomNumber(0, timeMax, 0);
					shift.time.end = testingUtils.getRandomNumber(shift.time.start, timeMax, 0);

					// When changing startTime/endTime, start/end are updated by backend automatically
					// But, because the tests will fail if old raw data will not match new raw data we will manually update
					// start/end to ensure that the tests pass.
					const seriesStart = pMoment.m(shift.start).startOf('day');

					shift.start = seriesStart.clone().add(shift.time.start, 'milliseconds').valueOf();
					shift.end = seriesStart.clone().add(shift.time.end, 'milliseconds').valueOf();

					// assignable members
					const newAssignableMember = api.data.members.get(0)!;
					if (shift.isNewItem()) {
						// add new assignable member
						const assignableMember = shift.assignableMembers.createNewItem();
						assignableMember.hourlyEarnings = testingUtils.getRandomNumber(0, 15, 0);
						assignableMember.memberId = newAssignableMember.id;
					} else {
						// remove one.
						// Make sure not to remove an assignable member who is assigned.
						// Or that member will not returned again and the equality check
						// will fail
						for (const assignableMember of shift.assignableMembers.iterable()) {
							if (!shift.assignedMemberIds.contains(assignableMember.memberId)) {
								shift.assignableMembers.removeItem(assignableMember);
								break;
							}
						}
					}

					// assigned members
					if (shift.isNewItem()) {
						// add new assigned member (we add id of newAssignableMember
						// because we can only assign members who are also assignable)
						const memberId = newAssignableMember.id;
						shift.assignedMemberIds.push(memberId);
					} else {
						// remove one
						shift.assignedMemberIds.remove(0);
					}
				},
				createNewItem : () => {
					return api.data.shifts.createNewShift(	api.data.shiftModels.get(0)!
						, 	pMoment.m().startOf('day')
						,	getApiQueryParams('calendar'));
				}});

			it('apply-changes-to-shift-model', (done : any) => {
				const shift = api.data.shifts.get(0)!;

				const newValue = testingUtils.getRandomString(40);
				shift.description = newValue;

				const shiftModelId = shift.id.shiftModelId;
				api.data.shiftChangeSelector.shiftModelId = shiftModelId;

				api.save(
					{
						success: () => {
						// changes were applied to shift-model?
							const shiftModel = api.data.shiftModels.get(shiftModelId)!;

							shiftModel.loadDetailed(
								{
									searchParams: getApiQueryParams('calendar'),
									success: () => {
										expect(shiftModel.description).toEqual(newValue);
										done();
									},
								});
						},
					});
			});

			// describe('#shift', () => {
			// 	it('neededMembersCount calculation', (done : any) => {
			// 		let item : SchedulingApiShiftBase;
			// 		for (let shiftItem of api.data.shifts.iterable()) {
			// 			if (api.data.shiftModels.get(shiftItem.shiftModelId).isCourse) {
			// 				item = shiftItem;
			// 				return;
			// 			}
			// 		}
			//
			// 		let initNewBooking = (	booking : SchedulingApiBookingBase
			// 							, 	courseType : SchedulingApiCourseType
			// 							,	shiftModel : SchedulingApiShiftModelBase
			// 							,	shift : SchedulingApiShiftBase
			// 							,	paymentMethod : SchedulingApiShiftModelCoursePaymentMethod
			// 							,	tariff : SchedulingApiShiftModelCourseTariff
			// 							,	onlyWholeCourseBookable : boolean
			// 							,	bookingDesiredDateSetting : boolean) =>
			// 		{
			// 			booking.state = (
			// 				courseType === SchedulingApiCourseType.ONLINE_INQUIRY
			// 			) ? SchedulingApiBookingState.INQUIRY : SchedulingApiBookingState.BOOKED;
			//
			// 			booking.currentlyPaid = 0;
			// 			booking.shiftModelId = shiftModel.id;
			// 			booking.ownerComment = testingUtils.getRandomString(10);
			// 			booking.firstName = testingUtils.getRandomString(10);
			// 			booking.lastName = testingUtils.getRandomString(10);
			// 			booking.dateOfBirth = +pMoment.m().startOf('day');
			// 			booking.streetAndHouseNumber = testingUtils.getRandomString(10);
			// 			booking.city = testingUtils.getRandomString(10);
			// 			booking.postalCode = String(testingUtils.getRandomNumber(11111, 99999, 0));
			// 			booking.email = testingUtils.getRandomEmail();
			// 			booking.phoneMobile = testingUtils.getRandomString(10);
			// 			booking.phoneLandline = testingUtils.getRandomString(10);
			// 			booking.paymentMethodId = paymentMethod.id;
			// 			booking.bookingComment = testingUtils.getRandomString(10);
			// 			booking.company = testingUtils.getRandomString(10);
			// 			booking.wantsNewsletter = testingUtils.getRandomBoolean();
			//
			// 			if(onlyWholeCourseBookable)
			// 			{
			// 				booking.ageMin = 10;
			// 				booking.ageMax = 20;
			// 			}
			//
			// 			// participants / overallTariff
			// 			if(onlyWholeCourseBookable)
			// 			{
			// 				booking.overallTariffId = tariff.id;
			// 				booking.participantCount = 2;
			// 			}
			// 			else
			// 			{
			// 				let participant = booking.participants.createNewItem();
			// 				participant.firstName = testingUtils.getRandomString(10);
			// 				participant.lastName = testingUtils.getRandomString(10);
			// 				participant.email = testingUtils.getRandomEmail();
			// 				participant.dateOfBirth = +pMoment.m().startOf('day');
			// 				participant.tariffId = tariff.id;
			// 			}
			//
			// 			// which course?
			// 			if(bookingDesiredDateSetting)
			// 			{
			// 				booking.desiredDate = testingUtils.getRandomString(10);
			// 				booking.courseSelector = new ShiftId();
			// 			}
			// 			else
			// 			{
			// 				booking.courseSelector = shift.id;
			// 			}
			// 		};
			//
			// 		item.loadDetailed({
			// 			success: () => {
			// 				item.neededMembersCountConf.neededMembersCount = 1;
			// 				item.neededMembersCountConf.isZeroNotReachedMinParticipantsCount = true;
			// 				item.neededMembersCountConf.perXParticipants = 1;
			// 				item.minCourseParticipantCount = 1;
			//
			// 				let _booking = new SchedulingApiBookingBase(api);
			// 				let _model = api.data.shiftModels.get(item.shiftModelId);
			// 				initNewBooking(	_booking
			// 							, 	_model.courseType
			// 							, 	_model
			// 							, 	item
			// 							, 	_model.coursePaymentMethods.get(0)
			// 							, 	_model.courseTariffs.get(0)
			// 							, 	_model.onlyWholeCourseBookable
			// 							, 	_model.bookingDesiredDateSetting);
			//
			// 				api.save({
			// 					success: () => {
			// 						expect(item.neededMembersCount).toBeGreaterThan(0);
			// 						done();
			// 					},
			// 					error: () => {
			// 						expect(false).toBeTruthy();
			// 						done();
			// 					}
			// 				});
			// 			},
			// 			error: () => {
			// 				expect(false).toBeTruthy();
			// 				done();
			// 			}
			// 		});
			// 	});
			// });
		});

		/** ***********************************************************************************/
		describe('#assignment-processes', () => {
			let assignmentProcess : SchedulingApiAssignmentProcess | null = null;

			const testCreateProcess = (type : SchedulingApiAssignmentProcessType) : void => {
				it('create-process', async () => {
					assignmentProcess = api.data.assignmentProcesses.createNewItem();
					assignmentProcess.name = testingUtils.getRandomString(10);
					assignmentProcess.type = type;

					// add 4 last shifts to process (which will be in the future)
					const shiftsSorted = api.data.shifts.sortedBy('start', false);

					for (let shiftIndex = 0; shiftIndex < 4; ++shiftIndex) {
						const shift = shiftsSorted.get(shiftsSorted.length - 1 - shiftIndex)!;

						// remove shift assignments and add it to process
						shift.assignedMemberIds.clear();
						assignmentProcess.shiftRefs.createNewItem(shift.id);
					}

					await api.save();
					expect().nothing();
				});

				it('remove-shifts', async () => {
					expect(assignmentProcess!.state).toBe(SchedulingApiAssignmentProcessState.NOT_STARTED);

					// remove one shift from process
					assignmentProcess!.shiftRefs.remove(0);
					const shiftsListLength = assignmentProcess!.shiftRefs.length;

					await api.save();
					expect(assignmentProcess!.shiftRefs.length).toBe(shiftsListLength);
				});
			};

			const testAskMemberPrefState = () : void => {
				it('start-ask-member-pref-state', async () => {
					// start ask member pref state
					assignmentProcess!.state = SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES;

					const deadline = pMoment.m().add(2, 'day').valueOf();
					assignmentProcess!.deadline = deadline;

					await api.save();

					// State changed successfully?
					expect(assignmentProcess!.state).toBe(SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES);
					expect(assignmentProcess!.deadline).toBe(deadline);
				});

				it('ask-member-pref-state-change-preferences', async () => {
					expect(assignmentProcess!.state).toBe(SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES);

					// change preferences
					const newPrefs = new Map<SchedulingApiShiftBase, number>();

					const ignoreShift = (shift : SchedulingApiShiftBase) : boolean => {
						// can we set pref?
						const shiftRef = assignmentProcess!.shiftRefs.get(shift.id);

						if (!shiftRef || !shiftRef.requesterCanSetPref)
							return true;

						// ignore shifts of a packet as their preferences are transferred to the others shifts.
						// The testing is too complicated.
						if (shift.packetShifts.length > 0)
							return true;

						return false;
					};

					for (const shift of api.data.shifts.iterable()) {
						if (ignoreShift(shift))
							continue;

						// set new pref
						const newPref = testingUtils.getRandomNumber(1, 3, 0);
						shift.myPref = newPref;

						newPrefs.set(shift, newPref);
					}

					await api.save();

					// have the preferences been updated?
					for (const shift of api.data.shifts.iterable()) {
						if (ignoreShift(shift))
							continue;

						const newPref = newPrefs.get(shift)!;

						// test myPref
						expect(shift.myPref).toBe(newPref);

						// test memberPrefs
						let pref : number | null = null;

						for (const memberPref of shift.memberPrefs.iterable()) {
							if (memberPref.memberId.equals(me.data.id)) {
								pref = memberPref.pref;
								break;
							}
						}

						expect(pref).toBe(newPref);
					}
				});

				it('end-ask-member-pref-state', async () => {
					expect(assignmentProcess!.state).toBe(SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES);

					// set deadline to a past time so state finishes
					assignmentProcess!.deadline = pMoment.m().subtract(1, 'day').valueOf();

					await api.save();
				});
			};


			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const testAlgorithm = () : void => {
				it('algorithm', () => {
					expect(assignmentProcess!.state).toBe(SchedulingApiAssignmentProcessState.NEEDING_APPROVAL);

					// the algorithm should have assigned all shifts
					for (const shiftIdObj of assignmentProcess!.shiftRefs.iterable()) {
						const shift = api.data.shifts.get(shiftIdObj.id)!;
						expect(shift.assignedMemberIds.length).toBe(shift.neededMembersCount);
					}
				});
			};

			const testManualScheduling = () : void => {
				it('manual-scheduling', () => {
					expect(assignmentProcess!.state).toBe(SchedulingApiAssignmentProcessState.MANUAL_SCHEDULING);
				});
			};

			const testEarlyBirdScheduling = () : void => {
				it('start-early-bird-state', async () => {
					// start early-bird state
					assignmentProcess!.state = SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING;

					const deadline = pMoment.m().add(2, 'day').valueOf();
					assignmentProcess!.deadline = deadline;

					await api.save();

					// State changed successfully?
					expect(assignmentProcess!.state).toBe(SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING);
					expect(assignmentProcess!.deadline).toBe(deadline);
				});

				it('assign-myself', async () => {
					const shift = api.data.shifts.get(assignmentProcess!.shiftRefs.get(0)!.id)!;
					const meId = me.data.id;

					// prepare shift for test: Nobody should be assigned. "me" should be assignable and
					// one person should be needed for the shift
					await shift.loadDetailed({ searchParams: getApiQueryParams('calendar') });

					shift.assignedMemberIds.clear();
					shift.neededMembersCountConf.neededMembersCount = 1;
					shift.neededMembersCountConf.perXParticipants = null;
					shift.neededMembersCountConf.isZeroNotReachedMinParticipantsCount = false;

					if (!shift.assignableMembers.containsMemberId(meId))
						shift.assignableMembers.addNewMember(api.data.members.get(meId)!, 1);

					await api.save();

					// assign myself
					shift.earlyBirdAssignToMe = true;
					await api.save();

					expect(shift.assignedMemberIds.contains(meId)).toBeTruthy();

					// clean up
					shift.assignedMemberIds.clear();
					await api.save();
				});

				it('error-reached-needed-members-count', async () => {
					const shift = api.data.shifts.get(assignmentProcess!.shiftRefs.get(0)!.id)!;
					expect(shift.assignedMemberIds.length).toBe(0);

					// set needed members count to zero
					await shift.loadDetailed({ searchParams: getApiQueryParams('calendar') });

					const oldNeededMembersCount = shift.neededMembersCountConf.neededMembersCount;
					shift.neededMembersCountConf.neededMembersCount = 0;

					await shift.saveDetailed();

					// now try to assign myself
					shift.earlyBirdAssignToMe = true;

					const response = await shift.saveDetailed();
					expect(response.status).toBe(api.consts.EARLY_BIRD_REACHED_NEEDED_MEMBERS_COUNT);
					expect(shift.assignedMemberIds.length).toBe(0);

					// clean up
					shift.neededMembersCountConf.neededMembersCount = oldNeededMembersCount;
					await api.save();
				});

				it('end-early-bird', async () => {
					assumeNonNull(assignmentProcess);

					expect(assignmentProcess.state).toBe(SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING);

					// set deadline to a past time so state finishes
					assignmentProcess.deadline = pMoment.m().subtract(1, 'day').valueOf();

					await api.save();
					expect(assignmentProcess.state).toBe(SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED);
				});

				it('reopen-early-bird', async () => {
					assumeNonNull(assignmentProcess);

					assignmentProcess.state = SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING;
					assignmentProcess.deadline = pMoment.m().add(1, 'day').valueOf();

					await api.save();
					expect(assignmentProcess.state).toBe(SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING);
				});

				it('remove-process', async () => {
					assumeNonNull(assignmentProcess);

					api.data.assignmentProcesses.removeItem(assignmentProcess);
					await api.save();
					expect(api.data.assignmentProcesses.contains(assignmentProcess)).toBeFalsy();
				});
			};

			const testReopenAskMemberPrefState = () : void => {
				it('reopen-ask-member-pref-state', async () => {
					assumeNonNull(assignmentProcess);

					assignmentProcess.state = SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES;
					assignmentProcess.deadline = pMoment.m().add(1, 'day').valueOf();

					await api.save();
					expect(assignmentProcess.state).toBe(SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES);
				});

				it('end-ask-member-pref-state', async () => {
					assumeNonNull(assignmentProcess);

					expect(assignmentProcess.state).toBe(SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES);

					// set deadline to a past time so state finishes
					assignmentProcess.deadline = pMoment.m().subtract(1, 'day').valueOf();

					await api.save();
				});
			};

			const testApproveSchedule = () : void => {
				it('approve-schedule', async () => {
					assumeNonNull(assignmentProcess);

					assignmentProcess.state = SchedulingApiAssignmentProcessState.APPROVE;

					await api.save();

					// approving the schedule will automatically remove the process
					expect(api.data.assignmentProcesses.contains(assignmentProcess)).toBeFalsy();
				});
			};

			const testRemoveProcess = (_type : SchedulingApiAssignmentProcessType) : void => {
				it('remove-process-manually', async () => {
					// create new process
					assignmentProcess = api.data.assignmentProcesses.createNewItem();
					assignmentProcess.name = testingUtils.getRandomString(10);
					assignmentProcess.type = SchedulingApiAssignmentProcessType.DR_PLANO;

					await api.save();

					// and remove it
					api.data.assignmentProcesses.removeItem(assignmentProcess);
					await api.save();
					expect(api.data.assignmentProcesses.contains(assignmentProcess)).toBeFalsy();
				});
			};

			describe('dr-plano', () => {
				testCreateProcess(SchedulingApiAssignmentProcessType.DR_PLANO);
				testAskMemberPrefState();
				// testAlgorithm(); // FIXME: PLANO-35500
				testReopenAskMemberPrefState();
				testApproveSchedule();
				testRemoveProcess(SchedulingApiAssignmentProcessType.DR_PLANO);
			});

			describe('manual', () => {
				testCreateProcess(SchedulingApiAssignmentProcessType.MANUAL);
				testAskMemberPrefState();
				testManualScheduling();
				testReopenAskMemberPrefState();
				testApproveSchedule();
				testRemoveProcess(SchedulingApiAssignmentProcessType.MANUAL);
			});

			describe('early-bird', () => {
				testCreateProcess(SchedulingApiAssignmentProcessType.EARLY_BIRD);
				testEarlyBirdScheduling();
				testApproveSchedule();
				testRemoveProcess(SchedulingApiAssignmentProcessType.EARLY_BIRD);
			});
		});

		/** ***********************************************************************************/
		describe('memos', () => {
			apiTestingUtils.doDefaultListTests({
				searchParams: getApiQueryParams('calendar'),
				getApi : () => { return api; },
				getList : () => {
					return api.data.memos;
				},
				changeItem : (memo : SchedulingApiMemo) => {
					memo.message = testingUtils.getRandomString(10);
					memo.start = +pMoment.m().startOf('day');
					memo.end = +pMoment.m().endOf('day');
				},
			});
		});

		/** ***********************************************************************************/
		describe('todays-shift-descriptions', () => {
			it('change-description', (done : any) => {
				const shiftDescription = api.data.todaysShiftDescriptions.get(0)!;
				const newValue = testingUtils.getRandomString(10);

				shiftDescription.description = newValue;
				api.save(
					{
						success: () => {
							expect(shiftDescription.description).toBe(newValue);
							done();
						},
					});
			});
		});

		/** ***********************************************************************************/
		describe('working-times', () => {
			it('should-be-undefined', () => {
				expect(api.data.workingTimes.length === 0).toBeTruthy();
			});
		});

		/** ***********************************************************************************/
		describe('absences', () => {
			it('should-be-defined', () => {
				expect(api.data.absences.length > 0).toBeTruthy();
			});
		});
	});

	// //////////////////////////////////////////////////////////////////////////////////////////////
	// //// REPORTING ///////////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////////////////////////
	describe('reporting', () => {
		let me : MeService;

		testingUtils.init(
			{
				imports: [],
				providers: [SchedulingApiService],
			});

		beforeAll(async () => {
			me = testingUtils.getService(MeService);
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('reporting'));
		});

		/** ***********************************************************************************/
		describe('shifts', () => {
			it('should-be-undefined', () => {
				expect(api.data.shifts.length === 0).toBeTruthy();
			});
		});

		/** ***********************************************************************************/
		describe('working-times', () => {
			apiTestingUtils.doDefaultListTests({
				searchParams: getApiQueryParams('reporting'),
				getApi : () => { return api; },
				getList : () => {
					return api.data.workingTimes;
				},
				changeItem : (workingTime : SchedulingApiWorkingTimeBase) => {
					const minuteMillis = 1000 * 60;

					if (workingTime.isNewItem()) {
						workingTime.shiftModelId = api.data.shiftModels.get(0)!.id;

						// create working-time for logged in member so he will also be able to modify his comment
						workingTime.memberId = me.data.id;
					}

					workingTime.hourlyEarnings = testingUtils.getRandomNumber(5, 15, 1);

					// keep regular pause under 20 minutes so rest is filled with automatic pause
					// (no seconds as backend removes them)
					workingTime.regularPauseDuration = testingUtils.getRandomNumber(10, 20, 0) * minuteMillis;

					// backend currently remove all seconds information from start/end. So, don’t pass seconds otherwise
					// equality tests will fail
					workingTime.time.start = pMoment.m().valueOf() + testingUtils.getRandomNumber(0, 100 * minuteMillis, 0);
					workingTime.time.start = workingTime.time.start - (workingTime.time.start % minuteMillis);

					workingTime.time.end = workingTime.time.start + 8 * 60 * minuteMillis;
				},
				beforeRawDataCompare: (workingTime : SchedulingApiWorkingTimeBase, rawDataBeforeSave : any) => {
					// Copy values automatically calculated by backend
					rawDataBeforeSave[api.consts.WORKING_TIME_AUTOMATIC_PAUSE_DURATION] = workingTime.automaticPauseDuration;

					rawDataBeforeSave[api.consts.WORKING_TIME_WHEN_MEMBER_STAMPED_START] = workingTime.whenMemberStampedStart;
					rawDataBeforeSave[api.consts.WORKING_TIME_WHEN_MEMBER_STAMPED_END] = workingTime.whenMemberStampedEnd;
				},
				afterItemCreated: (workingTime : SchedulingApiWorkingTimeBase) => {
					// working-time is greater than 6 hours. So sum of regular/automatic pauses should be 30 minutes
					expect(workingTime.regularPauseDuration + workingTime.automaticPauseDuration).toBe(30 * 60 * 1000);
				},
			});
		});

		/** ***********************************************************************************/
		describe('absences', () => {
			apiTestingUtils.doDefaultListTests({
				searchParams: getApiQueryParams('reporting'),
				getApi : () => { return api; },
				getList : () => {
					return api.data.absences;
				},
				changeItem : (absence : SchedulingApiAbsenceBase) => {
					if (absence.isNewItem()) {
						absence.memberId = api.data.members.get(0)!.id;
					}

					absence.attributeInfoHourlyEarnings.value = testingUtils.getRandomNumber(5, 15, 1);
					absence.attributeInfoOwnerComment.value = testingUtils.getRandomString(30);
					absence.time.start = pMoment.m().valueOf() + testingUtils.getRandomNumber(0, 100000, 0);
					absence.time.end = pMoment.m().add(4, 'days').valueOf() + testingUtils.getRandomNumber(0, 100000, 0);
					absence.attributeInfoWorkingTimePerDay.value = null;
					absence.attributeInfoType.value = testingUtils.getRandomNumber(1, 3, 0);
					absence.visibleToTeamMembers = true;
				},
			});
		});
	});

	// //////////////////////////////////////////////////////////////////////////////////////////////
	// //// RIGHTS //////////////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////////////////////////
	describe('#rights', () => {
		let me : MeService;

		testingUtils.init(
			{
				imports: [],
				providers: [SchedulingApiService],
			});

		beforeAll(async () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			me = testingUtils.getService(MeService);
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('rights'));
		});

		/** ***********************************************************************************/
		describe('right-groups', () => {
			apiTestingUtils.doDefaultListTests(
				{
					searchParams: getApiQueryParams('rights'),
					getApi: () => { return api; },
					getList : () => {
						return api.data.rightGroups;
					},
					changeItem : (rightGroup : SchedulingApiRightGroupBase) => {
						rightGroup.name = testingUtils.getRandomString(10);
						rightGroup.role = testingUtils.getRandomBoolean() ? SchedulingApiRightGroupRole.CLIENT_DEFAULT :
							SchedulingApiRightGroupRole.CLIENT_OWNER;

						const isClientOwner = rightGroup.role === SchedulingApiRightGroupRole.CLIENT_OWNER;
						rightGroup.canReadAndWriteBookingSystemSettings = isClientOwner ? true : testingUtils.getRandomBoolean();

						// shift model rights
						if (rightGroup.isNewItem()) {
							const shiftModelRight1 = rightGroup.shiftModelRights.createNewItem();
							shiftModelRight1.shiftModelId = api.data.shiftModels.get(0)!.id;
							shiftModelRight1.canRead = true;
							shiftModelRight1.canWrite = true;
							shiftModelRight1.canWriteBookings = true;
							shiftModelRight1.canOnlineRefund = true;
							shiftModelRight1.canGetManagerNotifications = true;

							const shiftModelRight2 = rightGroup.shiftModelRights.createNewItem();
							shiftModelRight2.shiftModelParentName = api.data.shiftModels.get(0)!.parentName;
							shiftModelRight2.canRead = true;
							shiftModelRight2.canWrite = true;
							shiftModelRight2.canGetManagerNotifications = true;
						} else {
							rightGroup.shiftModelRights.remove(0);
						}
					},
					removeMethod: 'none',
				});
		});
	});

	// //////////////////////////////////////////////////////////////////////////////////////////////
	// //// BOOKING-SYSTEM-SETTINGS /////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////////////////////////
	describe('#booking-system-settings', () => {
		testingUtils.init(
			{
				imports: [],
				providers: [SchedulingApiService],
			});

		beforeAll(async () => {
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('bookingSystemSettings'));
		});

		/** ***********************************************************************************/
		describe('custom-course-mails', () => {
			apiTestingUtils.doDefaultListTests({
				searchParams: getApiQueryParams('bookingSystemSettings'),
				getApi : () => { return api; },
				getList : () => {
					return api.data.customBookableMails;
				},
				changeItem : (customBookableMail : SchedulingApiCustomBookableMail) => {
					customBookableMail.name = testingUtils.getRandomString(10);
					customBookableMail.eventType = testingUtils.getRandomNumber(1, 8, 0);
					customBookableMail.sendToBookingPerson = testingUtils.getRandomBoolean();
					customBookableMail.sendToParticipants = testingUtils.getRandomBoolean();
					customBookableMail.subjectTemplate = testingUtils.getRandomString(20);
					customBookableMail.textTemplate = testingUtils.getRandomString(20);
					// cSpell:ignore adam
					customBookableMail.replyTo = 'adam@dr-plano.de';
				},
			});
		});
	});

	// //////////////////////////////////////////////////////////////////////////////////////////////
	// //// AUTOMATIC WORKING_TIME CREATION /////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////////////////////////
	describe('#automatic-working-time-creation', () => {
		let me : MeService;

		testingUtils.init(
			{
				imports: [],
				providers: [SchedulingApiService],
			});

		// For these tests we also need to load the "reporting" data. But before each test the
		// "calendar" data should be loaded.
		beforeAll(async () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			me = testingUtils.getService(MeService);
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('calendar'));
		});

		const assignMember = (shift : SchedulingApiShiftBase) : SchedulingApiMemberBase => {
			const assignedMember = api.data.members.get(shift.assignableMembers.get(0)!.memberId)!;
			shift.assignedMemberIds.push(assignedMember.id);

			return assignedMember;
		};

		/** ***********************************************************************************/
		it('on-series-creation-for-past', (done : any) => {
			const cleanUp = (shiftId : ShiftId) : void => {
				api.load(
					{
						success: () => {
						// remove whole series of that shift
							api.data.shifts.removeItem(shiftId);
							api.data.shiftChangeSelector.shiftModelId = shiftId.shiftModelId;
							api.data.shiftChangeSelector.shiftsOfShiftModelVersion = shiftId.shiftModelVersion;
							api.data.shiftChangeSelector.shiftsOfSeriesId = shiftId.seriesId;

							api.save({success: () => { expect().nothing(); done();}, error: fail});

						},
						searchParams: getApiQueryParams('calendar'),
					});
			};

			// find shift-model which has automatic working-time creation
			let shiftModelFound = false;

			for (const shiftModel of api.data.shiftModels.iterable()) {
				// Value workingTimeCreationMethod is currently detailed. So we take "Yoga" shift-model which we know
				// is "AUTOMATIC"
				if (shiftModel.name === 'Yoga') {
					shiftModelFound = true;

					// create shift from this shift-model
					api.data.shifts.createNewShift(	shiftModel
						, 	pMoment.m().subtract(1, 'weeks')
						,	getApiQueryParams('calendar')
						, 	(newShift : SchedulingApiShiftBase) => {
						// we need an assigned member so a working-time entry will be created
							const assignedMember = assignMember(newShift);

							// save shift
							api.save(
								{
									success: () => {
										const shiftId = newShift.id;
										const shiftStart = newShift.start;
										const shiftEnd = newShift.end;

										// Now check if a working-time entry for this shift was automatically created
										api.load(
											{
												success: () => {
													for (const workingTime of api.data.workingTimes.iterable()) {
														// working-time was created
														if (	workingTime.memberId.equals(assignedMember.id)	&&
											workingTime.shiftModelId.equals(shiftModel.id)	&&
											workingTime.time.start === shiftStart	&&
											workingTime.time.end === shiftEnd) {
															cleanUp(shiftId);
															return;
														}
													}

													// no working-time created
													fail();
													cleanUp(shiftId);
												},
												searchParams: getApiQueryParams('reporting'),
											});
									},
								});
						});

					break;
				}
			}

			if (!shiftModelFound)
				api.console.warn('WARNING: No shift-model with AUTOMATIC working-time creation was found.');
		});

		/** ***********************************************************************************/
		it('on-working-time-creation-method-change-for-past', (done : any) => {
			// Find a working-time in the past with time-stamp creation method
			let foundShift = false;

			for (const shift of api.data.shifts.iterable()) {
				// past shift?
				if (shift.start < pMoment.m().valueOf()) {
					// Value workingTimeCreationMethod is currently detailed. So we take "Frühschicht" shift-model which we know
					// is "TIME_STAMP"
					const shiftModel = api.data.shiftModels.get(shift.shiftModelId)!;

					if (shiftModel.name === 'Frühschicht') {
						foundShift = true;

						// we need an assigned member so a working-time entry will be created
						const assignedMember = assignMember(shift);

						// change working-time-creation-method
						shift.workingTimeCreationMethod = SchedulingApiWorkingTimeCreationMethod.AUTOMATIC;

						// save shift
						api.save(
							{
								success: () => {
									const shiftStart = shift.start;
									const shiftEnd = shift.end;

									// Now check if a working-time entry for this shift was automatically created
									api.load(
										{
											success: () => {
												for (const workingTime of api.data.workingTimes.iterable()) {
													// working-time was created
													if (	workingTime.memberId.equals(assignedMember.id)	&&
											workingTime.shiftModelId.equals(shiftModel.id)	&&
											workingTime.time.start === shiftStart	&&
											workingTime.time.end === shiftEnd) {
														expect().nothing();
														done();
														return;
													}
												}

												// no working-time created
												fail();
											},
											searchParams: getApiQueryParams('reporting'),
										});
								},
								error: fail,
							});

						break;
					}
				}
			}

			if (!foundShift)
				api.console.warn('WARNING: No shift with TIME_STAMP working-time creation was found.');
		});
	});
});
