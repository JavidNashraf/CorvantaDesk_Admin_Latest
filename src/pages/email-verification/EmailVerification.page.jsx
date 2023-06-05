import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { validateEmailToken } from "store/Actions/AuthActions";
import Loader from "components/Loader/Loader";

function EmailVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //= ===EXTRACTING REQUIRED PARAMS FROM URL====//
  const { userId } = useParams();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const code = query.get("code");

  const emailVerificationHandler = async () => {
    await dispatch(validateEmailToken(userId, code, navigate));
  };

  useEffect(() => {
    emailVerificationHandler();
  }, []);

  return (
    <div className="h-screen w-full flex  items-center justify-content-center">
      <div className="col " style={{ maxWidth: "536px" }}>
        <div className="flex items-center justify-center mb-5">
          {/* <img src="/icon/logo.svg" alt="" className="h-20 w-20" /> */}
        </div>
        <div className="bg-custom-secondary  col mx-4 md:mx-auto  rounded-lg p-4 md:p-5">
          <div className="text-center">
            <Loader />
            <h2 className="text-md text-2xl text-white font-normal mb-2">
              Verifying Email...
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
