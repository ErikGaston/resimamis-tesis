import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postLogin, clearLogin } from "../../redux/actions/userActions";
import { showLoading } from "../../redux/actions/loadingActions";
import { hideToast } from "../../redux/actions/toastActions";
import LoginTemplate from "../../components/templates/login/LoginTemplate";
import Loading from "../../components/atoms/loading/Loading";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../utils/setAuthToken";
import { GENERIC_API_ERROR } from "../../utils/apiErrorMessage";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataLogin = useSelector(state => state.userReducer)
  const loading = useSelector(state => state.userReducer?.loading)
  const [model, setModel] = useState({
    Dni: '',
    Contrasena: '',
  });
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);
    dispatch(hideToast());
    dispatch(showLoading(true));
    dispatch(postLogin(model));
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home', { replace: true })
      return
    }
    dispatch(clearLogin())
    return () => {
      dispatch(clearLogin())
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (dataLogin?.error) {
      dispatch(showLoading(false));
      const msg =
        typeof dataLogin.error?.message === "string" && dataLogin.error.message.trim()
          ? dataLogin.error.message
          : GENERIC_API_ERROR;
      setError(msg);
    }
    if (dataLogin?.postLogin !== null) {
      let token = dataLogin?.postLogin?.token;
      localStorage.setItem("voluntaria", JSON.stringify({
        'id': dataLogin?.postLogin?.voluntaria?.idVoluntaria,
        'nombre': dataLogin?.postLogin?.voluntaria?.nombre,
        'apellido': dataLogin?.postLogin?.voluntaria?.apellido,
        'mail': dataLogin?.postLogin?.voluntaria?.mail,
        'dni': dataLogin?.postLogin?.voluntaria?.dni,
        'celular': dataLogin?.postLogin?.voluntaria?.celular,
      }))
      localStorage.setItem("token", token);
      setAuthToken(token);
      dispatch(showLoading(false))
      dispatch(hideToast());
      setError(null);
      navigate("/home");
    }
  }, [dataLogin?.error, dataLogin?.postLogin, dispatch, navigate])

  return (
    <>
      {loading &&
        <Loading position={'absolute'} height={'100%'} zIndex={9999} />
      }
      <LoginTemplate
        model={model}
        setModel={setModel}
        handleLogin={handleLogin}

        error={error}
      />
    </>
  )
}
