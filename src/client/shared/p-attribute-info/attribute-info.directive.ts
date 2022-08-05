/* eslint-disable unicorn/no-empty-file */

// @Directive({
// 	/* eslint-disable @angular-eslint/directive-selector */
// 	selector:
// 		'[foo]'
// 	,
// })
// export class PRequiredAttributeInfoDirective extends AttributeInfoComponentBase implements AfterContentInit {
// 	@HostBinding('class.foo') private _alwaysTrue = true;
// 	constructor() {
// 		super()
// 	}

// 	public ngAfterContentInit() : void {
// 		if (this.attributeInfo === undefined) throw 'no';
// 	}
// }

// @Directive({
// 	/* eslint-disable @angular-eslint/directive-selector */
// 	selector: 'p-button[attributeInfo][editButton]',
// })
// export class PEditButtonAttributeInfoDirective extends AttributeInfoComponentBase {
// 	@HostBinding('icon') private get icon() : PlanoFaIconPoolValues {
// 		return this.attributeInfo.canEdit ? PlanoFaIconPool.EDIT : this.canNotEditIcon;
// 	}

// 	@Input() public canNotEditIcon : PlanoFaIconPoolValues = PlanoFaIconPool.MORE_INFO;
// 	// eslint-disable-next-line @typescript-eslint/naming-convention
// 	public PThemeEnum = PThemeEnum;

// 	constructor() {
// 		super()
// 	}
// }
