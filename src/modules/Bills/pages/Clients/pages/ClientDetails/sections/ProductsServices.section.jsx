import { Spin } from "antd";
import { Table } from "components";
import { Next } from "icons";
import { checkModule } from "lib/checkModule";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductsByClientID } from "store";

// const PS = ({
//   title,
//   type,
//   desc,
//   img,
//   id,
//   // status = 'done',
// }) => {
//   return (
//     <div>
//       <div className="flex justify-between items-center">
//         <div className="flex gap-[16px] items-center">
//           {img ? (
//             <div className="w-[100px] h-[70px] text-white flex items-center justify-center">
//               <img
//                 src={img}
//                 alt="car"
//                 className="h-full w-full object-cover rounded-[8px]"
//               />
//             </div>
//           ) : (
//             <div className="w-[100px] border-2 rounded-[8px] border-blue-700 h-[70px] text-white flex items-center justify-center">
//               <p className="text-center">No Image Available</p>
//             </div>
//           )}
//           <div className="flex flex-col gap-[8px]">
//             <div className="flex gap-[12px] items-center">
//               <div className="text-white text-base text-[16px]">{title}</div>
//               <div
//                 className={`rounded-[4px] py-[4px] px-[8px] ${
//                   type === "Product"
//                     ? "bg-[#2F264F] text-[#8950FC]"
//                     : "bg-[#392F28] text-[#FFA800]"
//                 }`}
//               >
//                 {type}
//               </div>
//             </div>
//             <div className="text-[#474761]">{desc}</div>
//           </div>
//         </div>
//         <Link
//           to={`/admin/dashboard/billing/products-services/list/details/${id}`}
//         >
//           <div className="bg-[#323248] p-[8px] rounded-lg cursor-pointer">
//             <Next />
//           </div>
//         </Link>
//       </div>
//       <div className="h-0 w-full border-t-[1px] border-dashed border-[#323248] mt-[16px]" />
//     </div>
//   );
// };

export const ProductsServices = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await dispatch(getProductsByClientID({ clientId: id }));
    })();
  }, []);
  const { loading, products } = useSelector((state) => state?.products);
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Users",
    modules: userModules,
  });
  const { t } = useTranslation("/Bills/ns");

  const columns = [
    {
      title: "Product Image",
      dataIndex: "base64Image",
      key: "base64Image",
      render: (img) => {
        return (
          <>
            {img ? (
              <div className="w-[100px] h-[70px] text-white flex items-center justify-center">
                <img
                  src={img}
                  alt="car"
                  className="h-full w-full object-cover rounded-[8px]"
                />
              </div>
            ) : (
              <div className="w-[100px] border-2 rounded-[8px] border-blue-700 h-[70px] text-white flex items-center justify-center">
                <p className="text-center">No Image Available</p>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Product Details",
      dataIndex: "name",
      key: "name",
      render: (name) => {
        return (
          <div className="flex flex-col gap-[8px]">
            <div className="flex gap-[12px] items-center">
              <div className="text-white text-base text-[16px]">
                {name?.title}
              </div>
              <div
                className={`rounded-[4px] py-[4px] px-[8px] ${
                  name?.type === "Product"
                    ? "bg-[#2F264F] text-[#8950FC]"
                    : "bg-[#392F28] text-[#FFA800]"
                }`}
              >
                {name?.type}
              </div>
            </div>
            <div className="text-[#474761]">{name?.desc}</div>
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "orderId",
      key: "orderId",
      render: (id) => (
        <Link
          to={`/admin/dashboard/billing/orders/all-orders/list/edit/${id}`}
          onClick={(event) => event.stopPropagation()}
          className="text-[#3699FF] hover:text-[#0BB783]"
        >
          View Order
        </Link>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Link
          to={`/admin/dashboard/billing/products-services/list/details/${id}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="bg-[#323248] p-[8px] rounded-lg cursor-pointer flex items-center justify-center">
            <Next />
          </div>
        </Link>
      ),
    },
  ];

  const [data, setData] = useState([]);
  useEffect(() => {
    setData([]);
    if (products?.length) {
      const dataToSet = products?.map((b) => {
        return {
          ...b,
          name: {
            title: b?.name,
            desc: b?.description,
            type: "Product",
          },
          key: b?.id,
          id: b?.id,
        };
      });

      setData(dataToSet);
    }
  }, [products]);

  return (
    <div className="mt-4 p-[32px] bg-[#000000] rounded-lg">
      <Spin spinning={loading}>
        <h6 className="text-white mb-[32px] text-[16px]">Products/Services</h6>
        <div className="flex flex-col gap-[16px] justify-center">
          <Table
            columns={columns}
            rowKey={(record) => record?.id}
            data={data}
            emptyText="No Products Assigned"
            searchText="Search products here"
            loading={loading}
            hideActions
            permissions={permissions}
            t={t}
            btnData={{
              text: "Create Order",
              onClick: () =>
                navigate(
                  `/admin/dashboard/billing/orders/all-orders/list/add/new?client=${id}`
                ),
            }}
          />
        </div>
      </Spin>
    </div>
  );
};
