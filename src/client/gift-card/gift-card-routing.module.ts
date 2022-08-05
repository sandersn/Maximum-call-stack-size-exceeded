import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { GiftCardComponent } from './gift-card.component';

export const ROUTES : Routes = [
	{
		path: '',
		children: [
			{ path: '', redirectTo: '0', pathMatch: 'full' },
			{ path: ':id', component: GiftCardComponent },
			{ path: ':id/:openTab', component: GiftCardComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class GiftCardRoutingModule { }
