import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { BookingComponent } from './booking.component';

export const ROUTES : Routes = [
	{
		path: '',
		children: [
			{ path: '', redirectTo: '0', pathMatch: 'full' },
			{ path: 'create', redirectTo: 'create/0/participants', pathMatch: 'full' },
			{ path: 'create/:shiftId/:opentab', component: BookingComponent },
			{ path: 'create/:shiftId', component: BookingComponent },
			{ path: ':id/:opentab', component: BookingComponent },
			{ path: ':id', component: BookingComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class BookingRoutingModule { }
