import { PMath } from './math-utils';

export class RandomValueUtils {

	/**
	 * @param length Length of the generated string.
	 * @returns A randomly generated string.
	 */
	public getRandomString(length : number) : string {
		return Math.random().toString(36).substring(0, length);
	}

	/**
	 * @returns A randomly generated boolean.
	 */
	public getRandomBoolean() : boolean {
		return Math.random() > 0.5;
	}

	/**
	 * @param min The minimal range of the generated number (inclusive).
	 * @param max The maximal range of the generated number (inclusive).
	 * @param decimalPlaces The number of digits on the right side of the comma. If omitted the default value is zero.
	 * @returns A random number in range [min, max].
	 */
	public getRandomNumber(min : number, max : number, decimalPlaces : number = 0) : number {
		const random = min + Math.random() * (max - min);
		return PMath.roundToDecimalPlaces(random, decimalPlaces);
	}

	/**
	 * @returns A random email adress which is valid according the backend validation tests.
	 */
	public getRandomEmail() : string {
		return `${this.getRandomString(7)}@dr-plano.de`;
	}
}
