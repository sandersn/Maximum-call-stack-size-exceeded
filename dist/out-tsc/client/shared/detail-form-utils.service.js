import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PRouterService } from '@plano/shared/core/router.service';
import { PThemeEnum } from './bootstrap-styles.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { ToastsService } from '../service/toasts.service';
let PDetailFormUtilsService = class PDetailFormUtilsService {
    constructor(toastsService, localize, modalService, pRouterService) {
        this.toastsService = toastsService;
        this.localize = localize;
        this.modalService = modalService;
        this.pRouterService = pRouterService;
    }
    /**
     * Save the provided new item to the database
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveNewItem(api, item, itemTitle, success, canBeANewItem) {
        assumeDefinedToGetStrictNullChecksRunning(item, 'item');
        assumeDefinedToGetStrictNullChecksRunning(!!itemTitle ? itemTitle : undefined, 'itemTitle');
        if (!item.isNewItem() && !canBeANewItem)
            throw new Error('This is not a new item');
        api.mergeDataCopy();
        const text = this.localize.transform('${itemTitle} wurde angelegt.', { itemTitle: itemTitle });
        item.saveDetailed({
            success: () => {
                this.toastsService.addToast({
                    content: text,
                    theme: PThemeEnum.SUCCESS,
                });
                if (success)
                    success();
            },
        });
    }
    /**
     * Create new item which than can be filled with data from the form
     */
    createNewItem(api, items, paramsService, success) {
        const createIt = () => {
            api.createDataCopy();
            const ITEM = items.createNewItem();
            success(ITEM);
        };
        if (api.isLoaded()) {
            createIt();
            return;
        }
        // Make sure other data is loaded so that a new item can be created.
        paramsService.updateQueryParams();
        assumeDefinedToGetStrictNullChecksRunning(paramsService.queryParams, 'paramsService.queryParams');
        api.load({
            searchParams: paramsService.queryParams,
            success: () => {
                createIt();
            },
        });
    }
    /** onDestroy */
    onDestroy(api) {
        if (api.hasDataCopy())
            api.dismissDataCopy();
    }
    /**
     * Handle Click on delete button
     */
    onRemoveClick({ modalTitle = undefined, description = undefined, action = undefined, api = undefined, items = undefined, item = undefined, removeItemFn = undefined, }) {
        this.modalService.openDefaultModal({
            modalTitle: modalTitle,
            description: description,
            closeBtnLabel: this.localize.transform('Ja, ${action}', {
                // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
                action: action ? action : this.localize.transform('Löschen'),
            }),
            hideDismissBtn: false,
        }, {
            theme: PThemeEnum.DANGER,
            centered: true,
            success: () => {
                const afterSuccess = () => {
                    this.pRouterService.navBack();
                    api.save({
                        success: () => {
                        },
                    });
                };
                if (removeItemFn) {
                    removeItemFn(afterSuccess);
                }
                else {
                    // Remove this item from the list of items
                    items.removeItem(item);
                    afterSuccess();
                }
            },
            size: null,
        });
    }
};
PDetailFormUtilsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ToastsService,
        LocalizePipe,
        ModalService,
        PRouterService])
], PDetailFormUtilsService);
export { PDetailFormUtilsService };
//# sourceMappingURL=detail-form-utils.service.js.map