import { ComponentFixture} from '@angular/core/testing';
import { fakeAsync, tick, async } from '@angular/core/testing';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { CustomMultiValueInputTestComponent } from './p-multi-value-input-test.component';

describe('#PFormsModule#PMultiValueInputComponent#IO', () => {
	let fixture : ComponentFixture<CustomMultiValueInputTestComponent>;
	let component : CustomMultiValueInputTestComponent;
	let inputElement : HTMLInputElement;
	const testingUtils = new TestingUtils();

	beforeAll(async(() => {
		fixture = testingUtils.createFixture(CustomMultiValueInputTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		inputElement = fixture.nativeElement.querySelector('input');
	}));

	beforeEach(fakeAsync(() => {
		fixture.detectChanges();
		tick();
	}));

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	it('should have a input element', () => {
		expect(inputElement).not.toBeNull();
		expect(inputElement).not.toBeUndefined();
	});

	it('model should be empty by default', () => {
		expect(component.value.length).toBe(0);
	});

	it('view value should be falsy by default', () => {
		expect(inputElement.value).toBeFalsy();
	});

	it('ngModel ➡ view', fakeAsync(() => {
		// Arrange
		const newValue = ['Hallo', 'Welt'];
		// Act
		component.value = newValue;
		fixture.detectChanges();
		tick();
		fixture.detectChanges();
		// Assert
		expect(inputElement.value).toEqual('');
	}));

	// it('view ➡ ngModel', fakeAsync(() => {
	// 	// Arrange
	// 	const newValue = 'Universum';
	// 	// Act
	// 	inputElement.value = newValue;
	// 	inputElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
	// 	inputElement.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter'}));
	// 	inputElement.dispatchEvent(new Event('change'));
	// 	fixture.detectChanges();
	// 	tick();
	// 	fixture.detectChanges();
	// 	// Assert
	// 	expect(component.value).toEqual(newValue);
	// }));
});
