import { SchedulingApiAccountHolderState, SchedulingApiAdyenAccountBase } from '../../../../shared/api';
import { SchedulingApiServiceBase } from '../../../../shared/api';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

export class SchedulingApiAdyenAccount<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAdyenAccountBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
	) {
		super(api);
	}

	public adyenTermsOfServiceAccepted = false;
	public adyenContractAccepted = false;

	/**
	 *	true if all checkboxes are accepted
	 */
	public get allCheckboxesAccepted() : boolean {
		return this.adyenTermsOfServiceAccepted && this.adyenContractAccepted;
	}

	/**
	 *	true if this account is closed or suspended
	 */
	public get isClosedOrSuspended() : boolean {
		return this.accountHolderState === SchedulingApiAccountHolderState.CLOSED ||
		this.accountHolderState === SchedulingApiAccountHolderState.SUSPENDED;
	}

	/**
	 *	true if the onboarding-button should be disabled
	 */
	public get adyenOnboardingButtonDisabled() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');

		if (this.api.isBackendOperationRunning) return true;
		return !this.allCheckboxesAccepted || this.api.me.isTestAccount ||
			this.accountHolderState === SchedulingApiAccountHolderState.CLOSED ||
			this.accountHolderState === SchedulingApiAccountHolderState.SUSPENDED;
	}

	public attributeInfoAdyenTermsOfServiceAccepted = new ApiAttributeInfo<SchedulingApiAdyenAccount, boolean>({
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
	public attributeInfoAdyenContractAccepted = new ApiAttributeInfo<SchedulingApiAdyenAccount, boolean>({
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
