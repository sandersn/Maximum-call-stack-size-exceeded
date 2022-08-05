import { AuthenticatedApiRole } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '@plano/shared/core/log.service';
import { MeService } from '@plano/shared/core/me/me.service';
import { FakeMeService } from '@plano/shared/core/me/me.service.mock';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PPermissionService } from './permission.service';
import { RightsService } from './rights.service';
import { SchedulingModule } from '../scheduling/scheduling.module';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';
import { FakeSchedulingApiService } from '../scheduling/shared/api/scheduling-api.service.mock';

describe('#RightsService', () => {
	let service : RightsService;
	let fakeMe : FakeMeService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll(done => {
		const fakeApi = new FakeSchedulingApiService();
		fakeMe = new FakeMeService();
		service = new RightsService(
			fakeMe as MeService,
			fakeApi as unknown as SchedulingApiService,
			undefined as unknown as LogService,
			undefined as unknown as PPermissionService,
		);
		done();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('requester should be owner', () => {
		expect(service.requesterIs(AuthenticatedApiRole.CLIENT_OWNER)).toBeTruthy();
	});

	it('requester should not have id 123', () => {
		const SOME_OTHER_MEMBER_ID = Id.create(123);
		expect(service.requesterIs(SOME_OTHER_MEMBER_ID)).toBeFalsy();
	});

	it('requester should have his own id', () => {
		const ID = fakeMe.data.id;
		expect(service.requesterIs(ID)).toBeTruthy();
	});

});
