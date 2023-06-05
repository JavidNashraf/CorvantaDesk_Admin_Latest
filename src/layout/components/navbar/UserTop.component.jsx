// import { Switch } from 'antd';
// import { Input } from 'components';
// import { Formik } from 'formik';
import { useOutside } from 'hooks';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { logout } from 'store/Slices/authSlice';
import { Departments } from './Departments.component';
import UserName from './UserProfileCard/UserName';
import { getNotificationss, notificationsRead } from 'store';

import './UserTop.css';
import { deactivateOrderUser } from 'store';
import { deactivateOrderUserforOrder } from 'store';
import { DefaultPopup } from "pages/sign-in/DefaultPopup";
import { t } from 'i18next';


function UserTop({ toggleNotification }) {
  const [connection, setConnection] = useState(null);
  const AuthToken = useSelector((state) => state.auth.token);
  const [dropdown, setDropdown] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state?.notifications);
  const [imgError, setImgError] = useState(false);
  const lessThanDesktop = useMediaQuery({
    query: '()',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const isOnline = window.navigator.onLine;

  // ONLINE STATUS
 
  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_BASEURL}/api/ws/signalRHub`, {
        accessTokenFactory: () => {
          return AuthToken;
        },
        withCredentials: false,
        transport: HttpTransportType.LongPolling,
        headers: {
          'gen-api-key': process.env.REACT_APP_GEN_APIKEY,
          tenant: 'admin',
          Authorization: `Bearer ${AuthToken}`,
        },
      })
      .withAutomaticReconnect()
      .build();
    setConnection(connect);
  }, [AuthToken]);

  useEffect(() => {
    if (connection) {
      connection.start();
      // .then(() => {
      //   console.log("Connected!", connection);
      //   connection.on("ReceiveMessage", (message) => {
      //     console.log("Message", message);
      //   });
      // })
      // .catch((error) => console.log("Connection Failed!", error));
    }
  }, [connection]);

  // const [notifications, setNotifications] = useState(false);
  const links = [
    // {
    //   name: 'Active Departments',
    //   Icon: <Right fill={showDepartments ? '#3699ff' : '#494b74'} />,
    //   onClick: () => {
    //     setShowDepartments((dept) => !dept);
    //   },
    //   active: showDepartments,
    // },
    {
      name: 'Active Groups',
      onClick: () => {
        setShowPopup(true);
      },
      active: showDepartments,
    },
    {
      name: 'Account Settings',
      onClick: () => {
        setDropdown((dropdownValue) => !dropdownValue);
        navigate('/admin/dashboard/account-settings/general');
      },
    },
    {
      name: 'Notifications',
      onClick: () => {
        setDropdown((dropdownValue) => !dropdownValue);
        handleNotification();
      },
    },
    {
      name: 'Sign Out',
      onClick: async () => {
        await dispatch(deactivateOrderUserforOrder(user?.id))
        dispatch(logout());
        navigate('/admin/sign-in');
        window.location.reload(true)
      },
    },
  ];

  const handleOutsideClick = () => {
    setDropdown(false);
    setShowDepartments(false);
    setShowPopup(false);
  };
  const handleNotification = () => {
    toggleNotification(true);
    (async () => {
      await dispatch(
        getNotificationss({
          toUserId: user?.id,
        })
      );
    })();
  };

  useEffect(() => {
    if (notifications?.length) {
      let ids = [];
      notifications
        ?.filter(function (el) {
          return el.isRead !== true;
        })
        ?.forEach((b) => {
          ids.push(b?.id);
        });
      if (ids.length) dispatch(notificationsRead(ids));
    }
  }, [notifications]);

  const dropDownRef = useRef(null);
  useOutside(dropDownRef, handleOutsideClick);

  return (
    <div
      className="flex items-center cursor-pointer mr-4 relative"
      // onClick={() => setDropdown((prevDropdown) => !prevDropdown)}
      ref={dropDownRef}
    >
      {/* <Notifications
        visible={notifications}
        onClose={() => setNotifications(false)}
      /> */}
      <DefaultPopup
          show={showPopup}
          setShow={setShowPopup}
          type="order"
        />
      <div
        className={`w-[278px] bg-[#000000] ${
          dropdown ? '' : 'hidden'
        } rounded-lg text-gray-300`}
        style={{
          position: 'absolute',
          top: '58px',
          right: 0,
          boxShadow: '0px 0px 40px #00000066',
          zIndex: 2,
        }}
      >
        {/* Name and Email Box */}
        <div className="p-[20px] border-b-[1px] border-b-[#fff] cursor-auto">
          <div className="flex items-start justify-between">
            {/* Image + Status */}
            <div className="h-12 w-12 rounded-lg border-2 border-[#3699FF] p-1 userName">
              {/* {user && user.base64Image && !imgError ? (
                // !showName
                <img
                  src={"data:image/png;base64," + user?.base64Image}
                  alt={"Corvanta Desk"}
                  onError={() => setImgError(true)}
                  className="h-full w-full"
                />
              ) : (
                <>{user && <UserName isLoggedIn={isLoggedIn} user={user} />}</>
              )} */}
            </div>
            <div className="bg-[#1C3238] px-[8px] py-[4px] rounded-[4px] ">
              <p className="text-[#0BB783] text-[14px]">Active</p>
            </div>
          </div>
          <div className="mt-[20px]">
            {/* onClick={() => dispatch(logout())} */}
            <h3 className="text-white text-[14px] mb-0">Corvanta Desk</h3>
            <h3 className="text-[#92928F] text-[14px] mb-0">
              {/* {user?.userName} */}
              Corvanta Desk
            </h3>
          </div>
        </div>
        <div>
          {links?.map(({ onClick, name, Icon, active }, index) => (
            <p
              className={`pt-[20px] px-[20px] ${
                active ? 'text-[#3699FF]' : 'text-[#fff]'
              } flex items-center justify-between hover:text-[#3699FF] transition-all text-[14px] last:pb-[20px]`}
              onClick={onClick}
              key={name}
            >
              <span>{name}</span>
              {Icon}
            </p>
          ))}
        </div>
      </div>
      <div
        className={`h-12 w-12 rounded-lg border-2 border-[#08090A] p-1 userName ${
          isOnline ? 'isOnline' : 'isOffline'
        }`}
      >
        {/* {user?.base64Image ? (
          <img
            src={"data:image/png;base64," + user?.base64Image}
            alt={user.userName}
            className="h-full w-full"
          />
        ) : (
          <>{user && <UserName isLoggedIn={isLoggedIn} user={user} />}</>
        )} */}
        {/* Departments Dropdown */}
        <Departments showDepartments={showDepartments} />
        {/* Dropdown */}
      </div>

      {!lessThanDesktop && (
        <>
          <div
            className="text-base mx-3"
            onClick={() => setDropdown((prevDropdown) => !prevDropdown)}
          >
            <h3 className="text-white text-base mb-0">
              Corvanta Desk
            </h3>
            <p className="text-gray-400 mb-0">corvantadesk@gmail.com</p>
          </div>
          <div
            className="h-12 w-12 bg-[#08090A] flex items-center justify-center rounded-lg relative"
            onClick={() => setDropdown((prevDropdown) => !prevDropdown)}
          >
            <img src="/icon/arrow-down.svg" alt="" />
          </div>
        </>
      )}
    </div>
  );
}

export default UserTop;
