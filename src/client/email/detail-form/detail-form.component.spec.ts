import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { DetailFormComponent } from './detail-form.component';

describe('#Email_DetailFormComponent #needsapi', () => {
	let api : SchedulingApiService;
	let component : DetailFormComponent;
	let fixture : ComponentFixture<DetailFormComponent>;

	const testingUtils = new TestingUtils();

	/**
	 * getApiQueryParams
	 */
	const getApiQueryParams = () : HttpParams => {
		return new HttpParams()
			.set('data', 'bookingSystemSettings');
	};

	testingUtils.init({ imports : [DetailFormComponent] });

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams());
		fixture = TestBed.createComponent(DetailFormComponent);
		component = fixture.componentInstance;
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('formGroup', () => {
		beforeAll((done) => {
			component.item = api.data.customBookableMails.get(0)!;
			component.initComponent(done);
		});
		it('should be defined', () => {
			expect(component.formGroup).toBeDefined();
		});
		// FIXME: PLANO-6369
		// NOTE: This formGroup's state is pending because of the async email validator
		// 	it('should be valid',
		// 		() => {
		// 			expect(component.formGroup.valid).toBe(true);
		// 		});
		// 		// (done : any) => {
		// 		// 	fixture.detectChanges();
		// 		// 	fixture.whenStable().then(() => {
		// 		// 		fixture.detectChanges();
		// 		// 		expect(component.formGroup.valid).toBe(true);
		// 		// 		done();
		// 		// 	});
		// 		// });
		// });

	});
});
