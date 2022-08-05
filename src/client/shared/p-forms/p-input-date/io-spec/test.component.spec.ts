import { ComponentFixture} from '@angular/core/testing';
import { fakeAsync, tick, async } from '@angular/core/testing';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PInputDateTestComponent } from './test.component';
import { PInputDateTypes } from '../p-input-date.component';

describe('#PFormsModule#PInputDateComponent#IO', () => {
	let fixture : ComponentFixture<PInputDateTestComponent>;
	let component : PInputDateTestComponent;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let inputElement : any;
	const testingUtils = new TestingUtils();

	beforeAll(async(() => {
		fixture = testingUtils.createFixture(PInputDateTestComponent);
		component = fixture.componentInstance;
		component.type = PInputDateTypes.deadline;
		fixture.detectChanges();
		inputElement = fixture.nativeElement.querySelector('input');
	}));

	// const addTest = (
	// 	locale : PSupportedLocaleIds,
	// 	ngModel: number,
	// 	value: string,
	// ) => {
	// 	describe(locale, () => {
	// 		beforeEach(fakeAsync(() => {
	// 			component.type = undefined;
	// 			component.locale = PSupportedLocaleIds[locale];
	// 			component.value = '';
	// 			inputElement.dispatchEvent(new Event('change'));
	// 		}));
	//
	// 		it(`ngModel ${ngModel} ➡ view ${value}`, fakeAsync(() => {
	// 			// Arrange
	// 			const newModel = ngModel;
	// 			// Act
	// 			component.value = newModel;
	// 			fixture.detectChanges();
	// 			tick();
	// 			fixture.detectChanges();
	// 			// Assert
	// 			expect(inputElement.value).toEqual(value);
	// 		}));
	//
	// 		it(`view ${value} ➡ ngModel ${ngModel}`, fakeAsync(() => {
	// 			// Arrange
	// 			const newValue = value;
	// 			// Act
	// 			inputElement.value = newValue;
	// 			inputElement.dispatchEvent(new Event('change'));
	// 			// Assert
	// 			expect(component.value).toEqual(ngModel);
	// 		}));
	//
	// 	});
	// };

	const addDeadlineTest = (
		locale : PSupportedLocaleIds,
		max : number,
		ngModel : number,
		value : string,
	) : void => {
		describe(locale, () => {
			describe(`with shift at ${new PMomentService(locale).m(max).format('HH:mm')}`, () => {
				beforeAll(fakeAsync(() => {
					component.type = PInputDateTypes.deadline;
					component.locale = locale;
					component.max = max;
					component.value = ngModel;
					inputElement.dispatchEvent(new Event('change'));
				}));

				it('ngModel ➡ view', fakeAsync(() => {
					// Arrange
					const newValue = ngModel;
					// Act
					component.value = newValue;
					fixture.detectChanges();
					tick();
					fixture.detectChanges();
					// Assert
					expect(inputElement.value).toEqual(value);
				}));
			});

			describe(`with shift at ${new PMomentService(locale).m(max).format('HH:mm')}`, () => {
				beforeAll(fakeAsync(() => {
					component.type = PInputDateTypes.deadline;
					component.locale = locale;
					component.max = max;
					inputElement.dispatchEvent(new Event('change'));
				}));

				it('view ➡ ngModel', fakeAsync(() => {
					// Arrange
					const newValue = value;
					// Act
					inputElement.value = newValue;
					inputElement.dispatchEvent(new Event('change'));
					// Assert
					expect(component.value).toEqual(ngModel);
				}));
			});
		});
	};

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	it('should have a input element', () => {
		expect(inputElement).not.toBeNull();
		expect(inputElement).not.toBeUndefined();
	});

	it('model should be falsy by default', () => {
		expect(component.value).toBeFalsy();
	});

	it('view value should be falsy by default', () => {
		expect(inputElement.value).toBeFalsy();
	});

	// describe('isExclusiveEnd on day of times-shift in germany [PLANO-9191]', () => {
	// 	addTest(
	// 		PSupportedLocaleIds.de_DE,
	// 		1585454400000,
	// 		'3',
	// 	);
	// });

	describe('type deadline', () => {
		addDeadlineTest(
			PSupportedLocaleIds.de_DE,
			1586415600000, // Apr 09 2020 09:00:00 GMT+0200 (Central European Summer Time)
			1586210400000, // Apr 07 2020 00:00:00 GMT+0200 (Central European Summer Time)
			'3',
		);
		addDeadlineTest(
			PSupportedLocaleIds.de_DE,
			1586383200000, // Apr 09 2020 00:00:00 GMT+0200 (Central European Summer Time)
			1586210400000, // Apr 07 2020 00:00:00 GMT+0200 (Central European Summer Time)
			'3',
		);
		addDeadlineTest(
			PSupportedLocaleIds.en_GB,
			1586419200000, // Apr 09 2020 09:00:00 GMT+0100
			1586214000000, // Apr 07 2020 00:00:00 GMT+0100
			'3',
		);

	});
});
