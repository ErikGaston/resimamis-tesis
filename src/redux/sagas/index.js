import { all } from "redux-saga/effects";
import userSaga from "./userSaga";
import volunteerSaga from "./volunteerSaga";
import motherSaga from "./motherSaga";
import genericsSaga from "./genericsSaga";
import babySaga from "./babySaga";
import assignmentSaga from "./assignmentSaga";
import supplySaga from "./supplySaga";

export default function* rootSaga() {
    yield all([
        userSaga(),
        volunteerSaga(),
        motherSaga(),
        genericsSaga(),
        babySaga(),
        assignmentSaga(),
        supplySaga()
    ]);
}