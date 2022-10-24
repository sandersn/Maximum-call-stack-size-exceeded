import { __decorate, __metadata } from "tslib";
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Input, HostListener } from '@angular/core';
import { Config } from '../config';
let ExternalLinkDirective = class ExternalLinkDirective {
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClick() {
        // let app handle this?
        if (Config.platform === 'appAndroid' || Config.platform === 'appIOS') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.nsWebViewInterface.emit('externalLink', this.externalLink);
        }
        else {
            // otherwise just open
            if (this.externalLink.startsWith('mailto:'))
                window.location.href = this.externalLink;
            else
                window.open(this.externalLink, '_blank');
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], ExternalLinkDirective.prototype, "externalLink", void 0);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExternalLinkDirective.prototype, "onClick", null);
ExternalLinkDirective = __decorate([
    Directive({
        selector: '[externalLink]',
    })
], ExternalLinkDirective);
export { ExternalLinkDirective };
//# sourceMappingURL=external-link.directive.js.map