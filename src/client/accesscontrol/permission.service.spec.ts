import { PPermissionService } from './permission.service';
import { RightEnums } from './permission.service';
import { ShiftsAndShiftModelsRights } from './rights-enums';
import { LogService } from '../../shared/core/log.service';
import { PSentryService } from '../../shared/sentry/sentry.service';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';
import { FakeSchedulingApiService } from '../scheduling/shared/api/scheduling-api.service.mock';

describe('PPermissionService', () => {
	let service : PPermissionService;
	let api : SchedulingApiService;

	beforeAll(() => {
		api = (new FakeSchedulingApiService()) as unknown as SchedulingApiService;
		const pSentryService = new PSentryService();
		const logService = new LogService(pSentryService);
		service = new PPermissionService(logService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('hasPermission()', () => {

		describe('ShiftsAndShiftModelsRights', () => {
			const testEnumValue = (_expectedResult : boolean, rightEnum : RightEnums) : void => {
				it(rightEnum, () => {
					const member = api.data.members.get(0)!;
					expect(member).toBeDefined();
					const shiftModel = api.data.shiftModels.get(0)!;
					expect(shiftModel).toBeDefined();
					const rightGroup = api.data.rightGroups.get(0)!;
					expect(rightGroup).toBeDefined();
					const HAS_PERMISSION = service.getPermission(
						rightEnum,
						rightGroup.role,
						rightGroup.shiftModelRights.getByItem(shiftModel)!,
						!!shiftModel.assignableMembers.getByMemberId(member.id),
					);
					expect(HAS_PERMISSION).toBeDefined();
				});
			};

			// This is just for easier debugging
			testEnumValue(true, ShiftsAndShiftModelsRights.editShiftAssignedMembers);

			const keys = Object.values(ShiftsAndShiftModelsRights) as RightEnums[];

			for (const someKey of keys) {
				testEnumValue(true, someKey);
			}
		});
	});

});
