import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from '@angular/core';
import { Component } from '@angular/core';
import { SchedulingApiBooking, SchedulingApiMailSentToBookingPerson} from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiVoucher } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { EventTypesService } from '../../../plugin/p-custom-course-emails/event-types.service';
import { BootstrapSize, PThemeEnum } from '../../../shared/bootstrap-styles.enum';

/**
 * Lists all sent mails of an given bookable.
 */
@Component({
	selector: 'p-email-history',
	templateUrl: './email-history.component.html',
	styleUrls: ['./email-history.component.scss'],
})
export class EmailHistoryComponent {
	public PThemeEnum = PThemeEnum;

	constructor(
		public api : SchedulingApiService,
		public eventTypesService : EventTypesService,
		private modalService : ModalService,
		private localize : LocalizePipe,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;


	private modalRef : NgbModalRef | null = null;

	/**
	 * Shows the details of a mail item in a modal.
	 */
	public showMailDetails(modalContent : TemplateRef<unknown>) : void {
		this.modalRef = this.modalService.openModal(modalContent, {
			size: BootstrapSize.LG,
		});
	}

	/**
	 * Are we currently on the voucher details page?
	 */
	public get isVoucherDetailPage() : boolean {
		return this.api.currentlyDetailedLoaded instanceof SchedulingApiVoucher;
	}

	/**
	 * Resend `mail`.
	 */
	public resendEmail(mail : SchedulingApiMailSentToBookingPerson) : void {
		const mailBookingPerson = (mail.api!.currentlyDetailedLoaded as SchedulingApiBooking | SchedulingApiVoucher).email;

		this.modalService.confirm(
			{
				modalTitle: this.localize.transform('Sicher?'),
				description: this.localize.transform('Die Email wird an die aktuelle Adresse der buchenden Person verschickt: <strong>${mailBookingPerson}</strong><br/><br/>Der Email-Inhalt <strong>wird nicht aktualisiert</strong>, sondern genau so verschickt, wie er hier gespeichert ist. Falls darin enthaltene Informationen nicht mehr passen, kommuniziere das bitte separat mit deinem Kunden.', {mailBookingPerson: mailBookingPerson}),
				closeBtnLabel: this.localize.transform('Ja, senden'),
				dismissBtnLabel: this.localize.transform('Abbrechen'),
			}, {
				theme: PThemeEnum.WARNING,
				size: 'lg',
				success: () => {
					mail.resend = true;
					this.api.save();
					mail.resend = false;

					this.modalRef!.close();
				},
			},
		);
	}
}
