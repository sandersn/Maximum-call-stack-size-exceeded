var _a;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
let TextToHtmlService = class TextToHtmlService {
    constructor(localize) {
        this.localize = localize;
    }
    /**
     * Is the text longer then the allowed maximum?
     */
    trimText(text, maxTextLength, addTrailingHint) {
        if (text.length <= maxTextLength)
            return text;
        let result = `${text.slice(0, maxTextLength)}`;
        if (addTrailingHint)
            result += `<span class="text-primary"> ${this.localize.transform('…mehr anzeigen')}</span>`;
        return result;
    }
    /**
     * Is the text longer then the allowed maximum?
     */
    cutLineBreaks(text, maxLines, addTrailingHint) {
        const lineBreaksCount = text.replace(/[^\n]/g, '').length;
        if (lineBreaksCount < maxLines)
            return text;
        // get position of nth line-break
        const delimiter = '\n';
        const pos = text.split(delimiter, maxLines).join(delimiter).length;
        let result = `${text.slice(0, pos)}`;
        if (addTrailingHint)
            result += `<span class="text-primary"> ${this.localize.transform('…mehr anzeigen')}</span>`;
        return result;
    }
    /**
     * Turn the text into html [and crop it if wanted]
     */
    textToHtml(text, 
    /**
     * The maximal length of the text. Is the text longer, then it will be cropped.
     * You can set this to false if you never want the text to be cropped.
     */
    inputMaxTextLength, 
    /**
     * The maximal amount of lines of the text. Is the text longer, then it will be cropped.
     * You can set this to false if you never want the text to be cropped.
     */
    inputMaxLines, 
    /**
     * If the text gets cropped, a "read more" text will be added at the end.
     */
    addTrailingHint = true) {
        let result = text;
        let maxTextLength;
        let maxLines;
        if (inputMaxTextLength === undefined || inputMaxTextLength === true) {
            maxTextLength = 100;
        }
        else {
            maxTextLength = inputMaxTextLength;
        }
        if (inputMaxLines === undefined || inputMaxLines === true) {
            maxLines = 4;
        }
        else {
            maxLines = inputMaxLines;
        }
        if (maxTextLength)
            result = this.trimText(result, maxTextLength, addTrailingHint);
        if (maxLines)
            result = this.cutLineBreaks(result, maxLines, addTrailingHint);
        result = result.replace(/\n/g, '<br>');
        return result;
    }
};
TextToHtmlService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _a : Object])
], TextToHtmlService);
export { TextToHtmlService };
//# sourceMappingURL=text-to-html.service.js.map