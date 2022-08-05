import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';

export const ROUTES : Routes = [
	{ path: '', component: MenuComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class MenuRoutingModule { }
