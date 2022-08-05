import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PParticipantsService } from './p-participants.service';
import { BookingModule } from '../../booking.module';

describe('PParticipantsService', () => {
	let service : PParticipantsService;
	const testingUtils = new TestingUtils();

	testingUtils.init({
		imports: [BookingModule],
	});

	beforeAll(done => {
		service = testingUtils.getService(PParticipantsService);
		done();
	});

	it('should have a defined instance', () => {
		expect(service).toBeDefined();
	});

	it('dateOfBirthReachedMinAgeLimit(…)', () => {
		const dateOfBirth = new Date('2000-01-01').valueOf();
		const referenceDate = new Date('2022-01-01').valueOf();
		expect(service.dateOfBirthReachedMinAgeLimit(dateOfBirth, referenceDate, 16)).toBeFalse();
	});
	it('dateOfBirthReachedMaxAgeLimit(…)', () => {
		const dateOfBirth = new Date('2000-01-01').valueOf();
		const referenceDate = new Date('2022-01-01').valueOf();
		expect(service.dateOfBirthReachedMaxAgeLimit(dateOfBirth, referenceDate, 17)).toBeTrue();
	});

});
