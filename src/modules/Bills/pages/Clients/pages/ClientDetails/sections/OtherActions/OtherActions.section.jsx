import { Spin } from "antd";
import { Button, DateRangePicker } from "components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loginAsClient } from "store";
import { messageNotifications } from "store";
import { userStatusChangeById } from "store";
import { EditClientUser } from "../../../ClientList/sections";
import { Delete } from "../APIKeys/sections";
import { DownloadData } from "./sections/Download.section";

export const OtherActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const { id } = useParams();

  const { user, loading } = useSelector((state) => state?.users);
  const auth = useSelector((state) => state?.auth);

  const userStatus = user?.isActive;

  const handleDisableClient = async () => {
    setIsLoading(true);
    if (userStatus) {
      await dispatch(userStatusChangeById(id, "deactivate"));
    } else {
      await dispatch(userStatusChangeById(id, "activate"));
    }
    setIsLoading(false);
  };

  const handleLoginAsClient = () => {
    dispatch(loginAsClient(user.id, messageNotifications));
  };

  return (
    <div className="bg-[#000000] rounded-lg admin-details__user-card px-8">
      <EditClientUser show={showEdit} setShow={setShowEdit} client={user} />
      <Delete
        show={showDelete}
        setShow={setShowDelete}
        record={user}
        type="client"
        id={user?.id}
      />
      <DownloadData show={showDownload} setShow={setShowDownload}  />
      <Spin spinning={loading}>
        <h6 className="text-white text-[16px] mb-8">Other Actions</h6>
        <div className="flex flex-col gap-4">
          <Button
            type="ghost"
            onClick={handleLoginAsClient}
            disabled={auth.isLoading}
          >
            Login as Client
          </Button>
          <Button type="ghost" onClick={() => setShowEdit(true)}>
            Reset and Send Password
          </Button>
          <Button type="ghost" onClick={() => setShowDownload(true)}>
            Download Data
          </Button>
          {userStatus ? (
            <Button type="deactivate" onClick={handleDisableClient}>
              {isLoading ? "Deactivating Client..." : "Deactivate Client"}
            </Button>
          ) : (
            <Button type="activate" onClick={handleDisableClient}>
              {isLoading ? "Activating Client..." : "Activate Client"}
            </Button>
          )}
          <Button type="delete" onClick={() => setShowDelete(true)}>
            Delete client's account
          </Button>
        </div>
      </Spin>
    </div>
  );
};
