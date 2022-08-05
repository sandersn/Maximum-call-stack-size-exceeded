// cSpell:ignore kolkov
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbTypeaheadModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery'; window['$'] = $; window['jQuery'] = $;
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ImageCropperModule } from 'ngx-image-cropper';
import { KeyValuePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PListsModule } from '@plano/client/shared/p-lists/p-lists.module';
import { getPopoverConfig } from '@plano/ngx-bootstrap.config';
import { CoreModule } from '@plano/shared/core/core.module';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { AutosizeDirective } from './autosize/autosize.directive';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FormControlShowcaseComponent } from './form-control-showcase/form-control-showcase.component';
import { PInputImageCropperComponent } from './input-image/input-image-cropper/input-image-cropper.component';
import { PInputImageComponent } from './input-image/input-image.component';
import { InputMemberComponent } from './input-member/input-member.component';
import { PButtonComponent } from './p-button/p-button.component';
import { CustomCheckboxTestComponent } from './p-checkbox/io-spec/p-checkbox-test.component';
import { PCheckboxComponent } from './p-checkbox/p-checkbox.component';
import { PDeleteButtonComponent } from './p-delete-button/p-delete-button.component';
import { PDropdownItemComponent } from './p-dropdown/p-dropdown-item/p-dropdown-item.component';
import { PDropdownComponent } from './p-dropdown/p-dropdown.component';
import { PFormControlSwitchDurationComponent } from './p-form-control-switch-duration/p-form-control-switch-duration.component';
import { PFormControlSwitchItemComponent } from './p-form-control-switch/p-form-control-switch-item/p-form-control-switch-item.component';
import { PFormControlSwitchComponent } from './p-form-control-switch/p-form-control-switch.component';
import { PFormDeleteSectionComponent } from './p-form-delete-section/p-form-delete-section.component';
import { PFormGroupComponent } from './p-form-group/p-form-group.component';
import { PFormRecoverSectionComponent } from './p-form-recover-section/p-form-recover-section.component';
import { PInputCopyStringComponent } from './p-input-copy-string/p-input-copy-string.component';
import { PInputDateTestComponent } from './p-input-date/io-spec/test.component';
import { PInputDateComponent } from './p-input-date/p-input-date.component';
import { PInputDateService } from './p-input-date/p-input-date.service';
import { PInputMemberIdComponent } from './p-input-member-id/p-input-member-id.component';
import { PInputSearchComponent } from './p-input-search/input-search.component';
import { PInputShiftModelIdComponent } from './p-input-shiftmodel-id/p-input-shiftmodel-id.component';
import { PInputTestComponent } from './p-input/io-spec/test.component';
import { PInputComponent } from './p-input/p-input.component';
import { PInputPrependComponent } from './p-input/p-input.component';
import { PInputAppendComponent } from './p-input/p-input.component';
import { PInputService } from './p-input/p-input.service';
import { CustomMultiValueInputTestComponent } from './p-multi-value-input/io-spec/p-multi-value-input-test.component';
import { PMultiValueInputComponent } from './p-multi-value-input/p-multi-value-input.component';
import { PPasswordStrengthMeterComponent } from './p-password-strength-meter/p-password-strength-meter.component';
import { PRadioComponent } from './p-radios/p-radio/p-radio.component';
import { PRadiosRadioComponent } from './p-radios/p-radios-radio/p-radios-radio.component';
import { PRadiosComponent } from './p-radios/p-radios.component';
import { PRecoverButtonComponent } from './p-recover-button/p-recover-button.component';
import { PShiftmodelTariffService } from './p-shiftmodel-tariff.service';
import { PTariffFormComponent } from './p-tariff-form/p-tariff-form.component';
import { PTaxDropdownComponent } from './p-tariff-form/p-tax-dropdown/p-tax-dropdown.component';
import { CustomTextareaTestComponent } from './p-textarea/io-spec/p-textarea-test.component';
import { PTextareaComponent } from './p-textarea/p-textarea.component';
import { PCardModule } from '../../../shared/core/component/card/card.module';
import { CoreComponentsModule } from '../../../shared/core/component/core-components.module';
import { PGridModule } from '../../../shared/core/component/grid/grid.module';
import { PAttributeInfoModule } from '../p-attribute-info/attribute-info.module';
import { EditableDirective } from '../p-editable/editable/editable.directive';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PLedModule } from '../p-led/p-led.module';
import { PMemberModule } from '../p-member/p-member.module';
import { PMomentService } from '../p-moment.service';
import { PShiftModelModule } from '../p-shiftmodel/p-shiftmodel.module';
import { PageModule } from '../page/page.module';
import { ClientPipesModule } from '../pipe/client-pipes.module';
import { PDurationPipe } from '../pipe/p-duration.pipe';
import { SharedModule } from '../shared/shared.module';

declare const window : {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key : string] : any; // NOTE: missing index definition
	prototype : Window;
	new() : Window;
};

@NgModule({
	imports: [
		AngularEditorModule,
		BsDropdownModule.forRoot(),
		ClientPipesModule,
		CoreComponentsModule,
		CoreModule,
		ImageCropperModule,
		NgbDatepickerModule,
		NgbModalModule,
		NgbTypeaheadModule,
		PageModule,
		PAttributeInfoModule,
		PCardModule,
		PEditableModule,
		PGridModule,
		PLedModule,
		PListsModule,
		PMemberModule,
		PopoverModule,
		PShiftModelModule,
		SharedModule,
		TypeaheadModule,
	],
	declarations: [
		AutosizeDirective,
		CheckboxComponent,
		CustomCheckboxTestComponent,
		CustomMultiValueInputTestComponent,
		CustomTextareaTestComponent,
		FormControlShowcaseComponent,
		FormControlShowcaseComponent,
		InputMemberComponent,
		PButtonComponent,
		PCheckboxComponent,
		PDeleteButtonComponent,
		PDeleteButtonComponent,
		PDropdownComponent,
		PDropdownComponent,
		PDropdownItemComponent,
		PDropdownItemComponent,
		PFormControlSwitchComponent,
		PFormControlSwitchComponent,
		PFormControlSwitchDurationComponent,
		PFormControlSwitchItemComponent,
		PFormControlSwitchItemComponent,
		PFormDeleteSectionComponent,
		PFormGroupComponent,
		PFormRecoverSectionComponent,
		PInputAppendComponent,
		PInputComponent,
		PInputCopyStringComponent,
		PInputCopyStringComponent,
		PInputDateComponent,
		PInputDateTestComponent,
		PInputImageComponent,
		PInputImageComponent,
		PInputImageCropperComponent,
		PInputImageCropperComponent,
		PInputMemberIdComponent,
		PInputPrependComponent,
		PInputSearchComponent,
		PInputSearchComponent,
		PInputShiftModelIdComponent,
		PInputTestComponent,
		PMultiValueInputComponent,
		PPasswordStrengthMeterComponent,
		PPasswordStrengthMeterComponent,
		PRadioComponent,
		PRadiosComponent,
		PRadiosRadioComponent,
		PRecoverButtonComponent,
		PRecoverButtonComponent,
		PTariffFormComponent,
		PTaxDropdownComponent,
		PTextareaComponent,
	],
	providers: [
		EditableDirective,
		KeyValuePipe,
		PCurrencyPipe,
		PDurationPipe,
		PFormsService,
		PInputDateService,
		PInputService,
		{
			provide: PopoverConfig,
			useFactory: getPopoverConfig,
		},
		PMomentService,
		PShiftmodelTariffService,
		TextToHtmlService,
	],
	exports: [
		CheckboxComponent,
		CustomCheckboxTestComponent,
		FormControlShowcaseComponent,
		FormControlShowcaseComponent,
		InputMemberComponent,
		PAttributeInfoModule,
		PAttributeInfoModule,
		PButtonComponent,
		PCheckboxComponent,
		PDeleteButtonComponent,
		PDropdownComponent,
		PDropdownItemComponent,
		PFormControlSwitchComponent,
		PFormControlSwitchComponent,
		PFormControlSwitchDurationComponent,
		PFormControlSwitchItemComponent,
		PFormControlSwitchItemComponent,
		PFormDeleteSectionComponent,
		PFormGroupComponent,
		PFormRecoverSectionComponent,
		PInputAppendComponent,
		PInputComponent,
		PInputCopyStringComponent,
		PInputDateComponent,
		PInputDateTestComponent,
		PInputImageComponent,
		PInputImageComponent,
		PInputImageCropperComponent,
		PInputImageCropperComponent,
		PInputMemberIdComponent,
		PInputPrependComponent,
		PInputSearchComponent,
		PInputSearchComponent,
		PInputShiftModelIdComponent,
		PInputTestComponent,
		PMultiValueInputComponent,
		PPasswordStrengthMeterComponent,
		PPasswordStrengthMeterComponent,
		PRadioComponent,
		PRadiosComponent,
		PRadiosRadioComponent,
		PRecoverButtonComponent,
		PTariffFormComponent,
		PTextareaComponent,
	],
})
export class PFormsModule {}
