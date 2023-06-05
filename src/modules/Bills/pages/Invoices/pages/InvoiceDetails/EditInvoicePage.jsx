import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "components";
import { Input } from "components";
import { getInvoiceById } from "store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBrandById } from "store";
import { useNavigate } from "react-router-dom";
import { getClients } from "store";
import { getProducts } from "store";
import { updateInvoice } from "store";

export const EditInvoicePage = (props) => {
  const { invoice } = useSelector((state) => state?.invoices);
  const { products } = useSelector((state) => state?.products);
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state?.users);
  const { id } = useParams();
  const { brand } = useSelector((state) => state?.brands);

  var date = new Date(invoice?.createdOn);
  const format = date.toISOString().substring(0, 10);

  const initialValues = {
    fullName: "",
    status: "",
    invoiceDate: "",
    dueDate: "",
    billingAddress: "",
    billingEmail: "",
    phoneNumber: "",
    brandName: "",
    brandAddress: "",
    product: "",
    productId: "",
    price: "",
  };

  let usersData = [{ label: "Any", value: "" }];
  if (clients?.length) {
    clients?.forEach((client) => {
      usersData.push({
        id: client?.id,
        value: client?.fullName,
        label: client?.fullName ? `${client.fullName}` : "N/A",
      });
    });
  }

  let productsData = [{ label: "Any", value: "" }];
  if (products?.length) {
    products?.forEach((product) => {
      productsData.push({
        id: product?.id,
        value: product?.name,
        label: product?.name ? `${product.name}` : "N/A",
      });
    });
  }

  var Duedate = new Date(invoice?.dueDate);
  const duedate = Duedate.toISOString().substring(0, 10);

  const status = () => {
    if (invoice?.status === 0) {
      return "Draft";
    } else if (invoice?.status === 1) {
      return "Pending";
    } else if (invoice?.status === 2) {
      return "Paid";
    } else if (invoice?.status === 3) {
      return "Processing";
    } else if (invoice?.status === 4) {
      return "Completed";
    } else if (invoice?.status === 5) {
      return "Accepted";
    } else if (invoice?.status === 6) {
      return "Canceled";
    }
  };

  useEffect(() => {
    dispatch(getInvoiceById(id));
    dispatch(getBrandById(invoice?.user?.brandId));
    dispatch(getClients());
    dispatch(getProducts());
  }, []);
  const { isLoading } = props;
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const fields = [
    {
      name: "Invoice Date",
      label: `Invoice Date`,
      placeholder: format,
    },
    {
      name: "due date",
      label: `Due Date`,
      placeholder: duedate,
    },
    {
      name: "Status",
      label: "Status",
      type: "select",
      placeholder: status(),
      options: [
        { label: "Any", value: "" },
        { label: "Draft", value: 0 },
        { label: "Pending", value: 1 },
        { label: "Paid", value: 2 },
        { label: "Processing", value: 3 },
        { label: "Accepted", value: 4 },
        { label: "Completed", value: 5 },
        { label: "Canceled", value: 6 },
      ],
    },
  ];
  const CustomerField = [
    {
      name: "client name",
      label: "Client Name",
      placeholder: invoice?.user?.fullName,
    },
    {
      name: "billing address",
      label: "Billing Address",
      placeholder: invoice?.user?.address1,
      disabled: true,
    },
    {
      name: "billing email",
      label: "Billing Email",
      type: "text",
      placeholder: invoice?.user?.email,
    },
    {
      name: "phone number",
      label: "Phone Number",
      type: "text",
      placeholder: invoice?.user?.phoneNumber,
    },
  ];
  const BrandField = [
    {
      name: "brandname",
      label: "Brand Name",
      type: "text",
      placeholder: brand?.name,
    },
    {
      name: "brandaddress",
      label: "Brand Address",
      type: "text",
      placeholder: brand?.address,
    },
  ];

  const ProductField = [
    {
      name: "product",
      label: "Product",
      type: "select",
      placeholder: "Search Product...",
      options: productsData,
    },
    {
      name: "price",
      label: "Price",
      type: "text",
      placeholder: "Enter Price...",
    },
  ];
  const [addProductList, setAddProductList] = useState([]);
  const addProductHandler = () => {
    const { productId, price } = initialValues;
    let selectedProduct = products?.filter(
      (data) => data.id === productId
    )?.[0];
    const addProduct = { ...selectedProduct, price };
    setAddProductList([...addProductList, addProduct]);
  };

  return (
    <div className=" bg-[#000000] p-5 my-5  rounded-md">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const finalObject = {
            products: [...addProductList],
            adminAssignedId: [invoice.id],
            orderForClientId: invoice.clientId,
            customerIP: "121231",
            status: values?.Status ? Number(values?.Status) : invoice?.status,
            notes: values?.message,
            clientName: values?.fullName,
            billingAddress: values?.brandAddress,
            billingEmail: values?.billingEmail,
            phoneNumber: values?.phoneNumber,
            tenant: invoice.tenant,
          };
          dispatch(updateInvoice(invoice?.orderId, finalObject));
        }}
        enableReinitialize
      >
        <Form>
          <h4 className="text-white font-medium text-md mt-4 ml-1 mb-5 text-[24px]  text-left">
            Invoice Details
          </h4>
          <div className="grid grid-cols-2 gap-[40px] mb-[32px] items-end">
            {fields.map((field) => (
              <div className="flex items-end" key={field?.name}>
                <Input
                  key={field.name}
                  name={field.name}
                  label={field?.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  disabled={field?.name !== "Status"}
                  options={field.options}
                  min={field?.min}
                  max={field?.max}
                  customOnChange={(e) => {
                    initialValues[e.target.name] = e.target.value;
                  }}
                />
              </div>
            ))}
          </div>
          <hr className="border-t-[#92928f] border-dashed custom-card__divider" />
          <h4 className="text-white font-medium text-md mt-4 ml-1 mb-5 text-[24px]  text-left">
            Customer Information
          </h4>
          <div className="grid grid-cols-2 gap-[40px] mt-[40px] items-end">
            {CustomerField.map((field) => (
              <div className="flex items-end" key={field?.name}>
                <Input
                  key={field.name}
                  name={field.name}
                  label={field?.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  disabled={true}
                  options={field.options}
                  min={field?.min}
                  max={field?.max}
                  customOnChange={(e) => {
                    initialValues[e.target.name] = e.target.value;
                  }}
                />
              </div>
            ))}
          </div>
          <hr className="border-t-[#92928f] mt-5 border-dashed custom-card__divider" />
          <h4 className="text-white font-medium text-md mt-4 ml-1 mb-5 text-[24px]  text-left">
            Brand Information
          </h4>
          <div className="grid grid-cols-2 gap-[40px] mt-[40px] items-end">
            {BrandField.map((field) => (
              <div className="flex items-end" key={field?.name}>
                <Input
                  key={field.name}
                  name={field.name}
                  label={field?.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  disabled={true}
                  options={field.options}
                  min={field?.min}
                  max={field?.max}
                  customOnChange={(e) => {
                    initialValues[e.target.name] = e.target.value;
                  }}
                />
              </div>
            ))}
          </div>
          <hr className="border-t-[#92928f] mt-5 border-dashed custom-card__divider" />
          <h4 className="text-white font-medium text-md mt-4 ml-1 mb-5 text-[24px]  text-left">
            Products & Items
          </h4>
          <div className="grid grid-cols-3 gap-[40px] mt-[40px] items-end">
            {ProductField.map((field) => (
              <div className="flex items-end" key={field?.name}>
                <Input
                  key={field.name}
                  name={field.name}
                  label={field?.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  disabled={true}
                  options={field.options}
                  min={field?.min}
                  max={field?.max}
                  customOnChange={(e) => {
                    if (e.target.name === "product") {
                      initialValues["productId"] =
                        e.target.selectedOptions[0].id;
                      initialValues[e.target.name] = e.target.value;
                    } else {
                      initialValues[e.target.name] = e.target.value;
                    }
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-5">
            {invoice?.products &&
            Array.isArray(invoice.products) &&
            invoice.products.length > 0
              ? invoice?.products.map((product) => {
                  return (
                    <div className="w-full bg-[#323248] rounded-[8px] text-white grid grid-cols-2 gap-[20px] mb-[35px] p-[20px]">
                      <h6 className="text-[#fff] text-[14px] text-left">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#494B74] mr-[5px] mt-4"></span>
                        {product?.name}
                      </h6>
                      <div className="text-right">
                        <h4 className="text-[#fff] text-[14px]">
                          {`$ ${
                            invoice?.orderProductLineItems &&
                            Array.isArray(invoice?.orderProductLineItems) &&
                            invoice?.orderProductLineItems?.length > 0
                              ? invoice.orderProductLineItems
                                  .filter(
                                    (data) => data?.productId === product?.id
                                  )
                                  .reduce((total, num) => {
                                    return total + num?.price;
                                  }, 0)
                              : null
                          }`}

                          <button
                            htmlType="submit"
                            className="bg-[#272738] h-[52px] p-[15px] border-none rounded-[8px] ml-[20px]"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              "Searching..."
                            ) : (
                              <img
                                src="/img/vuesax-bulk-close-circle.svg"
                                alt="close-icon"
                              />
                            )}
                          </button>
                        </h4>
                      </div>
                      <div className="w-[204%] bg-[#000000] rounded-[8px] p-[20px]">
                        {invoice?.orderProductLineItems &&
                        Array.isArray(invoice?.orderProductLineItems) &&
                        invoice?.orderProductLineItems?.length > 0
                          ? invoice.orderProductLineItems
                              .filter((data) => data?.productId === product?.id)
                              .map((productLineItem) => {
                                return (
                                  <>
                                    <h4 className=" text-left text-[#92928F]">
                                      {productLineItem?.lineItem}
                                    </h4>
                                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                                  </>
                                );
                              })
                          : null}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="mt-5">
            <div className="flex gap-[20px]">
              <div className="text-left p-[3px] text-[24px] text-[#494B74] ">
                <span className="w-[10px] h-[10px] mr-[5px] mt-4">
                  Sub Total
                </span>
                <div className="text-[14px] text-[#FFFFFF] ml-[5px]">
                  ${invoice?.subTotal}
                </div>
              </div>
              <div className="text-left px-[10px] text-[24px] text-[#494B74] border-dashed border-x-[1px] border-[#323248]">
                <span className="w-[10px] h-[10px] mr-[5px] mt-4">Vat</span>
                <div className="text-[14px] text-[#FFFFFF] ml-[5px]">
                  ${invoice?.vat}
                </div>
              </div>
              <div className="text-left px-[10px] text-[24px] text-[#494B74]">
                <span className="w-[10px] h-[10px] mr-[5px] mt-4">
                  Total Value
                </span>
                <div className="text-[14px] text-[#0BB783] ml-[5px]">
                  ${invoice?.totalPrice}
                </div>
              </div>
            </div>
            <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
            <div>
              <h4 className="text-[#fff] text-[24px] text-left mb-4 ml-[3px] ">
                Notes
              </h4>

              <div className="grid grid-cols-2 gap-[20px] mb-[32px]">
                <Input
                  name="message"
                  placeholder={invoice?.notes}
                  type="textarea"
                  rows={5}
                  className="flex w-[980px]"
                />
              </div>
            </div>
            <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
            <div>
              <div className="flex gap-[20px] ">
                <Button
                  htmlType="submit"
                  className="bg-[#212E48] text-[#3699FF] h-[52px] p-8 py-2 border-none rounded-[8px]"
                  disabled={isLoading}
                  onClick={async (values) => {}}
                >
                  {isLoading ? "Searching..." : "Save Changes"}
                </Button>
                <button
                  htmlType="submit"
                  className="bg-[#212E48] text-[#3699FF] h-[52px] p-8 py-2 border-none rounded-[8px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
