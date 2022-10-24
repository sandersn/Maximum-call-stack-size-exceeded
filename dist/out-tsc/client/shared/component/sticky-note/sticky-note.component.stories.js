import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PBackgroundColorEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { ClientSharedComponentsModule } from '../client-shared-components.module';
const templateItem = (showDot, backgroundColor, height = '24') => {
    return `
		<p-sticky-note
			class="m-2"
			backgroundColor="${backgroundColor}"
			[showDot]="${showDot ? showDot.toString() : undefined}"
			[displayBlock]="true"
			[height]="${height ? height.toString() : undefined}"
		></p-sticky-note>
	`;
};
const template = `
	<div>
		${templateItem(null, PBackgroundColorEnum.WHITE, '14')}
		${templateItem(true, PBackgroundColorEnum.WHITE, '14')}
	</div>
	<div>
		${templateItem(null, PBackgroundColorEnum.WHITE)}
		${templateItem(true, PBackgroundColorEnum.WHITE)}
	</div>

	<div class="bg-primary">
		${templateItem(null, PThemeEnum.PRIMARY)}
		${templateItem(true, PThemeEnum.PRIMARY)}
	</div>

	<div class="bg-dark">
		${templateItem(null, PThemeEnum.DARK)}
		${templateItem(true, PThemeEnum.DARK)}
	</div>
`;
const myStory = storiesOf('Client/SharedComponents/sticky-note', module);
myStory
    .addDecorator(moduleMetadata({
    imports: [
        StorybookModule,
        ClientSharedComponentsModule,
    ],
}))
    .add('default', () => ({
    template: template,
    props: {},
}));
//# sourceMappingURL=sticky-note.component.stories.js.map