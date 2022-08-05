import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { SchedulingApiService} from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PMemberBadgeService } from './p-member-badge.service';

describe('#PMemberBadgeService', () => {
	let service : PMemberBadgeService;
	let fakeApi : SchedulingApiService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll(done => {
		fakeApi = new FakeSchedulingApiService() as unknown as SchedulingApiService;
		service = testingUtils.getService(PMemberBadgeService);
		done();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getInitials()', () => {
		describe('Add Anna Storch and Adam Schlondra', () => {
			let adam : SchedulingApiMember;
			let annaStorch : SchedulingApiMember;
			beforeAll(() => {
				adam = fakeApi.data.members.createNewItem(Id.create(123));
				adam.firstName = 'Adam';
				adam.lastName = 'Schlondra';
				annaStorch = fakeApi.data.members.createNewItem(Id.create(124));
				annaStorch.firstName = 'Anna';
				annaStorch.lastName = 'Storch';
			});

			it('Adam Schlondra to AdS, if there is a Anna Storch', () => {
				expect(!!annaStorch).toBe(true);
				const initials = service.getInitials(adam, fakeApi.data.members);
				expect(initials).toBe('AdS');
			});
			it('Anna Storch to AnS, if there is a Adam Schlondra', () => {
				expect(!!annaStorch).toBe(true);
				const initials = service.getInitials(annaStorch, fakeApi.data.members);
				expect(initials).toBe('AnS');
			});
			describe('add a Anna Schmidt', () => {
				let annaSchmidt : SchedulingApiMember;
				beforeAll(() => {
					annaSchmidt = fakeApi.data.members.createNewItem();
					annaSchmidt.firstName = 'Anna';
					annaSchmidt.lastName = 'Schmidt';
					service.resetInitials();
				});
				it('Anna Storch to AnSt and Anna Schmidt to AnSc', () => {
					expect(service.getInitials(annaStorch, fakeApi.data.members)).toBe('AnSt');
					expect(service.getInitials(annaSchmidt, fakeApi.data.members)).toBe('AnSc');
				});
			});
		});

		describe('Add Alex Honneth and trashed Alex Honneth', () => {
			let johannSebastianBach : SchedulingApiMember;
			let trashedJohannSebastianBach : SchedulingApiMember;
			beforeAll(() => {
				johannSebastianBach = new SchedulingApiMember(null, 123);
				johannSebastianBach.firstName = 'Johann Sebastian';
				johannSebastianBach.lastName = 'Bach';
				fakeApi.data.members.push(johannSebastianBach);

				trashedJohannSebastianBach = new SchedulingApiMember(null, 123456);
				trashedJohannSebastianBach.firstName = 'Johann Sebastian (gelöscht)';
				trashedJohannSebastianBach.lastName = 'Bach';
				trashedJohannSebastianBach.trashed = true;
				fakeApi.data.members.push(trashedJohannSebastianBach);
			});

			it('should generate AH for both', () => {
				expect(service.getInitials(johannSebastianBach, fakeApi.data.members)).toBe('JB');
				expect(service.getInitials(trashedJohannSebastianBach, fakeApi.data.members)).toBe('JB');
			});
		});
	});

	describe('Nils Holgersson has two accounts [PLANO-20460]', () => {
		let user : SchedulingApiMember;
		let user2 : SchedulingApiMember;
		beforeAll(() => {
			user = new SchedulingApiMember(null, 3253466432);
			user.firstName = 'Nils';
			user.lastName = 'Holgersson';
			fakeApi.data.members.push(user);

			user2 = new SchedulingApiMember(null, 4323884772738674);
			user2.firstName = 'Nils';
			user2.lastName = 'Holgersson ?';
			fakeApi.data.members.push(user2);
		});

		it('should generate NiHol for both', () => {
			expect(service.getInitials(user, fakeApi.data.members)).toBe('NiHol');
			expect(service.getInitials(user2, fakeApi.data.members)).toBe('NiHol');
		});
	});

	describe('initials that should never be returned', () => {
		const shouldBeCustomized = (initial1 : string, initial2 : string) : void => {
			let member : SchedulingApiMember;
			beforeAll(() => {
				member = new SchedulingApiMember(null);
				member.firstName = `${initial1}foo`;
				member.lastName = `${initial2}bar`;
			});

			it(initial1 + initial2, () => {
				expect(service.getInitials(member, fakeApi.data.members)).not.toBe(initial1 + initial2);
			});
		};

		shouldBeCustomized('S', 'S');
		shouldBeCustomized('S', 'A');
		shouldBeCustomized('S', 'D');
		shouldBeCustomized('B', 'H');
		shouldBeCustomized('N', 'S');
		shouldBeCustomized('N', 'Su');
		shouldBeCustomized('Ns', 'U');
		shouldBeCustomized('A', 'Ds');
		shouldBeCustomized('Ad', 'S');
		shouldBeCustomized('W', 'C');
		shouldBeCustomized('K', 'Z');
		shouldBeCustomized('A', 'H');
		shouldBeCustomized('H', 'H');
		shouldBeCustomized('I', 'S');
		shouldBeCustomized('M', 'S');
		shouldBeCustomized('A', 'A');
		shouldBeCustomized('S', 'M');
		shouldBeCustomized('G', 'V');
		shouldBeCustomized('Kk', 'K');
		shouldBeCustomized('W', 'P');
		shouldBeCustomized('Np', 'D');
	});

});
