import { Spin } from "antd";
import { Button } from "components";
import UserName from "layout/components/navbar/UserProfileCard/UserName";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { AddClientUser } from "../../ClientList/sections";

export const SubUsers = () => {
  const { t } = useTranslation("/Users/ns");
  const [showAdd, setShowAdd] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { loading, clients } = useSelector((state) => state?.users);

  const { id } = useParams();
  const subUsers = clients?.filter(
    (user) => user?.parentID === id && user?.isDeleted === false
  );

  return (
    <div className="bg-[#000000] rounded-lg admin-details__user-card px-8">
      <AddClientUser show={showAdd} setShow={setShowAdd} />
      <Spin spinning={loading}>
        <div className="flex items-center justify-between  mb-8">
          <h6 className="text-white text-[16px]">{t("Sub Users")}</h6>
          <Button type="ghost" onClick={() => setShowAdd(true)}>
            Add sub user
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {subUsers?.length ? (
            subUsers.map(({ fullName, email, base64Image, id }, index) => {
              return (
                <div className="flex flex-col gap-1" key={index}>
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      {base64Image && !imgError ? (
                        <div className="bg-[#171723] flex items-center justify-center w-[47px] h-[47px] rounded-lg p-[4px]">
                          <img
                            className="rounded-lg w-full h-full"
                            src={base64Image}
                            alt="user"
                            onError={() => setImgError(true)}
                          />
                        </div>
                      ) : (
                        <div className="bg-[#171723] flex items-center justify-center w-[47px] h-[47px] rounded-lg p-[4px] text-[#0BB783] text-[18px] font-bold">
                          <UserName isLoggedIn={true} user={{ fullName }} />
                        </div>
                      )}
                      <div className="">
                        <div className="text-white text-sm">{fullName}</div>
                        <div className="text-[#92928F] text-sm">{email}</div>
                      </div>
                    </div>
                    <Link
                      to={`/admin/dashboard/billing/clients/list/details/${id}`}
                      className="text-[#3699FF] hover:text-[#0BB783]"
                    >
                      View
                    </Link>
                  </div>
                  <div className="h-0 w-full border-t-[1px] border-dashed border-[#323248] mt-2" />
                </div>
              );
            })
          ) : (
            <h4 className="text-white mt-[16px] text-center w-full">
              No Sub Users Assigned!
            </h4>
          )}
        </div>
      </Spin>
    </div>
  );
};
