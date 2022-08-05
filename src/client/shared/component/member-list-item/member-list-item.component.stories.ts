import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Router } from '@angular/router';
import { MemberListItemComponent } from './member-list-item.component';
import { SchedulingApiMember, SchedulingApiService, MeService } from '../../../../shared/api';
import { CoreModule } from '../../../../shared/core/core.module';
import { PCookieService } from '../../../../shared/core/p-cookie.service';
import { RightsService } from '../../../accesscontrol/rights.service';
import { SchedulingService } from '../../../scheduling/scheduling.service';
import { PWishesService } from '../../../scheduling/wishes.service';
import { FilterService } from '../../filter.service';
import { HighlightService } from '../../highlight.service';
import { PFormsModule } from '../../p-forms/p-forms.module';
import { PListsModule } from '../../p-lists/p-lists.module';
import { PSidebarService } from '../../p-sidebar/p-sidebar.service';
import { ClientRoutingService } from '../../routing.service';

const member : SchedulingApiMember = new SchedulingApiMember(null);
member.firstName = 'Nils';
member.lastName = 'Karlsson';

storiesOf('Client/ClientSharedComponents/MemberListItemComponent', module)
	.addDecorator(
		moduleMetadata({
			imports: [
				PListsModule,
				PFormsModule,
				CoreModule,
			],
			schemas: [],
			declarations: [
				MemberListItemComponent,
				MemberListItemComponent,
			],
			providers: [
				PWishesService,
				// eslint-disable-next-line jsdoc/require-jsdoc
				{ provide: SchedulingApiService, useClass: class {
					// eslint-disable-next-line jsdoc/require-jsdoc
					public isLoaded() : boolean { return false; }
				} },
				// eslint-disable-next-line jsdoc/require-jsdoc
				{ provide: MeService, useClass: class {
					// eslint-disable-next-line jsdoc/require-jsdoc
					public isLoaded() : boolean { return false; }
				} },
				// eslint-disable-next-line jsdoc/require-jsdoc
				{ provide: RightsService, useClass: class {} },
				PSidebarService,
				// eslint-disable-next-line jsdoc/require-jsdoc
				{ provide: PCookieService, useClass: class {} },
				// eslint-disable-next-line jsdoc/require-jsdoc
				{ provide: SchedulingService, useClass: class {} },
				HighlightService,
				FilterService,
				// eslint-disable-next-line jsdoc/require-jsdoc
				{ provide: ClientRoutingService, useClass: class {} },
				// eslint-disable-next-line jsdoc/require-jsdoc
				{ provide: Router, useClass: class {} },
			],
		}),
	)
	.add('default', () => ({
		props: {
			member : member,
		},
		template: `
			<p-member-list-item
				[member]="member"
			></p-member-list-item>
		`,
	}));
