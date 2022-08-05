import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { ShiftModelComponent } from './shiftmodel.component';

export const ROUTES : Routes = [
	{
		path: 'copy',
		children: [
			{ path: '', redirectTo: '0', pathMatch: 'full' },
			{ path: ':id/:opentab', component: ShiftModelComponent },
			{ path: ':id', component: ShiftModelComponent },
		],
	},
	{
		path: '',
		children: [
			{ path: '', redirectTo: '0', pathMatch: 'full' },
			{ path: ':id/:opentab', component: ShiftModelComponent },
			{ path: ':id', component: ShiftModelComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class ShiftModelRoutingModule { }
