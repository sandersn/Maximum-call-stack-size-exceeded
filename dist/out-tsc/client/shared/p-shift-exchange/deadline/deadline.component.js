import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDateFormat, PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { PMomentService } from '../../p-moment.service';
/**
 * A Directive to show a deadline as a badge. The badge automatically gets some kind of »danger« style, when it the
 * deadline passes.
 *
 * @example
 *   <p-deadline
 *     [timestamp]="future"
 *     [theme]="PThemeEnum.DARK"
 *     label="Mach schon" i18n-label
 *     tooltipContent="Ist echt wichtig, dass du das einhältst." i18n-tooltipContent
 *   ></p-deadline>
 */
let PDeadlineComponent = class PDeadlineComponent {
    constructor(datePipe, localize, pMoment, localizePipe) {
        this.datePipe = datePipe;
        this.localize = localize;
        this.pMoment = pMoment;
        this.localizePipe = localizePipe;
        /**
         * The timestamp of the deadline
         */
        this.timestamp = null;
        /**
         * Theme of the badge
         */
        this.theme = null;
        /**
         * Text on the left side of the date.
         * Describes what kind of date this is.
         */
        this.label = null;
        /**
         * Text for a Tooltip that shows up on hover.
         */
        this.tooltipContent = null;
        /**
         * In which format should the date be shown?
         */
        this.dateFormat = PDateFormat.VERY_SHORT_DATE;
    }
    ngAfterContentChecked() {
        this.now = +this.pMoment.m();
    }
    get timestampIsInThePast() {
        if (!this.timestamp)
            return false;
        if (this.timestamp <= this.now)
            return true;
        return false;
    }
    ngAfterContentInit() {
        if (this.theme === PThemeEnum.DANGER)
            throw new Error(`Theme 'DANGER' is not supported on p-deadline`);
        if (!this.label)
            this.label = this.localizePipe.transform('Frist');
        if (!this.tooltipContent) {
            assumeDefinedToGetStrictNullChecksRunning(this.timestamp, 'timestamp');
            const date = this.datePipe.transform(this.timestamp - 1, 'shortDate');
            const time = this.datePipe.transform(this.timestamp - 1, 'shortTime');
            this.tooltipContent = this.localize.transform('Frist für Ersatzsuche: ${date}, ${time}', { date: date, time: time });
        }
    }
    /**
     * Get more styling classes for this component
     */
    get cssClasses() {
        let result = 'border badge align-self-center';
        result += ` `;
        result += this.timestampIsInThePast ? 'border-danger' : '';
        result += ` `;
        if (!this.theme) {
            result += `badge-light`;
            result += ` `;
            result += `border-${this.timestampIsInThePast ? 'danger' : 'gray'}`;
            result += ` `;
        }
        else {
            result += `badge-${!this.timestampIsInThePast ? this.theme : 'danger'}`;
            result += ` `;
            result += `border-${!this.timestampIsInThePast ? this.theme : 'gray'}`;
            result += ` `;
        }
        return result;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDeadlineComponent.prototype, "timestamp", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDeadlineComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDeadlineComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PDeadlineComponent.prototype, "tooltipContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PDeadlineComponent.prototype, "dateFormat", void 0);
PDeadlineComponent = __decorate([
    Component({
        selector: 'p-deadline',
        templateUrl: './deadline.component.html',
        styleUrls: ['./deadline.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [PDatePipe,
        LocalizePipe,
        PMomentService,
        LocalizePipe])
], PDeadlineComponent);
export { PDeadlineComponent };
//# sourceMappingURL=deadline.component.js.map