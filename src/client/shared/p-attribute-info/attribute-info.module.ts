import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { AttributeInfoComponentBaseDirective } from './attribute-info-component-base';

@NgModule({
	imports: [
		CoreModule,
	],
	declarations: [
		AttributeInfoComponentBaseDirective,
	],
	providers: [
	],
	exports: [
		AttributeInfoComponentBaseDirective,
	],
})
export class PAttributeInfoModule {}
