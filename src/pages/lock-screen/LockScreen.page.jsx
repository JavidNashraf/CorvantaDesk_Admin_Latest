import UserName from "layout/components/navbar/UserProfileCard/UserName";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { messageNotifications } from "store";
import {
  getUserProfile,
  SaveTokenInLocalStorage,
} from "store/Actions/AuthActions";
import {
  initAuthenticationFail,
  initAuthenticationPending,
  initAuthenticationSuccess,
  logout,
  onLoginDispatch,
} from "store/Slices/authSlice";
import { accountSuspended, closeLockScreen } from "store/Slices/settingSlice";
import "../../layout/components/navbar/UserTop.css";

function LockScreen() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [imgError, setImgError] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isTrustDevice = true;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  let has2faEnabled = false;
  const login = (userName, password, TrustDevice) => {
    return async (dispatch) => {
      dispatch(initAuthenticationPending());
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/api/tokens`,
        {
          method: "POST",
          body: JSON.stringify({
            userName,
            password,
            TrustDevice,
          }),
          headers: new Headers({
            "Content-type": "application/json",
            "gen-api-key": process.env.REACT_APP_GEN_APIKEY,
            tenant: "admin",
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        dispatch(initAuthenticationFail(error));
        if (error.exception.includes("User Not Active")) {
          has2faEnabled = true;
          localStorage.setItem("Account-Suspended", true);
          dispatch(accountSuspended());
          navigate("/admin/account-suspended");

          toast.error(
            "Account has been suspended, Please contact administration",
            {
              ...messageNotifications,
            }
          );
        }
        if (error.exception.includes("Provided Credentials are invalid.")) {
          has2faEnabled = true;
          toast.error("Invalid Credentials, Please enter correct password", {
            ...messageNotifications,
          });
        }
      }
      const res = await response.json();
      if (res.messages[0]) {
        has2faEnabled = true;
        navigate("/admin/one-time-password");
        localStorage.setItem("userId", res.messages[1]);
        localStorage.setItem("userEmail", res.messages[2]);
        toast.success("Please verify otp to login", {
          ...messageNotifications,
        });
      }
      localStorage.removeItem("Account-Suspended");
      dispatch(initAuthenticationSuccess(res.data));
      dispatch(closeLockScreen());
      dispatch(getUserProfile(res.data.token));
      localStorage.setItem("AuthToken", JSON.stringify(res.data));
      SaveTokenInLocalStorage(res.data);
    };
  };
  const LoginHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userName = user && user.userName;
    try {
      await dispatch(login(userName, password, isTrustDevice));
      toast.success("You have logged in successfuly", {
        ...messageNotifications,
      });
      dispatch(onLoginDispatch(true))
      setIsLoading(false);
      setPassword("");
    } catch (err) {
      setIsLoading(false);
      if (!has2faEnabled) {
        toast.error("Failed to Login", {
          ...messageNotifications,
        });
      }
    }
  };
  const { t } = useTranslation("/LockScreenPage/ns");
  return (
    <div className="d-flex w-screen py-20 md:py-2 md:h-screen relative">
      <div
        className="absolute left-[20px] top-[20px] text-white underline text-[20px] cursor-pointer"
        onClick={() => {
          dispatch(logout());
          navigate("/admin/sign-in");
        }}
      >
        Not {user && user.userName}? Sign in here.
      </div>
      <div className="col-md-6 my-auto px-5  md:p-20">
        <div style={{ maxWidth: "668px" }} className="mx-auto">
          <div className="">
            {/* <img src="/icon/logo.svg" alt="" className="w-20 h-20" /> */}
            <h3 className="text-4xl text-white font-normal mt-5">
              {t("title")}
            </h3>
            <p className=" mb-5 custom-text-light text-base border-dashed-bottom pb-5">
              {t("desc")}
            </p>
          </div>
          <div className="flex items-center mb-5">
            <div className="h-[90px] w-[90px] rounded-[50%] border-[2px] border-[#3699FF] p-[2px] userName mr-4">
              {user && user?.base64Image && !imgError ? (
                // !showName
                <img
                  src={"data:image/png;base64," + user?.base64Image}
                  alt={user?.userName}
                  onError={() => setImgError(true)}
                  className="h-full w-full rounded-[50%]"
                />
              ) : (
                <>{user && <UserName isLoggedIn={isLoggedIn} user={user} />}</>
              )}
            </div>
            <div>
              <h3 className="text-[22px] text-white">
                {t("Welcome")} {user && user.userName}
              </h3>
              <p className="text-[16px] custom-text-light">{t("WelcomeTxt")}</p>
            </div>
          </div>
          <div className="col-md-8">
            <form onSubmit={LoginHandler}>
              <input
                type="password"
                name="password"
                onChange={onChangeHandler}
                className="w-full h-12 mb-3  bg-custom-secondary rounded-md text-gray-300 placeholder:text-gray-400 placeholder:text-sm px-3  placeholder:font-light"
                id="enterPassword"
                placeholder="Enter Password"
              />
              <button
                type="submit"
                disabled={password.length < 6}
                className="w-full h-12 custom-blue-bg ease-in duration-200 rounded-lg text-white bg-blue-500 hover:bg-blue-700"
              >
                {isLoading ? t("unlocking") : t("unlock")}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col d-none bg-custom-secondary d-md-flex items-center justify-center">
        <img src="/icon/lock-screen.svg" alt="" />
      </div>
    </div>
  );
}

export default LockScreen;
