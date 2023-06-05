import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import moment from "moment";
import "../../../ProductsServices/pages/PSDetails/PSDetails.styles.scss";
import {
  EditAdminNote,
  GS,
  GSsection,
  LineItems,
  MulitpleAddAdmin,
  Note,
} from "./sections/GeneralSettings/sub-sections";
import { findClientUser } from "lib";
import { EditOrderSideBar } from "./sections/Sidebar/sub-sections/editOrderSideBar";
import { 
  getOrderDetails,
  editOrder, 
  getUsersByDepartmentID, 
  getClients
} from "store";
import { OrderNote } from "modules/Bills/pages/ProductsServices/pages/PSDetails/sections/GeneralSettings/sub-sections";
import { Button } from "components";

export const EditOrderDetails = () => {
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state?.products);
  const { loading, order } = useSelector((state) => state?.orders);
  const { settings } = useSelector((state) => state.appSettings);
  const { clients, user } = useSelector((state) => state?.users);
  const { id } = useParams();
  const [isOpenAddAdmin, setIsOpenAddAdmin] = useState([]);
  useEffect(() => {
    (async () => {
      await dispatch(getOrderDetails(id));
    })();
  }, []);

  useEffect(async () => {
    if (order){
      if (order?.clientFullName == null) {
        await dispatch(getClients())
      }
      if (order?.products[0]?.productDepartments) {
        order?.products[0]?.productDepartments?.forEach((dept) => {
          dispatch(getUsersByDepartmentID(dept?.departmentId));
        });
      }
    }
    
  }, [order]);

  const initVal = {
    preview: product?.base64Image,
    thumbnail: product?.thumbnail,
    status: order?.status,
    orderNo: `#${order?.orderNo}`,
    orderPrice: order?.status === 0 ? "Draft Order" : order?.totalPrice,
    adminAssigned: order?.adminAssigned,
    name: order?.products[0]?.name,
    notes: order?.notes ? order?.notes : "",
    orderNotes: order?.orderNotes,
    description: order?.products[0]?.description,
    productLineItems: order?.orderProductLineItems?.map((item) => ({
      ...item,
      isDeleted: item?.isDeleted || false,
    })),
    assignedToClient: findClientUser(order?.clientId, clients)?.fullName,
    createdOn: moment(order?.createdOn).format(settings?.dateFormat),
    modifiedOn: moment(order?.lastModifiedOn).format(settings?.dateFormat),
  };
  return (
    <Formik
      initialValues={initVal}
      enableReinitialize
      onSubmit={async (values) => {

        var assigned = [];
        order.adminUserInfos.map((data, index) => {
          assigned.push(data.adminAssigned);
        });

        const newValues = {
          status: Number(values?.status),
          adminAssignedId:
            values.adminAssigned === undefined
              ? assigned
              : values.adminAssigned,
          notes: values?.notes,
          orderNotes: values?.orderNotes,
        };
        await dispatch(editOrder(id, newValues));
      }}
    >
      {({ values }) => {
        return (
          <Form>
            <div className="users">
              <div className="admin-details min-w-[60vh]">
                {loading ? (
                  <Spin
                    size="large"
                    style={{ gridColumn: "1/3", alignSelf: "center" }}
                  />
                ) : (
                  <>
                    <div className="admin-details__left">
                      <EditOrderSideBar />
                    </div>
                    <div className="admin-details__right">
                      <GSsection
                        isView
                        actionLink={[
                          {
                            link: order?.bill?.id
                              ? `/admin/dashboard/billing/invoices/list/details/${order?.bill?.id}`
                              : "#",
                            text: "View Invoice",
                          },
                        ]}
                      />
                      <LineItems isView />
                      <Button
                        className="h-[52px] mt-[32px] text-white "
                        onClick={() =>
                          setIsOpenAddAdmin([
                            ...isOpenAddAdmin,
                            isOpenAddAdmin.length,
                          ])
                        }
                      >
                        Admin Notes
                      </Button>
                      {Array.isArray(isOpenAddAdmin) &&
                      isOpenAddAdmin.length > 0
                        ? isOpenAddAdmin.map((loopCount, index) => {
                            return (
                              <Fragment key={index}>
                                <MulitpleAddAdmin />
                              </Fragment>
                            );
                          })
                        : ""}
                      <EditAdminNote />
                      <OrderNote />
                      <Button
                        type="ghost"
                        className="h-[52px] mt-[32px]"
                        htmlType="submit"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
