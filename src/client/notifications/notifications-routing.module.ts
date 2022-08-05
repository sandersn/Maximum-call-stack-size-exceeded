import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from './notifications.component';

export const ROUTES : Routes = [
	{ path: '', component: NotificationsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class NotificationsRoutingModule { }
