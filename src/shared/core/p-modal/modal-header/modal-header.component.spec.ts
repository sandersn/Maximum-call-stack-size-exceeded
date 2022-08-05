import { HttpParams } from '@angular/common/http';
import { PossibleApiLoadDataValues } from '@plano/client/scheduling/scheduling-api-based-pages.service';
import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ModalHeaderComponent } from './modal-header.component';

describe('ModalHeaderComponent #needsapi', () => {
	let component : ModalHeaderComponent;

	const testingUtils = new TestingUtils();

	/**
	 * getApiQueryParams
	 */
	const getApiQueryParams = (dataType : PossibleApiLoadDataValues) : HttpParams => {
		const now = new PMomentService(PSupportedLocaleIds.de_DE).m();

		return new HttpParams()
			.set('data', dataType)
			.set('start', now.clone().valueOf().toString())
			.set('end', now.clone().add(1, 'week').valueOf().toString());
	};

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(ModalHeaderComponent);
					done();
				},
				getApiQueryParams('calendar'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
