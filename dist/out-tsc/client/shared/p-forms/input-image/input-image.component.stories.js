import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_OBJECT_OUTPUT_FN, STORYBOOK_OUTPUT_FN, STORYBOOK_STRINGIFY_FN } from '@plano/storybook/storybook.utils';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';
const myStory = storiesOf('Client/PForms/p-input-image', module);
const model = '';
const validators = new ValidatorsService();
myStory
    .addDecorator(moduleMetadata({
    imports: [
        StorybookModule,
        PFormsModule,
    ],
    providers: [
        TextToHtmlService,
    ],
}))
    .add('default', () => ({
    template: `
			<p-input-image
				[formControl]="formControl"
				[disabled]="false"
			></p-input-image>
			<br>
			<p-input-image
				[formControl]="ormControl"
				[disabled]="true"
			></p-input-image>
			<hr>
			<p>
				${STORYBOOK_OUTPUT_FN('formControl.value')}
			</p>
			<p>
				${STORYBOOK_OBJECT_OUTPUT_FN('formControl.errors')}
			</p>
		`,
    props: {
        stringify: STORYBOOK_STRINGIFY_FN,
        formControl: new PFormControl({
            formState: {
                // value: 'data:image/png;base64,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',
                value: 'http://127.0.0.1:6006/images/party-party.en.png',
                disabled: false,
            },
            validatorOrOpts: [
                validators.imageMinHeight(684 / 2),
                validators.imageMinWidth(900),
                validators.imageMaxFileSize(1000),
                validators.imageRatio(1800 / 684),
            ],
        }),
        model: '',
    },
}));
// myStory
// 	.add('with ngModel', () => ({
// 		template: `
// 			<p-input-image
// 				[ngModel]="model"
// 				(ngModelChange)="ngModelChange($event)"
// 				[disabled]="false"
// 			></p-input-image>
// 			<br>
// 			<p-input-image
// 				[ngModel]="model"
// 				(ngModelChange)="ngModelChange($event)"
// 				[disabled]="true"
// 			></p-input-image>
// 			<hr>
// 			<p>
// 				${STORYBOOK_OBJECT_OUTPUT_FN('model')}
// 			</p>
// 		`,
// 		props: {
// 			stringify: STORYBOOK_STRINGIFY_FN,
// 			formControl: new PFormControl({
// 				value: '',
// 				disabled: false,
// 			}),
// 			ngModel: model,
// 			ngModelChange: (event : string) => {
// 				model = event;
// 				action('ngModelChange')(event);
// 			},
// 		},
// 	}));
myStory
    .add('with preview', () => ({
    template: `
			<p-input-image
				[formControl]="ormControl"
				[disabled]="false"
				[preview]="true"
			></p-input-image>
			<br>
			<p-input-image
				[formControl]="ormControl"
				[disabled]="true"
				[preview]="true"
			></p-input-image>
			<hr>
			<p>
				${STORYBOOK_OUTPUT_FN('formControl.value')}
			</p>
			<p>
				${STORYBOOK_OBJECT_OUTPUT_FN('formControl.errors')}
			</p>
		`,
    props: {
        stringify: STORYBOOK_STRINGIFY_FN,
        formControl: new PFormControl({
            formState: {
                // value: 'data:image/png;base64,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',
                value: 'https://s3.eu-central-1.amazonaws.com/files.dr-plano.com/dev/company_logo.13538.png',
                disabled: false,
            },
            validatorOrOpts: [
                validators.imageMinHeight(684 / 2),
                validators.imageMinWidth(900),
                validators.imageMaxFileSize(1000),
                validators.imageRatio(1800 / 684),
            ],
        }),
        model: '',
    },
}));
myStory
    .add('with custom preview', () => ({
    template: `
			<div class="row">
				<div class="col">
					<div class="bg-white  mb-3 rounded o-hidden">
						<div class="bg-secondary d-flex p-2">
							<button class="d-inline-block mr-2 p-0 bg-danger rounded-circle border-0" style="width: 12px; height: 12px; cursor: default;"></button>
							<button class="d-inline-block mr-2 p-0 bg-warning rounded-circle border-0" style="width: 12px; height: 12px; cursor: default;"></button>
							<button class="d-inline-block mr-2 p-0 bg-success rounded-circle border-0" style="width: 12px; height: 12px; cursor: default;"></button>
						</div>
						<ng-template [ngIf]="!model">
							<div class="bg-primary d-flex align-items-center justify-content-center" [class.muted]="disabled" style="height: 150px; width: 100%;">
								<span class="text-muted">Cover-Bild</span>
							</div>
						</ng-template>
						<ng-template [ngIf]="model">
							<img [src]="model" alt="Hochgeladenes Bild" i18n-alt style="width: 100%;">
						</ng-template>
						<div class="shadow border-bottom">
							<div class="shadow bg-light rounded" style="height:50px;width:50px;transform:translate(50%, -30%);"></div>
						</div>
						<div class="bg-white bg-light" style="height:50px;width:100%;"></div>
					</div>
					<p-input-image
						[(ngModel)]="model"
						[disabled]="false"
					></p-input-image>
				</div>
				<div class="col">
					<div class="bg-white  mb-3 rounded o-hidden">
						<div class="bg-secondary d-flex p-2">
							<button class="d-inline-block mr-2 p-0 bg-danger rounded-circle border-0" style="width: 12px; height: 12px; cursor: default;"></button>
							<button class="d-inline-block mr-2 p-0 bg-warning rounded-circle border-0" style="width: 12px; height: 12px; cursor: default;"></button>
							<button class="d-inline-block mr-2 p-0 bg-success rounded-circle border-0" style="width: 12px; height: 12px; cursor: default;"></button>
						</div>
						<div class="bg-light" [class.muted]="disabled" style="height: 150px; width: 100%;"></div>
						<div class="shadow border-bottom">
							<ng-template [ngIf]="!model">
								<div class="shadow bg-primary rounded d-flex align-items-center justify-content-center" style="height:50px;width:50px;transform:translate(50%, -30%);">
									<span class="text-muted">Logo</span>
								</div>
							</ng-template>
							<ng-template [ngIf]="model">
								<img class="shadow bg-light rounded" style="height:50px;width:50px;transform:translate(50%, -30%);" [src]="model" alt="Hochgeladenes Bild" i18n-alt>
							</ng-template>
						</div>
						<div class="bg-white bg-light" style="height:50px;width:100%;"></div>
					</div>
					<p-input-image
						[(ngModel)]="model"
						[disabled]="false"
					></p-input-image>
				</div>
			</div>
			<hr>
			<p>
				${STORYBOOK_OBJECT_OUTPUT_FN('model')}
			</p>
		`,
    props: {
        stringify: STORYBOOK_STRINGIFY_FN,
        formControl: new PFormControl({
            formState: {
                value: '',
                disabled: false,
            },
        }),
        ngModel: model,
        // ngModelChange: (event : string) => {
        // 	model = event;
        // 	action('ngModelChange')(event);
        // },
    },
}));
//# sourceMappingURL=input-image.component.stories.js.map