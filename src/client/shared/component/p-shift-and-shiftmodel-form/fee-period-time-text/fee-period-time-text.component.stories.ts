import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular';
import { FeePeriodTimeTextComponent } from './fee-period-time-text.component';
import { PShiftAndShiftmodelFormModule } from '../p-shift-and-shiftmodel-form.module';

// eslint-disable-next-line import/no-default-export
export default {
	title: 'Client/PLedModule/FeePeriodTimeTextComponent',
	component: FeePeriodTimeTextComponent,
	decorators: [
		moduleMetadata({
			imports: [
				PShiftAndShiftmodelFormModule,
			],
		}),
	],
} as Meta;

const TEMPLATE : Story<FeePeriodTimeTextComponent> = (args : FeePeriodTimeTextComponent) => ({
	props: args,
});

export const UndefinedToUndefined = TEMPLATE.bind({});
UndefinedToUndefined.args = {
};

export const UndefinedToNull = TEMPLATE.bind({});
UndefinedToNull.args = {
	start: 0,
	end: null,
};

export const XToUndefined = TEMPLATE.bind({});
XToUndefined.args = {
	start: 1,
	end: null,
};

export const XToNull = TEMPLATE.bind({});
XToNull.args = {
	start: 1,
	end: -1,
};

export const OneToOne = TEMPLATE.bind({});
OneToOne.args = {
	start: 1,
	end: 1,
};

export const OneToTwo = TEMPLATE.bind({});
OneToTwo.args = {
	start: 1,
	end: 2,
};

export const UndefinedToTwo = TEMPLATE.bind({});
UndefinedToTwo.args = {
	start:  null,
	end: 2,
};

export const NullToTwo = TEMPLATE.bind({});
NullToTwo.args = {
	start: -1,
	end: 2,
};
