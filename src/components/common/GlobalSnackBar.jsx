import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../redux/actions/toastActions";
import SnackBar from "./SnackBar";

/** Toast único visible en toda la app (errores API, mensajes de éxito, etc.). */
export default function GlobalSnackBar() {
  const dispatch = useDispatch();
  const { open, message, severity, seq } = useSelector((state) => state.toastReducer);

  return (
    <SnackBar
      key={seq}
      open={open}
      message={message}
      error={severity === "error"}
      severity={severity}
      variant={severity === "error" ? "filled" : "standard"}
      setAlert={() => dispatch(hideToast())}
    />
  );
}
