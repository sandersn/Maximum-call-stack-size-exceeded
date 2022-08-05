import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { DeskComponent } from './desk.component';

export const ROUTES : Routes = [
	{ path: '', component: DeskComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class DeskRoutingModule { }
