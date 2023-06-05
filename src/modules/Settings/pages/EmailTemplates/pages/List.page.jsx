import { Button } from "antd";
import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmailTemplate } from "store";
import { Delete } from "./sections";

const columns = [
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
    width: "15%",
    sorter: (a, b) => (a?.subject < b?.subject ? -1 : 1),
  },
  {
    title: "Configuration",
    dataIndex: "smtpConfigurationId",
    key: "smtpConfigurationId",
  },
  {
    title: "Event",
    dataIndex: "event",
    key: "event",
    sorter: (a, b) => (a?.event < b?.event ? -1 : 1),
  },
  {
    title: "Added By",
    dataIndex: "addedBy",
    key: "addedBy",
    sorter: (a, b) => (a?.addedBy < b?.addedBy ? -1 : 1),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <span>
        {status ? (
          <span className="text-[#0BB783] px-[8px] py-[4px] bg-[#1C3238] rounded-[4px]">
            Enabled
          </span>
        ) : (
          <span className="text-[#F64E60] px-[8px] py-[4px] bg-[#3A2434] rounded-[4px]">
            Disabled
          </span>
        )}
      </span>
    ),
  },
];

export const List = () => {
  const [show, setShow] = useState(false);
  const [record, setRecord] = useState(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Check for permissions Start
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "EmailTemplates",
    modules: userModules,
  });
  // Check for permissions End

  const { emailTemplates, loading } = useSelector(
    (state) => state.emailTemplates
  );

  const { smtps } = useSelector((state) => state?.smtps);
  const { users } = useSelector((state) => state?.users);
  const smtpsLoading = useSelector((state) => state?.smtps?.loading);
  const usersLoading = useSelector((state) => state?.users?.loading);
  
  useEffect(() => {
    const d = [];
    emailTemplates?.forEach((emailTemplate) => {
      d.push({
        key: emailTemplate?.id,
        id: emailTemplate?.id,
        subject: emailTemplate?.subject,
        smtpConfigurationId:
          smtps.find((x) => x.id === emailTemplate?.smtpConfigurationId)?.host ||
          "N/A",
        event: [
          "General",
          "Email Confirmation",
          "Email OTP",
          "Product Cancellation",
          "Reset Password",
          "Ticket Update",
          "Ticket Create",
          "Ticket Assignment",
          "Orders",
          "Invoice",
          "Product Status Updated",
        ]?.find((evt, idx) => idx === emailTemplate?.emailTemplateType),
        addedBy: emailTemplate?.isSystem
          ? "System"
          : users?.find((x) => x?.id === emailTemplate?.createdBy)?.fullName ||
            "N/A",
        isSystem: emailTemplate?.isSystem,
        status: emailTemplate?.status,
      });
    });
    setData(d);
  }, [emailTemplates, smtps, users]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEmailTemplate(null));
  }, [dispatch]);

  return (
    <div className="m-[40px] p-[40px] bg-[#000000] rounded-[8px]">
      <Delete show={show} setShow={setShow} record={record} />
      <Table
        columns={columns}
        data={data}
        permissions={permissions}
        fieldToFilter="name"
        btnData={{
          text: "Add New Template",
          onClick: () => {
            navigate("/admin/dashboard/settings/email-templates/template/add");
          },
        }}
        loading={loading || smtpsLoading || usersLoading}
        editAction={(record) => (
          <Button
            onClick={() => {
              navigate(
                `/admin/dashboard/settings/email-templates/edit/${record.id}`
              );
            }}
          >
            Edit
          </Button>
        )}
        deleteAction={(record) => {
          return (
            <>
              {record?.isSystem ? (
                <></>
              ) : (
                <Button
                  onClick={() => {
                    setRecord(record);
                    setShow(true);
                  }}
                >
                  Delete
                </Button>
              )}
            </>
          );
        }}
      />
    </div>
  );
};
