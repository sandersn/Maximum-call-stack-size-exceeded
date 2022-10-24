import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AccountApiCountry, AccountApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { TranslatePipe } from '@plano/shared/core/pipe/translate.pipe';
import { PFormGroup } from '../../p-forms/p-form-control';
import { FormControlSwitchType } from '../../p-forms/p-form-control-switch/p-form-control-switch.component';
import { SectionWhitespace } from '../../page/section/section.component';
let LocationComponent = class LocationComponent {
    constructor(api, translatePipe) {
        this.api = api;
        this.translatePipe = translatePipe;
        this.CONFIG = Config;
        this.turnIntoRealAccountForm = false;
        this.countriesArray = Object.values(AccountApiCountry).filter((value) => !Number.isNaN(Number(value)));
        this.SectionWhitespace = SectionWhitespace;
        this.FormControlSwitchType = FormControlSwitchType;
    }
    ngAfterContentInit() {
        this.countriesArray = this.countriesArray.sort((a, b) => {
            const aKey = AccountApiCountry[a];
            const bKey = AccountApiCountry[b];
            const aLabel = this.translatePipe.transform(aKey);
            const bLabel = this.translatePipe.transform(bKey);
            if (aLabel === null || bLabel === null)
                return 0;
            if (typeof aLabel !== 'string' || typeof bLabel !== 'string')
                return 0;
            return aLabel.toLowerCase().localeCompare(bLabel.toLowerCase());
        });
    }
};
__decorate([
    Input('group'),
    __metadata("design:type", PFormGroup)
], LocationComponent.prototype, "formGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], LocationComponent.prototype, "turnIntoRealAccountForm", void 0);
LocationComponent = __decorate([
    Component({
        selector: 'p-location[group]',
        templateUrl: './location.component.html',
        styleUrls: ['./location.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [AccountApiService,
        TranslatePipe])
], LocationComponent);
export { LocationComponent };
//# sourceMappingURL=location.component.js.map