import { ComponentFixture} from '@angular/core/testing';
import { fakeAsync, tick, async } from '@angular/core/testing';
import { PApiPrimitiveTypes, PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PInputTestComponent } from './test.component';

describe('#PFormsModule#PInputComponent#IO', () => {
	let fixture : ComponentFixture<PInputTestComponent>;
	let component : PInputTestComponent;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let inputElement : any;
	const testingUtils = new TestingUtils();

	beforeAll(async(() => {
		fixture = testingUtils.createFixture(PInputTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		inputElement = fixture.nativeElement.querySelector('input');
	}));

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

	describe('should change value passed as @Input()', () => {
		const testCases = [
			{
				inputName: 'type', newValue: 'text',
			},
			// {
			// 	inputName: 'placeholder', newValue: 'some placeholder',
			// },
		];

		testCases.map(tc => {
			it(`for '${tc.inputName}' property`, fakeAsync(() => {
				// Arrange
				// eslint-disable-next-line @typescript-eslint/typedef
				const { inputName, newValue } = tc;
				// Act
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(component as any)[inputName] = newValue;
				tick();
				fixture.detectChanges();
				// Assert
				expect(inputElement[inputName]).toEqual(newValue);
			}));
		});
	});

	describe('type text (default)', () => {
		beforeAll(fakeAsync(() => {
			component.type = PApiPrimitiveTypes.string;
			inputElement.dispatchEvent(new Event('change'));
		}));

		it('ngModel ➡ view', fakeAsync(() => {
			// Arrange
			const newValue = 'New Name from Model';
			// Act
			component.value = newValue;
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			// Assert
			expect(inputElement.value).toEqual(newValue);
		}));

		it('view ➡ ngModel', fakeAsync(() => {
			// Arrange
			const newValue = 'New Name from View';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toEqual(newValue);
		}));

	});

	describe('type minutes', () => {
		beforeAll(fakeAsync(() => {
			component.type = PApiPrimitiveTypes.Duration;
			component.durationUIType = PApiPrimitiveTypes.Minutes;
			inputElement.dispatchEvent(new Event('change'));
		}));

		it('ngModel 90006600 ➡ view »1.500,11«', fakeAsync(() => {
			// Arrange
			const newValue = 90006600;
			// Act
			component.value = newValue;
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			// Assert
			expect(inputElement.value).toEqual('1.500,11');
		}));

		it('view »1.500,99« ➡ ngModel 90059400', fakeAsync(() => {
			// Arrange
			const newValue = '1.500,99';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(90059400);
		}));
	});

	describe('type number', () => {
		beforeAll(fakeAsync(() => {
			component.type = PApiPrimitiveTypes.Integer;
			inputElement.dispatchEvent(new Event('change'));
		}));

		describe('de_DE', () => {
			beforeAll(fakeAsync(() => {
				component.locale = PSupportedLocaleIds.de_DE;
				inputElement.dispatchEvent(new Event('change'));
			}));

			it('ngModel 12.5 ➡ view »12,5«', fakeAsync(() => {
				// Arrange
				const newValue = 12.5;
				// Act
				component.value = newValue;
				fixture.detectChanges();
				tick();
				fixture.detectChanges();
				// Assert
				expect(inputElement.value).toEqual('12,5');
			}));

			it('view »123,5« ➡ ngModel 123.5', fakeAsync(() => {
				// Arrange
				const newValue = '123,5';
				// Act
				inputElement.value = newValue;
				inputElement.dispatchEvent(new Event('change'));
				// Assert
				expect(component.value).toBe(123.5);
			}));

			it('view »12.5« ➡ ngModel »\'12.5\'«', fakeAsync(() => {
				// Arrange
				const newValue = '12.5';
				// Act
				inputElement.value = newValue;
				inputElement.dispatchEvent(new Event('change'));
				// Assert
				expect(component.value).toBe(newValue);
			}));
		});

		describe('en_GB', () => {
			beforeAll(fakeAsync(() => {
				component.locale = PSupportedLocaleIds.en_GB;
				inputElement.dispatchEvent(new Event('change'));
			}));

			it('ngModel 5.5 ➡ view »5.5«', fakeAsync(() => {
				// Arrange
				const newValue = 5.5;
				// Act
				component.value = newValue;
				fixture.detectChanges();
				tick();
				fixture.detectChanges();
				// Assert
				expect(inputElement.value).toEqual('5.5');
			}));

			it('view »123.5« ➡ ngModel 123.5', fakeAsync(() => {
				// Arrange
				const newValue = '123.5';
				// Act
				inputElement.value = newValue;
				inputElement.dispatchEvent(new Event('change'));
				// Assert
				expect(component.value).toBe(123.5);
			}));

			it('view »12,5« ➡ ngModel »\'12,5\'«', fakeAsync(() => {
				// Arrange
				const newValue = '12,5';
				// Act
				inputElement.value = newValue;
				inputElement.dispatchEvent(new Event('change'));
				// Assert
				expect(component.value).toBe(newValue);
			}));
		});
	});

	describe(`type ${PApiPrimitiveTypes.Hours}`, () => {
		beforeAll(fakeAsync(() => {
			component.type = PApiPrimitiveTypes.Duration;
			component.durationUIType = PApiPrimitiveTypes.Hours;

			inputElement.dispatchEvent(new Event('change'));
		}));

		it('view »1« ➡ ngModel 3600000', fakeAsync(() => {
			// Arrange
			const newValue = '1';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(3600000);
		}));

		it('view »12,« ➡ ngModel null', fakeAsync(() => {
			// Arrange
			const newValue = '12,';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(null);
		}));
	});

	describe('type time', () => {
		beforeAll(fakeAsync(() => {
			component.type = PApiPrimitiveTypes.LocalTime;
			inputElement.dispatchEvent(new Event('change'));
		}));

		it('view 00:00 ➡ ngModel 0', fakeAsync(() => {
			// Arrange
			const newValue = '00:00';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(0);
		}));

		it('view 23:59 ➡ ngModel 86340000', fakeAsync(() => {
			// Arrange
			const newValue = '23:59';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(86340000);
		}));

		it(`view '' ➡ ngModel undefined`, fakeAsync(() => {
			// Arrange
			const newValue = '';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(null);
		}));
	});

	describe('type days', () => {
		beforeAll(fakeAsync(() => {
			component.type = PApiPrimitiveTypes.Duration;
			component.durationUIType = PApiPrimitiveTypes.Days;

			inputElement.dispatchEvent(new Event('change'));
		}));

		it('view 4 ➡ ngModel 345600000', fakeAsync(() => {
			// Arrange
			const newValue = '4';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(345600000);
		}));
	});

	describe('type currency', () => {
		beforeAll(fakeAsync(() => {
			component.locale = PSupportedLocaleIds.de_DE;
			component.type = PApiPrimitiveTypes.Currency;
			inputElement.dispatchEvent(new Event('change'));
		}));

		it('ngModel 12.5 ➡ view »12,5«', fakeAsync(() => {
			// Arrange
			const newValue = 12.5;
			// Act
			component.value = newValue;
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			// Assert
			expect(inputElement.value).toEqual('12,50');
		}));

		it('view »12,5« ➡ ngModel 12.5', fakeAsync(() => {
			// Arrange
			const newValue = '12,5';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(12.5);
		}));

		it(`view »12.5« ➡ ngModel »12.5«`, fakeAsync(() => {
			// Arrange
			const newValue = '12.5';
			// Act
			inputElement.value = newValue;
			inputElement.dispatchEvent(new Event('change'));
			// Assert
			expect(component.value).toBe(newValue);
		}));
	});

});
