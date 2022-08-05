import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { SchedulingComponent } from './scheduling.component';

export const ROUTES : Routes = [
	{ path: '', redirectTo: 'month/0', pathMatch: 'full' },
	{
		path: ':calendarMode',
		redirectTo: ':calendarMode/0',
		pathMatch: 'full',
	},
	{
		path: 'undefined/:date',
		redirectTo: 'month/:date',
		pathMatch: 'full',
	},
	{
		path: ':calendarMode/:date',
		component: SchedulingComponent,
	},
	{
		path: ':calendarMode/:date/:detailObject',
		redirectTo: ':calendarMode/:date/shift/0',
		pathMatch: 'full',
	},
	// TODO: this is probably obsolete through PLANO-5510
	{ path: ':calendarMode/:date/:detailObject/:detailObjectId', component: SchedulingComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class SchedulingRoutingModule { }
