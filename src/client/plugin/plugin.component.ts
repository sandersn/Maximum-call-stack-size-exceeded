import { Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AfterContentInit, OnDestroy } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormControlSwitchType } from '@plano/client/shared/p-forms/p-form-control-switch/p-form-control-switch.component';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShiftModels} from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShiftModel, SchedulingApiAccountHolderState, SchedulingApiAccountHolderPayoutState, SchedulingApiAccountHolderProcessingState, SchedulingApiAccountHolderPayoutSchedule } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { SchedulingApiPosSystem } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PSupportedPaymentSystems, PSupportedPosSystems } from './interface-cards/interface-cards.component';
import { PSupportedInterfaces} from './interface-cards/interface-cards.component';
import { PApiPrimitiveTypes, PSupportedCurrencyCodes, PSupportedLanguageCodes } from '../../shared/api/base/generated-types.ag';
import { Months} from '../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { AngularDatePipeFormat } from '../../shared/core/pipe/p-date.pipe';
import { SchedulingService } from '../scheduling/scheduling.service';
import { PFormsService } from '../service/p-forms.service';
import { ToastsService } from '../service/toasts.service';
import { BootstrapSize, PAlertThemeEnum } from '../shared/bootstrap-styles.enum';
import { PThemeEnum } from '../shared/bootstrap-styles.enum';
import { EditableDirective, EditableInterface } from '../shared/p-editable/editable/editable.directive';
import { PFormGroup } from '../shared/p-forms/p-form-control';
import { EmittedOutputType } from '../shared/p-forms/p-multi-value-input/p-multi-value-input.component';
import { PTabSizeEnum } from '../shared/p-tabs/p-tabs/p-tab/p-tab.component';
import { PTabComponent} from '../shared/p-tabs/p-tabs/p-tab/p-tab.component';
import { SectionWhitespace } from '../shared/page/section/section.component';

export enum PluginComponentTabs {
	BASIS = 'basis',
	PAYMENTS = 'payments',
	GIFT_CARDS = 'vouchers',
}

@Component({
	selector: 'p-plugin',
	templateUrl: './plugin.component.html',
	styleUrls: ['./plugin.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PluginComponent implements AfterContentInit, OnDestroy {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;
	public iframeWidth : number = 500;
	public iframeFixedWidth : boolean = false;
	private copiedToClipboard : string | number | null = null;
	private timeout : number | null = null;
	public selectedShiftModel : SchedulingApiShiftModel | null = null;

	public onboardingRequestRunning = false;
	public generateOnboardingFailed = false;

	constructor(
		private zone : NgZone,
		private domSanitizer : DomSanitizer,
		private router : Router,
		public me : MeService,
		public accountApi : AccountApiService,
		public api : SchedulingApiService,
		public schedulingService : SchedulingService,
		public toasts : ToastsService,
		private changeDetectorRef : ChangeDetectorRef,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
		private modalService : ModalService,
		public pFormsService : PFormsService,
	) {
		// this.navigationSubscription = this.pRouterService.handleAnchorLinks();
	}

	public PSupportedPaymentSystems = PSupportedPaymentSystems;
	public SchedulingApiAccountHolderState = SchedulingApiAccountHolderState;
	public SchedulingApiAccountHolderPayoutState = SchedulingApiAccountHolderPayoutState;
	public SchedulingApiAccountHolderProcessingState = SchedulingApiAccountHolderProcessingState;
	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;
	public PTabSizeEnum = PTabSizeEnum;
	public SectionWhitespace = SectionWhitespace;
	public PluginComponentTabs = PluginComponentTabs;
	public PAlertThemeEnum = PAlertThemeEnum;
	public Config = Config;
	public AngularDatePipeFormat = AngularDatePipeFormat;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PSupportedLanguageCodes = PSupportedLanguageCodes;
	public SchedulingApiAccountHolderPayoutSchedule = SchedulingApiAccountHolderPayoutSchedule;
	public FormControlSwitchType = FormControlSwitchType;

	public showPlugin : boolean | null = null;

	public formGroup : PFormGroup | null = null;

	public ngAfterContentInit() : void {

		if (Config.DEBUG) {
			this.formGroup = this.pFormsService.group({});
		}

		this.loadInitialData();
	}

	/**
	 * Refresh the showPlugin flag based on the given tab.
	 */
	public refreshShowPlugin(activeTab : PTabComponent) : void {
		assumeDefinedToGetStrictNullChecksRunning(activeTab, 'activeTab');
		const NEW_VALUE = activeTab.urlName === 'setup';
		if (this.showPlugin === NEW_VALUE) return;
		this.showPlugin = NEW_VALUE;
		this.changeDetectorRef.detectChanges();
	}

	public automaticBookableAnonymizationAfterPeriod : Months | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getModalHook() : EditableInterface['saveChangesHook'] {
		return (saveChangesHookSuccess, saveChangesHookDismiss) => {
			const success = () : void => {
				this.automaticBookableAnonymizationAfterPeriod = this.accountApi.data.automaticBookableAnonymizationAfterPeriod;
				saveChangesHookSuccess();
			};

			// User wants to disable the automatic auto-removal
			if (this.accountApi.data.automaticBookableAnonymizationAfterPeriod === null) {
				return success();
			}

			// User wants to change the interval of the already active auto-removal
			if (this.automaticBookableAnonymizationAfterPeriod !== null) return success();

			this.modalService.confirm({
				description: this.localize.transform('Anonymisierte Daten können nicht wiederhergestellt werden.'),
				modalTitle: this.localize.transform('Sicher?'),
			}, {
				success: () => success(),
				dismiss: () => {
					saveChangesHookDismiss();
				},
				theme: PThemeEnum.WARNING,
			});
		};
	}

	private loadInitialData() : void {
		this.accountApi.load({
			success: () => {
				this.automaticBookableAnonymizationAfterPeriod = this.accountApi.data.automaticBookableAnonymizationAfterPeriod;
				this.initFormGroup();
			},
		});

		// Load Scheduling api
		this.loadNewData();
	}

	/**
	 * Initialize the form-group for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const tempFormGroup = this.pFormsService.group({});

		this.formGroup = tempFormGroup;
	}

	/**
	 * Load new Data from api
	 */
	private loadNewData() : void {
		const queryParams = new HttpParams()
			.set('data', 'bookingSystemSettings');

		this.api.load({
			searchParams: queryParams,
			success: () => {
				// set condition1&2 to true, if not not yet initialized, closed or suspended
				this.api.data.adyenAccount.attributeInfoAdyenTermsOfServiceAccepted.value =
					this.api.data.adyenAccount.accountHolderState !== SchedulingApiAccountHolderState.NOT_INITIALIZED;
				this.api.data.adyenAccount.attributeInfoAdyenContractAccepted.value = this.api.data.adyenAccount.attributeInfoAdyenTermsOfServiceAccepted.value;
			},
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get coursesForDropdown() : SchedulingApiShiftModels {
		return this.api.data.shiftModels.filterBy(item => item.isCourse && !item.trashed);
	}

	/**
	 * The script snippet that the user must add to his/her homepage
	 */
	public get scriptSnippet() : string | null {
		if (!this.api.data.reCaptchaWhiteListedHostNames.length) return null;
		return `<script id="drp-script" src="${this.widgetUrl}" data-backend-url="${Config.BACKEND_URL}" data-id="${this.me.data.clientId.toString()}" data-frontend-url="${Config.FRONTEND_URL_LOCALIZED}"></script>`;
	}

	/**
	 * Copy string to clipboard
	 */
	public copyString(input : string) : void {
		window.clearTimeout(this.timeout ?? undefined);

		// Create a dummy input to copy the string array inside it
		const dummy = document.createElement('input');
		// Output the array into it
		dummy.value = input;
		// Add it to the document
		document.body.appendChild(dummy);
		// Set its ID
		dummy.setAttribute('id', 'dummy_id');
		// Select it
		dummy.select();
		// Copy its contents
		document.execCommand('copy');
		// Remove it as its not needed anymore
		document.body.removeChild(dummy);

		this.copiedToClipboard = input;

		this.toasts.addToast({
			title: this.localize.transform('OK!'),
			content: this.localize.transform('Wurde in die Zwischenablage kopiert'),
			// + ` und kann mit <code>STRG + V</code> bzw. <code>⌘ + V</code> eingefügt werden.`,
			theme: PThemeEnum.SUCCESS,
			icon: 'clipboard',
			visibilityDuration: 'short',
		});

		this.zone.runOutsideAngular(() => {
			this.timeout = window.setTimeout(() => {
				this.zone.run(() => {
					if (this.copiedToClipboard) this.copiedToClipboard = null;
				});
			}, 4500);
		});
	}

	/**
	 * Get a snippet.
	 * Provide shiftModel if it should be shiftModel-specific.
	 * Provide »true« if your want the snippet for the vouchers.
	 */
	public getSnippet(input : SchedulingApiShiftModel | boolean | null) : string | null {
		if (!this.api.data.reCaptchaWhiteListedHostNames.length) return null;
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		let result : string = '<div id="drp-booking"';
		if (input instanceof SchedulingApiShiftModel) {
			result += ` data-course-id="${input.id.rawData}"`;
		} else if (input === true) {
			// eslint-disable-next-line literal-blacklist/literal-blacklist
			result += ' data-voucher="true"';
		}
		if (this.iframeFixedWidth) result += ` style="width: ${this.iframeWidth}px"`;
		result += '></div>';
		return result;
	}

	private get widgetUrl() : string | null {
		if (this.me.isLoaded() && this.me.data.clientId.toString()) {
			return `${Config.FRONTEND_URL_LOCALIZED}/static/booking-plugin/code.js`;
		}
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get exampleSnippetToc() : string {
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		return '<div id="drp-booking" data-hide-terms="true" data-hide-data-protection="true" data-hide-terms-of-participation="true"></div>';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get exampleSnippetCustomAgreement() : string {
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		return '<div id="drp-booking" data-custom-agreement-title="<Titel>" data-custom-agreement-text="<Text>"></div>';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showPaypalShutdownAlert() : boolean {
		const now = +this.pMoment.m();
		return this.api.data.isPaypalAvailable && !this.api.data.isOnlinePaymentAvailable && now < Config.PAYPAL_SHUTDOWN_DATE;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClickInterfaceCards(interfacePath : PSupportedInterfaces) : void {
		// if (interfacePath === PSupportedRoutedatabases.BETA7) {
		// 	this.modalService.openDefaultModal({
		// 		description: 'Test',
		// 	})
		// 	return;
		// }
		this.router.navigate([`client/plugin/${interfacePath}`]);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get posSystem() : PSupportedPosSystems | null {
		switch (this.api.data.posSystem) {
			case SchedulingApiPosSystem.BOULDERADO :
				return PSupportedPosSystems.BOULDERADO;
			case SchedulingApiPosSystem.FREECLIMBER :
				return PSupportedPosSystems.FREECLIMBER;
			case null :
				return null;
		}
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public scrollToAdyenActivation() : void {
		const domElement = document.querySelector('#adyen-activation');
		if (!domElement) throw new Error('domElement is not available');
		domElement.scrollIntoView({behavior:'smooth'});
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public scrollToAdyenChangeData() : void {
		const domElement = document.querySelector('#adyen-change-data');
		if (!domElement) throw new Error('domElement is not available');
		domElement.scrollIntoView({behavior:'smooth'});
	}

	/**
	 * Is Adyen supported for this client?
	 */
	public get adyenIsSupported() : boolean {
		return Config.CURRENCY_CODE === PSupportedCurrencyCodes.EUR;
	}

	/**
	 * true if theres a discount active
	 */
	public get isDiscountActive() : boolean {
		return Date.now() < Config.ONBOARDING_DISCOUNT_DATE;
	}

	/**
	 * Submit changes / initial onboarding request for Adyen
	 */
	public openAdyenOnboardingUrl()  : void {
		// only once at a time
		if (this.onboardingRequestRunning) return;

		// disable the button and set the button-icon to spinner
		this.onboardingRequestRunning = true;
		this.generateOnboardingFailed = false;

		// if already onboarded successfully, let the user confirm hes sure
		if (this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.ACTIVE) {
			this.modalService.confirm({
				modalTitle: this.localize.transform('Sicher?'),
				description: this.localize.transform('Eine Datenänderung muss von Adyen, unserem Partner für die Online-Zahlung, geprüft und genehmigt werden. Über das Ergebnis der Prüfung wirst du automatisch benachrichtigt. Bis dahin steht dir die Online-Zahlung weiterhin zur Verfügung.'),
				closeBtnLabel: this.localize.transform('Ja'),
				dismissBtnLabel: this.localize.transform('Abbrechen')}, {
				theme: PThemeEnum.WARNING,
				size: BootstrapSize.LG,
				success: () => {
					this.getAdyenOnboardingUrl();
				},
				dismiss: () => {
					this.onboardingRequestRunning = false;
				},
			});
		} else {
			if (this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.NOT_INITIALIZED) {
				// if we passed the discount-date and are going to do the initial onboarding, warn the user about onboarding-fees
				let description : string;
				if (this.isDiscountActive) {
					// eslint-disable-next-line literal-blacklist/literal-blacklist
					description = this.localize.transform('Wenn du fortfährst, wird für dich ein Buchungskonto bei unserem Partner Adyen erstellt. Anschließend fragt Adyen nach einigen Angaben zu dir und deinem Betrieb.</br></br>👩‍🦰👨‍🦱 Stelle bitte bei der Angabe deiner Daten sicher, dass du unter der Rubrik <mark>ULTIMATE BENEFICIAL OWNER (UBO) UND UNTERZEICHNER</mark> <b>mindestens eine/n Inhaber/in</b> und <b>mindestens eine/n Unterzeichner/in</b> einträgst. Sonst kann das Onboarding nicht vollständig abgeschlossen werden. Beide Rollen können übrigens von derselben Person erfüllt sein.</br></br><mark>🎉 Rabatt-Aktion</mark> Keine Einrichtungsgebühr für die Online-Zahlung bis Ende 2021. Danach kostet die Einrichtung einmalig 15 € (siehe <a href="online-payment-pricing#onboarding" target="_blank" rel="noopener">Gebühren Online-Zahlung</a>).</br></br>Möchtest du fortfahren?');

				} else {
					// eslint-disable-next-line literal-blacklist/literal-blacklist
					description = this.localize.transform('Wenn du fortfährst, wird für dich ein Buchungskonto bei unserem Partner Adyen erstellt. Dafür fällt eine einmalige <mark>Einrichtungsgebühr von 15 €</mark> an, die mit deiner nächsten Rechnung abgerechnet wird (siehe <a href="online-payment-pricing#onboarding" target="_blank" rel="noopener">Gebühren Online-Zahlung</a>).</br></br>Anschließend fragt Adyen nach einigen Angaben zu dir und deinem Betrieb. 👩‍🦰👨‍🦱 Stelle dabei sicher, dass du unter der Rubrik <mark>ULTIMATE BENEFICIAL OWNER (UBO) UND UNTERZEICHNER</mark> <b>mindestens eine/n Inhaber/in</b> und <b>mindestens eine/n Unterzeichner/in</b> einträgst. Sonst kann das Onboarding nicht vollständig abgeschlossen werden. Beide Rollen können übrigens von derselben Person erfüllt sein.</br></br>Möchtest du fortfahren?');
				}
				this.modalService.confirm({
					modalTitle: this.localize.transform('Sicher?'),
					description: description,
					closeBtnLabel: this.localize.transform('Ja'),
					dismissBtnLabel: this.localize.transform('Abbrechen')}, {
					theme: PThemeEnum.WARNING,
					size: BootstrapSize.LG,
					success: () => {
						this.getAdyenOnboardingUrl();
					},
					dismiss: () => {
						this.onboardingRequestRunning = false;
					},
				});
			} else {
				this.getAdyenOnboardingUrl();
			}
		}
	}
	private getAdyenOnboardingUrl() : void {
		this.api.data.adyenAccount.onboardingUrl = 'generate';
		// request the onboarding url
		this.api.save({
			success: () => {
				// enable the button and stop the spinner
				this.onboardingRequestRunning = false;
				// if the url is set to "not created" show a notification that it might take a while to create the account.
				if (!!this.api.data.adyenAccount.onboardingUrl && this.api.data.adyenAccount.onboardingUrl !== 'not created') {
					// redirect
					window.location.href = this.api.data.adyenAccount.onboardingUrl;
				} else {
					if (this.api.data.adyenAccount.onboardingUrl === 'not created') {
						this.showAccountStillInCreationInfo();
					} else {
						// display fail message
						this.generateOnboardingFailed = true;
					}
				}
			},
		});
	}
	private showAccountStillInCreationInfo() : void {
		this.modalService.info({
			modalTitle: (this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.NOT_INITIALIZED ? this.localize.transform('Buchungskonto wird erstellt') : this.localize.transform('Hohe Auslastung')),
			description: (this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.NOT_INITIALIZED ? this.localize.transform('Dein Buchungskonto wird gerade noch erstellt. Das kann einige Minuten dauern. Wir werden dich per Email benachrichtigen, sobald das Konto zur Verfügung steht und du fortfahren kannst.') : this.localize.transform('Die Onboarding-Seite kann gerade aufgrund hoher Auslastung nicht aufgerufen werden. Versuche es bitte später nochmal.')),
			closeBtnLabel: this.localize.transform('Okay'),
		},
		() => {
			this.onboardingRequestRunning = false;
		});
	}

	/**
	 * returns a theme based on the accountHolderState and onboardingActionRequiredOrPending
	 */
	public get adyenOnboardingStatusTheme() : PThemeEnum {
		// Is onboarding process going on?
		const onboardingProcess =
					(	this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.ACTIVE ||
						this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.INACTIVE ||
						this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.INITIAL_ONBOARDING) &&
							(this.api.data.adyenAccount.onboardingActionRequiredOrPending);

		if (onboardingProcess) {
			return PThemeEnum.PRIMARY;
		}

		// Onboarding blocked?
		const onboardingBlocked = this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.CLOSED ||
			this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.SUSPENDED;

		if (onboardingBlocked)
			return PThemeEnum.DANGER;

		// Otherwise online payment is active
		return PThemeEnum.SUCCESS;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get canDoOnboarding() : boolean {
		return this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.INITIAL_ONBOARDING ||
				this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.ACTIVE ||
				this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.INACTIVE;
	}

	private navigationSubscription : Subscription | null = null;

	public ngOnDestroy() : void {
		this.navigationSubscription?.unsubscribe();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get savePayoutScheduleChangesHook() : EditableInterface['saveChangesHook'] {
		return (saveChangesHookSuccess, saveChangesHookDismiss) => {
			this.modalService.confirm({
				description: this.localize.transform('Möchtest du den Rhythmus der Auszahlungen wirklich ändern?'),
				modalTitle: this.localize.transform('Sicher?'),
			}, {
				success: saveChangesHookSuccess,
				dismiss: saveChangesHookDismiss,
				theme: PThemeEnum.WARNING,
			});
		};
	}

	/**
	 * Add the current domain to the list of items
	 */
	public reCaptchaWhiteListedHostNameAdded(event : EmittedOutputType, pEditableRef : EditableDirective) : void {
		this.api.data.reCaptchaWhiteListedHostNames.push(event.value);
		pEditableRef.startEditable(event.event);
		pEditableRef.saveChanges();
	}

	/**
	 * Removed one domain to the list of items
	 */
	public reCaptchaWhiteListedHostNameRemoved(event : EmittedOutputType, pEditableRef : EditableDirective) : void {
		this.api.data.reCaptchaWhiteListedHostNames.removeItem(event.value);
		pEditableRef.startEditable(event.event);
		pEditableRef.saveChanges();
	}
}
