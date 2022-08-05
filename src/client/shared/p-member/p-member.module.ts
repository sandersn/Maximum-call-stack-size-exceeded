import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { MemberBadgeComponent } from './member-badges/member-badge/member-badge.component';
import { MemberBadgesComponent } from './member-badges/member-badges.component';
import { PEmptyMemberBadgesComponent } from './member-badges/p-empty-member-badges/p-empty-member-badges.component';
import { PMemberWishIconComponent } from './member-wish-icon/member-wish-icon.component';
import { MemberService } from './p-member.service';

@NgModule({
	imports: [
		CoreModule,
	],
	declarations: [
		MemberBadgeComponent,
		MemberBadgesComponent,
		PEmptyMemberBadgesComponent,
		PMemberWishIconComponent,
	],
	providers: [
		MemberService,
	],
	exports: [
		MemberBadgeComponent,
		MemberBadgesComponent,
		PEmptyMemberBadgesComponent,
		PMemberWishIconComponent,
	],
})
export class PMemberModule {}
