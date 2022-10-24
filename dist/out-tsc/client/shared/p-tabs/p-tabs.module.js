import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PTabComponent } from './p-tabs/p-tab/p-tab.component';
import { PTabsComponent } from './p-tabs/p-tabs.component';
import { PLedModule } from '../p-led/p-led.module';
import { PMomentService } from '../p-moment.service';
import { SharedModule } from '../shared/shared.module';
let PTabsModule = class PTabsModule {
};
PTabsModule = __decorate([
    NgModule({
        imports: [
            CoreModule,
            PLedModule,
            SharedModule,
        ],
        declarations: [
            PTabComponent,
            PTabsComponent,
        ],
        providers: [
            PMomentService,
        ],
        exports: [
            PTabComponent,
            PTabsComponent,
        ],
    })
], PTabsModule);
export { PTabsModule };
//# sourceMappingURL=p-tabs.module.js.map