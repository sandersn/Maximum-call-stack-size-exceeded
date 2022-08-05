import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';

export const ROUTES : Routes = [
	{ path: ':opentab', component: SalesComponent },
	{ path: '', component: SalesComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class SalesRoutingModule { }
