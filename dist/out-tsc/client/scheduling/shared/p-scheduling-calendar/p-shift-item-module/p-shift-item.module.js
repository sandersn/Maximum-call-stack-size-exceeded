import { __decorate } from "tslib";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PEditableFormsModule } from '@plano/client/shared/p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '@plano/client/shared/p-editable/p-editable.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { PMemberModule } from '@plano/client/shared/p-member/p-member.module';
import { PShiftExchangeModule } from '@plano/client/shared/p-shift-exchange/p-shift-exchange.module';
import { PShiftModule } from '@plano/client/shared/p-shift-module/p-shift.module';
import { PTransmissionModule } from '@plano/client/shared/p-transmission/p-transmission.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { PMinimalPacketInfoComponent } from './shift-item-list/minimal-packet-info/minimal-packet-info.component';
import { ShiftItemListComponent } from './shift-item-list/shift-item-list.component';
import { ShiftItemTimelineComponent } from './shift-item-timeline/shift-item-timeline.component';
import { ShiftItemComponent } from './shift-item/shift-item.component';
let PShiftItemModule = class PShiftItemModule {
};
PShiftItemModule = __decorate([
    NgModule({
        imports: [
            ClientSharedModule,
            CoreModule,
            PEditableFormsModule,
            PEditableModule,
            NgxPopperjsModule.forRoot({ disableAnimation: true }),
            PFormsModule,
            PMemberModule,
            PopoverModule,
            PShiftExchangeModule,
            PShiftModule,
            PTransmissionModule,
        ],
        declarations: [
            PMinimalPacketInfoComponent,
            ShiftItemComponent,
            ShiftItemListComponent,
            ShiftItemTimelineComponent,
        ],
        providers: [
        // BookingsService
        ],
        exports: [
            ShiftItemComponent,
            ShiftItemTimelineComponent,
        ],
    })
], PShiftItemModule);
export { PShiftItemModule };
//# sourceMappingURL=p-shift-item.module.js.map