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
import proveedorReducer from "./proveedorReducer";
import salaReducer from "./salaReducer";
import dashboardReducer from "./dashboardReducer";
import asistenteReducer from "./asistenteReducer";
import reporteReducer from "./reporteReducer";
import estadisticaAvanzadaReducer from "./estadisticaAvanzadaReducer";

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
    proveedorReducer: proveedorReducer,
    salaReducer: salaReducer,
    dashboardReducer: dashboardReducer,
    asistenteReducer: asistenteReducer,
    reporteReducer: reporteReducer,
    estadisticaAvanzadaReducer: estadisticaAvanzadaReducer,
});

export default rootReducer;