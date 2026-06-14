import { combineReducers } from "redux";
import userReducer from "./userReducer";
import volunteerReducer from "./volunteerReducer";
import motherReducer from "./motherReducer";
import genericsReducer from "./genericsReducer";
import babyReducer from "./babyReducer";
import assignmentReducer from "./assignmentReducer";
import supplyReducer from "./supplyReducer";
import toastReducer from "./toastReducer";
import horarioReducer from "./horarioReducer";
import tareaReducer from "./tareaReducer";
import visitaReducer from "./visitaReducer";

const rootReducer = combineReducers({
    userReducer: userReducer,
    volunteerReducer: volunteerReducer,
    motherReducer: motherReducer,
    genericsReducer: genericsReducer,
    babyReducer: babyReducer,
    assignmentReducer: assignmentReducer,
    supplyReducer: supplyReducer,
    toastReducer: toastReducer,
    horarioReducer: horarioReducer,
    tareaReducer: tareaReducer,
    visitaReducer: visitaReducer,
});

export default rootReducer;