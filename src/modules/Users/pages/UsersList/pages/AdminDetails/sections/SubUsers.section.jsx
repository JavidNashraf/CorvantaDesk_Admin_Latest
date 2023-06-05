import { Spin } from 'antd';
import UserName from 'layout/components/navbar/UserProfileCard/UserName';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const SubUsers = () => {
  const { t } = useTranslation('/Users/ns');
  const [imgError, setImgError] = useState(false);

  const { loading, users, clients } = useSelector((state) => state?.users);
  const allUsers = [...users, ...clients];

  const { id } = useParams();
  const subUsers = allUsers?.filter((user) => user?.parentID === id);

  return (
    <div className="bg-[#000000] rounded-lg admin-details__user-card px-8">
      <Spin spinning={loading}>
        <h6 className="text-white text-[16px] mb-8">{t('Sub Users')}</h6>
        <div className="flex flex-col gap-4">
          {subUsers?.length ? (
            subUsers.map(({ fullName, email, base64Image }, index) => {
              return (
                <div className="flex flex-col gap-1" key={index}>
                  <div className="flex gap-3 items-center">
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
                  <div className="h-0 w-full border-t-[1px] border-dashed border-[#323248] mt-4" />
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
