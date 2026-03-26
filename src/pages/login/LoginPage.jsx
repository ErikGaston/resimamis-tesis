import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postLogin, clearLogin } from "../../redux/actions/userActions";
import { showLoading } from "../../redux/actions/loadingActions";
import LoginTemplate from "../../components/templates/login/LoginTemplate";
import Loading from "../../components/atoms/loading/Loading";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../utils/setAuthToken";

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
    dispatch(showLoading(true))
    dispatch(postLogin(model))
  }

  useEffect(() => {
    dispatch(clearLogin())
    return () => {
      dispatch(clearLogin())
    }
  }, []);

  useEffect(() => {
    if (dataLogin?.error !== null) {
      dispatch(showLoading(false))
      setError(dataLogin?.error?.message)
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
      navigate("/home");
    }
  }, [dataLogin?.error, dataLogin?.postLogin, navigate])

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
        setError={setError}
      />
    </>
  )
}