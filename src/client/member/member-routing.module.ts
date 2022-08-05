import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';

export const ROUTES : Routes = [
	{
		path: '',
		children: [
			{ path: '', redirectTo: '0', pathMatch: 'full' },
			{ path: ':id/:opentab', component: MemberComponent },
			{ path: ':id', component: MemberComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class MemberRoutingModule { }
