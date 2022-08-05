import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { DevicesComponent } from './devices.component';

export const ROUTES : Routes = [
	{ path: '', component: DevicesComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class DevicesRoutingModule { }
