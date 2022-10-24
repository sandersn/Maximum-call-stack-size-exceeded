export class DataBase {
    constructor(input1, input2, input3) {
        this.input1 = input1;
        this.input2 = input2;
        this.input3 = input3;
        this.input1LastDataVersion = null;
        this.input2LastDataVersion = null;
        this.input3LastDataVersion = null;
        if (input3)
            this.inputsChanged = this.threeInputsChanged;
        else if (input2)
            this.inputsChanged = this.twoInputsChanged;
        else
            this.inputsChanged = this.oneInputChanged;
    }
    oneInputChanged() {
        if (this.input1 === null)
            throw new Error('input1 is not defined');
        if (this.input1.dataVersion !== this.input1LastDataVersion) {
            this.input1LastDataVersion = this.input1.dataVersion;
            return true;
        }
        return false;
    }
    twoInputsChanged() {
        // update cache if data-version is newer
        let updateValue = false;
        if (this.input1 === null)
            throw new Error('input1 is not defined');
        if (this.input1.dataVersion !== this.input1LastDataVersion) {
            updateValue = true;
            this.input1LastDataVersion = this.input1.dataVersion;
        }
        if (this.input2 === null)
            throw new Error('input2 is not defined');
        if (this.input2.dataVersion !== this.input2LastDataVersion) {
            updateValue = true;
            this.input2LastDataVersion = this.input2.dataVersion;
        }
        return updateValue;
    }
    threeInputsChanged() {
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
//# sourceMappingURL=data-base.js.map