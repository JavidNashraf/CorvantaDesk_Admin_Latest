import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { getUserProfile } from "store";
import { initAuthenticationSuccess } from "store/Slices/authSlice";
import { closeLockScreen } from "store/Slices/settingSlice";

export function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SignInByToken = () => {
  const token = useQuery().get('token');
  const clientId = useQuery().get('clientId');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    if (userToken && userToken.token) {
      dispatch(initAuthenticationSuccess(userToken));
      dispatch(closeLockScreen());
      dispatch(getUserProfile(userToken.token));
      localStorage.setItem('AuthToken', JSON.stringify(userToken));
      
      if (clientId) {
        navigate(`/admin/dashboard/billing/clients/list/details/${clientId}`)
      }
    }
  }, [dispatch, userToken])

  useEffect(() => {
    if (!token) {
      navigate('/admin/sign-in');
    };

    try {
      const parsedToken = JSON.parse(token);
      setUserToken(parsedToken)
    } catch(e) {
      navigate('/admin/sign-in')
    }
  }, [token])

  return (
    <></>
  )
}

export default SignInByToken;