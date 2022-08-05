import { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PTariffMetaInfoComponent } from './tariff-meta-info.component';

describe('BasicInfoComponent', () => {
	let component : PTariffMetaInfoComponent;
	let fixture : ComponentFixture<PTariffMetaInfoComponent>;

	beforeEach(() => {
		fixture = TestBed.createComponent(PTariffMetaInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
