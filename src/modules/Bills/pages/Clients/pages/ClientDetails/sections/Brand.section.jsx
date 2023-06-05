import { Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBrands } from "store";

export const Brands = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getBrands());
    })();
  }, [dispatch]);
  const { user } = useSelector((state) => state?.users);
  const { brands, loading } = useSelector((state) => state.brands);

  const userBrands = brands?.filter((brand) => brand?.id === user?.brandId);

  return (
    <div className="bg-[#000000] rounded-lg admin-details__user-card px-8">
      <Spin spinning={loading}>
        <h6 className="text-white text-[16px] mb-8">Brands</h6>
        <div className="flex flex-col gap-4">
          {userBrands?.length ? (
            userBrands.map(({ name, companyName, base64Image, id }, index) => {
              let newName = "";
              let userN = name.split(" ");
              if (userN.length < 2) {
                newName = userN[0].charAt(0);
              } else {
                newName = userN[0].charAt(0) + userN[1].charAt(0);
              }
              return (
                <div className="flex flex-col gap-1" key={index}>
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      {base64Image ? (
                        <img
                          src={base64Image}
                          alt={name}
                          className="h-full w-[40px] rounded-[5px] object-cover text-[8px]"
                        />
                      ) : (
                        <div className="bg-[#1C3238] px-[8px] py-[4px] uppercase w-[40px] h-[40px] rounded-[4px] flex justify-center items-center text-white">
                          {newName}
                        </div>
                      )}

                      <div className="">
                        <div className="text-white text-sm">{name}</div>
                        <div className="text-[#92928F] text-sm">
                          {companyName}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/admin/dashboard/settings/brands?brandId=${id}`}
                      className="text-[#3699FF] hover:text-[#0BB783]"
                    >
                      View Brand
                    </Link>
                  </div>
                  <div className="h-0 w-full border-t-[1px] border-dashed border-[#323248] mt-2" />
                </div>
              );
            })
          ) : (
            <h4 className="text-white mt-[16px] text-center w-full">
              No Brands Assigned!
            </h4>
          )}
        </div>
      </Spin>
    </div>
  );
};
