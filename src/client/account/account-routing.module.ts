import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { AccountFormComponent } from './account.component';

export const ROUTES : Routes = [
	{ path: ':opentab', component: AccountFormComponent },
	{ path: '', component: AccountFormComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class AccountRoutingModule { }
