import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { IcalComponent } from './ical.component';

export const ROUTES : Routes = [
	{ path: '', component: IcalComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class IcalRoutingModule { }
