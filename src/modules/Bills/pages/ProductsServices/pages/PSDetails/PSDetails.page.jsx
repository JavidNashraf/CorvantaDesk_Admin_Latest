import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { Form, Formik } from "formik";

import { getProductByID } from "store";
import {
  Navigation,
  Sidebar,
  GeneralSettings,
  AdvancedSettings,
} from "./sections";
import { ModuleActions } from "./sections/ModuleActions/Component";
import "./PSDetails.styles.scss";
// import { createServerImage } from "lib";
import { getCategories } from "store";
import { updateProductByID } from "store";
import { getClients } from "store";
import { getDepartments } from "store";
import { createServerImage } from "lib";

export const PSDetails = () => {
  const [active, setActive] = useState("GENERAL SETTINGS");
  const [hideModuleActions, setHideModuleActions] = useState(true);
  const links = [
    { label: "GENERAL SETTINGS", onClick: () => setActive("GENERAL SETTINGS") },
    {
      label: "ADVANCED SETTINGS",
      onClick: () => setActive("ADVANCED SETTINGS"),
    },
  ];

  const moduleSettings =     {
    label: "MODULE ACTIONS",
    onClick: () => setActive("MODULE ACTIONS"),
  }

  const dispatch = useDispatch();
  const { loading, product } = useSelector((state) => state?.products);
  const categoriesLoading = useSelector((state) => state?.categories?.loading);
  const usersLoading = useSelector((state) => state?.users?.loading);
  const departmentsLoading = useSelector(
    (state) => state?.departments?.loading
  );

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      await dispatch(getCategories());
      await dispatch(getProductByID(id));
      await dispatch(getClients());
      await dispatch(getDepartments());
    })();
  }, []);

  useEffect(() => {
    if (product?.moduleName !== null) {
      setHideModuleActions(false);
    }else{
      setHideModuleActions(true);
    }
  }, [product]);

  const initVal = {
    preview: "data:image/png;base64," + product?.base64Image,
    thumbnail: product?.thumbnail,
    status: product?.status,
    productDepartments: product?.productDepartments?.map(
      (department) => department?.departmentId
    ),
    productCategories: product?.productCategories?.map(
      (category) => category?.categoryId
    ),
    tags: product?.tags?.split(","),
    name: product?.name,
    description: product?.description,
    // descriptionHolder: convertHTMLToDraftState(product?.headerContent),
    productLineItems: product?.productLineItems?.map((item) => ({
      ...item,
      isDeleted: item?.isDeleted || false,
    })),
    notes: product?.notes,
    paymentType: product?.paymentType,
    registrationDate: moment(product?.registrationDate),
    nextDueDate: moment(product?.nextDueDate),
    terminationDate:
      product?.terminationDate?.split("-")[0] !== "0001"
        ? moment(product?.terminationDate)
        : null,
    overrideTerminationDate:
      product?.overrideTerminationDate?.split("-")[0] !== "0001"
        ? moment(product?.overrideTerminationDate)
        : null,
    overrideSuspensionDate:
      product?.overrideSuspensionDate?.split("-")[0] !== "0001"
        ? moment(product?.overrideSuspensionDate)
        : null,
    assignedToClientId: product?.assignedToClientId,
    billingCycle: product?.billingCycle,
    dedicatedIP: product?.dedicatedIP,
  };

  // console.log("product", product);
  return (
    <Formik
      initialValues={initVal}
      enableReinitialize
      onSubmit={async (values) => {
        // console.log(values);
        const img = await createServerImage(values.thumbnail);
        const newValues = {
          thumbnail: img,
          status: Number(values?.status),
          // productCategories: values?.productCategories?.map((item) => ({
          //   categoryId: item,
          // })),
          // productDepartments: values?.productDepartments?.map((item) => ({
          //   departmentId: item,
          // })),
          // productCategories: null,
          // productDepartments: null,
          assignedToClientId: values?.assignedToClientId,
          dedicatedIP: values?.dedicatedIP,
          paymentType: Number(values?.paymentType),
          billingCycle: Number(values?.billingCycle),
          tags: null,
          name: values?.name,
          description: values?.description,
          productLineItems: values?.productLineItems?.map((item) => ({
            id: item?.id,
            lineItem: item?.lineItem,
            price: item?.price,
            isDeleted: item?.isDeleted,
            priceType: item?.priceType,
          })),
          notes: values?.notes,
          registrationDate: values?.registrationDate
            ? values?.registrationDate?.toISOString()
            : null,
          nextDueDate: values?.nextDueDate
            ? values?.nextDueDate?.toISOString()
            : null,
          terminationDate: values?.terminationDate
            ? values?.terminationDate?.toISOString()
            : null,
          overrideSuspensionDate: values?.overrideSuspensionDate
            ? values?.overrideSuspensionDate?.toISOString()
            : null,
          overrideTerminationDate: values?.overrideTerminationDate
            ? values?.overrideTerminationDate?.toISOString()
            : null,
        };
        // console.log("here", newValues);
        await dispatch(updateProductByID(id, newValues));
        // console.log(newValues);
      }}
    >
      {({ values }) => {
        // console.log("Form values", values);
        return (
          <Form>
            <div className="users">
              <div className="admin-details min-w-[60vh]">
                {loading ||
                categoriesLoading ||
                usersLoading ||
                departmentsLoading ||
                product === null ? (
                  <Spin
                    size="large"
                    style={{ gridColumn: "1/3", alignSelf: "center" }}
                  />
                ) : (
                  <>
                    <div className="admin-details__left">
                      {/* THUMBNAIL + STATUS + PRODUCT DETAILS */}
                      <Sidebar defaulValue={product?.assignedClient} />
                    </div>
                    <div className="admin-details__right">
                      <Navigation
                        active={active}
                        links={links}
                        hideModule={hideModuleActions}
                        moduleSettings={moduleSettings}
                        actionLink={[
                          {
                            link: product?.orderId
                              ? `/admin/dashboard/billing/orders/all-orders/list/edit/${product?.orderId}`
                              : "#",
                            text: "View Order",
                          },
                          // {
                          //   link: product?.invoiceId
                          //     ? `/admin/dashboard/billing/orders/all-orders/list/edit/${product?.invoiceId}`
                          //     : "#",
                          //   text: "View Invoice",
                          // },
                        ]}
                      />
                      {active === "GENERAL SETTINGS" ? (
                        <GeneralSettings />
                      ) : (
                        <></>
                      )}
                      {active === "ADVANCED SETTINGS" ? (
                        <AdvancedSettings
                          product={product}
                         />
                      ) : (
                        <></>
                      )}
                      {active === "MODULE ACTIONS" ? (
                        <ModuleActions product={product} />
                      ) : (
                        <></>
                      )}
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
