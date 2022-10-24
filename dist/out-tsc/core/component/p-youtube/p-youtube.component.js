var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { ModalService } from '../../p-modal/modal.service';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';
let PYoutubeComponent = class PYoutubeComponent {
    constructor(modalService, sanitizer) {
        this.modalService = modalService;
        this.sanitizer = sanitizer;
        /**
         * The youtube thumbnail quality values.
         * Possible values are "default", "mqdefault", "hqdefault", "sddefault" and "maxresdefault". cSpell:disable-line
         * Source: https://stackoverflow.com/a/2068371
         */
        this.quality = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this._imageUrl = null;
        this._iFrameUrl = null;
    }
    ngOnChanges() {
        if (!this.key) {
            throw new Error(`"key" is a required value.`);
        }
        if (!this.quality) {
            throw new Error(`"quality" is a required value.`);
        }
        this._imageUrl = this.sanitizer.
            bypassSecurityTrustUrl(`https://img.youtube.com/vi/${this.key}/${this.quality}.jpg`);
        // The player parameter "showinfo" has been deprecated in 2018. Therefore the video title will always be shown in embedded videos. For more info about available parameters head over to https://developers.google.com/youtube/player_parameters
        // cSpell:ignore showinfo
        this._iFrameUrl = this.sanitizer.
            bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.key}?rel=0`);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onImageClick() {
        // On ios app the webview could not show youtube iframe. So, we let the app open the video in external browser.
        if (Config.platform === 'appIOS') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.nsWebViewInterface.emit('openYoutube', this.key);
        }
        else {
            // Otherwise open our own modal with embedded video
            this.modalService.openModal(this.videoModalContent, { size: BootstrapSize.LG });
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get imageUrl() {
        return this._imageUrl;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get iFrameUrl() {
        return this._iFrameUrl;
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], PYoutubeComponent.prototype, "key", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PYoutubeComponent.prototype, "quality", void 0);
__decorate([
    ViewChild('videoModalContent', { static: true }),
    __metadata("design:type", typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object)
], PYoutubeComponent.prototype, "videoModalContent", void 0);
PYoutubeComponent = __decorate([
    Component({
        selector: 'p-youtube[key]',
        templateUrl: './p-youtube.component.html',
        styleUrls: ['./p-youtube.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [ModalService, typeof (_a = typeof DomSanitizer !== "undefined" && DomSanitizer) === "function" ? _a : Object])
], PYoutubeComponent);
export { PYoutubeComponent };
//# sourceMappingURL=p-youtube.component.js.map