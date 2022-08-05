import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { ShiftExchangesComponent } from './shift-exchanges.component';

export const ROUTES : Routes = [
	{
		path: '',
		component: ShiftExchangesComponent,
	},
	{ path: ':start', component: ShiftExchangesComponent },
	{ path: ':start/:end', component: ShiftExchangesComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class ShiftExchangesRoutingModule { }
