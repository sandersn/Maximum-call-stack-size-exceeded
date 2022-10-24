import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { MemberBadgeComponent } from './member-badges/member-badge/member-badge.component';
import { MemberBadgesComponent } from './member-badges/member-badges.component';
import { PEmptyMemberBadgesComponent } from './member-badges/p-empty-member-badges/p-empty-member-badges.component';
import { PMemberWishIconComponent } from './member-wish-icon/member-wish-icon.component';
import { MemberService } from './p-member.service';
let PMemberModule = class PMemberModule {
};
PMemberModule = __decorate([
    NgModule({
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
], PMemberModule);
export { PMemberModule };
//# sourceMappingURL=p-member.module.js.map