import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import moment from 'moment';
import { Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import {
  // Navigation,
  Sidebar,
  GeneralSettings,
  // AdvancedSettings,
} from "./sections";
import "./OTDetails.styles.scss";
import { createServerImage } from "lib";
import {
  getCategories,
  createOrderTemplate,
  getDepartments,
  getOrderTemplateByID,
} from "store";
import { editOrderTemplateByID } from "store";
import { getOrderTemplate } from "store";
// import { updateProductByID } from 'store';
// import { getClients } from 'store';

export const OTDetails = () => {
  // const [active, setActive] = useState('GENERAL SETTINGS');

  // const links = [
  //   { label: 'GENERAL SETTINGS', onClick: () => setActive('GENERAL SETTINGS') },
  //   {
  //     label: 'ADVANCED SETTINGS',
  //     onClick: () => setActive('ADVANCED SETTINGS'),
  //   },
  // ];

  const dispatch = useDispatch();
  const { loading, orderTemplate } = useSelector((state) => state?.orders);
  const categoriesLoading = useSelector((state) => state?.categories?.loading);
  const usersLoading = useSelector((state) => state?.users?.loading);
  const departmentsLoading = useSelector(
    (state) => state?.departments?.loading
  );

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      await dispatch(getCategories());
      if (id) {
        dispatch(getOrderTemplateByID(id));
      } else if (!id) {
        dispatch(getOrderTemplate(null));
      }
      await dispatch(getDepartments());
    })();
  }, []);

  const initVal = {
    preview: orderTemplate ? orderTemplate?.base64Image : "",
    adminNotes: orderTemplate?.adminNotes ? orderTemplate?.adminNotes : '',
    isActive: true,
    name: orderTemplate ? orderTemplate?.name : "",
    description: orderTemplate ? orderTemplate?.description : "",
    productName: orderTemplate ? orderTemplate?.productName : "",
    productDescription: orderTemplate ? orderTemplate?.productDescription : "",
    thumbnail: orderTemplate ? orderTemplate?.thumbnail : "",
    status: orderTemplate ? orderTemplate?.status : 0,
    orderTemplateCategories: orderTemplate
      ? orderTemplate?.orderTemplateCategories?.map(
        (category) => category?.categoryId
      )
      : [],
    orderTemplateDepartments: orderTemplate
      ? orderTemplate?.orderTemplateDepartments?.map(
        (department) => department?.departmentId
      )
      : [],
    orderTemplateLineItems: orderTemplate
      ? orderTemplate?.orderTemplateLineItems?.map((item) => ({
        ...item,
        isDeleted: item?.isDeleted || false,
      }))
      : [],
    tags: orderTemplate ? orderTemplate?.tags?.split(",") : [],
    paymentType: orderTemplate ? orderTemplate?.paymentType : 0,
    billingCycle: orderTemplate ? orderTemplate?.billingCycle : 0,
    notes: orderTemplate ? orderTemplate?.notes : "",
    tenant: "admin",
  };

  const navigate = useNavigate();
  return (
    <Formik
      initialValues={initVal}
      enableReinitialize
      onSubmit={async (values, { resetForm }) => {
        const img = await createServerImage(values.thumbnail);
        const newValues = {
          isActive: true,
          name: values.name,
          description: values.description,
          productName: values.productName,
          productDescription: values.productDescription,
          base64Image: img,
          orderNotes: values.orderNotes ? values.orderNotes : '',
          notes: values?.notes ? values?.notes : '',
          orderTemplateLineItems: values.orderTemplateLineItems?.map((item) => {
            if (id) {
              if (item?.isNew) {
                return {
                  lineItem: item?.lineItem,
                  isNew: true,
                  price: item?.price,
                  isDeleted: item?.isDeleted ? true : false,
                  priceType: Number(values?.paymentType),
                };
              } else {
                return {
                  id: item?.isNew ? "" : item?.id,
                  lineItem: item?.lineItem,
                  price: item?.price,
                  isDeleted: item?.isDeleted ? true : false,
                  priceType: Number(values?.paymentType),
                };
              }
            } else {
              if (item?.isNew) {
                return {
                  lineItem: item?.lineItem,
                  isNew: true,
                  price: item?.price,
                  isDeleted: item?.isDeleted ? true : false,
                  priceType: Number(values?.paymentType),
                };
              } else {
                return {
                  id: item?.isNew ? "" : item?.id,
                  lineItem: item?.lineItem,
                  price: item?.price,
                  isDeleted: item?.isDeleted ? true : false,
                  priceType: Number(values?.paymentType),
                };
              }
            }
          }),
          notes: `${values?.notes}`,
          paymentType: Number(values.paymentType),
          billingCycle: Number(values.billingCycle),
          tenant: values?.tenant,
        };
        if (id) {
          await dispatch(editOrderTemplateByID(id, newValues));
          resetForm();
          navigate("/admin/dashboard/billing/orders/order-templates/list");
        } else {
          await dispatch(createOrderTemplate({ data: newValues }));
          resetForm();
          navigate("/admin/dashboard/billing/orders/order-templates/list");
        }
      }}
    >
      {({ values }) => {
        return (
          <Form>
            <div className="users">
              <div className="admin-details min-w-[60vh]">
                {loading ||
                  categoriesLoading ||
                  usersLoading ||
                  departmentsLoading ? (
                  <Spin
                    size="large"
                    style={{ gridColumn: "1/3", alignSelf: "center" }}
                  />
                ) : (
                  <>
                    <div className="admin-details__left">
                      {/* THUMBNAIL + STATUS + PRODUCT DETAILS */}
                      <Sidebar />
                    </div>
                    <div className="admin-details__right">
                      {/* <Navigation active={active} links={links} /> */}
                      {/* {active === 'GENERAL SETTINGS' ? ( */}
                      <GeneralSettings />
                      {/* ) : ( */}
                      {/* <></> */}
                      {/* )} */}
                      {/* {active === 'ADVANCED SETTINGS' ? (
                        <AdvancedSettings />
                      ) : (
                        <></>
                      )} */}
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
