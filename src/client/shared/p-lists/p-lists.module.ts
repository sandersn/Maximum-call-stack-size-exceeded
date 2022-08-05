import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@plano/shared/core/core.module';
import { EarningsBarComponent } from './earnings-bar/earnings-bar.component';
import { ListHeadlineItemComponent } from './list-headline-item/list-headline-item.component';
import { ListHeadlineComponent } from './list-headline/list-headline.component';
import { PListItemAppendAppendComponent, PListItemComponent } from './p-list-item/p-list-item.component';
import { PListComponent } from './p-list/p-list.component';
import { PMemberModule } from '../p-member/p-member.module';

@NgModule({
	imports: [
		CommonModule,
		CoreModule,
		FormsModule,
		PMemberModule,
	],
	declarations: [
		EarningsBarComponent,
		ListHeadlineComponent,
		ListHeadlineItemComponent,
		PListComponent,
		PListItemAppendAppendComponent,
		PListItemComponent,
	],
	providers: [
	],
	exports: [
		EarningsBarComponent,
		ListHeadlineComponent,
		ListHeadlineItemComponent,
		PListComponent,
		PListItemAppendAppendComponent,
		PListItemComponent,
	],
})
export class PListsModule {}
