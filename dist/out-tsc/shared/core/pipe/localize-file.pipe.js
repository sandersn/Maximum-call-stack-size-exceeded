import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { Config } from '../config';
/**
 * A Pipe to localize file path's. It will automatically add language code before file ending.
 * e.g. 'my_file.png' will be transformed by this pipe to 'my_file.de.png' depending on current locale.
 */
let LocalizeFilePipe = class LocalizeFilePipe {
    /**
     * Translate the given string.
     * @param input String to be translated
     * @param locale location code containing a language to be translated to
     * @returns translated string
     */
    transform(input, locale) {
        const fileEndingDotIndex = input.lastIndexOf('.');
        return input.substr(0, fileEndingDotIndex + 1) +
            Config.getLanguageCode(locale) +
            input.substr(fileEndingDotIndex);
    }
};
LocalizeFilePipe = __decorate([
    Pipe({ name: 'pLocalizeFile' })
], LocalizeFilePipe);
export { LocalizeFilePipe };
//# sourceMappingURL=localize-file.pipe.js.map