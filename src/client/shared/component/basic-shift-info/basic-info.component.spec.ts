import { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PBasicInfoComponent } from './basic-info.component';

describe('BasicInfoComponent', () => {
	let component : PBasicInfoComponent;
	let fixture : ComponentFixture<PBasicInfoComponent>;

	beforeEach(() => {
		fixture = TestBed.createComponent(PBasicInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
