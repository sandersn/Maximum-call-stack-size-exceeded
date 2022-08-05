import { HttpParams } from '@angular/common/http';
import { SchedulingApiNotificationSettingsDeviceType } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { NotificationsComponent } from './notifications.component';
import { ClientModule } from '../client.module';
import { PossibleApiLoadDataValues } from '../scheduling/scheduling-api-based-pages.service';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';

describe('#NotificationsComponent #needsapi', () => {
	let component : NotificationsComponent;

	const testingUtils = new TestingUtils();

	/**
	 * getApiQueryParams
	 */
	const getApiQueryParams = (dataType : PossibleApiLoadDataValues) : HttpParams => {
		return new HttpParams()
			.set('data', dataType);
	};

	testingUtils.init({ imports : [ClientModule] });

	beforeAll((done) => {
		testingUtils.login(
			{
				success: () => {
					testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
						component = testingUtils.createComponent(NotificationsComponent);
						done();
					}, getApiQueryParams('notifications'));
				},
			},
		);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('getDeviceTypeIcon', () => {
		it('(SchedulingApiNotificationSettingsDeviceType.WEB_PUSH_NOTIFICATION) should return a string', () => {
			expect(() => {
				component.getDeviceTypeIcon(SchedulingApiNotificationSettingsDeviceType.WEB_PUSH_NOTIFICATION);
			}).not.toThrow();
		});
		it('(undefined) should return a string', () => {
			expect(() => {
				component.getDeviceTypeIcon(undefined!);
			}).toThrow();
		});
	});

});
