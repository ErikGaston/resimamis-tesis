import { combineReducers } from "redux";
import userReducer from "./userReducer";
import volunteerReducer from "./volunteerReducer";
import motherReducer from "./motherReducer";
import genericsReducer from "./genericsReducer";
import babyReducer from "./babyReducer";
import assignmentReducer from "./assignmentReducer";
import supplyReducer from "./supplyReducer";

const rootReducer = combineReducers({
    userReducer: userReducer,
    volunteerReducer: volunteerReducer,
    motherReducer: motherReducer,
    genericsReducer: genericsReducer,
    babyReducer: babyReducer,
    assignmentReducer: assignmentReducer,
    supplyReducer: supplyReducer,
});

export default rootReducer;