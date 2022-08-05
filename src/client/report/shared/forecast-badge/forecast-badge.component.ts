import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Config } from '@plano/shared/core/config';

@Component({
	selector: 'p-forecast-badge',
	templateUrl: './forecast-badge.component.html',
	styleUrls: ['./forecast-badge.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastBadgeComponent {
	public readonly CONFIG : typeof Config = Config;
}
