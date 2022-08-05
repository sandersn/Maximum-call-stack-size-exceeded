import { DataInputBase } from './data-input-base';

export abstract class DataBase<T> {
	private input1LastDataVersion : unknown = null;
	private input2LastDataVersion : unknown = null;
	private input3LastDataVersion : unknown = null;

	protected cachedValue ! : T;

	protected constructor(private input1 : DataInputBase | null, private input2 : DataInputBase | null, private input3 : DataInputBase | null) {
		if (input3)
			this.inputsChanged = this.threeInputsChanged;
		else if (input2)
			this.inputsChanged = this.twoInputsChanged;
		else
			this.inputsChanged = this.oneInputChanged;
	}

	protected inputsChanged : () => boolean;

	private oneInputChanged() : boolean {
		if (this.input1 === null) throw new Error('input1 is not defined');
		if (this.input1.dataVersion !== this.input1LastDataVersion) {
			this.input1LastDataVersion = this.input1.dataVersion;
			return true;
		}

		return false;
	}

	private twoInputsChanged() : boolean {
		// update cache if data-version is newer
		let updateValue = false;

		if (this.input1 === null) throw new Error('input1 is not defined');
		if (this.input1.dataVersion !== this.input1LastDataVersion) {
			updateValue = true;
			this.input1LastDataVersion = this.input1.dataVersion;
		}

		if (this.input2 === null) throw new Error('input2 is not defined');
		if (this.input2.dataVersion !== this.input2LastDataVersion) {
			updateValue = true;
			this.input2LastDataVersion = this.input2.dataVersion;
		}

		return updateValue;
	}

	private threeInputsChanged() : boolean {
		// update cache if data-version is newer
		let updateValue = false;

		if (this.input1 && this.input1.dataVersion !== this.input1LastDataVersion) {
			updateValue = true;
			this.input1LastDataVersion = this.input1.dataVersion;
		}

		if (this.input2 && this.input2.dataVersion !== this.input2LastDataVersion) {
			updateValue = true;
			this.input2LastDataVersion = this.input2.dataVersion;
		}

		if (this.input3 && this.input3.dataVersion !== this.input3LastDataVersion) {
			updateValue = true;
			this.input3LastDataVersion = this.input3.dataVersion;
		}

		return updateValue;
	}
}
