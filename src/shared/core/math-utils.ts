import { Currency } from '../api/base/generated-types.ag';

export class PMath {

	/**
	 * @param value The value to be rounded.
	 * @param decimalPlaces The number of digits on the right side of the comma.
	 * @returns Returns `value` rounded.
	 */
	public static roundToDecimalPlaces(value : number, decimalPlaces : number) : number {
		const multiplier = Math.pow(10, decimalPlaces);
		return Math.round(value * multiplier) / multiplier;
	}

	/**
	 * @param value The value to be cut.
	 * @param decimalPlaces The number of digits on the right side of the comma.
	 * @returns Returns `value` cut to the wanted amount of decimal points.
	 */
	public static cutToDecimalPlaces(value : number, decimalPlaces : number) : number {
		const valueAsString = value.toString();
		if (!valueAsString.includes('.')) return value;
		const result = valueAsString.toString().slice(0, valueAsString.indexOf('.') + decimalPlaces);
		return Number(result);
	}

	/**
	 * Subtract two floats and round them.
	 *
	 * Reason why you should use this method instead of simply `-`:
	 * It is type-save and calculations with floats in js can be difficult.
	 * Some floats can not be mapped to binary code exactly.
	 * One effect: In js 1 - 0.7 gives you 0.30000000000000004
	 * More Info: https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
	 */
	public static subtractCurrency(value1 : Currency, value2 : Currency) : Currency {
		return PMath.roundToDecimalPlaces(value1 - value2, 2);
	}

	/**
	 * Add two floats and round them.
	 *
	 * Reason why you should use this method instead of simply `-`:
	 * It is type-save and calculations with floats in js can be difficult.
	 * Some floats can not be mapped to binary code exactly.
	 * One effect: In js 1 - 0.7 gives you 0.30000000000000004
	 * More Info: https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
	 */
	public static addCurrency(value1 : Currency, value2 : Currency) : Currency {
		return PMath.roundToDecimalPlaces(value1 + value2, 2);
	}
}
