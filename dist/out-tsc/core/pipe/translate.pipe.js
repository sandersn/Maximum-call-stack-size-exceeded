import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { AccountApiCountry } from '@plano/shared/api';
import { LocalizePipe } from './localize.pipe';
import { PSupportedLanguageCodes, PSupportedCountryCodes } from '../../api/base/generated-types.ag';
import { Config } from '../config';
import { LogService } from '../log.service';
let TranslatePipe = class TranslatePipe {
    constructor(console, localize) {
        this.console = console;
        this.localize = localize;
    }
    // TODO: Get rid of the type 'string' in 'value : string | AccountApiCountry'
    // eslint-disable-next-line jsdoc/require-jsdoc
    transform(value) {
        if (value === null)
            return null;
        switch (value) {
            case 'GERMANY':
            case AccountApiCountry.GERMANY:
            case PSupportedCountryCodes.DE:
                return this.localize.transform('Deutschland');
            case 'SWITZERLAND':
            case AccountApiCountry.SWITZERLAND:
            case PSupportedCountryCodes.CH:
                return this.localize.transform('Schweiz');
            case 'AUSTRIA':
            case AccountApiCountry.AUSTRIA:
            case PSupportedCountryCodes.AT:
                return this.localize.transform('Österreich');
            case 'NETHERLANDS':
            case AccountApiCountry.NETHERLANDS:
            case PSupportedCountryCodes.NL:
                return this.localize.transform('Niederlande');
            case 'BELGIUM':
            case AccountApiCountry.BELGIUM:
            case PSupportedCountryCodes.BE:
                return this.localize.transform('Belgien');
            case 'UNITED_KINGDOM':
            case AccountApiCountry.UNITED_KINGDOM:
            case PSupportedCountryCodes.GB:
                return this.localize.transform('Vereinigtes Königreich');
            case 'CZECH_REPUBLIC':
            case AccountApiCountry.CZECH_REPUBLIC:
            case PSupportedCountryCodes.CZ:
                return this.localize.transform('Tschechien');
            case 'SWEDEN':
            case AccountApiCountry.SWEDEN:
            case PSupportedCountryCodes.SE:
                return this.localize.transform('Schweden');
            case 'LUXEMBOURG':
            case AccountApiCountry.LUXEMBOURG:
            case PSupportedCountryCodes.LU:
                return this.localize.transform('Luxemburg');
            case PSupportedLanguageCodes.de:
                return this.localize.transform('Deutsch');
            case PSupportedLanguageCodes.en:
                return this.localize.transform('Englisch');
            default:
                if (Config.DEBUG)
                    this.console.error(`Could not find translation for country key: "${value}"`);
                if (typeof value === 'string')
                    return value;
                return null;
        }
    }
};
TranslatePipe = __decorate([
    Pipe({ name: 'pTranslateCountryKey' }),
    __metadata("design:paramtypes", [LogService,
        LocalizePipe])
], TranslatePipe);
export { TranslatePipe };
//# sourceMappingURL=translate.pipe.js.map