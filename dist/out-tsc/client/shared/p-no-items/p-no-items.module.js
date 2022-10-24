import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PNoItemComponent } from './p-no-item/p-no-item.component';
import { PNoItemsComponent } from './p-no-items/p-no-items.component';
import { PFormsModule } from '../p-forms/p-forms.module';
let PNoItemsModule = class PNoItemsModule {
};
PNoItemsModule = __decorate([
    NgModule({
        imports: [CoreModule, PFormsModule],
        exports: [PNoItemComponent, PNoItemsComponent],
        declarations: [PNoItemComponent, PNoItemsComponent],
        providers: [],
    })
], PNoItemsModule);
export { PNoItemsModule };
//# sourceMappingURL=p-no-items.module.js.map