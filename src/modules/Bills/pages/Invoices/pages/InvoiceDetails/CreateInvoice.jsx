import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "components";
import { Input } from "components";
import { createInvoice } from "store";
import { getClients } from "store";
import { useState, useEffect, useMemo } from "react";
import { getProducts } from "store";
import { getBrandById } from "store";
import { useNavigate } from "react-router-dom";

export const CreateInvoicePage = (props) => {
  const { products } = useSelector((state) => state?.products);
  const { brand } = useSelector((state) => state?.brands);
  const { clients } = useSelector((state) => state?.users);
  const [addProductList, setAddProductList] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [vatTotal, setVatTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));

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

  const filtered = useMemo(() => {
    const clientList = clients?.filter((client) => client?.isDeleted === false);
    return clientList?.filter(
      (client) => !client.parentID && client.fullName != null
    );
  }, [clients]);

  let usersData = [];
  let usersData1 = "";
  const [clientaddress, setClientaddress] = useState({
    address: "",
  });
  const [clientemail, setClientemail] = useState({
    email: "",
  });
  const [clientphone, setClientphone] = useState({
    phoneNumber: "",
  });
  const [clientBrand, setClientBrand] = useState({
    brandsId: "",
  });

  if (filtered?.length) {
    filtered?.forEach((client) => {
      usersData.push({
        id: client?.id,
        value: client?.fullName,
        label: client?.fullName,

        address1: client?.address1 ? `${client.address1}` : "N/A",
        email: client?.email ? `${client.email}` : "N/A",
        phoneNumber: client?.phoneNumber ? `${client.phoneNumber}` : "N/A",
        brandId: client?.brandId,
      });
    });
  }

  let productsData = [];
  if (products?.length) {
    products?.forEach((product) => {
      productsData.push({
        id: product?.id,
        value: product?.name,
        label: product?.name ? `${product.name}` : "N/A",
      });
    });
  }
  // const { isLoading } = props;

  useEffect(() => {
    dispatch(getClients());
    dispatch(getProducts());
  }, []);
  const fields = [
    {
      name: "invoiceDate",
      label: "Invoice Date",
      type: "date",
      placeholder: "Select Date...",
    },
    {
      name: "dueDate",
      label: "Due Date",
      type: "date",
      placeholder: "Select Date...",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
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
      name: "fullName",
      label: "Client Name",
      type: "select",
      options: usersData,
    },
    {
      name: "billingAddress",
      label: "Billing Address",
      placeholder: clientaddress?.address,
      value: clientaddress?.address,
      disabled: true,
    },
    {
      name: "billingEmail",
      label: "Billing Email",
      type: "text",
      placeholder: clientemail?.email,
      value: clientemail?.email,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: clientphone?.phoneNumber,
      value: clientphone?.phoneNumber,
    },
  ];
  const BrandField = [
    {
      name: "brandName",
      label: "Brand Name",
      placeholder: brand?.name ? `${brand?.name}` : "N/A",
      value: brand?.name,
    },
    {
      name: "brandAddress",
      label: "Brand Address",
      placeholder: brand?.address ? `${brand?.address}` : "N/A",
      value: brand?.address,
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
      type: "number",
      placeholder: "Enter Price...",
    },
  ];

  const addProductHandler = () => {
    const { productId, price } = initialValues;
    let selectedProduct = products?.filter(
      (data) => data.id === productId
    )?.[0];

    const addProduct = { ...selectedProduct, price };
    setAddProductList([...addProductList, addProduct]);
    setSubTotal(Number(subTotal) + Number(price));
    setVatTotal(
      Number(vatTotal) +
        (selectedProduct?.vat ? Number(selectedProduct.vat) : 0)
    );
  };

  const deleteProductHandler = (id) => {
    let productList = [...addProductList];
    let index = productList?.findIndex((data) => data.id === id);
    let price = productList?.[index]?.price;
    let vat = productList?.[index]?.vat;
    productList.splice(index, 1);
    setAddProductList(productList);
    setSubTotal(Number(subTotal) - Number(price));
    setVatTotal(Number(vatTotal) - (vat ? Number(vat) : 0));
  };

  return (
    <div className=" bg-[#000000] p-5 my-5 mx-5  rounded-md">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          setIsLoading(true);
          const finalObject = {
            products: [...addProductList],
            adminAssigned: [currentUser.id],
            orderForClientId: selectedClient.id,
            customerIP: "",
            orderStatus: Number(values?.status),
            notes: values?.message,
            clientName: values?.fullName,
            billingAddress: values?.brandAddress,
            billingEmail: values?.billingEmail,
            phoneNumber: values?.phoneNumber,
            tenant: "Admin",
          };
          dispatch(createInvoice(finalObject));
          setIsLoading(false);
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
                  options={field.options}
                  min={field?.min}
                  disabled={field?.name !== "fullName"}
                  max={field?.max}
                  customOnChange={(e) => {
                    field?.options?.forEach((clientData) => {
                      if (e.target.selectedOptions[0].id === clientData.id) {
                        setSelectedClient(clientData);
                        dispatch(getBrandById(clientData.brandId));
                        setClientaddress({ address: clientData?.address1 });
                        setClientemail({ email: clientData?.email });
                        setClientphone({
                          phoneNumber: clientData?.phoneNumber,
                        });
                      }
                    });
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
                  options={field.options}
                  min={field?.min}
                  max={field?.max}
                  disabled={true}
                  customOnChange={(e) => {}}
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
            <Button
              htmlType="button"
              type="ghost"
              className="  col-6 px-[32px] h-[52px]"
              onClick={() => addProductHandler()}
            >
              Add Product
            </Button>
          </div>
          <div className="mt-5">
            {Array.isArray(addProductList) && addProductList.length > 0
              ? addProductList.map((product) => {
                  return (
                    <div className="w-full bg-[#323248] rounded-[8px] text-white grid grid-cols-2 gap-[20px] mb-[35px] p-[20px]">
                      <h6 className="text-[#fff] text-[14px] text-left">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#494B74] mr-[5px] mt-4"></span>
                        {product?.name}
                      </h6>
                      <div className="text-right">
                        <h4 className="text-[#fff] text-[14px]">
                          {`$ ${product?.price}`}
                          <button
                            type="button"
                            onClick={() => deleteProductHandler(product?.id)}
                            className="bg-[#272738] h-[52px] p-[15px] border-none rounded-[8px] ml-[20px]"
                          >
                            {
                              <img
                                src="/img/vuesax-bulk-close-circle.svg"
                                alt="close-icon"
                              />
                            }
                          </button>
                        </h4>
                      </div>
                      <div className="w-[204%] bg-[#000000] rounded-[8px] p-[20px]">
                        {product?.productLineItems &&
                        Array.isArray(product?.productLineItems) &&
                        product?.productLineItems?.length > 0
                          ? product.productLineItems.map((productLineItem) => {
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
                  ${subTotal.toFixed(2)}
                </div>
              </div>
              <div className="text-left px-[10px] text-[24px] text-[#494B74] border-dashed border-x-[1px] border-[#323248]">
                <span className="w-[10px] h-[10px] mr-[5px] mt-4">Vat</span>
                <div className="text-[14px] text-[#FFFFFF] ml-[5px]">
                  ${vatTotal.toFixed(2)}
                </div>
              </div>
              <div className="text-left px-[10px] text-[24px] text-[#494B74]">
                <span className="w-[10px] h-[10px] mr-[5px] mt-4">
                  Total Value
                </span>
                <div className="text-[14px] text-[#0BB783] ml-[5px]">
                  ${(subTotal + vatTotal).toFixed(2)}
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
                  placeholder="Enter Reason"
                  type="textarea"
                  rows={5}
                  className="flex w-[1070px]"
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
                  onClick={async () => {}}
                >
                  {isLoading ? "Searching..." : "Create Invoice"}
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
