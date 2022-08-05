import { SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationState, SchedulingApiShiftExchangeRequesterRelationship } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PCommunicationData } from './p-communication-data';
import { PShiftExchangeConceptService } from './p-shift-exchange-concept.service';
import { PShiftExchangeModule } from './p-shift-exchange.module';
import { LogService } from '../../../shared/core/log.service';

describe('#PShiftExchangeConceptService', () => {
	let service : PShiftExchangeConceptService;
	let logService : LogService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [PShiftExchangeModule] });

	beforeAll(() => {
		service = testingUtils.getService(PShiftExchangeConceptService);
		logService = testingUtils.getService(LogService);
	});

	it('should have a defined component', () => {
		expect(service).toBeDefined();
	});

	describe('.needsReview', () => {
		const enumComState = SchedulingApiShiftExchangeCommunicationState;
		const enumRelationship = SchedulingApiShiftExchangeRequesterRelationship;

		describe('(IM, CP_WANTS_SWAP)', () => {
			it('should return false', () => {
				expect(service.needsReviewByCP(enumRelationship.IM, enumComState.CP_WANTS_SWAP)).toBe(false);
				expect(service.needsReviewByIM(enumRelationship.IM, enumComState.CP_WANTS_SWAP)).toBe(false);
			});
		});
		describe('(CP, CP_NOT_RESPONDED)', () => {
			it('should return false', () => {
				expect(service.needsReviewByCP(enumRelationship.CP, enumComState.CP_NOT_RESPONDED)).toBe(false);
				expect(service.needsReviewByIM(enumRelationship.CP, enumComState.CP_NOT_RESPONDED)).toBe(false);
			});
		});
		describe('(A, CP_WANTS_SWAP)', () => {
			it('should return true', () => {
				expect(service.needsReviewByIM(enumRelationship.A, enumComState.CP_WANTS_SWAP)).toBe(true);
			});
		});
		describe('(CP, CP_WANTS_SWAP)', () => {
			it('should return true', () => {
				expect(service.needsReviewByIM(enumRelationship.CP, enumComState.CP_WANTS_SWAP)).toBe(true);
			});
		});
		describe('(A, IM_CHANGED_MIND_WANTS_SWAP)', () => {
			it('should return true', () => {
				expect(service.needsReviewByCP(enumRelationship.A, enumComState.IM_CHANGED_MIND_WANTS_SWAP)).toBe(true);
			});
		});
		describe('(CP, IM_CHANGED_MIND_WANTS_TAKE)', () => {
			it('should return false', () => {
				expect(service.needsReviewByCP(enumRelationship.CP, enumComState.IM_CHANGED_MIND_WANTS_TAKE)).toBe(false);
			});
		});
		describe('(IM, IM_CHANGED_MIND_WANTS_TAKE)', () => {
			it('should return true', () => {
				expect(service.needsReviewByCP(enumRelationship.IM, enumComState.IM_CHANGED_MIND_WANTS_TAKE)).toBe(true);
			});
		});
	});

	describe('.replaceTemplateMarkers()', () => {
		it('pCommunicationData', () => {
			const pCommunicationData = new PCommunicationData(new LocalizePipe(logService, PSupportedLocaleIds.de_DE));
			for (const item of pCommunicationData.arrayOfActionTexts) {
				const member = new SchedulingApiMember(null, 5);
				member.firstName = 'A';
				member.lastName = 'B';
				const shiftExchangeObject : Parameters<PShiftExchangeConceptService['replaceTemplateMarkers']>[1] = {
					indisposedMemberId : member.id,
					isIllness : false,
					indisposedMember : member,
					shiftRefs : new SchedulingApiShiftExchangeShiftRefs(null, false),
					lastUpdate : 12345678,
					communications : undefined!,
					rawData : true,
				};
				const matches = service.replaceTemplateMarkers(item.text, shiftExchangeObject)!.match(/#[\dA-Z]*#/g);
				expect(!!matches && !!matches.length).toBe(false);
			}
		});
	});
});
