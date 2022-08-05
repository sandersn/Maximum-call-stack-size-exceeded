import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { TutorialsComponent } from './tutorials.component';

export const ROUTES : Routes = [
	{ path: '', component: TutorialsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class TutorialsRoutingModule { }
