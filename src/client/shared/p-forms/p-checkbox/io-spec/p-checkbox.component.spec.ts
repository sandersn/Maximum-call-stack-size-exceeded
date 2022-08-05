import { ComponentFixture} from '@angular/core/testing';
import { fakeAsync, async } from '@angular/core/testing';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { CustomCheckboxTestComponent } from './p-checkbox-test.component';

describe('#PFormsModule#PCheckboxComponent#IO', () => {
	let fixture : ComponentFixture<CustomCheckboxTestComponent>;
	let component : CustomCheckboxTestComponent;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let inputElement : any;
	const testingUtils = new TestingUtils();

	beforeAll(async(() => {
		fixture = testingUtils.createFixture(CustomCheckboxTestComponent);
		component = fixture.componentInstance;
		// component.ngOnInit();
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
		expect(component.checked).toBeFalsy();
	});

	it('view value should be falsy by default', () => {
		expect(inputElement.checked).toBeFalsy();
	});

	// FIXME: PLANO-41583
	// it('ngModel ➡ view', fakeAsync(() => {
	// 	// Arrange
	// 	const newValue = true;
	// 	// Act
	// 	component.checked = newValue;
	// 	fixture.detectChanges();
	// 	tick();
	// 	fixture.detectChanges();
	// 	// Assert
	// 	expect(inputElement.checked).toEqual(newValue);
	// }));

	it('view ➡ ngModel (checked false)', fakeAsync(() => {
		// Arrange
		const newValue = false;
		// Act
		inputElement.checked = newValue;
		inputElement.dispatchEvent(new Event('change'));
		// Assert
		expect(component.checked).toBe(newValue);
	}));

	it('view ➡ ngModel (checked true)', fakeAsync(() => {
		// Arrange
		const newValue = true;
		// Act
		inputElement.checked = newValue;
		inputElement.dispatchEvent(new Event('change'));
		// Assert
		expect(component.checked).toBe(newValue);
	}));

	// NOTE: These are protector tests. not karma. they need to move somewhere else.
	// it('click to toggle', fakeAsync(() => {
	// 	// Arrange
	// 	const initialValue = component.checked;
	// 	// Act
	// 	element(by.tagName('p-checkbox')).click();
	// 	// Assert
	// 	expect(component.checked).toBe(!initialValue);
	// }));
	//
	// it('hit space to toggle', fakeAsync(() => {
	// 	// Arrange
	// 	const initialValue = component.checked;
	// 	// Act
	// 	element(by.tagName('p-checkbox')).sendKeys(Key.SPACE);
	// 	// Assert
	// 	expect(component.checked).toBe(!initialValue);
	// }));

});
