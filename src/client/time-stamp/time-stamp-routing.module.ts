import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { TimeStampComponent } from './time-stamp.component';

export const ROUTES : Routes = [
	{
		path: '',
		component: TimeStampComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class TimeStampRoutingModule { }
