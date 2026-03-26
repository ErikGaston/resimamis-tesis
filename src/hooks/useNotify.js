import { useDispatch } from "react-redux";
import { showToast } from "../redux/actions/toastActions";

/** Para disparar toasts desde componentes (éxito, avisos genéricos). */
export function useNotify() {
  const dispatch = useDispatch();

  return {
    error: (message) =>
      dispatch(showToast({ message, severity: "error" })),
    success: (message) =>
      dispatch(showToast({ message, severity: "success" })),
    info: (message) =>
      dispatch(showToast({ message, severity: "info" })),
    warning: (message) =>
      dispatch(showToast({ message, severity: "warning" })),
  };
}
