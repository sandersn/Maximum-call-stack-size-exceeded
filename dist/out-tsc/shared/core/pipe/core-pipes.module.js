import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocalizeFilePipe } from './localize-file.pipe';
import { LocalizePipe } from './localize.pipe';
import { PCurrencyPipe } from './p-currency.pipe';
import { PDatePipe } from './p-date.pipe';
import { TranslatePipe } from './translate.pipe';
import { PUrlForHumansPipe } from './url-for-humans.pipe';
import { PContrastPipe } from '../contrast.service';
import { SafeHtmlPipe } from '../pipe/safe-html.pipe';
let CorePipesModule = class CorePipesModule {
};
CorePipesModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
        ],
        declarations: [
            LocalizeFilePipe,
            LocalizePipe,
            PContrastPipe,
            PCurrencyPipe,
            PDatePipe,
            PUrlForHumansPipe,
            SafeHtmlPipe,
            TranslatePipe,
        ],
        providers: [],
        exports: [
            LocalizeFilePipe,
            LocalizePipe,
            PContrastPipe,
            PCurrencyPipe,
            PDatePipe,
            PUrlForHumansPipe,
            SafeHtmlPipe,
            TranslatePipe,
        ],
    })
], CorePipesModule);
export { CorePipesModule };
//# sourceMappingURL=core-pipes.module.js.map