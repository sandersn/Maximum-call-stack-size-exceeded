import { SchedulingApiAccountHolderState, SchedulingApiAdyenAccountBase } from '../../../../shared/api';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
export class SchedulingApiAdyenAccount extends SchedulingApiAdyenAccountBase {
    constructor(api) {
        super(api);
        this.api = api;
        this.adyenTermsOfServiceAccepted = false;
        this.adyenContractAccepted = false;
        this.attributeInfoAdyenTermsOfServiceAccepted = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'adyenTermsOfServiceAccepted',
            id: 'ADYEN_ACCOUNT_ADYEN_TERMS_OF_SERVICE_ACCEPTED',
            primitiveType: PApiPrimitiveTypes.boolean,
            canEdit: () => {
                assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
                return !this.api.me.isTestAccount &&
                    this.accountHolderState === SchedulingApiAccountHolderState.NOT_INITIALIZED &&
                    !!this.api.rightsService.isOwner;
            },
        });
        this.attributeInfoAdyenContractAccepted = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'adyenContractAccepted',
            id: 'ADYEN_ACCOUNT_ADYEN_CONTRACT_ACCEPTED',
            primitiveType: PApiPrimitiveTypes.boolean,
            canEdit: () => {
                assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
                return !this.api.me.isTestAccount &&
                    this.accountHolderState === SchedulingApiAccountHolderState.NOT_INITIALIZED &&
                    !!this.api.rightsService.isOwner;
            },
        });
    }
    /**
     *	true if all checkboxes are accepted
     */
    get allCheckboxesAccepted() {
        return this.adyenTermsOfServiceAccepted && this.adyenContractAccepted;
    }
    /**
     *	true if this account is closed or suspended
     */
    get isClosedOrSuspended() {
        return this.accountHolderState === SchedulingApiAccountHolderState.CLOSED ||
            this.accountHolderState === SchedulingApiAccountHolderState.SUSPENDED;
    }
    /**
     *	true if the onboarding-button should be disabled
     */
    get adyenOnboardingButtonDisabled() {
        assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
        if (this.api.isBackendOperationRunning)
            return true;
        return !this.allCheckboxesAccepted || this.api.me.isTestAccount ||
            this.accountHolderState === SchedulingApiAccountHolderState.CLOSED ||
            this.accountHolderState === SchedulingApiAccountHolderState.SUSPENDED;
    }
}
//# sourceMappingURL=scheduling-api-adyen-account.service.js.map