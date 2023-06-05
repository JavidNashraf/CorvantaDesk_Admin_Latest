import "./InvoiceDetails.styles.scss";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { getInvoiceById } from "store";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import moment from "moment";
import { statusList } from "lib";
import { InvoiceTab } from "../Invoicetab";
import { AddCredit } from "modules/Bills/pages/Clients/pages/ClientDetails/sections/AddCredit.section";

export const InvoiceDetails = () => {
  const { t } = useTranslation("/Bills/ns");
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(getInvoiceById(id));
    })();
  }, [dispatch]);
  const { loading, invoice } = useSelector((state) => state?.invoices);

  return (
    <div className="text-center  ">
  
      {loading || invoice === null ? (
        <Spin size="large" style={{ gridColumn: "1/3", alignSelf: "center" }} />
      ) : (
        <div className="bg-[#000000] mt-4 rounded-lg text-left">
          <div className="users invoice-details">
            <div className="invoice-Details__left">
              <div className="flex items-center justify-between">
                <h4 className="text-white text-[24px]">{invoice?.billNo}</h4>
                {/* <button className="bg-[#0BB783] rounded-[8px] px-[16px] py-[8px] text-[#fff] mb-0">
                  {t("payNow")}
                </button> */}
              </div>
              <div className="mt-[40px]">
                <h6 className="text-[#474761] text-[14px]">{t("issueDate")}</h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">
                  {moment(invoice?.createdOn).format(localStorage.getItem('dateFormat'))}
                </p>
              </div>
              <div className="mt-[20px]">
                <h6 className="text-[#474761] text-[14px]">{t("dueDate")}</h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">
                  {moment(invoice?.dueDate).format(localStorage.getItem('dateFormat'))}
                  {moment(invoice?.dueDate).isSame(new Date(), "day")}{" "}
                  {moment(invoice?.dueDate).isSame(new Date(), "day") ? (
                    <span className="text-[#F64E60] inline-block">
                      Due Today
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
              <div className="column " style={{ float: 'right',marginTop:"20px",}}>
                <div className="container ">
                  <div className="ml-[15px] mr-[10px] ">
                    {/* <img src="/icon/logo.svg" alt="logo" className="h-[50px]" /> */}
                  </div>
                  <div className="text-[white] text-[24px] ">Company Name</div>
                </div>
                <div className="text-[#3699FF] p-[0] container" style={{ float: 'right' }}>companyName</div>
                </div>
              <div className="mt-[20px]">
                <h6 className="text-[#474761] text-[14px]">{t("issuedFor")}</h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">
                  {invoice?.issuedFor || "---"}
                </p>
              </div>
              <div className="mt-[20px]">
                <h6 className="text-[#474761] text-[14px]">{t("issuedBy")}</h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">
                  {invoice?.issuedBy || "---"}
                </p>
              </div>
              <div className="mt-[40px]">
                <div className="flex items-center justify-between">
                  <h6 className="text-[#474761] text-[12px] uppercase">
                    {t("description")}
                  </h6>
                  <h6 className="text-[#474761] text-[12px] uppercase">
                    {t("amount")}
                  </h6>
                </div>
                <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                {invoice?.orderProductLineItems?.map((data, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <h6 className="text-[#fff] text-[14px]">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#F64E60] mr-[5px]"></span>
                        {data?.lineItem}
                      </h6>
                      <h6 className="text-[#fff] text-[14px]">
                        ${data?.price}
                      </h6>
                    </div>
                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <h6 className="text-[#fff] text-[14px]">
                    <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                    {t("subTotal")}
                  </h6>
                  <h6 className="text-[#fff] text-[14px]">
                    ${invoice?.subTotal}
                  </h6>
                </div>
                <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                <div className="flex items-center justify-between">
                  <h6 className="text-[#fff] text-[14px]">
                    <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                    {t("vat")}
                  </h6>
                  <h6 className="text-[#fff] text-[14px]">${invoice?.vat}</h6>
                </div>
                <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                <div className="flex items-center justify-between">
                  <h6 className="text-[#fff] text-[14px]">
                    <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                    {t("Total")}
                  </h6>
                  <h6 className="text-[#fff] text-[14px]">
                    ${invoice?.totalPrice}
                  </h6>
                </div>
                <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
              </div>
            </div>
            <div className="invoice-Details__right p-[40px] bg-[#1A1A27] border-dashed border-[1px] border-[#323248] rounded-[8px]">
              {/* <button
                className={`bg-[${
                  statusList(invoice.status)?.bg
                }] rounded-[8px] px-[8px] py-[4px] text-[10px] text-[${
                  statusList(invoice.status)?.text
                }] mb-0 uppercase`}
              >
                {statusList(invoice.status)?.name}
              </button> */}
              <h4 className="text-[#474761] text-[16px] mt-[65px] uppercase">
                {t("paymentDetails")}
              </h4>
              <div className="mt-[20px]">
                <h6 className="text-[#474761] text-[14px]">{t("payPal")}</h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">---</p>
              </div>
              <div className="mt-[20px]">
                <h6 className="text-[#474761] text-[14px]">{t("account")}</h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">---</p>
              </div>
              <div className="mt-[20px]">
                <h6 className="text-[#474761] text-[14px]">
                  {t("paymentTerms")}
                </h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">
                  --- . <span className="text-[#F64E60] inline-block">---</span>
                </p>
              </div>
              <h4 className="text-[#474761] text-[16px] mt-[60px] uppercase">
                {t("overview")}
              </h4>
              {invoice?.products?.length && (
                <div className="mt-[20px]">
                  <h6 className="text-[#474761] text-[14px]">
                    {t("productName")}
                  </h6>
                  {invoice?.products?.map((product) => (
                    <p className="text-[#fff]  text-[14px] mt-[4px] ">
                      {product?.name}{" "}
                      <NavLink
                        to={`/admin/dashboard/billing/products-services/list/details/${product?.id}`}
                        className="text-[#3699FF] inline-block"
                      >
                        {t("viewProduct")}
                      </NavLink>
                    </p>
                  ))}
                </div>
              )}
              <div className="mt-[20px]">
                <h6 className="text-[#474761] text-[14px]">
                  {t("completedBy")}
                </h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">
                  Paul Elliott
                </p>
                <h6 className="text-[#474761] text-[14px] mt-[20px] ">
                  {t("AdditionalNotes")}
                </h6>
                <p className="text-[#fff]  text-[14px] mt-[4px]">
                  N/A
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    
    </div>
    // </div>
  );
};