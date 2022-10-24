import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { PDurationTimePipe, PDurationHoursPipe } from './duration-time.pipe';
import { PDurationPipe } from './p-duration.pipe';
import { PTimeAgoPipe } from './time-ago.pipe';
let ClientPipesModule = class ClientPipesModule {
};
ClientPipesModule = __decorate([
    NgModule({
        declarations: [
            PDurationHoursPipe,
            PDurationPipe,
            PDurationTimePipe,
            PTimeAgoPipe,
        ],
        exports: [
            PDurationHoursPipe,
            PDurationPipe,
            PDurationTimePipe,
            PTimeAgoPipe,
        ],
    })
], ClientPipesModule);
export { ClientPipesModule };
//# sourceMappingURL=client-pipes.module.js.map