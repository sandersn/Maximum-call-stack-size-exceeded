export class ApiLoadArgs {
}
export class ApiSaveArgs {
}
export class ApiPostArgs {
}
/**
 * Enum indicating whether an Online-Cancellation is possible or not.
 * NOTE: Be careful! This enum also exists in backend/java (booking.java).
 */
export var OnlineCancellationPossible;
(function (OnlineCancellationPossible) {
    OnlineCancellationPossible["NO"] = "NO";
    OnlineCancellationPossible["CAN_WITHDRAW"] = "CAN_WITHDRAW";
    OnlineCancellationPossible["CAN_CANCEL"] = "CAN_CANCEL";
})(OnlineCancellationPossible || (OnlineCancellationPossible = {}));
//# sourceMappingURL=types.js.map