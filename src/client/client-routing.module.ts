import { NgModule } from '@angular/core';
import { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@plano/shared/page-not-found/page-not-found.component';
import { AccessControlComponent } from './accesscontrol/accesscontrol.component';
import { ClientComponent } from './client.component';
import { LogoutComponent } from './header/logout/logout.component';
import { ReportComponent } from './report/report.component';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { ShiftExchangeComponent } from './shift-exchange/shift-exchange.component';
import { ShiftComponent } from './shift/shift.component';
import { TimeStampComponent } from './time-stamp/time-stamp.component';

export const ROUTES : Routes = [
	{
		path: 'client',
		component: ClientComponent,
		children:
		[
			// { path: 'time-stamp', loadChildren: () => import('./time-stamp/time-stamp.module').then( (m) => m.TimeStampModule ) },
			{ path: 'time-stamp', component: TimeStampComponent },
			{ path: 'tutorials', loadChildren: () => import('./tutorials/tutorials.module').then( m => m.TutorialsModule ) },
			{ path: 'menu', loadChildren: () => import('./menu/menu.module').then( m => m.MenuModule ) },
			{ path: 'desk', loadChildren: () => import('./desk/desk.module').then( m => m.DeskModule ) },
			{ path: 'absence', loadChildren: () => import('./absence/absence.module').then( m => m.AbsenceModule ) },
			{ path: 'booking', loadChildren: () => import('./booking/booking.module').then( m => m.BookingModule ) },
			{ path: 'sales', loadChildren: () => import('./sales/sales.module').then( m => m.SalesModule ) },
			{ path: 'shiftmodel', loadChildren: () => import('./shiftmodel/shiftmodel.module').then( m => m.ShiftModelModule ) },
			{ path: 'email', loadChildren: () => import('./email/email.module').then( m => m.EmailModule ) },
			{ path: 'member', loadChildren: () => import('./member/member.module').then( m => m.MemberModule ) },
			{ path: 'workingtime', loadChildren: () => import('./workingtime/workingtime.module').then( m => m.WorkingtimeModule ) },
			{ path: 'ical', loadChildren: () => import('./ical/ical.module').then( m => m.IcalModule ) },
			{ path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsModule ) },
			{ path: 'account', loadChildren: () => import('./account/account.module').then( m => m.AccountModule ) },
			{ path: 'shift-exchanges', loadChildren: () => import('./shift-exchanges/shift-exchanges.module').then( m => m.ShiftExchangesModule ) },

			{ path: 'gift-card', loadChildren: () => import('./gift-card/gift-card.module').then( m => m.GiftCardModule ) },
			{ path: 'transaction', loadChildren: () => import('./transaction/transaction.module').then( m => m.TransactionModule ) },

			// FIXME: Something with providedIn: 'root' is broken
			{ path: 'shift-exchange', component: ShiftExchangeComponent },
			{ path: 'shift-exchange/:id', component: ShiftExchangeComponent },
			{ path: 'shift-exchange/create/:shiftId', component: ShiftExchangeComponent },
			{ path: 'shift-exchange/create/:shiftId/member/:memberId', component: ShiftExchangeComponent },

			// FIXME: Something with providedIn: 'root' is broken
			// { path: 'shift-exchange', loadChildren: () => import('./shift-exchange/shift-exchange.module').then( (m) => m.ShiftExchangeModule ) },

			{ path: 'testaccount', loadChildren: () => import('./test-account/test-account.module').then( m => m.TestAccountModule ) },
			{ path: 'devices', loadChildren: () => import('./devices/devices.module').then( m => m.DevicesModule ) },

			{ path: 'shift', redirectTo: 'shift/0', pathMatch: 'full' },
			{ path: 'shift/create', redirectTo: 'shift/0', pathMatch: 'full' },
			{ path: 'shift/create/shiftmodel', redirectTo: 'shift/create/shiftmodel/0', pathMatch: 'full' },
			{ path: 'shift/create/shiftmodel/:shiftmodelid', component: ShiftComponent },
			{ path: 'shift/create/shiftmodel/:shiftmodelid/:opentab', component: ShiftComponent },
			{
				path: 'shift/create/shiftmodel/:shiftmodelid/start',
				redirectTo: 'shift/create/shiftmodel/:shiftmodelid/start/0',
				pathMatch: 'full',
			},
			{ path: 'shift/create/shiftmodel/:shiftmodelid/start/:start/:opentab', component: ShiftComponent },
			{ path: 'shift/create/shiftmodel/:shiftmodelid/start/:start', component: ShiftComponent },
			{ path: 'shift/create/start/:start/:opentab', component: ShiftComponent },
			{ path: 'shift/create/start/:start', component: ShiftComponent },
			{ path: 'shift/:id/:opentab', component: ShiftComponent },
			{ path: 'shift/:id', component: ShiftComponent },

			{ path: 'scheduling', redirectTo: 'scheduling/day/0', pathMatch: 'full' },
			{
				path: 'scheduling/:calendarMode',
				redirectTo: 'scheduling/:calendarMode/0',
				pathMatch: 'full',
			},
			{
				path: 'scheduling/undefined/:date',
				redirectTo: 'scheduling/month/:date',
				pathMatch: 'full',
			},
			{
				path: 'scheduling/:calendarMode/:date',
				component: SchedulingComponent,
			},
			{
				path: 'scheduling/:calendarMode/:date/:detailObject',
				redirectTo: 'scheduling/:calendarMode/:date/shift/0',
				pathMatch: 'full',
			},
			// TODO: this is probably obsolete through PLANO-5510
			{ path: 'scheduling/:calendarMode/:date/:detailObject/:detailObjectId', component: SchedulingComponent },
			{ path: 'report/:start/:end/:memberId', component: ReportComponent },
			{ path: 'report/:start/:end', component: ReportComponent },
			{ path: 'report/:start', redirectTo: 'report/:start/0', pathMatch: 'full' },
			{ path: 'report', redirectTo: 'report/0/0', pathMatch: 'full' },
			{ path: 'plugin', loadChildren: () => import('./plugin/plugin.module').then( m => m.PluginModule ) },
			{ path: 'rightgroups/:opentab', component: AccessControlComponent },
			{ path: 'rightgroups', component: AccessControlComponent },
			{ path: 'logout', component: LogoutComponent },
			{ path: '', redirectTo: 'scheduling/month/0', pathMatch: 'full' },
			{ path: '**', component: PageNotFoundComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES)],
	exports: [RouterModule],
})
export class ClientRoutingModule {}
