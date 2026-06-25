import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getProveedoresAll: null,
    postProveedor: null,
    putProveedor: null,
    postProveedorDelete: null,
    loading: false,
    error: null,
};

export default function proveedorReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_GET_PROVEEDORES_ALL]: responseToReturn('getProveedoresAll'),
        [actionTypes.SUCCESS_POST_PROVEEDOR]: responseToReturn('postProveedor'),
        [actionTypes.SUCCESS_PUT_PROVEEDOR]: responseToReturn('putProveedor'),
        [actionTypes.SUCCESS_POST_PROVEEDOR_DELETE]: responseToReturn('postProveedorDelete'),
        [actionTypes.ERROR_PROVEEDOR]: responseToReturn('error'),
        [actionTypes.CLEAR_PROVEEDOR_WRITES]: clearProveedorWrites(),
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            res = { ...state, [typeState]: action.response.data, loading: false };
            if (typeState !== 'error') res.error = null;
        }
        return res;
    }

    function showLoading() {
        if (action.type === 'SHOW_LOADING') {
            return { ...state, loading: action.payload };
        }
        return { ...state };
    }

    function clearProveedorWrites() {
        if (action.type === actionTypes.CLEAR_PROVEEDOR_WRITES) {
            return { ...state, postProveedor: null, putProveedor: null, postProveedorDelete: null, error: null };
        }
        return { ...state };
    }

    let receiveAction = DEFAULT;
    if (ACTIONS[action.type] !== undefined) receiveAction = ACTIONS[action.type];
    return receiveAction;
}
