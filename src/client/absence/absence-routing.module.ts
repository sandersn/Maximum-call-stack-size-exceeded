import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { PAbsenceComponent } from './absence.component';

export const ROUTES : Routes = [
	{
		path: '',
		children: [
			{ path: '', redirectTo: '0', pathMatch: 'full' },
			{ path: ':id', component: PAbsenceComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class AbsenceRoutingModule { }
