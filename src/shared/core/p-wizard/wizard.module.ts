import { NgWizardModule, THEME } from 'ng-wizard';
import { NgWizardConfig} from 'ng-wizard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const ngWizardConfig : NgWizardConfig = {
	theme: THEME.dots,
};

@NgModule({
	declarations: [
	],
	imports: [
		CommonModule,
		NgWizardModule.forRoot(ngWizardConfig),
	],
	exports: [
		NgWizardModule,
	],
})
export class PWizardModule {}
