/* eslint-disable max-lines */
// eslint-disable-next-line no-warning-comments
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { PSupportedLanguageCodes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '../config';
const L = PSupportedLanguageCodes;
const DICTIONARY = {
    /**
    * Don’t remove this block. It gets used by our automated Tests
    */
    'Hallo Welt': { [L.en]: 'Hello World' },
    'Hallo ${name}.': { [L.en]: '${name}, yo!' },
    'Hallo ${name}, ${name} ist ein schöner Name!': { [L.en]: 'Yo ${name}, ${name} is a wonderful name!' },
    'Im Deutschen wird ${shiftPluralisation} im Satz groß geschrieben.': { [L.en]: 'In english, ${shiftPluralisation} should be lowercase.' },
    'Im Deutschen wird der erste Buchstabe von ${firstName} immer groß geschrieben.': { [L.en]: 'In english the first letter of ${firstName} will always be uppercase.' },
    '${shiftPluralisation} wird am Anfang eines Satzes immer groß geschrieben.': { [L.en]: '${shiftPluralisation}, if placed at the beginning of a sentence, will always be uppercase.' },
    'Kontakt': {
        [L.en]: 'Contact',
    },
    'Mo': { [L.en]: 'Mon' },
    'Di': { [L.en]: 'Tue' },
    'Mi': { [L.en]: 'Wed' },
    'Do': { [L.en]: 'Thu' },
    'Fr': { [L.en]: 'Fri' },
    'Sa': { [L.en]: 'Sat' },
    'So': { [L.en]: 'Sun' },
    'Jan': { [L.en]: 'Jan' },
    'Feb': { [L.en]: 'Feb' },
    'Mär': { [L.en]: 'Mar' },
    'Apr': { [L.en]: 'Apr' },
    'Mai': { [L.en]: 'May' },
    'Jun': { [L.en]: 'Jun' },
    'Jul': { [L.en]: 'Jul' },
    'Aug': { [L.en]: 'Aug' },
    'Sep': { [L.en]: 'Sep' },
    'Okt': { [L.en]: 'Oct' },
    'Nov': { [L.en]: 'Nov' },
    'Dez': { [L.en]: 'Dec' },
    /**
     * src/admin/clients/clients.component.ts
     */
    'Neu': { [L.en]: 'New' },
    /**
     * src/shared/core/seo.service.ts
     */
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Dr. Plano – Online-Software für Schichtplanung & Kursbuchung in Kletterhallen, Boulderhallen und Sportstätten. Automatische Schichtverteilung, Arbeitszeiterfassung, Schichttausch, online Buchungssystem für Slots, Kurse & Gutscheine samt Online-Zahlung und automatischen Emails. Alles bequem auch über mobile Apps fürs Handy bedienbar.': { [L.en]: 'Dr. Plano – The all-in-one application for staff scheduling & class booking and online payment system. It comes along with a lot of features such as automated scheduling, time tracking, shift swapping; online booking system for classes, time-slots, and gift cards; online payment system with time-saving features like automated refunds to your customers after booking cancellations — all also from the convenience of your smartphone via mobile apps for iOS and Android.' },
    'Schichtplanung & Kursbuchung in Kletterhallen, Boulderhallen und Sportstätten': { [L.en]: 'Staff scheduling & class booking & online payment system for bouldering gyms and climbing gyms' },
    'Autom. Schichtverteilung, Arbeitszeiterfassung, Schichttausch, online Buchungssystem für Kurse & Gutscheine …': { [L.en]: 'Automated scheduling, Time tracking, Shift swapping, online booking system for classes & gift cards, online payment system…' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Dr. Plano – Software für Schichtplanung & Kursbuchung': { [L.en]: 'Dr. Plano – App for staff scheduling & class booking & online payment system' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Dr. Plano – Schichtplanung & Kursbuchung': { [L.en]: 'Dr. Plano – Staff scheduling & class booking & online payment system' },
    /**
     * src/client/absence/absence.component.ts
     */
    'Abwesenheitseintrag': { [L.en]: 'Leave of absence' },
    'Willst du diesen Abwesenheitseintrag wirklich löschen?': { [L.en]: 'Are you sure you want to delete this leave of absence?' },
    /**
     * src/client/accesscontrol/rights-array.ts
     */
    'Abwesenheiten': { [L.en]: 'Abwesenheiten' },
    'Eigene Abwesenheiten sehen': { [L.en]: 'Eigene Abwesenheiten sehen' },
    'Abwesenheiten anderer sehen': { [L.en]: 'Abwesenheiten anderer sehen' },
    'Abwesenheiten editieren': { [L.en]: 'Abwesenheiten editieren' },
    'Neue Abwesenheiten erstellen': { [L.en]: 'Neue Abwesenheiten erstellen' },
    /**
     * src/client/accesscontrol/accesscontrol.component.ts
     */
    'Änderung der Rechte wurde gespeichert': { [L.en]: 'Your changes have been saved' },
    /**
     * src/client/accesscontrol/rights-table/rights-table.component.ts
     */
    'Die Gruppe hat Leserecht für Tätigkeiten.': { [L.en]: 'The group has read permission for activities.' },
    'Die Gruppe hat Schreibrecht für Tätigkeiten.': { [L.en]: 'The group has write permission for activities.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Die Gruppe bekommt von Dr. Plano die Nachrichten für Bereichsleitende.': { [L.en]: 'The group receives notifications for managers from Dr. Plano.' },
    'Die Gruppe darf Buchungen eines Angebots verwalten.': { [L.en]: 'The group has permission to manage bookings of an offer.' },
    'Die Gruppe darf Tätigkeiten ausführen. Das wird in den Tätigkeiten festgelegt.': { [L.en]: 'The group is allowed to do activities. That is set in the activities.' },
    'Die Gruppe darf Online-Rückerstattungen an Kunden veranlassen.': { [L.en]: 'The group is permitted to initiate online refunds to clients.' },
    'Darf': { [L.en]: 'Allowed' },
    /**
     * src/client/accesscontrol/rightgroup-header/rightgroup-header.component.ts
     */
    'Bitte wählen': { [L.en]: 'Please select' },
    'Für wen ist ${name} gedacht?': { [L.en]: '${name} is meant for' },
    'sie': { [L.en]: 'It' },
    'Admins': { [L.en]: 'Admins' },
    'Mitarbeitende': { [L.en]: 'Employees' },
    /**
     * src/client/accesscontrol/rights-enums.ts
     */
    'Tätigkeiten & Schichten': { [L.en]: 'Activities & shifts' },
    'Tätigkeit erstellen': { [L.en]: 'Create activities' },
    'Tätigkeit editieren': { [L.en]: 'Edit activities' },
    'Mitarbeitende und Lohndaten einer Tätigkeit sehen': { [L.en]: 'See users qualified for an activity (incl. wages)' },
    'Mitarbeitende und Lohndaten einer Tätigkeit editieren': { [L.en]: 'Edit users qualified for an activity (incl. wages)' },
    'Buchungseinstellungen sehen': { [L.en]: 'See booking settings' },
    'Buchungseinstellungen editieren': { [L.en]: 'Edit booking settings' },
    'Schichten erstellen': { [L.en]: 'Create shifts' },
    'Schichten editieren': { [L.en]: 'Edit shifts' },
    'Schichtbesetzung ändern': { [L.en]: 'Edit shift assignments' },
    'Eigene Schicht abgeben': { [L.en]: 'Drop own shifts' },
    'Schichten anderer übernehmen': { [L.en]: 'Pick up shifts from others' },
    'Benachrichtigung bei eigenem Schichttausch': { [L.en]: 'Notification of own shift swaps' },
    'Benachrichtigung bei Schichttausch anderer': { [L.en]: 'Notification of shift swaps from others' },
    'Statistik für Schichttausch exportieren': { [L.en]: 'Export shift swap statistics' },
    'Grunddaten für Online-Zahlung ändern': { [L.en]: 'Change basic settings for online payment' },
    'Online-Zahlung für den Account aktivieren': { [L.en]: 'activate online payment for this account' },
    'User': { [L.en]: 'Users' },
    'Eigene Daten editieren': { [L.en]: 'Edit own profile' },
    'Vollständige Daten anderer sehen': { [L.en]: 'See someone else’s complete profile' },
    'Kontaktdaten anderer sehen (Name, Email, Telefon)': { [L.en]: 'See someone else’s contact details (name, email, phone)' },
    'Daten anderer editieren': { [L.en]: 'Edit someone else’s profile' },
    'Neue User-Accounts erstellen': { [L.en]: 'Create new user accounts' },
    'User exportieren': { [L.en]: 'Export users' },
    'Buchungssystem': { [L.en]: 'Booking system' },
    'Buchungssystem-Einstellungen': { [L.en]: 'Booking system settings' },
    'Buchungsstatus eines Angebots sehen': { [L.en]: 'See booking status of offers' },
    'Buchungen eines Angebots sehen': { [L.en]: 'See booking of an offer' },
    'Buchungen sehen': { [L.en]: 'See bookings' },
    'Verkäufe': { [L.en]: 'Sales' },
    'Buchungen editieren': { [L.en]: 'Edit bookings' },
    'Online-Rückerstattung veranlassen': { [L.en]: 'Initiate an online refund' },
    'Preise & Infos von Tarifen ändern': { [L.en]: 'Change fee amount and info' },
    'Buchungen manuell erstellen': { [L.en]: 'Create bookings manually' },
    'Buchungen exportieren': { [L.en]: 'Export bookings' },
    '${bookingsCount} Buchungen exportieren': { [L.en]: 'Export ${bookingsCount} bookings' },
    'Buchungen löschen': { [L.en]: 'Delete booking' },
    'Benachrichtigung über Buchungen': { [L.en]: 'Notification of new bookings' },
    'Übersicht aller Zahlungen sehen': { [L.en]: 'See overview of all transactions' },
    'Gutscheine sehen oder editieren': { [L.en]: 'See and edit gift cards' },
    'Stornogebühr einer Buchung ändern': { [L.en]: 'Change cancellation fee of a booking' },
    'Tarife in einer Tätigkeit ändern': { [L.en]: 'Edit fees of an activity' },
    'Schichtverteilungsvorgänge': { [L.en]: 'Shift scheduling' },
    'Verteilungsvorgang erstellen': { [L.en]: 'Create scheduling tasks' },
    'Schichtwünsche anfordern': { [L.en]: 'Request shift preferences' },
    'Schichtwünsche abgeben': { [L.en]: 'Submit shift preferences' },
    'Eigene Schichtwünsche sehen': { [L.en]: 'See own shift preferences' },
    'Eigene Schichtwünsche editieren': { [L.en]: 'Edit own shift preferences' },
    'Schichtwünsche anderer sehen': { [L.en]: 'See someone else’s shift preferences' },
    'Schichtwünsche anderer editieren': { [L.en]: 'Edit someone else’s shift preferences' },
    'Erinnerung an Schichtwunschabgabe': { [L.en]: 'Reminder of submitting shift preferences' },
    'Mindest- & Maximallöhne anderer editieren': { [L.en]: 'Edit someone else’s earning limits' },
    'Eigenen Wunschlohn editieren': { [L.en]: 'Edit own desired earnings' },
    'Wunschlohn anderer editieren': { [L.en]: 'Edit someone else’s desired earnings' },
    'Verteilungsbericht empfangen': { [L.en]: 'Receive scheduling reports' },
    'Schichtplan veröffentlichen': { [L.en]: 'Publish schedules' },
    'Kalender-Synchronisation': { [L.en]: 'Calendar sync' },
    'Eigene Schichten synchronisieren': { [L.en]: 'sync own shifts' },
    'Andere Schichten synchronisieren': { [L.en]: 'Sync other shifts' },
    'Tageskommentar': { [L.en]: 'Day note' },
    'Tageskommentare sehen': { [L.en]: 'See day notes' },
    'Tageskommentare erstellen': { [L.en]: 'Create day notes' },
    'Tageskommentare editieren': { [L.en]: 'Edit day notes' },
    'Stempeluhr': { [L.en]: 'Time clock' },
    'Eigene Schicht stempeln': { [L.en]: 'Clock in own shifts' },
    'Ungeplanten Einsatz stempeln': { [L.en]: 'Clock in unscheduled hours' },
    'Stempelerinnerung für eigene Schichten': { [L.en]: 'Reminder of tracking own shifts' },
    'Benachrichtigung über versäumtes Stempeln der Angestellten': { [L.en]: 'Notification of employees who failed to track hours' },
    'Auswertung & Verdienst': { [L.en]: 'Reporting & earnings' },
    'Eigene Einträge sehen': { [L.en]: 'See own timesheet' },
    'Einträge anderer sehen': { [L.en]: 'See someone else’s timesheet' },
    'Einträge editieren': { [L.en]: 'Edit timesheets' },
    'Neue Einträge erstellen': { [L.en]: 'Create timesheet entries' },
    'Eigene Auswertungsdaten exportieren': { [L.en]: 'Export own timesheet' },
    'Auswertungsdaten anderer exportieren': { [L.en]: 'Export someone else’s timesheet' },
    'Rechteverwaltung': { [L.en]: 'Permission settings' },
    'Eigene Rechtegruppe sehen': { [L.en]: 'See own user group' },
    'Rechtegruppen anderer sehen': { [L.en]: 'See someone else’s user group' },
    'Rechtegruppen erstellen': { [L.en]: 'Create user groups' },
    'Rechtegruppen editieren': { [L.en]: 'Edit user groups' },
    'Firmen- & Account-Einstellungen': { [L.en]: 'Account & company settings' },
    'Firma/Account-Daten sehen': { [L.en]: 'See account & company settings' },
    'Firma/Account-Daten editieren': { [L.en]: 'Edit account & company settings' },
    'Gilt nur, wenn die Person Schreibrecht hat und zugleich die Nachrichten für Bereichsleitende bekommt.': { [L.en]: 'Permission only granted if a user group has write permission as well as notifications permission.' },
    /**
     * src/client/booking/booking.component.ts
     */
    'Buchung': { [L.en]: 'Booking' },
    'Interne Zahlungsart': { [L.en]: 'Internal payment method' },
    /**
     * src/client/booking/detail-form/detail-form.component.ts
     */
    'Buchende & teilnehmende Personen werden informiert, <strong>falls</strong> du automatische Emails aktiviert hast.': { [L.en]: 'Participants & the person who booked will be notified <strong>if</strong> you have enabled automated email.' },
    'Ein oder mehrere ausgewählte Tarife sind zu diesem Zeitpunkt nicht verfügbar.': { [L.en]: 'At least one of the chosen fees isn’t available at that time.' },
    'veranlassen': { [L.en]: 'initiate' },
    'Stornogebühr speichern': { [L.en]: 'Save cancellation fee' },
    'erfassen': { [L.en]: 'record' },
    'keine Rückerstattung': { [L.en]: 'no refund' },
    'Storno': { [L.en]: 'cancellation' },
    'Buchung stornieren': { [L.en]: 'cancel booking' },
    // cSpell:ignore zahlungsexport_buchung, paymentexport
    'zahlungsexport_buchung': { [L.en]: 'paymentexport_booking' },
    'Anfragen können nur auf »abgelehnt« oder »gebucht«, aber nicht auf »storniert« gesetzt werden. Nur verbindliche Buchungen dürfen »storniert« werden.': { [L.en]: 'Requests can only be set to »declined« or »booked« but not to »canceled«. Only binding bookings may be canceled.' },
    'Bitte verknüpfe zuerst diese Buchung mit einem Angebot, bevor du diesen Status setzt.': { [L.en]: 'Please link the booking to a suitable shift first before setting this status.' },
    'Nur Buchungen mit dem Status »gebucht« können storniert werden.': { [L.en]: 'Only bookings with the status »booked« may be canceled.' },
    'Die Personen sollten mindestens ${min} und höchstens ${max} Jahre alt sein (zum Datum des gebuchten Angebots).': { [L.en]: 'Should be at least ${min} and at most ${max} years old by the date of the booked offer.' },
    'Die Personen sollten mindestens ${min} Jahre alt sein (zum Datum des gebuchten Angebots).': { [L.en]: 'Should be at least ${min} years old by the date of the booked offer.' },
    'Die Personen sollten höchstens ${max} Jahre alt sein (zum Datum des gebuchten Angebots).': { [L.en]: 'Should be at most ${max} years old by the date of the booked offer.' },
    'Die Person sollte mindestens ${min} und höchstens ${max} Jahre alt sein (zum Datum des gebuchten Angebots).': { [L.en]: 'The person should be at least ${min} and at most ${max} years old by the date of the booked offer.' },
    'Die Person sollte mindestens ${min} Jahre alt sein (zum Datum des gebuchten Angebots).': { [L.en]: 'The person should be at least ${max} years old by the date of the booked offer.' },
    'Die Person sollte zum Buchungszeitpunkt mindestens ${min} Jahre alt sein.': { [L.en]: 'The person should be at least ${max} years old when booking.' },
    'Die Person sollte höchstens ${max} Jahre alt sein (zum Datum des gebuchten Angebots).': { [L.en]: 'The person should be at most ${max} years old by the date of the booked offer.' },
    /**
     * src/client/booking/detail-form/p-shift-selection/p-shift-selection.component.ts
     */
    /**
     * src/client/devices/devices.component.ts
     */
    'Gerät Nr. ${deviceCount}': { [L.en]: 'Device No. ${deviceCount}' },
    /**
     * src/client/email/detail-form/p-custom-course-email-placeholders/p-custom-course-email-placeholders.component.ts
     */
    'Wurde in die Zwischenablage kopiert': { [L.en]: 'Copied to the clipboard' },
    /**
     * src/client/email/email.component.ts
     */
    'Email': { [L.en]: 'Email' },
    'Willst du die ${itemName} wirklich löschen?': { [L.en]: 'Are you sure you want to delete ${itemName}?' },
    'Email-Vorlage »${name}«': { [L.en]: 'Email template »${name}«' },
    'neue Email-Vorlage': { [L.en]: 'new email template' },
    /**
     * src/client/gift-card/gift-card.component.ts
     */
    'Gutschein': { [L.en]: 'gift card' },
    'Für Online-Rückerstattungen an die buchende Person steht maximal dieses Guthaben zur Verfügung. Das Guthaben ergibt sich aus der Differenz ein- und abgegangener <strong>Online-Zahlungen</strong>, die unten aufgelistet sind.': { [L.en]: 'A maximum of this balance is available for online refunds to the booking person – the balance results from the difference of incoming and outgoing online payments shown below.' },
    /**
     * src/client/header/header.component.ts
     */
    'S': { [L.en]: 'Sec' },
    'Sek.': { [L.en]: 'Sec.' },
    'Sekunden': { [L.en]: 'Seconds' },
    'M': { [L.en]: 'Min' },
    'Min.': { [L.en]: 'Min.' },
    'Minute': { [L.en]: 'Minute' },
    'Minuten': { [L.en]: 'Minutes' },
    'Std': { [L.en]: 'Hrs' },
    'Std.': { [L.en]: 'Hrs.' },
    'Stunde': { [L.en]: 'Hour' },
    'Stunden': { [L.en]: 'Hours' },
    'Tage': { [L.en]: 'Days' },
    'Wochen': { [L.en]: 'Weeks' },
    'Monate': { [L.en]: 'Months' },
    'Jahre': { [L.en]: 'Years' },
    'KW': { [L.en]: 'CW' },
    'Test: noch ${time}': { [L.en]: 'Free trial: ${time} left' },
    /**
     * src/client/ical/ical.component.ts
     */
    'Sonstige': { [L.en]: 'Other' },
    'In die Zwischenablage kopieren': { [L.en]: 'Copy to clipboard' },
    'URL kopieren': { [L.en]: 'Copy link' },
    /**
     * src/client/member/detail-form/detail-form.component.ts
     */
    'Aus Sicherheitsgründen wirst du nun abgemeldet und kannst dich mit deinen neuen Daten wieder einloggen.': { [L.en]: 'For security reasons you’ll be logged out now. Please use your new data to log in again.' },
    '${name} wurde wiederhergestellt und per Email benachrichtigt.': { [L.en]: '${name} has been reactivated and notified via email.' },
    'Deine Kolleginnen und Kollegen, mit denen du in mindestens einer Tätigkeit zusammenarbeiten darfst, sehen dein Geburtsdatum im Kalender – allerdings nicht das Jahr und somit nicht dein genaues Alter 😉 Leitende Personen sehen das komplette Geburtsdatum.': { [L.en]: 'Your co-workers, who are allowed to work with you in at least one activity, will see your date of birth in their calendar - however, not the year and therefore not your exact age 😉 Managers will see the complete date.' },
    'Kontoinhaber': { [L.en]: 'account holder' },
    'Kontoinhaberin': { [L.en]: 'account holder' },
    'Der/Die Kontoinhabende': { [L.en]: 'account holder' },
    /**
     * src/client/member/member.component.ts
     */
    'Der User-Account': { [L.en]: 'The user' },
    'Willst du den Account von ${firstName} ${lastName} wirklich löschen?': { [L.en]: 'Are you sure you want to delete the user ${firstName} ${lastName}?' },
    'Dieser User kann aktuell nicht gelöscht werden, da es keinen weiteren User mit Admin-Rechten gibt. Es muss immer mindestens ein Admin vorhanden sein.': { [L.en]: 'This user cannot be deleted because there is no other user with administration rights. At least one admin must always exist.' },
    'Keine Sorge! Gelöschte User werden nicht aus den vergangenen Schichten entfernt. Außerdem kannst du weiterhin auf ihre Auswertungsdaten zugreifen.': { [L.en]: 'Don’t worry. Deleted users will not be taken out of past shifts. You will also be able to access their evaluation data.' },
    /**
     * src/client/notifications/notifications.component.ts
     */
    'App Push Nachricht': { [L.en]: 'Mobile push notification' },
    'Browser Push Nachricht': { [L.en]: 'Browser push notification' },
    'Grundlegendes für Schichtverteilungen': { [L.en]: 'General notifications for scheduling' },
    'Erinnerung an Schichtverteilungen': { [L.en]: 'Reminder for scheduling tasks' },
    'Schichtverteilung abgeschlossen': { [L.en]: 'Scheduling completed' },
    'Änderungen in deiner Schichtbesetzung': { [L.en]: 'Changes to your shift assignment' },
    'Schicht-Erinnerung': { [L.en]: 'Shift reminder' },
    'Vergessen zu stempeln': { [L.en]: 'Time clock reminder' },
    'Jemand hat nicht gestempelt': { [L.en]: 'someone failed to clock in/out' },
    'Mindestteilnehmendenzahl nicht erreicht': { [L.en]: 'Minimum participants haven’t been reached' },
    'Mindestteilnehmendenzahl erreicht': { [L.en]: 'Minimum participants have been reached' },
    'Neue Buchungsanfrage eingegangen': { [L.en]: 'New booking request' },
    'Buchungsanfrage abgelehnt': { [L.en]: 'Booking request declined' },
    'Neue Buchung': { [L.en]: 'New booking' },
    'Gebucht': { [L.en]: 'Booked' },
    'Neue Buchung bzw. Anfrage mit Kundenkommentar': { [L.en]: 'New booking or request with customer’s comment' },
    'Buchung storniert': { [L.en]: 'Booking canceled' },
    'Buchung storniert durch User': { [L.en]: 'Booking canceled by a user' },
    'Buchung storniert vom Kunden selbst': { [L.en]: 'Booking canceled by the customer' },
    'Buchung storniert und manuelle Rückerstattung nötig': { [L.en]: 'Booking canceled and manual refund required' },
    'Storniert': { [L.en]: 'canceled' },
    'Gutschein verkauft': { [L.en]: 'Gift card sold' },
    'Grundlegende Nachrichten': { [L.en]: 'General notifications' },
    'Erinnerung: Bitte antworten!': { [L.en]: 'Reminder to reply' },
    'Jede neue Ersatzsuche': { [L.en]: 'Each new swap request' },
    'Jede abgeschlossene Ersatzsuche mit Problemen': { [L.en]: 'Only shift swaps with warnings' },
    'Jede abgeschlossene Ersatzsuche': { [L.en]: 'Each shift swap' },
    'Jede gescheiterte Ersatzsuche': { [L.en]: 'Each failed swap request' },
    'Deine Schichten': { [L.en]: 'Your shifts' },
    'Schichtbesetzung': { [L.en]: 'Shift assignments' },
    'Tauschbörse': { [L.en]: 'Swap shop' },
    'Kursbuchung': { [L.en]: 'Online booking' },
    'Nachrichten zu deiner eigenen Ersatzsuche oder Krankmeldung. Sowie wichtige Infos zur Ersatzsuche von anderen, wo du involviert bist.': { [L.en]: 'Notifications of your own swap or leave requests. Also of swap request from others if you’re involved.' },
    'Wenn jemand seit Tagen wegen einer Ersatzsuche auf deine Antwort wartet.': { [L.en]: 'In case somebody has been waiting for days for your reply.' },
    'Tipp: Die Email-Benachrichtigung enthält auch eine Kopie der automatischen Emails, die an deine Kunden verschickt wurden.': { [L.en]: 'Tip: The email notification includes a copy of the automated emails that has been sent to your customers.' },
    'Bei manueller Stornierung einer Buchung in Dr.&nbsp;Plano durch dich selbst oder einen anderen User.': { [L.en]: 'When manually canceling a booking in Dr.&nbsp;Plano by yourself or another user.' },
    'Ein Kunde hat selbst online storniert.': { [L.en]: 'A customer has canceled online.' },
    'Nach einer Stornierung ist eine Rückerstattung fällig, die manuell ausgeführt werden muss. Entweder, weil die automatische Rückerstattung deaktiviert ist, oder weil nicht genügend Online-Guthaben dafür zur Verfügung steht.': { [L.en]: 'After a cancellation, a refund is due, which you need to do manually. Either because the automatic refund is deactivated or because there is not enough online balance available.' },
    'Deine Kunden können im Buchungsprozess einen Kommentar hinterlegen. Falls du dich nicht über jede Buchung & Anfrage benachrichtigen lässt, empfehlen wir dir diese Benachrichtigung einzuschalten.': { [L.en]: 'Your customers may add a comment to their booking. If you’ve turned off notifications for each booking, we highly recommend to activate this notification. Tip: The email notification includes a copy of the automated emails that has been sent to your customers.' },
    'Nach Ablauf der Buchungsfrist oder spätestens zwei Tage vor Angebotstermin.': { [L.en]: 'After the booking deadline has passed, but no later than two days before the offer’s date.' },
    'Sobald die Mindestteilnehmendenzahl erreicht wurde.': { [L.en]: 'As soon as the minimum participant number has been reached.' },
    'Falls du vergisst, eine geplante Schicht ein- oder auszustempeln, bekommst du spätestens am Folgetag eine Erinnerung.': { [L.en]: 'If you forget to track your time, Dr.&nbsp;Plano will remind you the next day at the latest.' },
    'Nach dem Gesetz müssen Angestellte innerhalb von 7 Tagen nach einer Schicht ihre Arbeitszeit gestempelt haben. Tun sie es trotz Erinnerung von Dr.&nbsp;Plano nicht, wirst du benachrichtigt.': { [L.en]: 'If employees fail to track their time despite reminders, you’ll be notified.' },
    'Du wirst über jeden neuen Gutscheinverkauf informiert.': { [L.en]: 'Notification of every gift card sold.' },
    'Probleme können sein: Überschreitung des Maximallohns, Schichtabstände etc.': { [L.en]: 'Warnings such as exceeding the earnings limit or not enough rest time between shifts etc.' },
    'Nachrichten wie: Bitte Schichtwünsche abgeben; bitte in Schichten / Kursen eintragen; Schichtplan veröffentlicht etc.': { [L.en]: 'Notifications like: please submit shift preferences; please pick up shifts; the schedule has been published etc.' },
    'Wenn du bis kurz vor Ablauf der Frist noch keine Schichtwünsche abgegeben oder vergessen hast, dich in Schichten einzutragen.': { [L.en]: 'If the deadline is about to expire and you haven’t either submitted your shift preferences or picked up empty shifts yet.' },
    'Du erhältst wichtige Berichte im Rahmen von Verteilungsvorgängen.': { [L.en]: 'You’ll receive important scheduling reports.' },
    'Wenn deine Personalleitung dich aus einer Schicht entfernt oder dir eine neue zuweist.': { [L.en]: 'In case you’ve been either scheduled for a new shift or removed from one.' },
    'Einmal pro Tag wirst du an deine morgigen Schichten erinnert.': { [L.en]: 'Once a day a kind reminder of your shifts for the next day.' },
    'Falls ein von dir geleitetes Angebot (z.B. ein Kurs) storniert wird.': { [L.en]: 'In case one of your bookable offers (e.g., a class) gets canceled.' },
    'Du wirst benachrichtigt, wenn die Online-Zahlung eines Kunden fehlschlägt und der Kunde die Zahlung erneut vornehmen muss.': { [L.en]: 'You will be notified if a customer’s online payment fails and the customer needs to make the payment again.' },
    'Benachrichtigung über jede Online-Rückerstattung an Kunden, die von einem <strong>anderen</strong> User in Dr.Plano veranlasst wird.': { [L.en]: 'Get notified about every online refund to a customer that <strong>another</strong> user initiates.' },
    'Benachrichtigung über jede fehlgeschlagene Online-Rückerstattung.': { [L.en]: 'Notification of any failed online refund.' },
    /**
     * src/client/plugin/p-plugin-settings/p-plugin-settings.component.ts
     */
    'Anonymisierte Daten können nicht wiederhergestellt werden.': { [L.en]: 'Anonymized data cannot be restored.' },
    /**
     * src/client/plugin/boulderado/boulderado.component.ts
     */
    'Schnittstelle zu ${posName} verwenden': { [L.en]: 'Use the ${posName} interface' },
    /**
     * src/client/plugin/p-custom-course-emails/event-types.service.ts
     */
    'Buchungsanfrage eingegangen': { [L.en]: 'Booking request received' },
    'Diese Email erhalten deine Kunden, nachdem sie online eine Buchungsanfrage gesendet haben.': { [L.en]: 'Your customers receive this email after requesting a booking online.' },
    'Diese Email erhalten Kunden bei direkter Online-Buchung oder bei Bestätigung ihrer Buchungsanfrage.': { [L.en]: 'Your customers receive this email after booking online or after you’ve accepted their booking requests.' },
    'Diese Email erhalten Kunden, deren Online-Zahlung nachträglich fehlgeschlagen ist (z.B. weil ihr Konto nicht gedeckt war). Die Email enthält einen Button, worüber deine Kunden erneut zahlen können.': { [L.en]: 'This email is sent to customers whose online payment failed afterward (e.g., because their account was not in credit). The email includes a button that allows your customers to pay again.' },
    'Erfolgreich gebucht': { [L.en]: 'Booked successfully' },
    'Teilzahlung erhalten': { [L.en]: 'Received partial payment' },
    'Buchungspreis komplett bezahlt': { [L.en]: 'Paid in full' },
    'Geld erstattet': { [L.en]: 'Fee refunded' },
    'Buchungspreis geändert': { [L.en]: 'Fee has changed' },
    'Termin-Erinnerung': { [L.en]: 'Reminder' },
    '2 Tage vor dem ersten Termin': { [L.en]: '2 days before the booked offer starts' },
    'Angebotstermin geändert': { [L.en]: 'Offer’s date changed' },
    'Diese Email wird verschickt, wenn sich die Uhrzeit oder das Datum eines gebuchten Angebots ändert. Oder einer der Termine eines mehrtägigen Angebots gelöscht wird.': { [L.en]: 'This email will either be sent out when date or time of an booked offer changes or when one session of a multi-day offer gets canceled.' },
    'Teilnahme abgeschlossen': { [L.en]: 'After attendance' },
    'Diese Email wird spätestens am Tag nach der Teilnahme an einem gebuchten Angebot verschickt.': { [L.en]: 'This email will be sent out the day after the booked offer.' },
    'Neuer Gutschein': { [L.en]: 'New gift card' },
    'Präferierte Zahlungsart geändert': { [L.en]: 'Preferred payment method changed' },
    'Online-Zahlung fehlgeschlagen': { [L.en]: 'Online payment failed' },
    'Online-Rückerstattung veranlasst': { [L.en]: 'Online refund initiated' },
    'Online-Rückerstattung fehlgeschlagen': { [L.en]: 'Online refund failed' },
    /**
     * src/client/plugin/plugin.component.ts
     */
    // cSpell:ignore gutscheine
    'gutscheine': { [L.en]: 'gift_cards' },
    'OK!': { [L.en]: 'OK!' },
    'Noch nicht eingerichtet': { [L.en]: 'Not yet activated.' },
    'Eine Datenänderung muss von Adyen, unserem Partner für die Online-Zahlung, geprüft und genehmigt werden. Über das Ergebnis der Prüfung wirst du automatisch benachrichtigt. Bis dahin steht dir die Online-Zahlung weiterhin zur Verfügung.': { [L.en]: 'A modification of data must be approved by Adyen, our partner for the online payment. We’re going to notify you about the result of the review. Until then, online payment will continue to be available to your customers.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Wenn du fortfährst, wird für dich ein Buchungskonto bei unserem Partner Adyen erstellt. Dafür fällt eine einmalige <mark>Einrichtungsgebühr von 15 €</mark> an, die mit deiner nächsten Rechnung abgerechnet wird (siehe <a href="online-payment-pricing#onboarding" target="_blank" rel="noopener">Gebühren Online-Zahlung</a>).</br></br>Anschließend fragt Adyen nach einigen Angaben zu dir und deinem Betrieb. 👩‍🦰👨‍🦱 Stelle dabei sicher, dass du unter der Rubrik <mark>ULTIMATE BENEFICIAL OWNER (UBO) UND UNTERZEICHNER</mark> <b>mindestens eine/n Inhaber/in</b> und <b>mindestens eine/n Unterzeichner/in</b> einträgst. Sonst kann das Onboarding nicht vollständig abgeschlossen werden. Beide Rollen können übrigens von derselben Person erfüllt sein.</br></br>Möchtest du fortfahren?': { [L.en]: 'If you proceed, an online payment account will be created with our partner Adyen. For this, you’ll be charged a one-time setup fee of 15 €, which will be included in your next invoice (see <a href="online-payment-pricing#onboarding" target="_blank" rel="noopener">online payment fees</a>).</br></br>Adyen will then ask for some information about you and your company. 👩‍🦰👨‍🦱 Please make sure that you enter <b>at least one owner</b> and <b>at least one signatory</b> in the section <mark>ULTIMATE BENEFICIAL OWNER (UBO) AND SIGNATORY</mark>. Otherwise, onboarding cannot be completed. Both roles can be covered by the same person.</br></br>Do you want to ge ahead?' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Wenn du fortfährst, wird für dich ein Buchungskonto bei unserem Partner Adyen erstellt. Anschließend fragt Adyen nach einigen Angaben zu dir und deinem Betrieb.</br></br>👩‍🦰👨‍🦱 Stelle bitte bei der Angabe deiner Daten sicher, dass du unter der Rubrik <mark>ULTIMATE BENEFICIAL OWNER (UBO) UND UNTERZEICHNER</mark> <b>mindestens eine/n Inhaber/in</b> und <b>mindestens eine/n Unterzeichner/in</b> einträgst. Sonst kann das Onboarding nicht vollständig abgeschlossen werden. Beide Rollen können übrigens von derselben Person erfüllt sein.</br></br><mark>🎉 Rabatt-Aktion</mark> Keine Einrichtungsgebühr für die Online-Zahlung bis Ende 2021. Danach kostet die Einrichtung einmalig 15 € (siehe <a href="online-payment-pricing#onboarding" target="_blank" rel="noopener">Gebühren Online-Zahlung</a>).</br></br>Möchtest du fortfahren?': { [L.en]: 'If you proceed, an online payment account will be created on the side of our partner Adyen. Adyen will then ask for some information about you and your company.</br></br>👩‍🦰👨‍🦱 Please make sure that you enter <b>at least one owner</b> and <b>at least one signatory</b> in the section <mark>ULTIMATE BENEFICIAL OWNER (UBO) AND SIGNATORY</mark>. Otherwise, onboarding cannot be completed. Both roles can be covered by the same person.</br></br><mark>🎉 Promotion</mark> No setup fee for online payment until the end of 2021. After that, you’ll be charged a one-time setup fee of 15 € (see <a href="online-payment-pricing#onboarding" target="_blank" rel="noopener">online payment fees</a>).</br></br>Do you want to ge ahead?' },
    'Du hast leider keine Berechtigung hierfür. Wende dich bitte an deine Admins.': { [L.en]: 'Sorry, you do not have permission to do this. Please get in touch with your admins.' },
    'Bevor du weitermachen kannst, musst du die Nutzungsbedingungen akzeptieren und die Checkboxen ankreuzen.': { [L.en]: 'Before continuing, you need to agree to the terms & conditions and check the checkboxes.' },
    'Dein Account ist zurzeit leider gesperrt! Falls du die Online-Zahlung wieder nutzen möchtest, melde dich bitte bei uns.': { [L.en]: 'Your account is currently suspended! If you wish to resume using the online payment, please let us know.' },
    'Anfrage läuft. Du wirst gleich weiter geleitet.': { [L.en]: 'Loading… You will be forwarded shortly.' },
    'Buchungskonto wird erstellt': { [L.en]: 'Your online payment account is being created' },
    'Dein Buchungskonto wird gerade noch erstellt. Das kann einige Minuten dauern. Wir werden dich per Email benachrichtigen, sobald das Konto zur Verfügung steht und du fortfahren kannst.': { [L.en]: 'Your booking account is being created, which may take a few moments. We will notify you by email as soon as the account is ready, and you can proceed.' },
    'Hohe Auslastung': { [L.en]: 'High server load' },
    'Die Onboarding-Seite kann gerade aufgrund hoher Auslastung nicht aufgerufen werden. Versuche es bitte später nochmal.': { [L.en]: 'Unfortunately, the onboarding page cannot be accessed right now due to the high load. Please try again later.' },
    'Okay': { [L.en]: 'Okay' },
    'Möchtest du den Rhythmus der Auszahlungen wirklich ändern?': { [L.en]: 'Are you sure you want to change the frequency of payouts?' },
    /**
     * src/client/voucher/voucher.component.ts
     */
    'Willst du diesen Gutschein wirklich löschen?': { [L.en]: 'Are you sure you want to delete this gift card?' },
    /**
     * src/client/report/report.component.ts
     */
    // cSpell:ignore auswertungsexport
    'auswertungsexport': { [L.en]: 'reporting_export' },
    'Auswertung vom': { [L.en]: 'Reporting from' },
    'vom': { [L.en]: 'from' },
    'bis': { [L.en]: 'to' },
    /**
     * src/client/report/shared/report-row/report-row.component.ts
     */
    'Diese Prognose für die Zukunft basiert auf dem aktuellen Schichtplan und kann nicht bearbeitet werden.': { [L.en]: 'The forecast is based on actual scheduling, and therefore it cannot be edited.' },
    /**
     * src/client/scheduling/shared/p-bookings/bookings.service.ts
     */
    'Die Anwesenheit darfst du nur am Tag des Termins selbst bearbeiten. Wende dich bitte ansonsten an einen Admin.': { [L.en]: 'You may only edit this on the day of the event itself. Please contact an admin, if it needs to be changed now.' },
    'Die Anwesenheit wurde automatisch bestätigt aufgrund eines Vermerks von der Kasse, dass die Person die fällige Gebühr am Tag des Termins an der Kasse entrichtet hat.': { [L.en]: 'The participant has been automatically marked as »attended« due to his or her on-site payment on the day of the event.' },
    /**
     * src/client/sales/bookings/bookings.component.ts
     */
    'Bei aktiver Suche steht der Statistik-Export nicht zur Verfügung.': { [L.en]: 'Statistics export is not available while the search is active.' },
    'Eine Buchung exportieren': { [L.en]: 'Export one booking' },
    'Statistik für eine Buchung exportieren': { [L.en]: 'Export statistics for one booking' },
    'Statistik für ${bookingsCount} Buchungen exportieren': { [L.en]: 'Export statistics for ${bookingsCount} bookings' },
    'Ja, ${action}': { [L.en]: 'Yes, ${action}' },
    'Angebote': { [L.en]: 'offers' },
    'Buchungen der folgenden Tätigkeiten werden <mark>nicht exportiert</mark>, weil dir dafür die Rechte fehlen:': { [L.en]: 'Bookings of the following activities <mark>will not</mark> be exported because you lack permission to do so:' },
    /**
     * src/client/sales/gift-cards/gift-cards.component.ts
     */
    'Gutscheine': { [L.en]: 'gift cards' },
    /**
     * src/client/sales/transactions/transactions.component.html
     */
    'Du hast nicht die Berechtigung dazu. Bitte wende dich an einen Admin.': { [L.en]: 'You do not have permission for this. Please refer to an admin.' },
    /**
     * src/client/sales/transactions/transactions.component.ts
     */
    'Rückbuchungen (Chargebacks)': { [L.en]: 'Chargebacks' },
    'Rückbuchung (Chargeback)': { [L.en]: 'Chargeback' },
    'Zahlungen': { [L.en]: 'Transactions' },
    'Eingegangene Zahlung': { [L.en]: 'Incoming payment' },
    'Eingegangene Zahlungen': { [L.en]: 'Incoming payments' },
    'Auszahlung des Guthabens': { [L.en]: 'Balance payout' },
    'Auszahlungen des Guthabens': { [L.en]: 'Balance payouts' },
    'Aufladung des Guthabens': { [L.en]: 'Balance reload' },
    '${vatPercent} USt. auf die Online-Zahlungsgebühr': { [L.en]: '${vatPercent} VAT on the online payment fee' },
    'USt. auf die Online-Zahlungsgebühr': { [L.en]: 'VAT on the online payment fee' },
    'Aufladungen des Guthabens': { [L.en]: 'Balance reloads' },
    'Automatische Rückerstattung': { [L.en]: 'Automated refund' },
    'Rückerstattung': { [L.en]: 'Refund' },
    'Rückerstattungen': { [L.en]: 'Refunds' },
    'Korrektur': { [L.en]: 'Adjusting entry' },
    'PayPal': { [L.en]: 'PayPal' },
    'PayPal (eingestellte Zahlungsart)': { [L.en]: 'PayPal (support discontinued)' },
    'Kasse per Schnittstelle': { [L.en]: 'POS (recorded via API)' },
    'Sonstige Zahlungsarten': { [L.en]: 'Misc. payment methods' },
    'Online-Zahlung': { [L.en]: 'Online payment' },
    'von ${referencedPerson}': { [L.en]: 'from ${referencedPerson}' },
    'an ${referencedPerson}': { [L.en]: 'to ${referencedPerson}' },
    'automatisch durch Dr.&nbsp;Plano': { [L.en]: 'automatically by Dr.&nbsp;Plano' },
    'einer fehlgeschlagenen Einzahlung': { [L.en]: 'for a failed incoming payment' },
    'einer fehlgeschlagenen Guthabenauszahlung': { [L.en]: 'for a failed balance payout' },
    'einer fehlgeschlagenen Rückerstattung': { [L.en]: 'for a failed refund' },
    'einer fehlgeschlagenen Guthaben-Aufladung': { [L.en]: 'for a failed balance reload' },
    'einer angefochtenen Rückbuchung': { [L.en]: 'for a defended chargeback' },
    'Zahlungsexport': { [L.en]: 'Payment export' },
    /**
     * src/client/scheduling/shared/p-bookings/booking-item/booking-item.component.ts
     */
    'Rückerstattung fällig': { [L.en]: 'Refund is needed' },
    'Keine Zahlungen offen': { [L.en]: 'No payments due' },
    'Kostenlose Buchung': { [L.en]: 'Free' },
    'Noch nicht bezahlt': { [L.en]: 'Not yet paid' },
    'Komplett bezahlt': { [L.en]: 'Paid in full' },
    'Teils bezahlt': { [L.en]: 'Paid partially' },
    /**
     * src/client/scheduling/shared/p-bookings/booking-item/booking-details-modal/p-tariff-input/p-tariff-input.component.ts
     */
    'Bist du sicher?': { [L.en]: 'Are you sure?' },
    'Dieser Tarif gilt nicht zum gewählten Angebotsdatum.': { [L.en]: 'This fee is not applicable on the selected offer date.' },
    /**
     * src/client/scheduling/shared/p-bookings/booking-item/dumb-booking-item/dumb-booking-item.component.ts
     * src/client/scheduling/shared/p-bookings/booking-item/dumb-booking-item/dumb-booking-item.component.html
     */
    'Anfrage': { [L.en]: 'Booking request' },
    'Anfrage abgelehnt': { [L.en]: 'Booking request declined' },
    'Keine Schicht im Kalender': { [L.en]: 'No shifts in the calendar' },
    'Im Kalender ansehen': { [L.en]: 'View on calendar' },
    /**
     * src/client/scheduling/shared/p-bookings/booking-list/booking-list.component.ts
     */
    // cSpell:ignore buchungsstatistik, buchungsexport
    'buchungsexport': { [L.en]: 'bookings_export' },
    'buchungsstatistik': { [L.en]: 'bookings_statistics' },
    'Nur verfügbar, wenn sich der eingestellte Zeitraum auf das »Angebotsdatum« bezieht.': { [L.en]: 'Only available if period relates to »class date«.' },
    'Lade ${label} ${index1} – ${index2} von ${index3}': { [L.en]: 'Show ${label} ${index1} – ${index2} of ${index3}' },
    'Buchungen': { [L.en]: 'Bookings' },
    'Kurse': { [L.en]: 'Classes' },
    /**
     * src/client/scheduling/shared/p-scheduling-calendar/calendar-title-bar/calendar-title-bar.component.ts
     */
    'Hinzufügen': { [L.en]: 'Create' },
    // cSpell:ignore kalenderexport
    'kalenderexport': { [L.en]: 'calendar_export' },
    'Das Ergebnis der Überprüfung wird dir per Email zugeschickt an: <strong>${email}</strong>': { [L.en]: 'The result will be sent to your email: <strong>${email}</strong>' },
    /**
     * src/client/scheduling/shared/p-scheduling-calendar/calendar-title-bar/deselect-btn/deselect-btn.component.ts
     */
    'Alles deselektieren': { [L.en]: 'Deselect all' },
    'Schicht deselektieren': { [L.en]: 'Deselect shift' },
    '${amount} Schichten deselektieren': { [L.en]: 'Deselect ${amount} shifts' },
    /**
     * src/client/scheduling/shared/p-scheduling-calendar/calendar-title-bar/wish-picker/wish-picker.component.ts
     */
    'Danke für deine Schichtwünsche.': { [L.en]: 'Thanks for your preferences' },
    'Schichtwunsch ist noch offen.': { [L.en]: 'shift preference is left.' },
    'Schichtwünsche sind noch offen.': { [L.en]: 'shift preferences are left.' },
    'Bitte erst Schichten auswählen': { [L.en]: 'Select shifts first' },
    'Schichtwunsch entfernen': { [L.en]: 'Remove preference' },
    'Möchte die Schicht': { [L.en]: 'Like it!' },
    'Wenn es sein muss': { [L.en]: 'If need be…' },
    'Kann nicht': { [L.en]: 'Unavailable' },
    /**
     * src/client/scheduling/shared/p-scheduling-calendar/p-calendar/p-all-day-items-list/p-all-day-item/p-all-day-item.component.ts
     */
    'Schulferien': { [L.en]: 'School holidays' },
    'Ist ein Festtag und kein gesetzlicher Feiertag': { [L.en]: 'It’s not a legal holiday.' },
    'Ist ein gesetzlicher Feiertag': { [L.en]: 'It’s a legal holiday.' },
    /**
     * src/shared/api.ts
     */
    'Krankheit': { [L.en]: 'Sickness' },
    'Urlaub': { [L.en]: 'Vacation' },
    'Sonstiges': { [L.en]: 'Other' },
    'Geburtstag': { [L.en]: 'Birthday' },
    /**
     * src/client/scheduling/shared/text-to-html.service.ts
     */
    '…mehr anzeigen': { [L.en]: '…show more' },
    /**
     * Ausgeblendet: ${counter} von ${amount} Schichten
     */
    'Ausgeblendete Schichten: ${counter} von ${amount}': { [L.en]: 'Hidden shifts: ${counter} of ${amount}' },
    /**
     * src/client/service/toasts.service.ts
     */
    'Ok': { [L.en]: 'OK' },
    'Schließen': { [L.en]: 'Close' },
    /**
     * src/client/shared/component/change-selectors-modal/change-selectors-modal.component.ts
     */
    'Nein, nur auf ${thisThing}': { [L.en]: 'No, just ${thisThing}' },
    'diese Vorlage': { [L.en]: 'this template' },
    'dieses Schicht-Paket': { [L.en]: 'this shift package' },
    'diese Schicht': { [L.en]: 'this shift' },
    'Änderung auf andere Bereiche übertragen?': { [L.en]: 'Apply this change to other areas?' },
    'Unbegrenzt': { [L.en]: 'Unlimited' },
    'Unbegrenzt bis zum Angebotsbeginn': { [L.en]: 'Unlimited till the start of the offer' },
    /**
     * src/client/shared/component/p-notification-conf-form/p-notification-conf-form.component.ts
     */
    'Eingeteilte User informieren': { [L.en]: 'Notify assigned user' },
    /**
     * src/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component.ts
     */
    'Kopie': { [L.en]: 'Copy' },
    'Momentchen …': { [L.en]: 'Not possible' },
    'Ein Tarif mit dem Namen »${name}« existiert schon.': { [L.en]: 'There’s already a fee called »${name}«.' },
    'Alle Zahlungsarten sind als interne Zahlungsart markiert.': { [L.en]: 'All payment methods are marked for internal use.' },
    'Alle Tarife sind als interner Tarif markiert.': { [L.en]: 'All fees marked as internal fee.' },
    '${name} wird bei Online-Buchung als kostenlos angezeigt werden.': { [L.en]: '${name} will be shown as free when booking online.' },
    'Wähle…': { [L.en]: 'Select…' },
    'Paketen': { [L.en]: 'Packages' },
    'Schichten': { [L.en]: 'shifts' },
    'Paket': { [L.en]: 'Package' },
    'Schicht': { [L.en]: 'shift' },
    'nach dem': { [L.en]: 'after the' },
    'Schichtinfo': { [L.en]: 'Shift details' },
    'Grundeinstellungen': { [L.en]: 'General settings' },
    'Einstellungen': { [L.en]: 'Settings' },
    'Buchungsinfo': { [L.en]: 'Booking status' },
    'Buchungseinstellungen': { [L.en]: 'Booking settings' },
    'Benötigtes Format: ss:mm. Wähle eine Uhrzeit zwischen ${start} und ${end}': { [L.en]: 'Required format: hh:mm. Select a time between ${start} and ${end}' },
    'Das Schicht-Paket »${shiftModelName}« wiederholt sich.': { [L.en]: 'The shift package ${shiftModelName} repeats.' },
    'Die Schicht »${shiftModelName}« wiederholt sich.': { [L.en]: 'The shift ${shiftModelName} repeats.' },
    '0 Mitarbeitende': { [L.en]: '0 instructor' },
    '1 Mitarbeitende': { [L.en]: 'One instructor' },
    '${counter} Mitarbeitende': { [L.en]: '${counter} instructors' },
    'pro ${x} teilnehmende': { [L.en]: 'per ${x} participants' },
    'Verteilt auf die Tage': { [L.en]: 'Repeat on' },
    'Am': { [L.en]: 'On' },
    'An jedem': { [L.en]: 'On every' },
    'Das Paket beginnt jeweils am': { [L.en]: 'This package starts on' },
    'Neue Tätigkeit': { [L.en]: 'New activity' },
    'Buchungen ${taxPercent}': { [L.en]: 'Bookings ${taxPercent}' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Das steht erst zur Verfügung, wenn du in den »Buchungssystem-Einstellungen« deinen PayPal-Account mit Dr. Plano verbunden hast.': { [L.en]: 'This will be available after you have connected your PayPal account to Dr.Plano in »Booking system settings«.' },
    'Du hast diese Zahlungsart bereits hinzugefügt.': { [L.en]: 'This payment method has already been added.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Bitte erst für deinen Account die <a href="client/plugin/payments" target="_blank">Online-Zahlung aktivieren</a>, um die Zahlungsart hier verwenden zu können.': { [L.en]: 'To enable this payment method here, you need to <a href="client/plugin/payments" target="_blank">activate online payment</a> for your account first.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Online-Zahlung steht für deine Landeswährung noch nicht zur Verfügung. Falls du die Online-Zahlung nutzen möchtest, melde dich gerne bei uns im Chat oder per <a href="mailto:service@dr-plano.com">Email</a>.': { [L.en]: 'Online payment is not yet available for your local currency. However, if you would like to use online payment, please contact us in the chat or via <a href="mailto:service@dr-plano.com">email</a>.' },
    /**
     * src/client/shared/component/p-shift-and-shiftmodel-form/cancellation-policy/cancellation-policy.component.html
     */
    'Um diese Funktion nutzen zu können, musst du erst deine Stornogebühren unter dem Reiter »Stornogebühren« angeben.': { [L.en]: 'You need to enter your cancellation fees on the tab »Cancellation fees« to use this feature.' },
    /**
     * src/client/shared/component/p-shift-and-shiftmodel-form/cancellation-policy/cancellation-policy.component.ts
     */
    'Bedenke!': { [L.en]: 'Keep in mind!' },
    'Tage vor dem Angebotstag': { [L.en]: 'days before the offer day' },
    'Damit hier eine weitere Zeitspanne hinzugefügt werden kann, ändere bitte den Start der vorherigen Zeitspanne von »UNBEGRENZT« in eine konkrete Anzahl an Tagen.': { [L.en]: 'To add another period here, please change the start of the previous period from »UNLIMITED« to a set number of days.' },
    /**
     * src/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.service.ts
     */
    'Für »${name}« sollen Kunden Wunschtermine angeben. Die Schichten sind im Plugin nicht zu sehen.': { [L.en]: 'Customers have to indicate an individual date for »${name}«. Existing shifts won’t be shown in the plugin calendar.' },
    'Uhrzeit muss vor »${max}« liegen': { [L.en]: 'Choose a time before »${max}«' },
    'Die Zeit muss vor »${max}« liegen': { [L.en]: 'Choose a time before »${max}«' },
    'Wähle bitte eine Zeit später als »${min}«.': { [L.en]: 'Choose a time after »${min}«.' },
    'Uhrzeit muss später als »${min}« sein': { [L.en]: 'Choose a time after »${min}«' },
    'Nie': { [L.en]: 'Never' },
    'Nach X Wiederholungen': { [L.en]: 'After X occurrences' },
    'An dem Datum X': { [L.en]: 'On X' },
    'Nach X Paketen': { [L.en]: 'After X packages' },
    'Nach X Schichten': { [L.en]: 'After X shifts' },
    /**
     * src/client/shared/component/p-subheader/p-subheader.component.ts
     */
    'Verwerfen': { [L.en]: 'Discard' },
    'Zurück': { [L.en]: 'Back' },
    /**
     * src/client/shared/detail-form-utils.service.ts
     */
    '${itemTitle} wurde angelegt.': { [L.en]: '${itemTitle} has been created.' },
    'Fehler beim Anlegen.': { [L.en]: 'Failed to create.' },
    /**
     * src/client/shared/filter.service.ts
     */
    'User ausgeblendet': { [L.en]: 'User hidden' },
    '… und dazugehörige Schichten, Tauschbörsen-Einträge, Arbeitseinsätze in der Auswertung etc.': { [L.en]: '… and related shifts, swap shop entries, entries in the reporting, etc.' },
    'Tätigkeit ausgeblendet': { [L.en]: 'Activity hidden' },
    /**
     * src/client/shared/p-account-form/p-account-form.service.ts
     */
    '${monthlyPrice} zzgl. MwSt.': { [L.en]: '${monthlyPrice}' },
    /**
     * src/client/shared/p-forms/p-delete-button/p-delete-button.component.ts
     */
    'Löschen': { [L.en]: 'Delete' },
    'Ja, ${label}': { [L.en]: 'Yes, ${label}' },
    /**
     * src/client/shared/p-editable/p-editable-modal-button/p-editable-modal-button.component.ts
     */
    'Speichern': { [L.en]: 'Save' },
    'Rückerstattung veranlassen': { [L.en]: 'initiate a refund' },
    'Einzahlung erfassen': { [L.en]: 'Record an incoming payment' },
    'Rückerstattung erfassen': { [L.en]: 'Record a refund' },
    'Neue Rückerstattung': { [L.en]: 'New refund' },
    'Neue Einzahlung': { [L.en]: 'New incoming payment' },
    'Neue Zahlung': { [L.en]: 'New payment' },
    /**
     * src/client/shared/p-forms/p-form-control-switch/p-form-control-switch.component.html
     */
    'Angebotsbeginn & danach': { [L.en]: 'Offer start & afterward' },
    /**
     * src/client/shared/p-forms/p-recover-button/p-recover-button.component.ts
     */
    'Wiederherstellen': { [L.en]: 'Restore' },
    /**
     * src/client/shared/p-export.service.ts
     */
    '${day}_${month}_${year}': { [L.en]: '${day}_${month}_${year}' },
    /**
     * src/client/shared/p-forms/p-dropdown/p-dropdown.component.ts
     */
    'Bitte wählen…': { [L.en]: 'Please select…' },
    /**
     * src/client/shared/p-forms/p-input-date/p-input-date.component.ts
     */
    '--.--.----': { [L.en]: '--.--.----' },
    '--:--': { [L.en]: '--:--' },
    'Datum': { [L.en]: 'Date' },
    'Tag': { [L.en]: 'Day' },
    '${dayText} vor Schicht': { [L.en]: '${dayText} before shift' },
    'Bitte eine Uhrzeit eintragen. Z.B. ${example1} oder ${example2}.': { [L.en]: 'Please enter a time, like ${example1} or ${example2}.' },
    'Eingabe löschen': { [L.en]: 'Delete entry' },
    /**
     * src/client/shared/p-forms/p-input-member-id/p-input-member-id.component.ts
     */
    'Alle': { [L.en]: 'All' },
    'Berechtigten': { [L.en]: 'Eligible users' },
    'Alle Berechtigten': { [L.en]: 'All eligible users' },
    /**
     * src/client/shared/p-forms/p-input/p-input.component.ts
     */
    'z.B. »+49 123 0000000«': { [L.en]: 'e.g., »+49 123 0000000«' },
    'z.B. »${example1}«': { [L.en]: 'e.g., »${example1}«' },
    'z.B. »${example1}« oder »${example2}«': { [L.en]: 'e.g., »${example1} or »${example2}«' },
    'z.B. »${example1}«, »${example2}« oder »${example3}«': { [L.en]: 'e.g., »${example1}«, »${example2}« or »${example3}«' },
    'Suche…': { [L.en]: 'Search…' },
    /**
     * src/client/shared/p-forms/p-input/p-input.service.ts
     */
    'Bitte Zeit eingeben, z.B. »${example1}« oder »${example2}«.': { [L.en]: 'Please enter a time, like »${example1}« or »${example2}«.' },
    /**
     * src/client/shared/p-forms/p-input/p-password-strength-meter.ts
     */
    'Schwach': { [L.en]: 'Weak' },
    'Mäßig': { [L.en]: 'Fair' },
    'Stark': { [L.en]: 'Strong' },
    /**
     * src/client/shared/p-forms/p-password-strength-meter/p-password-strength-meter.component.ts
     */
    'min. ${minLength} Zeichen': { [L.en]: 'at least ${minLength} chars' },
    /**
     * src/client/shared/p-member/p-member.service.ts
     */
    // cSpell:ignore genitiv
    '${genitivName}’': { [L.en]: '${genitivName}’s' },
    '${genitivName}s': { [L.en]: '${genitivName}’s' },
    /**
     * src/client/shared/p-shift-exchange/deadline/deadline.component.ts
     */
    'Frist für Ersatzsuche: ${date}, ${time}': { [L.en]: 'Request’s deadline: ${date}, ${time}' },
    'Frist': { [L.en]: 'Deadline' },
    /**
     * src/client/shared/p-shift-exchange/p-shift-exchange-btn/p-shift-exchange-btn.component.ts
     */
    'Ersatzsuche anzeigen': { [L.en]: 'Show replacement request' },
    'Ersatz suchen': { [L.en]: 'Request replacement' },
    'Krankmeldung anzeigen': { [L.en]: 'Show leave request' },
    'Krank melden': { [L.en]: 'Call in sick' },
    /**
     * src/client/shared/p-shift-exchange/p-shifts-info/p-shifts-info.component.ts
     */
    '${amountOfShiftRefs} von ${amountOfShiftsInPackets} Schichten': { [L.en]: '${amountOfShiftRefs} from ${amountOfShiftsInPackets} shifts' },
    'Eine Schicht': { [L.en]: 'One shift' },
    '${counter} Schichten': { [L.en]: '${counter} shifts' },
    'aus ${shiftModelName}': { [L.en]: 'of ${shiftModelName}' },
    'aus ${counter} Tätigkeiten': { [L.en]: 'of ${counter} activities' },
    /**
     * src/client/shared/p-shift-exchange/shift-exchange.service.ts
     */
    'Vorgang nicht möglich': { [L.en]: 'Action not possible' },
    'Solange sich die Schicht im Verteilungsvorgang »${assignmentProcessName}« befindet, kann sie nicht in die Tauschbörse gestellt werden.': { [L.en]: 'This shift is part of the scheduling task »${assignmentProcessName}«, and therefore it cannot be added to the swap shop.' },
    '${name} am ${startDate} um ${startTime}': { [L.en]: '${name} on ${startDate} at ${startTime}' },
    'Folgende Schichten können keinem Verteilungsvorgang hinzugefügt werden, weil sie sich in der Tauschbörse befinden. Entferne bitte zuerst die Schichtbesetzungen, um die Schichten aus der Tauschbörse zu nehmen: ${shiftListAsText}': { [L.en]: 'The following shifts cannot be added to a scheduling, as they are in the swap shop. To take them out, you have to remove the assigned employees beforehand: ${shiftListAsText}' },
    'Folgende Schicht kann keinem Verteilungsvorgang hinzugefügt werden, weil sie sich in der Tauschbörse befindet. Entferne bitte zuerst die Schichtbesetzung, um sie aus der Tauschbörse zu nehmen: ${shiftListAsText}': { [L.en]: 'The following shift cannot be added to a scheduling, as it’s in the swap shop. To take it out, you have to remove the assigned employees beforehand: ${shiftListAsText}' },
    'Aktuell ist ${firstName} der Schicht nicht zugewiesen.': { [L.en]: '${firstName} isn’t assigned to the shift right now.' },
    'Aktuell ist ${firstName} mindestens einer der Schichten nicht zugewiesen.': { [L.en]: 'Currently ${firstName} isn’t assigned to at least one of the shifts.' },
    /**
     * src/client/shared/shift-exchanges/shift-exchanges.component.ts
     */
    'Tauschbörsen Statistik': { [L.en]: 'Swap shop statistics' },
    'Bitte erst oben bei »Zeitraum der Schichten« auf »benutzerdefiniert« umstellen und ein Start- sowie Enddatum festlegen.': { [L.en]: 'Please switch the »Period of shifts« to »custom« and set a start and end date.' },
    'Statistik exportieren': { [L.en]: 'Export statistics' },
    'Statistik': { [L.en]: 'Statistics' },
    /**
     * src/client/shared/p-shift-module/p-course-info/p-course-info.component.ts
     */
    'Stornierung': { [L.en]: 'canceled' },
    'Angebot fällt aus': { [L.en]: 'canceled' },
    'Offenes Angebot – benötigt keine Buchungen': { [L.en]: 'Open class – attending without prior booking' },
    'Mindestens': { [L.en]: 'Minimum' },
    'Maximal': { [L.en]: 'Maximum' },
    'Angebot ist online nicht sichtbar': { [L.en]: 'Class isn’t visible on website' },
    'Angebot ist online sichtbar': { [L.en]: 'Class is shown on website' },
    /**
     * src/client/shared/p-shift-module/shift-item-list/shift-item-list.component.ts
     */
    'fällt aus': { [L.en]: 'canceled' },
    /**
     * src/client/shared/p-shift-module/shift-member-exchange.service.ts
     */
    'Du arbeitest zu der Zeit schon in einer anderen Schicht.': { [L.en]: 'You do another shift at the same time.' },
    '${firstName} arbeitet zu der Zeit schon in einer anderen Schicht.': { [L.en]: '${firstName} does another shift at the same time.' },
    'Du hast für die gewählte Zeit einen Abwesenheitseintrag.': { [L.en]: 'You have a leave of absence at the same time.' },
    '${firstName} hat für die gewählte Zeit einen Abwesenheitseintrag.': { [L.en]: '${firstName} has a leave of absence at the same time.' },
    'würdest': { [L.en]: 'would' },
    'würde': { [L.en]: 'would' },
    'weiter': { [L.en]: 'by a greater amount' },
    '${MEMBER} ${WOULD} mit dieser Schicht den Maximallohn ${FURTHER} überschreiten.': { [L.en]: 'By picking up this shift, ${MEMBER} ${WOULD} exceed the maximum earnings ${FURTHER}.' },
    /**
     * src/client/shared/p-shift-picker/p-shift-picker-modal-box/p-shift-picker-modal-box.component.ts
     */
    'Sicher?': { [L.en]: 'Sure?' },
    'Du hast Schichten im Kalender selektiert, aber sie nicht der Tauschbörse hinzugefügt.': { [L.en]: 'You’ve selected shifts in the calendar but haven’t added them to the swap shop yet.' },
    'Trotzdem schließen': { [L.en]: 'Close anyway' },
    'Schichten hinzufügen': { [L.en]: 'Add shifts' },
    /**
     * src/client/shared/p-shift-picker/p-shift-picker/p-shift-picker.component.ts
     */
    'Schichten für den Tausch': { [L.en]: 'Shifts to swap' },
    'Schichten für Krankmeldung': { [L.en]: 'Shifts to call in sick' },
    'Schichten für Ersatzsuche': { [L.en]: 'Shifts to give away' },
    'Schicht-Auswahl': { [L.en]: 'Shift selection' },
    'Wähle im Kalender die Schichten, die du ${firstName} zum Tausch anbieten möchtest, und füge sie anschließend hier hinzu.': { [L.en]: 'First select shifts in the calendar which you want to swap with ${firstName}, then add them here.' },
    'Wähle im Kalender diejenigen Schichten, für die du ${recipient} krank melden möchtest, und füge sie anschließend hier hinzu.': { [L.en]: 'First select shifts in the calendar which are affected by calling in sick, then add them here.' },
    'Wähle im Kalender die Schichten, für die du Ersatz suchen möchtest, und füge sie anschließend hier hinzu.': { [L.en]: 'First select shifts in the calendar for which you want to request replacement, then add them here.' },
    'dich': { [L.en]: 'you' },
    'Schicht hinzufügen': { [L.en]: 'Add a shift' },
    '${counter} Schichten einzeln hinzufügen': { [L.en]: 'Add ${counter} shifts separately' },
    '${counter} Schichten der Krankmeldung hinzufügen': { [L.en]: 'Add ${counter} shifts to call in sick' },
    '${counter} Schichten der Suche hinzufügen': { [L.en]: 'Add ${counter} shifts to the request' },
    '${counter} Schichten der Auswahl hinzufügen': { [L.en]: 'Add ${counter} shifts to the selection' },
    'Du hast mehrere Schichten hinzugefügt. Sie alle müssen von einer Person komplett übernommen werden. Möchtest du das nicht, solltest du die Schichten einzeln in die Tauschbörse stellen.': { [L.en]: 'You’ve added multiple shifts. These must all be taken by one person. If you want to make these shifts available separately, you should add them individually to the swap shop.' },
    'Bedenke, dass dein Verhandlungspartner ein gebündeltes Schicht-Angebot komplett übernehmen muss und sich nicht einzelne Schichten rauspicken kann.': { [L.en]: 'Please be aware that shifts in a bundle must be taken as a set. Your colleagues can’t only pick the ones they want.' },
    'Zwei Angebote gleichen sich.': { [L.en]: 'Two offers are identical.' },
    'Es gibt Mitarbeitende, die schon auf die bisherige Schicht-Auswahl geantwortet haben. Änderst du die Auswahl, müssen sie erneut antworten.': { [L.en]: 'Some colleagues have already replied. By changing your offer they will be asked to reply again.' },
    'Niemand aus dem Team kann deine aktuelle Schicht-Auswahl übernehmen. Du solltest deine Auswahl ändern.': { [L.en]: 'None of your colleagues is available at the time of the selected shifts. Please change your selection.' },
    /**
     * src/client/shared/p-shift-picker/shift-picker-picked-offers/shift-picker-picked-offers.component.ts
     */
    'Der Auswahl hinzufügen': { [L.en]: 'Add to selection' },
    'Wähle im Kalender mindestens 1 Schicht, die du hinzufügen möchtest.': { [L.en]: 'Select at least 1 shift in the calendar you want to add.' },
    'Fügst du 2 oder mehr Schichten gebündelt hinzu, müssen sie komplett von einer Person übernommen werden.': { [L.en]: 'If you add 2 or more shifts in a bundle, they must all be taken by one person.' },
    /**
     * src/client/shared/p-shift-picker/shift-refs/shift-refs.component.ts
     */
    'Wähle weitere Schichten im Kalender, um sie diesem Angebot gebündelt hinzuzufügen.': { [L.en]: 'Select more shifts in the calendar to add them as as a bundle.' },
    /**
     * src/client/shared/p-sidebar/main-sidebar/main-sidebar.component.ts
     */
    'user_export': { [L.en]: 'user_export' },
    'Alles per Filter ausgeblendet': { [L.en]: 'All hidden by filters' },
    'Ausgeblendet: ${counter} von ${amount}': { [L.en]: 'Hidden: ${counter} of ${amount}' },
    'Filter nicht aktiv': { [L.en]: 'No filter applied' },
    /**
     * src/client/shared/p-sidebar/main-sidebar/p-sidebar-shiftmodels/sidebar-shiftmodels.component.ts
     */
    'Tätigkeitsdetails': { [L.en]: 'Activity details' },
    /**
     * src/client/shared/p-sidebar/main-sidebar/p-sidebar-members/sidebar-members.component.ts
     */
    'Aktive User': { [L.en]: 'Active users' },
    'Gelöschte User': { [L.en]: 'Deleted users' },
    /**
     * src/client/shared/p-sidebar/p-assignment-processes/p-assignment-processes.component.html
     */
    'Diese Verteilungsart kostet dich am wenigsten Zeit und ist zugleich besonders fair für das gesamte Team. Dr.&nbsp;Plano berücksichtigt dabei folgende Faktoren:': { [L.en]: 'This type of scheduling saves you plenty of time and gets the fairest result to the entire team. It bases on the following key factors:' },
    'Deine Angestellten tragen sich selbst für die freigegebenen Schichten ein. Wer am schnellsten ist, bekommt womöglich die besten Schichten. Daher ist das nicht die fairste Verteilungsart, aber sinnvoll, wenn es z.B. mal besonders schnell gehen soll.': { [L.en]: 'Your employees may pick up shared shifts independently. It works on a first come, first served basis. It’s the best way to cover your shifts very quickly.' },
    'Bei dieser Verteilungsart bekommst du die Schichtwünsche deiner Angestellten. Anschließend musst du jede Schicht manuell besetzen. Das ist viel zeitaufwendiger als die automatische Verteilung, aber sinnvoll, wenn du bei der Verteilung sehr viele Sonderwünsche berücksichtigen möchtest.': { [L.en]: 'You’ll get the shift preferences of your employees and can assign shifts by using them. This scheduling type is recommended if there are plenty of special arrangements with your staff which can’t be considered by the automated scheduling.' },
    /**
     * src/client/shared/p-sidebar/p-assignment-processes/p-assignment-process/p-assignment-process-type-caption/p-assignment-process-type-caption.component.html
     */
    'Schichten auswählen': { [L.en]: 'Select shifts' },
    'Dr.&nbsp;Plano hat verteilt': { [L.en]: 'Dr.&nbsp;Plano has assigned' },
    'Muss veröffentlicht werden': { [L.en]: 'Needs to be published' },
    'Für Angestellte freigeben': { [L.en]: 'Send out to staff' },
    'Vorgang abschließen': { [L.en]: 'Finish scheduling' },
    'Schichten manuell besetzen': { [L.en]: 'Assign shifts manually' },
    /**
     * src/client/shared/p-sidebar/p-assignment-processes/p-assignment-process/p-assignment-process-type-caption/p-assignment-process-type-caption.component.ts
     */
    'Automatische Verteilung': { [L.en]: 'Automated scheduling' },
    'Der frühe Vogel': { [L.en]: 'Early bird' },
    'Manuelle Verteilung': { [L.en]: 'Manual scheduling' },
    'Schichten für Verteilung auswählen': { [L.en]: 'Select shifts to schedule' },
    /**
     * src/client/shared/p-sidebar/p-assignment-processes/p-assignment-process/p-assignment-process.component.ts
     */
    'Der Vorgang »${name}« wurde gelöscht.': { [L.en]: '»${name}« has been deleted.' },
    'Der Vorgang »${name}« wurde abgeschlossen.': { [L.en]: '»${name}« has been completed.' },
    '0 Schichten drin': { [L.en]: '0 shifts included' },
    '1 Schicht drin': { [L.en]: '1 shift included' },
    '${amount} Schichten drin': { [L.en]: '${amount} shifts included' },
    'bis heute Abend': { [L.en]: 'until tonight' },
    'Deine Auswahl beinhaltet Schichten, für die du nicht als bereichsleitende Person eingetragen bist.': { [L.en]: 'Your selection includes shifts for which you are not assigned as manager.' },
    /**
     * src/client/shared/p-sidebar/p-assignment-processes/p-assignment-processes.component.ts
     */
    'Schichtverteilung': { [L.en]: 'Shift scheduling' },
    'Schichtverteilung ${counter}': { [L.en]: 'Scheduling task ${counter}' },
    'Schichten verteilen': { [L.en]: 'Shift scheduling' },
    'Schichten zu verteilen': { [L.en]: 'Shifts for scheduling' },
    'Erstelle einen neuen Verteilungsvorgang, um deine Schichten zu besetzen.': { [L.en]: 'Start a new scheduling to get your shifts assigned.' },
    'Sobald deine Personalleitung Schichten verteilen lässt, siehst du das hier und kannst aktiv werden.': { [L.en]: 'Active scheduling task will be shown here. They are your chance to pick up shifts.' },
    /**
     * src/client/shared/p-sidebar/p-sidebar/p-sidebar.component.ts
     */
    'Filter aus': { [L.en]: 'Filter deactivated' },
    'Filter sind aktiv': { [L.en]: 'Filter activated' },
    '${amount} To-dos vorhanden': { [L.en]: '${amount} to-dos on the list' },
    'Kein Kommentar für dich vorhanden': { [L.en]: 'No notes for you' },
    'Kommentare für dich vorhanden': { [L.en]: 'Notes for you' },
    /**
     * src/client/shared/p-sidebar/shiftmodel-list-item/shiftmodel-list-item.component.html
     */
    'Details anzeigen': { [L.en]: 'Show details' },
    /**
     * src/client/shared/p-transmission/change-selectors-modal.component.ts
     */
    'Stornieren': { [L.en]: 'Cancel' },
    'Check deine Emails': { [L.en]: 'Check your emails' },
    'Wir haben dir geschrieben, bei welchen Buchungen eine Online-Rückerstattung veranlasst wurde.': { [L.en]: 'We have listed the bookings that have been refunded online.' },
    /**
     * src/client/shared/p-transmission/change-selectors-modal.component.html
     */
    'Bei dieser Aktion steht die Übertragung aus technischen Gründen leider noch nicht zur Verfügung. Wenn du doch viele Stornierungen auf einmal vornehmen möchtest, könntest du die dazugehörigen Schichten löschen und das Löschen übertragen – falls Löschen eine Option ist.': { [L.en]: 'You can’t apply this action to other shifts. However, if you want to make numerous cancellations at once, you could delete the related shifts and apply the deletion to further shifts – if deleting is an option for you.' },
    /**
     * src/client/shared/p-transactions/transaction-list/transaction-list.component.ts
     */
    'zzgl. ${value} USt.': { [L.en]: 'plus ${value} VAT' },
    '+ ${value} USt.': { [L.en]: '+ ${value} VAT' },
    /**
     * src/client/shared/pipe/time-ago.pipe.ts
     */
    'gerade eben': { [L.en]: 'just now' },
    'vor 1 Min.': { [L.en]: '1 min. ago' },
    'vor 1 Minute': { [L.en]: '1 minute ago' },
    'vor ${minutes} Min.': { [L.en]: '${minutes} min. ago' },
    'vor ${minutes} Minuten': { [L.en]: '${minutes} minutes ago' },
    'vor 1 Std.': { [L.en]: '1 hr. ago' },
    'vor 1 Stunde': { [L.en]: '1 hour ago' },
    'vor ${hours} Std.': { [L.en]: '${hours} hrs. ago' },
    'vor ${hours} Stunden': { [L.en]: '${hours} hours ago' },
    'vor 1 Tag': { [L.en]: '1 day ago' },
    'vor ${days} Tagen': { [L.en]: '${days} days ago' },
    'vor ${months} Mon.': { [L.en]: '${months} mths. ago' },
    'vor ${months} Monaten': { [L.en]: '${months} months ago' },
    'vor 1 Mon.': { [L.en]: '1 mth. ago' },
    'vor 1 Monat': { [L.en]: '1 month ago' },
    'vor 1 Jahr': { [L.en]: '1 year ago' },
    'vor ${years} Jahren': { [L.en]: '${years} years ago' },
    /**
     * src/client/shared/warnings.service.ts
     */
    'Deine gestempelte Arbeitszeit weicht von der geplanten ab. Warum?': { [L.en]: 'Your tracked time doesn’t match the scheduled time. Please justify.' },
    'Dein Arbeitseinsatz ist ungeplant? Wie kommt das?': { [L.en]: 'Please justify your unscheduled work.' },
    'Warum hast du nicht die aktuelle Zeit gestempelt?': { [L.en]: 'You failed to track your hours on time? Why?' },
    /**
     * src/client/shift/shift.component.ts
     */
    'Willst du diese Schicht wirklich löschen?': { [L.en]: 'Are you sure you want to delete this shift?' },
    'Wenn du <strong>alle</strong> Schichten eines Angebots löschst, werden dessen Buchungen storniert.': { [L.en]: 'If you delete <strong>all</strong> shifts of an offer, its bookings will be canceled automatically.' },
    'Wenn du ein Angebot löschst, werden dessen Buchungen storniert.': { [L.en]: 'If you delete an offer, its bookings will be canceled automatically.' },
    /**
     * src/client/shift/detail-form/detail-form.component.ts
     */
    'Neue Schicht': { [L.en]: 'New shift' },
    /**
     * src/client/shift-exchange/detail-form/p-shift-exchange-communication/p-shift-exchange-communication.component.ts
     */
    'Ok, weitermachen': { [L.en]: 'OK' },
    'Abbrechen': { [L.en]: 'Cancel' },
    '${firstName} möchte die ${shift} nur abgeben, ohne im Gegenzug was zu übernehmen. Willst du ${firstName} trotzdem einen Tausch anbieten?': { [L.en]: '${firstName} prefers to give away ${shift} without picking up one of your shifts. Do you still want to offer ${firstName} swapping shifts?' },
    'Unterschiedliche Präferenzen': { [L.en]: 'Different preferences' },
    '${firstName} möchte die ${shift} tauschen, anstatt sie nur abzugeben. Wenn du nicht tauschen möchtest, wird ${firstName} deinem Vorschlag erst zustimmen müssen, damit euer Deal zustande kommt.': { [L.en]: '${firstName} prefers to swap ${shift} for one of your shifts. You might still go ahead, but ${firstName} will be asked to confirm or reject your offer.' },
    /**
     * src/client/shift-exchange/detail-form/p-shift-exchange-communication/p-shift-exchange-communication-modal/p-shift-exchange-communication-modal.component.ts
     */
    'Mit ausgewählten Schichten tauschen': { [L.en]: 'Swap with selected shifts' },
    'Tauschen': { [L.en]: 'Swap' },
    'Mit ausgewählter Schicht tauschen': { [L.en]: 'Swap with selected shift' },
    // theShiftPluralisation
    'den Schichten': { [L.en]: 'these shifts' },
    'der Schicht': { [L.en]: 'this shift' },
    'Eine Ersatzsuche wird gestartet. Alle berechtigten Mitarbeitenden werden automatisch gefragt, ob sie die ${shiftPluralisation} übernehmen können. Über eine positive Antwort wirst du benachrichtigt.': { [L.en]: 'A request for replacement will be sent out. Eligible users will be asked to pick up ${shiftPluralisation}. You’ll be notified once someone has done so.' },
    'Hiermit entfernst du ${name} aus ${theShiftPluralisation}. ${name} wird benachrichtigt.': { [L.en]: 'You’re about to unassign ${name} from ${theShiftPluralisation}. ${name} will be notified automatically.' },
    /**
     * src/client/shift-exchange/detail-form/shift-exchange-detail-form.component.ts
     */
    'Wenn du weitere Schichten hinzufügst, werden deine vorgenommenen Einstellungen für Abwesenheitseinträge zurückgesetzt.': { [L.en]: 'By adding further shifts the settings of your sick leave will be reset.' },
    'Erfolgreich wiederhergestellt': { [L.en]: 'Restored successfully' },
    'Fehler beim Wiederherstellen': { [L.en]: 'Failed to restore' },
    'Du hast die Ersatzsuche von ${name} abgelehnt.': { [L.en]: 'You declined the request from ${name}.' },
    'In Krankmeldung umwandeln': { [L.en]: 'Convert to call in sick' },
    'Ich bin erkrankt und kann nicht arbeiten': { [L.en]: 'I’m ill and can’t make it to work' },
    '${name} ist erkrankt und kann nicht arbeiten': { [L.en]: '${name} is ill and can’t make it to work' },
    'Kommentar von ${sender} an ${responder}': { [L.en]: 'Comment from ${sender} to ${responder}' },
    'dir': { [L.en]: 'you' },
    'der Leitung': { [L.en]: 'the manager' },
    'die Mitarbeitenden': { [L.en]: 'the employees' },
    'die Leitung': { [L.en]: 'the manager' },
    'die zuständige Person': { [L.en]: 'responsible person' },
    '${days} vor Schicht': { [L.en]: '${days} before shift' },
    '${days} vor letzter Schicht': { [L.en]: '${days} before final shift' },
    /**
     * src/client/shift-exchange/generate-absences-options/generate-absences-options.component.ts
     */
    'Abwesende Stunden': { [L.en]: 'Hours of absence' },
    'Abwesende Stunden pro ${unit}': { [L.en]: 'Hours of absence per ${unit}' },
    'Eintrag': { [L.en]: 'entry' },
    /**
     * src/client/shift-exchange/shift-exchange.component.ts
     */
    'Krankmeldung': { [L.en]: 'Call in sick' },
    'Ersatzsuche': { [L.en]: 'Replacement request' },
    'Willst du diesen Tauschbörse-Eintrag wirklich löschen?': { [L.en]: 'Are you sure you want to delete this swap shop entry?' },
    '${others} automatisch benachrichtigt. Du musst weiter nichts tun.': { [L.en]: '${others} notified automatically. You’re all set now.' },
    'Deine Mitarbeitenden werden': { [L.en]: 'Your coworkers will be' },
    'Deine Personalleitung wird': { [L.en]: 'Your manager will be' },
    /**
     * src/client/shiftmodel/shiftmodel.component.ts
     */
    'Nutze nun den Button »Neuer Eintrag«, um für »${name}« Schichten im Kalender zu erstellen.': { [L.en]: 'Hit the button »Create« to add new shifts for »${name}« to the calendar.' },
    'Die Tätigkeit »${name}«': { [L.en]: 'The activity »${name}«' },
    'Bist du dir sicher, dass du die Schicht-Vorlage »${shiftModelName}« löschen willst?': { [L.en]: 'Are you sure you want to delete the template »${shiftModelName}«?' },
    'Keine Sorge! Die mit dieser Vorlage bereits erstellten Schichten gehen nicht verloren.': { [L.en]: 'Don’t worry. The shifts already created with this template won’t be deleted.' },
    /**
     * src/client/shiftmodel/detail-form/detail-form.component.ts
     */
    'Formular wurde befüllt': { [L.en]: 'Form has been filled out' },
    '…mit Werten aus der Tätigkeit »${name}«': { [L.en]: '…with data from »${name}«' },
    /**
     * src/client/time-stamp/stopwatch/stopwatch.component.ts
     */
    'Einstempeln': { [L.en]: 'Clock in' },
    'Ausstempeln': { [L.en]: 'Clock out' },
    /**
     * src/client/time-stamp/time-stamp.component.ts
     */
    'Aktuell bist du keiner Schicht zugewiesen. Also kannst du nur einen ungeplanten Einsatz machen. Wähle dazu eine Tätigkeit und klicke auf »Einstempeln«.': { [L.en]: 'Currently there aren’t any shifts to clock in to. You could clock in unscheduled time, though.' },
    'Du hilfst deinen Kollegen, obwohl du nicht für die Schicht eingetragen warst? Löblich! Deine Arbeitszeit kannst du dann als »ungeplanten Einsatz« stempeln. Wähle dazu eine Tätigkeit und klicke auf »Einstempeln«.': { [L.en]: 'You want to help out, even though you aren’t scheduled? Use »unscheduled work« to track your time.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Deine eingestempelten Zeiten wurden gespeichert! Du kannst sie in der <a href="client/report">Auswertung</a> einsehen.': { [L.en]: 'Your hours have been saved in <a href="client/report">Reporting</a>.' },
    'Du musst unten noch einen Kommentar für die Personalleitung abgeben.': { [L.en]: 'You have to leave a comment below to your manager.' },
    'Du darfst keine Tätigkeiten ausführen. Dementsprechend kannst du keinen ungeplanten Einsatz stempeln.': { [L.en]: 'You aren’t allowed to do any activities. Accordingly, you can’t clock in unscheduled times.' },
    'Keine Schichten zu stempeln': { [L.en]: 'No shifts to clock in for' },
    /**
     * src/client/transaction/detail-form/detail-form.component.ts
     */
    'nicht relevant': { [L.en]: 'not relevant' },
    'Zahlung erfasst von': { [L.en]: 'Transaction recorded by' },
    'Zahlung veranlasst von': { [L.en]: 'Transaction initiated by' },
    'Mit ♥ beauftragt von': { [L.en]: 'Mit ♥ initiated by' },
    /**
     * src/client/workingtime/workingtime.component.ts
     */
    'Willst du diesen Arbeitseinsatz wirklich löschen?': { [L.en]: 'Are you sure you want to delete this entry?' },
    /**
     * src/client/workingtime/detail-form/detail-form.component.ts
     */
    'Arbeitseinsatz': { [L.en]: 'Worked hours' },
    'Arbeitseinsatz ${editOrCreate}': { [L.en]: '${editOrCreate} worked hours' },
    'eintragen': { [L.en]: 'Create' },
    'bearbeiten': { [L.en]: 'Edit' },
    'Bearbeiten': { [L.en]: 'Edit' },
    'Die Pause war länger als die Arbeitszeit? Witzbold ;)': { [L.en]: 'Really? The break was longer than the work duration? Joker ;)' },
    /**
     * src/datepicker-i18n.service.ts
     */
    '${day}-${month}-${year}': { [L.en]: '${day}-${month}-${year}' },
    /**
     * src/global-error-handler/global-error-handler.ts
     */
    'Gute Nachricht: Soeben sind einige Verbesserungen online gegangen. Lade bitte Dr.&nbsp;Plano neu, damit du mit der verbesserten Version weiterarbeiten kannst.': { [L.en]: 'Good news: A new update to Dr.&nbsp;Plano has been released right now. Please reload the page to get the new features.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Aufgrund von sehr hoher Serverauslastung kann deine Anfrage momentan nicht bearbeitet werden. Bitte versuche es gleich nochmal. Danke! Checke bei Interesse den <a href="https://status.dr-plano.com/" target="_blank" rel="noopener noreferrer">Systemstatus&nbsp;von&nbsp;Dr.&nbsp;Plano</a>.': { [L.en]: 'Due to the very high server load, we cannot handle your request currently. Please try again shortly. Thank you! Feel free to check our <a href="https://status.dr-plano.com/" target="_blank" rel="noopener noreferrer">system status</a>.' },
    'Jetzt neu laden?': { [L.en]: 'Reload now?' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Dr.&nbsp;Plano ist aktuell nicht erreichbar. Kontrolliere bitte deine Internet-Verbindung. Checke gerne auch den <a href="https://status.dr-plano.com/" target="_blank" rel="noopener noreferrer">Systemstatus&nbsp;von&nbsp;Dr.&nbsp;Plano</a>.': { [L.en]: 'Can’t reach Dr.&nbsp;Plano at the moment. Please make sure you are connected to the internet. Feel free to check also our <a href="https://status.dr-plano.com/" target="_blank" rel="noopener noreferrer">status page</a>.' },
    'Du hast zu viele Anfragen an unseren Server gerichtet, weshalb du vorübergehend blockiert wurdest.': { [L.en]: 'You have sent too many requests to our server. Therefore you are temporarily blocked.' },
    'Deine gewünschte Aktion wurde aus Sicherheitsgründen blockiert. Für eine Freigabe melde dich bitte bei unserem Kundenservice.': { [L.en]: 'Your action has been blocked for security reasons. To unblock it, please get in touch with our customer service.' },
    'Kundenservice kontaktieren': { [L.en]: 'Contact customer service' },
    'https://tawk.to/chat/599aa06c1b1bed47ceb05bde/default': { [L.en]: 'https://tawk.to/chat/599aa06c1b1bed47ceb05bde/1e0qd6mh5' },
    'Dieser Zugang hat nur Leserecht.': { [L.en]: 'You have read-only access and cannot edit anything. ' },
    /**
     * src/public/main/register-test-account-form/register-test-account-form.component.ts
     */
    'Land wählen…': { [L.en]: 'Select country…' },
    /**
     * src/public/shared/public-newsletter-form/public-newsletter-form.component.ts
     */
    'Danke! Wir haben dir eine Email geschickt. Dort findest du einen Link, mit dem du dein Abonnement bestätigen kannst. Diese Maßnahme ist zu deinem eigenen Schutz.': { [L.en]: 'Thank you! We have sent you an email with a link to confirm your subscription. We do this to protect your data.' },
    'Fast geschafft': { [L.en]: 'Almost done' },
    /**
     * src/shared/core/component/p-toast/p-toast.component.ts
     */
    'Hey…': { [L.en]: 'Hey…' },
    'Warnung': { [L.en]: 'Warning' },
    'Achtung': { [L.en]: 'Warning' },
    'Info': { [L.en]: 'Info' },
    'Information': { [L.en]: 'Info' },
    'Fehler!': { [L.en]: 'Error!' },
    'Yeah!': { [L.en]: 'Yeah!' },
    /**
     * src/shared/core/component/validation-hint/validation-hint.service.ts
     */
    'Das Bild ist zu groß.': { [L.en]: 'The image is too large.' },
    'Das Bild ist nicht hoch genug.': { [L.en]: 'The image isn’t high enough.' },
    'Das Bild ist nicht breit genug.': { [L.en]: 'The image isn’t wide enough.' },
    'Diese Eingabe ist Pflicht.': { [L.en]: 'This is required.' },
    'Nur Großbuchstaben erlaubt.': { [L.en]: 'Only capital letters allowed.' },
    'Überprüfe bitte deine Eingabe.': { [L.en]: 'Please check your entry.' },
    'Zeit-Format falsch': { [L.en]: 'Bad time format' },
    'Bitte nur ganze Zahlen eingeben, z.B. »${example}«.': { [L.en]: 'Please enter whole numbers only. Correct example: »${example}«' },
    'Bitte höchstens ${maxDigitsLength} Nachkommastellen eintragen.': { [L.en]: 'Please enter a maximum of ${maxDigitsLength} decimal places.' },
    'Diese Eingabe darf nicht größer sein als »${labelOfComparedControl}«.': { [L.en]: 'This entry shouldn’t be greater than »${labelOfComparedControl}«.' },
    'Bitte höchstens die Zeit »${max}« eingeben.': { [L.en]: 'Please enter a maximum of »${max}«.' },
    'Bitte höchstens das Datum »${max}« eingeben.': { [L.en]: 'Please enter a maximum of »${max}«.' },
    'Bitte höchstens »${max}« eingeben.': { [L.en]: 'Please enter a maximum of »${max}«.' },
    'Diese Eingabe darf nicht kleiner sein als »${labelOfComparedControl}«.': { [L.en]: 'This entry shouldn’t be lesser than »${labelOfComparedControl}«.' },
    'Bitte mindestens die Zeit »${min}« eingeben.': { [L.en]: 'Please enter a minimum of »${min}«.' },
    'Bitte mindestens das Datum »${min}« eingeben.': { [L.en]: 'Please enter a minimum of »${min}«.' },
    'Bitte mindestens »${min}« eingeben.': { [L.en]: 'Please enter a minimum of »${min}«.' },
    'Eingabe muss größer sein als »${labelOfComparedControl}«.': { [L.en]: 'Needs to be greater than »${labelOfComparedControl}«.' },
    'Bitte eine Zeit später als »${greaterThan}« eingeben.': { [L.en]: 'Please enter a time later than »${greaterThan}«.' },
    'Bitte ein Datum später als »${greaterThan}« eingeben.': { [L.en]: 'Please enter a date after »${greaterThan}«.' },
    'Bitte eine Zahl größer als »${greaterThan}« eingeben.': { [L.en]: 'Please enter a number greater than »${greaterThan}«.' },
    'Eingabe muss kleiner sein als »${labelOfComparedControl}«.': { [L.en]: 'Needs to be lesser than »${labelOfComparedControl}«.' },
    'Bitte eine Zeit früher als »${lessThan}« eingeben.': { [L.en]: 'Please enter a time before »${lessThan}«.' },
    'Bitte ein Datum früher als »${lessThan}« eingeben.': { [L.en]: 'Please enter a date before »${lessThan}«.' },
    'Bitte eine Zahl kleiner als »${lessThan}« eingeben.': { [L.en]: 'Please enter a number smaller than »${lessThan}«.' },
    'Bitte maximal ${requiredLength} Zeichen eingeben. ${actualLength} ist zu viel.': { [L.en]: 'Please enter a maximum of ${requiredLength} characters. ${actualLength} are too many.' },
    'Bitte maximal ${max} Nachkommastellen.': { [L.en]: 'Maximum ${max} decimal places, please.' },
    'Bitte keine Leerzeichen eingeben.': { [L.en]: 'No spaces, please.' },
    'Das Passwort muss Zahlen enthalten.': { [L.en]: 'The password must contain numbers.' },
    'Das Passwort muss Buchstaben enthalten.': { [L.en]: 'The password must contain letters.' },
    'Das Passwort muss Großbuchstaben enthalten.': { [L.en]: 'The password must contain uppercase letters.' },
    'Das angegebene Ende muss nach dem angegebenen Start liegen.': { [L.en]: 'The end must be after the start.' },
    'Auf der Erde hat ein Tag 24 Stunden. Das Team von Dr.&nbsp;Plano ist aufgeschlossen gegenüber neuen Planeten. Melde dich! Wir kommen dich gerne besuchen! 🖖': { [L.en]: 'On Earth, a day has 24 hours. We are open to new planets. Get in touch! We would be glad to visit you! 🖖' },
    '»${actual}« ist keine Zahl.': { [L.en]: '${actual} isn’t a number.' },
    'Die Passwort-Wiederholung stimmt nicht.': { [L.en]: 'Passwords do not match.' },
    'Falsches Format eingegeben. Richtig wären z.B. »${example1}« oder »${example2}«.': { [L.en]: 'Bad format. Example: »${example1}« or »${example2}«.' },
    'Bitte nur Zahlen eingeben, z.B. »${example1}« oder »${example2}«.': { [L.en]: 'Please enter only numbers. For example »${example1}« or »${example2}«.' },
    'Bitte mit »http://« oder »https://« beginnen.': { [L.en]: 'Please start with http:// or https://' },
    'Das Format der eingegebenen Domain ist fehlerhaft.': { [L.en]: 'The format of the entered domain is wrong.' },
    'URL unvollständig': { [L.en]: 'URL incomplete' },
    'Bitte keine negativen Zahlen.': { [L.en]: 'Please no negative numbers.' },
    'Ist bereits vergeben.': { [L.en]: 'Is already in use.' },
    /**
     * src/shared/core/p-modal/modal.service.ts
     */
    'Ja': { [L.en]: 'Yes' },
    'Nein': { [L.en]: 'No' },
    'Hinweis': { [L.en]: 'Note' },
    'Nagut 🙄': { [L.en]: 'Well, OK then 🙄' },
    /**
     * src/shared/core/p-push-notifications.service.ts
     */
    'Schade. Falls du dich doch dafür entscheidest, gib uns bei deinem Browser das Recht, dir Benachrichtigungen zu schicken.': { [L.en]: 'It’s a pity. If you change your mind, go to your browser settings to activate push notifications.' },
    'Einstellung wurde gespeichert': { [L.en]: 'Saved!' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Falls du dich doch dafür entscheidest, kannst du die Nachrichten unter <a class="nowrap" href="client/notifications">Benachrichtigungs-Einstellungen</a> einschalten.': { [L.en]: 'If you change your mind, go to <a class="nowrap" href="client/notifications">Notification settings</a> to activate notifications.' },
    'Um über ${context} und ähnliche wichtige Dinge informiert zu werden, empfehlen wir dir Push-Nachrichten für diesen Browser einzuschalten.': { [L.en]: 'To be notified about ${context} and similar issues, we highly recommend to activate push notifications for your current browser.' },
    'Ja, bitte': { [L.en]: 'Yes please' },
    'Nein, danke': { [L.en]: 'No thanks' },
    'Neuigkeiten zu deiner Ersatzsuche': { [L.en]: 'Updates on your request' },
    'weitere Krankmeldungen': { [L.en]: 'more call in sick' },
    'den Status der Schichtverteilung': { [L.en]: 'the status of scheduling' },
    'fällige Zeiterfassung': { [L.en]: 'missing hours worked' },
    'neue Buchungsanfragen': { [L.en]: 'new booking request' },
    'Browser-Benachrichtigungen': { [L.en]: 'Browser notifications' },
    /**
     * src/shared/core/pipe/translate.pipe.ts
     */
    'Belgien': { [L.en]: 'Belgium' },
    'Deutschland': { [L.en]: 'Germany' },
    'Niederlande': { [L.en]: 'Netherlands' },
    'Österreich': { [L.en]: 'Austria' },
    'Schweiz': { [L.en]: 'Switzerland' },
    'Vereinigtes Königreich': { [L.en]: 'United Kingdom' },
    'Tschechien': { [L.en]: 'Czech Republic' },
    'Schweden': { [L.en]: 'Sweden' },
    'Luxemburg': { [L.en]: 'Luxembourg' },
    'Deutsch': { [L.en]: 'German' },
    'Englisch': { [L.en]: 'English' },
    /**
     * src/shared/core/pipe/translate-hdyk.pipe.ts
     */
    'Ihr habt mich angesprochen': { [L.en]: 'You reached out to me' },
    'Messe / Veranstaltung': { [L.en]: 'Fair / Event' },
    'Internet-Recherche': { [L.en]: 'Internet search' },
    'Empfehlung durch Dritte': { [L.en]: 'Recommendation by others' },
    'Soziale Medien': { [L.en]: 'Social media' },
    /**
     * FILE: p-shift-exchange-concept.service.ts
     */
    'Du': { [L.en]: 'You' },
    'wartest': { [L.en]: 'are waiting' },
    'wartet': { [L.en]: 'is waiting' },
    'hast': { [L.en]: 'have' },
    'hat': { [L.en]: 'has' },
    'willst': { [L.en]: 'want' },
    'will': { [L.en]: 'wants' },
    'suchst': { [L.en]: 'are requesting' },
    'sucht': { [L.en]: 'is requesting' },
    'bist': { [L.en]: 'are' },
    'ist': { [L.en]: 'is' },
    'arbeitest': { [L.en]: 'are working' },
    'arbeitet': { [L.en]: 'is working' },
    /**
     * FILE: p-state-data.ts
     */
    /** FAILED_DEADLINE_PASSED */
    'Gesetzte Frist verstrichen': { [L.en]: 'Set deadline expired' },
    /** FAILED_EVERYONE_DECLINED */
    'Niemand verfügbar': { [L.en]: 'No one available' },
    /** FAILED_SHIFTS_STARTED */
    'Kein Abnehmer bis Schichtbeginn': { [L.en]: 'No deal until shift start' },
    /** ILLNESS_ACCEPT_WITHOUT_SHIFT_EXCHANGE */
    'Akzeptiert ohne Ersatzsuche': { [L.en]: 'Approved without replacement request' },
    /** ILLNESS_DECLINED */
    'nicht akzeptiert': { [L.en]: 'declined' },
    'Hast nicht akzeptiert': { [L.en]: 'You declined' },
    /** ACTIVE */
    // NO_OFFER_YET
    'noch nichts Passendes': { [L.en]: 'nothing suitable so far' },
    'Bitte antworten': { [L.en]: 'Please reply' },
    // NO_OFFER_YET_CP_CANNOT
    'Bist nicht verfügbar': { [L.en]: 'You aren’t available' },
    // NO_OFFER_YET_CP_RESPONDED_NO
    'Hast abgelehnt': { [L.en]: 'You declined' },
    // NO_OFFER_YET_IM_RESPONDED_NO
    '${INDISPOSED_MEMBER_FIRST_NAME} hat abgelehnt': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} has declined' },
    // IM_MUST_ACCEPT
    '${INDISPOSED_MEMBER_FIRST_NAME} muss antworten': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} must reply' },
    // CP_MUST_ACCEPT
    'Wartest auf Antwort': { [L.en]: 'Waiting for reply' },
    '${RESPONSIBLE_PERSON_FIRST_NAME} ${RESPONSIBLE_PERSON_WAITS} auf Antwort': { [L.en]: '${RESPONSIBLE_PERSON_FIRST_NAME} ${RESPONSIBLE_PERSON_WAITS} for reply' },
    /** ILLNESS_NEEDS_CONFIRMATION */
    'Wartet auf Antwort': { [L.en]: 'Waiting for reply' },
    /** REMOVED_FROM_SHIFT */
    'Wurdest aus der Schicht entfernt': { [L.en]: 'removed from shift' },
    'aus der Schicht entfernt': { [L.en]: 'removed from shift' },
    /** SHIFTS_REMOVED */
    'Schicht gelöscht': { [L.en]: 'Shift deleted' },
    /** SWAP_SUCCESSFUL */
    'Getauscht': { [L.en]: 'Swapped' },
    /** TAKE_SUCCESSFUL */
    '${IM_OFFERED_SHIFTS} abgegeben ': { [L.en]: 'gave away ${IM_OFFERED_SHIFTS}' },
    '${IM_OFFERED_SHIFTS} übernommen': { [L.en]: 'picked up ${IM_OFFERED_SHIFTS}' },
    /** WITHDRAWN */
    'Hast zurückgezogen': { [L.en]: 'You withdrew' },
    'zurückgezogen': { [L.en]: 'withdrawn' },
    /**
     * FILE: p-action-data.ts
     */
    '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WAITS} auf Antwort': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WAITS} for reply' },
    'Mein Tauschangebot ändern': { [L.en]: 'Change offered shifts' },
    'Doch nicht tauschen': { [L.en]: 'don’t swap anymore' },
    'Tauschangebot annehmen': { [L.en]: 'Accept swap offer' },
    'Kann doch nicht': { [L.en]: 'not available anymore' },
    '${IM_OFFERED_SHIFTS} abnehmen': { [L.en]: 'Pick up ${IM_OFFERED_SHIFTS}' },
    'Schichten doch tauschen': { [L.en]: 'Swap shifts' },
    'Angebot an ${INDISPOSED_MEMBER_FIRST_NAME} ändern': { [L.en]: 'Change offer to ${INDISPOSED_MEMBER_FIRST_NAME}' },
    '${IM_OFFERED_SHIFTS} doch abnehmen': { [L.en]: 'pick up ${IM_OFFERED_SHIFTS}' },
    '${IM_OFFERED_SHIFTS} doch abgeben': { [L.en]: 'give away ${IM_OFFERED_SHIFTS}' },
    'Schichten tauschen': { [L.en]: 'Swap shifts' },
    'Tauschangebot ansehen': { [L.en]: 'Show swap offer' },
    'Will nicht tauschen': { [L.en]: 'Decline swap' },
    'Ablehnen': { [L.en]: 'Decline' },
    'Akzeptieren & Ersatz suchen': { [L.en]: 'Approve & request replacement' },
    'Doch Ersatz suchen': { [L.en]: 'Request replacement' },
    'Akzeptieren': { [L.en]: 'Approve' },
    'Doch akzeptieren & Ersatz suchen': { [L.en]: 'Approve & request replacement' },
    'Doch akzeptieren': { [L.en]: 'Approve' },
    'kann doch nicht': { [L.en]: 'not available anymore' },
    '${IM_OFFERED_SHIFTS} nicht abgeben': { [L.en]: 'don’t give away ${IM_OFFERED_SHIFTS}' },
    '${IM_OFFERED_SHIFTS} abgeben': { [L.en]: 'give away ${IM_OFFERED_SHIFTS}' },
    /**
     * FILE: p-communication-data.ts
     */
    /** CP_WANTS_SWAP */
    'Schichten getauscht': { [L.en]: 'Swapped shifts' },
    '${CP_FIRST_NAME} ${CP_HAS} doch abgelehnt': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} declined' },
    '${CP_FIRST_NAME} ${CP_HAS} ein neues Tauschangebot gemacht': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} offered new shifts' },
    '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} nicht tauschen': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} declined to swap' },
    '${CP_FIRST_NAME} ${CP_WANTS} die ${IM_OFFERED_SHIFTS} doch übernehmen': { [L.en]: '${CP_FIRST_NAME} ${CP_WANTS} to pick up ${IM_OFFERED_SHIFTS}' },
    '${CP_FIRST_NAME} ${CP_HAS} die ${IM_OFFERED_SHIFTS} übernommen': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} picked up ${IM_OFFERED_SHIFTS}' },
    /** A_REPORTED_ILLNESS */
    '${CP_FIRST_NAME} ${CP_HAS} diese Krankmeldung erstellt und ${CP_SEEKS} Ersatz': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} created this sick leave and ${CP_SEEKS} replacement' },
    /** ILLNESS_NEEDS_CONFIRMATION */
    '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung akzeptiert und ${CP_SEEKS} Ersatz': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} approved leave request and ${CP_SEEKS} replacement' },
    '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung akzeptiert ohne Ersatzsuche': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} approved leave request without requesting replacement' },
    '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung akzeptiert': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} approved leave request' },
    '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung nicht akzeptiert': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} declined leave request' },
    /** ILLNESS_DECLINED */
    '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung doch akzeptiert': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} approved leave request' },
    /** CP_NOT_RESPONDED */
    '${CP_FIRST_NAME} ${CP_WANTS} tauschen': { [L.en]: '${CP_FIRST_NAME} ${CP_WANTS} to swap' },
    '${CP_FIRST_NAME} ${CP_WANTS} die ${IM_OFFERED_SHIFTS} übernehmen': { [L.en]: '${CP_FIRST_NAME} ${CP_WANTS} to pick up ${IM_OFFERED_SHIFTS}' },
    '${CP_HAS} abgelehnt': { [L.en]: '${CP_HAS} declined' },
    /** CP_RESPONDED_NO */
    '${CP_FIRST_NAME} ${CP_WANTS} doch tauschen': { [L.en]: '${CP_FIRST_NAME} ${CP_WANTS} to swap' },
    '${CP_FIRST_NAME} ${C_HAS} die ${IM_OFFERED_SHIFTS} übernommen': { [L.en]: '${CP_FIRST_NAME} ${C_HAS} picked up ${IM_OFFERED_SHIFTS}' },
    /** C_DECLINED_SWAP */
    '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} doch tauschen': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} to swap' },
    '${CP_FIRST_NAME} ${CP_HAS} die ${IM_OFFERED_SHIFTS} doch übernommen': { [L.en]: '${CP_FIRST_NAME} ${CP_HAS} picked up ${IM_OFFERED_SHIFTS}' },
    /** CP_WANTS_TAKE */
    '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} nicht abgeben, sondern tauschen': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} to swap rather than giving away' },
    /** C_DECLINED_TAKE */
    '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} die ${IM_OFFERED_SHIFTS} doch abgeben': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} give away ${IM_OFFERED_SHIFTS}' },
    /** C_CHANGED_MIND_WANTS_SWAP */
    '${INDISPOSED_MEMBER_FIRST_NAME} ${C_HAS} ein anderes Angebot ausgewählt': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_HAS} chosen another shift offer' },
    '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} doch nicht tauschen': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} declined to swap' },
    /** IM_CHANGED_MIND_WANTS_TAKE */
    '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} doch nicht abgeben': { [L.en]: '${INDISPOSED_MEMBER_FIRST_NAME} declined to give away' },
    /** other */
    '${CP_IS_WORKING} zur selben Zeit': { [L.en]: '${CP_IS_WORKING} at the same time' },
    '${CP_IS_WORKING} in derselben Schicht': { [L.en]: '${CP_IS_WORKING} the same shift' },
    '${CP_FIRST_NAME} ${CP_IS} zu der Zeit abwesend': { [L.en]: '${CP_FIRST_NAME} ${CP_IS} absent at that time' },
    '${CP_FIRST_NAME} ${CP_IS} zu der Zeit krank': { [L.en]: '${CP_FIRST_NAME} ${CP_IS} sick at that time' },
    /**
     * src/shared/core/validators.service.ts
     */
    'Falsches Format eingegeben.': { [L.en]: 'Bad format' },
    'Mit dem Format des IBAN Codes stimmt etwas nicht.': { [L.en]: 'Bad format' },
    'Mit dem Format des BIC Codes stimmt etwas nicht.': { [L.en]: 'Bad format' },
    'Diese Email-Adresse scheint nicht zu existieren.': { [L.en]: 'Invalid email address' },
    'Es fehlt das »@« Zeichen.': { [L.en]: 'The »@« character is missing.' },
    'Diese Email Adresse ist bereits benutzt.': { [L.en]: 'Email address is already in use.' },
    'Unzulässiges Zeichen eingegeben. Richtiges Beispiel: »+49 123 0000000«.': { [L.en]: 'Invalid character. Correct example: »+49 123 0000000«' },
    'Das ist keine gültige Postleitzahl.': { [L.en]: 'Invalid zip / postal code.' },
    'Eingabe zu niedrig': { [L.en]: 'Value too low' },
    'Eingabe zu hoch': { [L.en]: 'Value too high' },
    'Bitte mindestens ${requiredLength} Zeichen eingeben. ${actualLength} ist zu wenig.': { [L.en]: 'Please enter a minimum of ${requiredLength} characters. ${actualLength} aren’t enough.' },
    'Eingabe zu gering. Minimum: ${min} Monate.': { [L.en]: 'Please enter a minimum of ${min} months.' },
    'Lädt…': { [L.en]: 'Loading…' },
    /**
     * src/client/shared/p-forms/p-input-shiftmodel-id/p-input-shiftmodel-id.component.ts
     */
    'Wähle eine Tätigkeit…': { [L.en]: 'Choose an activity…' },
    'Suche': { [L.en]: 'Search' },
    'Suche verlassen (Esc)': { [L.en]: 'Exit search (esc)' },
    /**
     * src/public/booking-system/booking-system-footer/booking-system-footer.component.ts
     */
    'AGB': { [L.en]: 'Disclaimer' },
    'Datenschutzerklärung': { [L.en]: 'Privacy policy' },
    'Stornobedingungen': { [L.en]: 'Cancellation policy' },
    'Teilnahmebedingungen': { [L.en]: 'Terms & Conditions' },
    /**
     * src/client/shared/p-forms/input-image/input-image.component.ts
     */
    'Willst du das aktuelle Bild wirklich löschen?': { [L.en]: 'Are you sure you want to delete the image?' },
    /**
     * src/public/booking-system/booking-system-payment/booking-system-payment.component.ts
     */
    'Jetzt bezahlen': { [L.en]: 'Pay now' },
    'Jetzt bezahlen mit': { [L.en]: 'Pay now by' },
    'Kredit- oder Debitkarte': { [L.en]: 'Credit or debit card' },
    'Filter Aktiv': { [L.en]: 'Filter applied' },
    'Es sind Filter aktiv, die möglicherweise Einfluss auf deinen Export haben.': { [L.en]: 'There are active filters that may affect your export.' },
    '<mark>${excludedShiftModels}</mark> Tätigkeiten sind ausgeblendet': { [L.en]: '<mark>${excludedShiftModels}</mark> activities hidden' },
    '<mark>eine</mark> Tätigkeit ist ausgeblendet': { [L.en]: 'one activity hidden' },
    'Zahlungstypen ausgeblendet:': { [L.en]: 'Hidden transaction types:' },
    'nur fehlgeschlagene Zahlungen anzeigen': { [L.en]: 'show only failed transactions' },
    'Zahlungsarten ausgeblendet:': { [L.en]: 'Hidden payment methods:' },
    'nur Zahlungen für die Suche nach <mark>${searchText}</mark> anzeigen': { [L.en]: 'show only transactions for the search for <mark>${searchText}</mark>' },
    'nur Beträge größer als <mark>${amountStart}</mark> anzeigen': { [L.en]: 'show only amounts greater than <mark>${amountStart}</mark>' },
    'nur Beträge kleiner als <mark>${amountEnd}</mark> anzeigen': { [L.en]: 'show only amounts smaller than <mark>${amountEnd}</mark>' },
    'nur Beträge zwischen <mark>${amountStart}</mark> und <mark>${amountEnd}</mark> anzeigen': { [L.en]: 'show only amounts from <mark>${amountStart}</mark> to <mark>${amountEnd}</mark>' },
    'Microsoft Excel': { [L.en]: 'Microsoft Excel' },
    'Falls du die CSV-Datei mit <strong>Microsoft Excel</strong> öffnen möchtest, klicke bitte in Excel bei der Registerkarte <mark>Daten</mark> auf den Knopf <mark>Aus Text/CSV</mark> und folge anschließend den Hinweisen, um die Daten zu laden. <br>Wir raten dir davon ab, die CSV-Datei direkt <strong>per Doppelklick</strong> in Excel zu öffnen, da manche Excel-Versionen die Formatierung der CSV-Datei verändern und die Datei unbrauchbar machen könnten.': { [L.en]: 'If you wish to open the CSV file with Microsoft Excel, please go to the <mark>Data</mark> tab, hit the button <mark>From Text/CSV</mark>, and follow the instructions to load the data.<br>We do not recommend opening the CSV file in Excel by <strong>double-clicking</strong>, as some versions of Excel may change the formatting of the CSV file and make the file corrupted.' },
    'Die Zahlung wurde verweigert.': { [L.en]: 'The Payment was refused.' },
    'Die Zahlung schlug fehl aufgrund eines Fehlers beim Zahlungsdienstleister.': { [L.en]: 'The transaction did not go through due to an error that occurred on the acquirer’s end.' },
    'Die verwendete Karte ist gesperrt und daher nicht einsetzbar.': { [L.en]: 'The card used for the transaction is blocked. Therefore it is unusable.' },
    'Die verwendete Karte ist abgelaufen und daher nicht einsetzbar.': { [L.en]: 'The card used for the transaction has expired. Therefore it is unusable.' },
    'Es ist eine Ungereimtheit beim Zahlungsbetrag aufgetreten.': { [L.en]: 'An inconsistency has occurred in the payment amount.' },
    'Die Kartennummer ist fehlerhaft oder ungültig.': { [L.en]: 'The specified card number is incorrect or invalid.' },
    'Die Zahlung konnte nicht autorisiert werden, da Ihre Bank nicht erreichbar ist.': { [L.en]: 'It is not possible to contact your bank to authorize the payment.' },
    'Ihre Bank erlaubt oder unterstützt diese Zahlungsart nicht.': { [L.en]: 'Your bank does not support or does not allow this type of transaction.' },
    'Die Authentifizierung (per 3D‐Secure‐Verfahren) konnte nicht durchgeführt werden oder ist gescheitert.': { [L.en]: '3D Secure authentication was not executed, or it did not execute successfully.' },
    'Die verwendete Karte hat nicht ausreichend Guthaben.': { [L.en]: 'The card does not have enough credit to cover the payable amount.' },
    'Die Zahlung mit dieser Zahlungsart wurde abgelehnt. Wähle bitte eine andere Zahlungsart.': { [L.en]: 'The payment with this payment method was refused. Please try another payment method.' },
    'Die Zahlung wurde abgebrochen.': { [L.en]: 'The payment was canceled.' },
    'Du hast den Zahlungsvorgang vorzeitig abgebrochen.': { [L.en]: 'You canceled the transaction before completing it.' },
    'Die PIN ist falsch oder ungültig.': { [L.en]: 'The specified PIN is incorrect or invalid.' },
    'Es wurde drei mal hintereinander eine falsche PIN eingegeben.': { [L.en]: 'You specified an incorrect PIN more that three times in a row.' },
    'Es ist nicht möglich die eingegebene PIN zu validieren.': { [L.en]: 'It is not possible to validate the specified PIN number.' },
    'Die Zahlung wurde nicht korrekt übermittelt und kann nicht weiterbearbeitet werden.': { [L.en]: 'The payment was not submitted correctly for processing.' },
    'Die CVC‐Prüfnummer ist falsch.': { [L.en]: 'The specified CVC (card security code) is invalid.' },
    'Die Karte kann nicht verwendet werden oder ist in diesem Land nicht zugelassen.': { [L.en]: 'The card cannot be used or is not allowed in this country.' },
    'Du hast die Zahlung oder das Abonnement gestoppt.': { [L.en]: 'You canceled the payment or requested to stop a subscription.' },
    'Es ist ein generischer Fehler aufgetreten.': { [L.en]: 'A generic error has occurred.' },
    'Die Zahlung kann nicht durchgeführt werden, da der maximale Abbuchungsbetrag der Karte überschritten wird.': { [L.en]: 'The withdrawal amount permitted for your card has exceeded.' },
    'Die Zahlung kann nicht durchgeführt werden, da die maximale Anzahl an Abbuchungen der Karte überschritten wird.': { [L.en]: 'The number of withdrawals permitted for your card has exceeded.' },
    'Die angegebenen Adresse ist fehlerhaft.': { [L.en]: 'The entered address data is incorrect.' },
    'Deine Bank benötigt die Eingabe deiner Online‐PIN zur Verifizierung.': { [L.en]: 'Your bank requires you to enter an online PIN.' },
    'Deine Bank benötigt dein Girokonto, um die Zahlung abzuschließen.': { [L.en]: 'Your bank requires a checking account to complete the purchase.' },
    'Deine Bank benötigt dein Sparkonto, um die Zahlung abzuschließen.': { [L.en]: 'Your bank requires a savings account to complete the purchase.' },
    'Deine Bank benötigt die Eingabe deiner mobilen PIN zur Verifizierung.': { [L.en]: 'Your bank requires you to enter a mobile PIN.' },
    'Du hast die Zahlung abgebrochen, nachdem du eine kontaktlose Zahlung versucht hattest und aufgefordert wurdest, eine andere Methode (PIN oder Unterschrift) zu benutzen.': { [L.en]: 'You abandoned the payment after you attempted a contactless payment and were prompted to try a different card entry method (PIN or swipe).' },
    'Deine Bank benötigt eine zusätzliche Authentifizierung. Versuche es bitte mit dem 3D‐Secure‐Verfahren.': { [L.en]: 'Your bank declined the authentication exemption request. Please retry with 3D Secure.' },
    'Die Authentifizierung (per 3D‐Secure 2‐Verfahren) wurde nicht korrekt abgeschlossen.': { [L.en]: 'Authentication (via 3D Secure 2 method) was not completed correctly.' },
    'Der zu zahlende Betrag ist höher, als das dir zur Verfügung stehende Limit für diese Zahlungsart.': { [L.en]: 'The payment amount is higher than your limit for the selected payment method.' },
    'Der zu zahlende Betrag ist leider zu gering für diese Zahlungsart.': { [L.en]: 'The payment amount is too low for the selected payment method.' },
    'Für SEPA-Zahlungen aus bestimmten Ländern ist die Angabe der Adresse des Zahlungspflichtigen erforderlich!': { [L.en]: 'For SEPA-Payments from some countries, the Shopper Address is required!' },
    // default case - should never happen
    'Irgendetwas ist während des Zahlungsvorgangs schiefgelaufen! Bitte überprüfe deine Emails auf eventuelle Benachrichtigungen, bevor du es nochmal probierst.': { [L.en]: 'An error occurred! Please check your emails for possible notifications before retrying.' },
    // refusal reason part two
    'Um die Zahlung abzuschließen, kontrolliere deine Daten und versuche es noch einmal oder wähle eine andere Zahlungsart.': { [L.en]: 'To complete the payment, please check your data and try again or choose another payment method.' },
    'Um die Zahlung abzuschließen, versuche es bitte erneut oder wähle eine andere Zahlungsart.': { [L.en]: 'To complete the payment, please try again or choose another payment method.' },
    'Um die Zahlung abzuschließen, wähle bitte eine andere Zahlungsart.': { [L.en]: 'To complete the payment, please choose another payment method.' },
    'Bitte versuche es mit einer anderen Zahlungsart oder wende dich an deinen Zahlungsdienstleister um das Limit für dein Konto zu erhöhen.': { [L.en]: 'Please choose another payment method or contact your provider to raise the limit for your account.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Bitte versuche es mit einer anderen Zahlungsart oder wende dich an <a href="${contactAddress}">${contactName}</a>.': { [L.en]: 'Please choose another payment method or contact <a href="${contactAddress}">${contactName}</a>.' },
    'Um die Zahlung abzuschließen, versuche es bitte erneut.': { [L.en]: 'To complete the payment, please try again.' },
    'Fehlercode für Kundenservice-Anfragen:': { [L.en]: 'Error code for customer service inquiries:' },
    /**
     * src/client/shared/component/input-shiftmodel-id-modal/input-shiftmodel-id-modal.component.ts
     */
    'Tätigkeit wählen …': { [L.en]: 'Choose an activity …' },
    'Buchungsdatum': { [L.en]: 'Booking date' },
    /**
     * src/shared/api/scheduling-api/server-timer-api.service.ag.ts
     */
    'Im Produktivmodus kann die Serverzeit nicht verändert werden.': { [L.en]: 'You can’t change the server time in production mode.' },
    /**
     * src/shared/api/scheduling-api/scheduling-api.service.ag.ts
     */
    'Um diese Funktionalität nutzen zu können, setze bitte erst eine Widerrufsfrist.': { [L.en]: 'To use this feature, please enter a »cooling-off« period first.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Um diese Funktionalität nutzen zu können, aktiviere bitte erst die <a href="client/plugin/payments" target="_blank">Online-Zahlung</a>.': { [L.en]: 'To use this feature, please activate the <a href="client/plugin/payments" target="_blank">online payment</a> first.' },
    'Das Ende errechnet sich automatisch anhand des Startzeitpunktes der vorherigen Zeitspanne. So werden Lücken zwischen den Zeiträumen vermieden.': { [L.en]: 'The end is automatically calculated based on the starting time of the previous period. This avoids gaps between the periods.' },
    'Das Ende der ersten Zeitspanne muss so definiert sein, um Lücken zu vermeiden und sicherzustellen, dass auch Stornos nach dem gebuchten Termin abgedeckt sind. Bei mehrtägigen Angeboten gilt immer der Starttermin als Referenz.': { [L.en]: 'The end of the first period must be set like this to avoid gaps between the periods and ensure that cancellations after the booked date are still covered. For multi-day offers, the start date is always the relevant date as a reference.' },
    'Der Start deiner letzten Zeitspanne sollte »UNBEGRENZT« sein.': { [L.en]: 'The start of your last period should be set to »UNLIMITED«.' },
    'Email an Kunden verschickt': { [L.en]: 'Email sent to customers' },
    'Keine Email an Kunden verschickt': { [L.en]: 'No email sent to customers' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Entsprechend deiner <a href="client/shiftmodel/${shiftModelId}/bookingsettings#automatic-mails" target="_blank">Einstellungen</a> in der Tätigkeit.': { [L.en]: 'According to your <a href="client/shiftmodel/${shiftModelId}/bookingsettings#automatic-mails" target="_blank">activity settings</a>.' },
    'An ${recipients}': { [L.en]: 'To the ${recipients}' },
    'buchende Person': { [L.en]: 'booking person' },
    'Teilnehmende': { [L.en]: 'participants' },
    'und': { [L.en]: 'and' },
    'An buchende Person und Teilnehmende': { [L.en]: 'To person booking and participants' },
    'An buchende Person': { [L.en]: 'To person booking' },
    'An Teilnehmende': { [L.en]: 'To participants' },
    'Stornierung der Buchung Nr. ${bookingNumber}': { [L.en]: 'Cancellation of booking no. ${bookingNumber}' },
    'Der eingegebene Betrag ist außergewöhnlich hoch. Falls er mit Sicherheit richtig ist, dann melde dich bitte bei uns für die Weiterbearbeitung.': { [L.en]: 'The entered amount is exceptionally high. If it is definitely correct, please get in touch with us for further processing.' },
    'Du kannst max. ${max} zurückerstatten, da das Online-Guthaben dieser Buchung für mehr nicht ausreicht.': { [L.en]: 'You can refund max. ${max}, as the online balance of this booking doesn’t allow more.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Du kannst max. ${max} zurückerstatten, da das <a href="client/sales/transactions" target="_blank" rel="noopener">Online-Guthaben</a> des gesamten Accounts abzüglich Gebühren für mehr nicht ausreicht.': { [L.en]: 'You can refund max. ${max}, as the online balance of your account minus fees doesn’t allow more.' },
    'Dein Kunde hat insgesamt ${max} eingezahlt. Du kannst nicht mehr als das zurückzahlen.': { [L.en]: 'Your customer has paid a total of ${max}. Unfortunately, you can’t refund more than that.' },
    'Du hast keine Berechtigung, Online-Rückerstattungen an Kunden zu veranlassen. Wende dich bitte an deine Personalleitung, falls das geändert werden soll.': { [L.en]: 'You lack permission to initiate online refunds to clients. Please refer to your admin if this needs to be changed.' },
    /**
     * src/shared/api/scheduling-api/scheduling-api-transactions.service.ts
     */
    'Konto | Karte': { [L.en]: 'Account | card' },
    /**
     * src/client/sales/shared/booking-transaction-form/booking-transaction-form.component.ts
     */
    'Es sind keine Zahlungen vorhanden, die erstattet werden können.': { [L.en]: 'There are no payments that could be refunded.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Um bequem Online-Rückerstattungen vornehmen zu können, aktiviere die <a href="client/plugin/payments" target="_blank">Online-Zahlungsfunktion</a>.': { [L.en]: 'Activate <a href="client/plugin/payments" target="_blank">online payment</a>, to make online refunds easily.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Online-Rückerstattung aktuell nicht möglich, da diese Buchung kein Online-Guthaben aufweist. Mehr dazu erfährst du <a href="client/plugin/faq-online-payment#refund" target="_blank">hier</a>.': { [L.en]: 'Online refund currently not available, as this booking holds no online balance. Find out more <a href="client/plugin/faq-online-payment#refund" target="_blank">here</a>.' },
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Online-Rückerstattung aktuell nicht möglich, da dein gesamter Account <a href="client/sales/transactions" target="_blank">kein Online-Guthaben</a> aufweist.': { [L.en]: 'Online refund currently not available, as your entire account doesn’t hold any <a href="client/sales/transactions" target="_blank">online balance</a>.' },
    'Eine Rückerstattung ist aktuell nicht möglich, da keine Zahlungsarten zur Verfügung stehen. Um das zu ändern, aktiviere die Online-Zahlung oder lege in der gewünschten Tätigkeit unter »Buchungseinstellungen« andere Zahlungsarten an.': { [L.en]: 'Refund is currently not possible because there are no payment methods available. To change this, activate online payment or create other payment methods in the desired activity under »Booking settings«.' },
    /**
     * src/client/sales/shared/booking-cancel-form/booking-transaction-form.component.ts
     */
    '(fix)': { [L.en]: '(fixed)' },
    '${percentage} vom Buchungspreis': { [L.en]: '${percentage} of the booking total' },
    'Die Angabe der Zahlungsart schafft Transparenz in der Kundenkommunikation. Außerdem kannst du so die Zahlungsvorgänge auch zu einem späteren Zeitpunkt gut nachvollziehen. Falls hier die benutzte Zahlungsart fehlt, dann musst du sie bitte erst in der Tätigkeit unter »Buchungseinstellungen« anlegen.': { [L.en]: 'Stating the payment method provides transparency in your customer communication. In addition, you can easily keep track of payment transactions in the future. If the used payment method is missing here, please add it to the activity on the tab »booking settings« first.' },
    'Gib bitte den Namen der verwendeten Zahlungsart an. Das sorgt für Transparenz in der Kundenkommunikation. Außerdem kannst du so die Zahlungsvorgänge zu einem späteren Zeitpunkt besser nachvollziehen.': { [L.en]: 'Stating the payment method provides transparency in your customer communication. In addition, you can easily keep track of payment transactions in the future.' },
    /**
     * src/client/sales/shared/booking-cancel-form/booking-transaction-form.component.html
     */
    // NOTE: We had a type error in the template when we used a semicolon in the string. Could not figure out why.
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Hier kannst du Rückerstattungen erfassen, die du nicht per Online-Zahlung, sondern über eine andere Zahlungsart vorgenommen hast und die deshalb von Dr. Plano nicht automatisch erfasst werden konnten. Bevor du allerdings eine solche Zahlung eingeben kannst, musst du erst in der Tätigkeit unter »Buchungseinstellungen« die Zahlungsart anlegen. Aktuell sind nämlich keine Zahlungsarten vorhanden.': { [L.en]: 'Here you can record refunds that you haven’t made via online payment but using another payment method, which couldn’t be recorded automatically by Dr. Plano. Before recording such a payment by yourself, you must create the used payment method in the related activity under »Booking settings«. Currently, there are no payment methods available.' },
    // NOTE: We had a type error in the template when we used a semicolon in the string. Could not figure out why.
    // eslint-disable-next-line literal-blacklist/literal-blacklist
    'Hier kannst du Einzahlungen erfassen, die nicht per Online-Zahlung, sondern über eine andere Zahlungsart erfolgt sind und die deshalb von Dr. Plano nicht automatisch erfasst werden konnten. Bevor du allerdings eine solche Zahlung eingeben kannst, musst du erst in der Tätigkeit unter »Buchungseinstellungen« die Zahlungsart anlegen. Aktuell sind nämlich keine Zahlungsarten vorhanden.': { [L.en]: 'Here you can record payments that didn’t come in via online payment but another payment method, which couldn’t be recorded automatically by Dr. Plano. Before recording such a payment by yourself, you must create the used payment method in the related activity under »Booking settings«. Currently, there are no payment methods available.' },
    /**
     * src/client/scheduling/shared/api/scheduling-api.service.ts
     */
    'Online-Rückerstattung erfolgreich veranlasst.<br>Das Geld sollte in wenigen Werktagen beim Kunden ankommen.': { [L.en]: 'Online refund initiated successfully. The money should reach your customer in a few business days.' },
    'Die Rückerstattung benötigte mehrere Teilzahlungen. Leider konnten nicht alle davon erfolgreich veranlasst werden. Für mehr Infos siehe »Zahlungen« in der Buchung.': { [L.en]: 'The refund required multiple partial payments. Unfortunately, not all of them could be initiated successfully. For more details, please check the payment details.' },
    'Die Online-Rückerstattung konnte leider nicht veranlasst werden. Bitte versuche es etwas später erneut.': { [L.en]: 'The online refund couldn’t be initiated, unfortunately. Please try again shortly.' },
    'Du brauchst mindestens eine buchbare Tätigkeit, um Buchungen erstellen zu können.': { [L.en]: 'You need at least one bookable activity to create bookings.' },
    'Dir fehlen die Rechte, um Buchungen erstellen zu können.': { [L.en]: 'You lack permission to create bookings.' },
    'Die angegebene Domain war bereits vorhanden und wurde daher automatisch gelöscht.': { [L.en]: 'The entered domain already existed and has been removed automatically.' },
    /**
     * src/client/scheduling/shared/api/scheduling-api-transactions.service.ts
     */
    'für ${month}': { [L.en]: 'for ${month}' },
    'Konto / Karte:': { [L.en]: 'Bank account/card:' },
    /**
     * src/public/main/main.component.ts
     */
    '${lowerLimit} - ${upperLimit} €': { [L.en]: '${lowerLimit} - ${upperLimit} €' },
    'bis ${upperLimit} €': { [L.en]: 'up to ${upperLimit} €' },
    'ab ${lowerLimit} €': { [L.en]: 'from ${lowerLimit} €' },
    '${lowerLimit} - ${upperLimit}': { [L.en]: '${lowerLimit} - ${upperLimit}' },
    'bis ${upperLimit}': { [L.en]: 'up to ${upperLimit}' },
    'ab ${lowerLimit}': { [L.en]: 'up to ${lowerLimit}' },
    '${lowerLimit} - ${upperLimit} User': { [L.en]: '${lowerLimit} - ${upperLimit} users' },
    'bis ${upperLimit} User': { [L.en]: 'up to ${upperLimit} users' },
    'ab ${lowerLimit} User': { [L.en]: 'from ${lowerLimit} users' },
    /**
     * src/client/sales/shared/email-history/email-history.component.ts
     */
    'Die Email wird an die aktuelle Adresse der buchenden Person verschickt: <strong>${mailBookingPerson}</strong><br/><br/>Der Email-Inhalt <strong>wird nicht aktualisiert</strong>, sondern genau so verschickt, wie er hier gespeichert ist. Falls darin enthaltene Informationen nicht mehr passen, kommuniziere das bitte separat mit deinem Kunden.': { [L.en]: 'The email will go to the current email address of the booking person: <strong>${mailBookingPerson}</strong><br/><br/>The email content <strong>will not be updated</strong> but sent out exactly as it is saved and shown here. If any information is no longer up-to-date, please make sure you inform your client separately.' },
    'Ja, senden': { [L.en]: 'Yes, send now' },
};
export const hasDictionaryEntry = (input) => {
    if (!input) {
        if (Config.DEBUG)
            throw new Error('input should be defined');
        return undefined;
    }
    return !!DICTIONARY[input];
};
export const getDictionaryEntry = (input, language) => {
    return DICTIONARY[input][language];
};
//# sourceMappingURL=localize.dictionary.js.map