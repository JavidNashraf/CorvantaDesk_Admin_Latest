import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { Sidebar, GeneralSettings } from "./sections";
import "./AddEditOrder.styles.scss";
import { createServerImage, findClientUser } from "lib";
import {
  getCategories,
  createOrder,
  getOrderTemplate,
  getOrderTemplates,
  getDepartments,
} from "store";
import { getOrderDetails } from "store";
import * as Yup from "yup";
import { useQuery } from "components/TicketDetails/sections/Details/Details.section";
import { Button } from "components";
import { GSsection } from "./sections/GeneralSettings/sub-sections";
import { AddProduct } from "./sections/GeneralSettings/sub-sections/sections/AddProduct.section";
import { getProductByID } from "store";
import { v4 as uuidv4 } from 'uuid';

const newOrderId = uuidv4();

const validationSchema = Yup.object().shape({
  assignedToClientId: Yup.string().required("Client is required"),
  billingCycle: Yup.string().required("Billing Cycle is required"),
  paymentType: Yup.string().required("Payment Type is required"),
  products: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      orderId: Yup.string().required(),
      productLineItems: Yup.array().of(Yup.object()).required(),
    })
  ).required(),
});

export const AddEditOrder = () => {

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.orders);
  const { products } =useSelector((state) => state?.products);
  const { clients, user } = useSelector((state) => state?.users);
  const { id } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const clientId = query.get("client");
  
  useEffect(() => {
    (async () => {
      await dispatch(getCategories());
      if (id) {
        dispatch(getOrderDetails(id));
      } 
      else if (!id) {
        dispatch(getOrderTemplate(null));
      }
      await dispatch(getDepartments());
      await dispatch(getOrderTemplates());
    })();
  }, []);

const orderID = products?.map((product) => ({
  id: product?.id,
}))
const nail = products?.[0]?.thumbnail

  const initialValue = {
    
    products: [
      {
        name: "",
        description: "",
        orderId: newOrderId,
        productLineItems: [],
      }
    ],
    adminAssigned: [],
    assignedToClientId: clientId,
    clientFullName: clientId ? findClientUser(clientId, clients)?.fullName : "",
    orderForClientId: "",
    tenant: "admin",
    notify: false
  }
  const [data, setData] = useState(initialValue)
  const [selected, setSelected] = useState('')
  // const { user } = useSelector((state) => state?.auth);

  return (
    <Formik
      initialValues={data}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values) => {
        values.orderForClientId = values?.assignedToClientId;
        values.clientFullName = findClientUser(values?.orderForClientId, clients)?.fullName;
        const img = await createServerImage(values.products.map((product) => ({
          id: product?.thumbnail
        })))   
        console.log(values) 
        // console.log(values, values?.products?.length > 0 && values?.products.map(prod => {if (prod.productLineItems?.length == 0) {return false } else return true})) 
        //values?.products?.length > 0 && values?.products.map(prod => {if (prod.productLineItems?.length == 0) {return false } else return true})[0] ? dispatch(createOrder({ data: values, navigate })) : null;
        
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
                      <Sidebar selected={selected} setSelected={setSelected} />
                    </div>
                    <div className="admin-details__right ">
                      <Button htmlType="button" type="ghost" className=" px-[32px] h-[52px] mt-[10px]" onClick={() => {
                        const newProduct = {
                          name: "",
                          description: "",                       
                          orderId: newOrderId,
                          productLineItems: [],
                        }
                        const productData = [...values?.products]
                        productData.splice(0, 0, newProduct);
                        setData({ ...data, products: productData })
                        setSelected('')
                      }
                      } >
                        Add Product
                      </Button>
                      <FieldArray name="products">
                        {({ insert, remove, push }) => (
                          <>
                            {values.products.length > 0 &&
                              values.products.map((product, index) => (
                                <Fragment key={index}>
                                  <AddProduct index={index} remove={remove} productListLength={values.products.length}/>
                                </Fragment>
                              ))}
                          </>
                        )}
                      </FieldArray>
                      <GeneralSettings />
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