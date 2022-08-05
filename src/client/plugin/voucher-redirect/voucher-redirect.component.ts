import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { LogService } from '@plano/shared/core/log.service';
import { PRouterService } from '@plano/shared/core/router.service';

@Component({
	selector: 'p-voucher-redirect',
	templateUrl: './voucher-redirect.component.html',
	styleUrls: ['./voucher-redirect.component.scss'],
})
export class VoucherRedirectComponent implements OnInit {

	constructor(
		private activatedRoute : ActivatedRoute,
		private console : LogService,
		private pRouterService : PRouterService,
	) {}

	public BootstrapSize = BootstrapSize;

	public ngOnInit() : void {
		if (!this.activatedRoute.snapshot.paramMap.has('id')) this.console.error('id missing');
		const ID = this.activatedRoute.snapshot.paramMap.get('id');
		this.console.error(`Someone has an old link: client/plugin/voucher/${ID}`);
		this.pRouterService.navigate([`/client/gift-card/${ID}`], { replaceUrl: true });
	}

}
