import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { TestAccountComponent } from './test-account.component';

export const ROUTES : Routes = [
	{ path: '', component: TestAccountComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class TestaccountRoutingModule { }
