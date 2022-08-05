import { ComponentFixture} from '@angular/core/testing';
import { fakeAsync, tick, async } from '@angular/core/testing';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { CustomTextareaTestComponent } from './p-textarea-test.component';

describe('#PFormsModule#PTextareaComponent#IO', () => {
	let fixture : ComponentFixture<CustomTextareaTestComponent>;
	let component : CustomTextareaTestComponent;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let inputElement : any;
	const testingUtils = new TestingUtils();

	beforeAll(async(() => {
		fixture = testingUtils.createFixture(CustomTextareaTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		inputElement = fixture.nativeElement.querySelector('textarea');
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

	it('ngModel ➡ view', fakeAsync(() => {
		// Arrange
		const newValue = 'Hallo Welt';
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
		const newValue = 'Hallo Universum';
		// Act
		inputElement.value = newValue;
		inputElement.dispatchEvent(new Event('change'));
		// Assert
		expect(component.value).toEqual(newValue);
	}));
});
