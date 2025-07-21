sap.ui.define([], () => {
    return {
        getStatusText: function (value) {
            switch (Number(value)) {
                case 1: return "Draft";
                case 2: return "Active";
                case 3: return "InActive";
                default: return "Unknown";
            }
        },
        getStatusState: function (value) {
            switch (Number(value)) {
                case 1: return "Warning";
                case 2: return "Success";
                case 3: return "Error";
                default: return "None";
            }
        }
    };
});
