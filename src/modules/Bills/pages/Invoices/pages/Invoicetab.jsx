import { useState } from "react";
import { InvoiceNavigation } from "./InvoiceNavigation.section";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { EditInvoicePage } from "./InvoiceDetails/EditInvoicePage";
import { AddCredit } from "./InvoiceDetails/AttemptCapture/AddCredit";
import { RefundCredit } from "./InvoiceDetails/RefundCredit/RefundCapture";
import { InvoiceDetails } from ".";


export const InvoiceTab = () => {
  const [active, setActive] = useState("OVERVIEW");
  const [show, setShow] = useState(true);
  const [showRefund, setShowRefund] = useState(true);
  const links = [
    { label: "OVERVIEW", onClick: () => setActive("OVERVIEW") },
    { label: "EDIT", onClick: () => setActive("EDIT") },
    { label: "ATTEMPT CAPTURE", onClick: () => { setActive("ATTEMPT CAPTURE"); setShow(true) } },
    { label: "REFUND", onClick: () => { setActive("REFUND"); setShowRefund(true) } },
    { label: "VIEW HTML", onClick: () => setActive("VIEW HTML") },
    { label: "VIEW PDF", onClick: () => setActive("VIEW PDF") },
    { label: "PRINT", onClick: () => setActive("PRINT") },
  ];

  const { isLoading, user } = useSelector((state) => state?.auth);

  return (
    <div className="profile p-5">
      <div className=" min-w-[60vh]">

        {isLoading || user === null ? (
          <Spin
            size="large"
            style={{ gridColumn: "1/3", alignSelf: "center" }}
          />
        ) : (
          <>

            <div className="profile-details__right" >

              <InvoiceNavigation active={active} links={links} />

              {active === "OVERVIEW" ?  < InvoiceDetails /> : <></>}
              {active === "EDIT" ?  < EditInvoicePage /> : <></>}
              {active === "ATTEMPT CAPTURE" ? <AddCredit show={show} setShow={setShow} /> : <></>}
              {active === "REFUND" ? <RefundCredit show={showRefund}
                setShow={setShowRefund} /> : <></>}
              {active === "VIEW HTML"}
              {active === "VIEW PDF"}
              {active === "PRINT"}

            </div>
          </>
        )}
      </div>
    </div>
  );
};
