import { Spin } from "antd";
import { EditorState, convertToRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import { Button, ConfigurationEditor, Input } from "components";
import { Form, Formik } from "formik";
import { SearchableField } from "modules/Bills/pages/Orders/pages/AddEditOrder/sections/Sidebar/sub-sections";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers } from "store";
import { getClients } from "store";
import { createTicket } from "store";
import { Checkbox } from "antd";
import { getCurrentOnlineUsers } from "store";
import * as Yup from "yup";
import { useQuery } from "components/TicketDetails/sections/Details/Details.section";
import { getUserById } from "store";

const validationSchema = Yup.object().shape({
  ticketTitle: Yup.string().required("Ticket title is required"),
  description: Yup.string().required("Ticket description is required"),
  departmentId: Yup.string().required("Department is required"),
  clientId: Yup.string().required("Client is required"),
});

export const GenerateTicket = ({ isAdmin, idx, clientIdx }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() || { id: idx };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();
  const clientId = query.get("client") || clientIdx;
  const { loading, users, onlineUsers, clients, user } = useSelector(
    (state) => state?.users
  );
  const { departments } = useSelector((state) => state?.departments);
  const departmentLoading = useSelector((state) => state?.departments?.loading);
  useEffect(() => {
      dispatch(getClients());
      dispatch(getUsers());
      dispatch(getCurrentOnlineUsers());

      if (clientId) {
        dispatch(getUserById(clientId, true))
      }
  }, []);

  let departmentsData = [{ value: "", label: "Select Department" }];
  departments?.forEach((departments) => {
    departmentsData.push({
      value: departments?.id,
      label: departments?.name,
    });
  });

  const filtered = useMemo(() => {
    const clientList = clients?.filter((client) => client?.isDeleted === false);
    return clientList?.filter((client) => !client.parentID && client.fullName != null)
  }, [clients])

  let usersData1 = [];

  if (filtered?.length) {
    filtered?.forEach((client) => {
      usersData1.push({
        id: client?.id,
        value: client?.id,
        label: client?.fullName,
      });
    }
    )
  }

  const initialValues={
    assignTo: "",
    status: 0,
    priority: 1,
    ticketTitle: "",
    description: "",
    bodyHolder: EditorState.createEmpty(),
    departmentId: "",
    clientId: clientId ? user?.id : "",
    incomingFromClient: false,
    userFullName: clientId ? user?.fullName : ""
  }
  
  return (
    <div className="bg-[#000000] mt-[32px] p-[32px] rounded-[8px] ">
      <h6 className="text-white text-[20px]">
        Generate Ticket For {isAdmin ? "Client" : "This Article"}
      </h6>
      <Spin spinning={loading || departmentLoading}>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={
            async (values) => {
              setIsLoading(true);
              const final = {
                assignedTo: values?.assignTo,
                ticketStatus: Number(values?.status),
                ticketPriority: Number(values?.priority),
                ticketTitle: values?.ticketTitle,
                clientId: values?.clientId,
                description: values?.description,
                ticketRelatedTo: isAdmin ? 1 : 0,
                ticketRelatedToId: isAdmin ? values?.clientId : id,
                departmentId: values?.departmentId,
                incomingFromClient: values?.incomingFromClient,
              };
              await dispatch(createTicket({ data: final }));
              setIsLoading(false);
              navigate("/admin/dashboard/support/tickets/show-all/list");
            }
            // else {
            //   setIsLoading(false);
            //   toast.error("Please select appropriate values.");
            // }
            // }
          }
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched }) => {
            let usersData = [{ label: "Auto Assign", value: "" }];
            if (values?.departmentId) {
              usersData = [];
              users
                ?.filter((user) =>
                  user?.departmentIds?.includes(values?.departmentId)
                )
                ?.forEach((user) => {
                  const isOnline = onlineUsers?.find(
                    (admin) => admin?.userId === user?.id
                  )
                    ? true
                    : false;
                  usersData.push({
                    value: user?.id,
                    label: user?.fullName
                      ? `${user?.fullName}${isOnline ? "   (Online)" : ""}`
                      : "N/A",
                    isActive: isOnline ? true : false,
                  });
                });
            } else {
              usersData = [
                { label: "Please select department first", value: "" },
              ];
            }
            return (
              <Form>
                <div className="mt-[40px] grid grid-cols-3 gap-[16px]">
                  <Input
                    type="text"
                    name="ticketTitle"
                    placeholder="Enter Ticket Title..."
                    label="Title"
                  />
                  <Input
                    options={[
                      { label: "Low", value: 0 },
                      { label: "Normal", value: 1 },
                      { label: "High", value: 2 },
                    ]}
                    type="select"
                    name="priority"
                    label="Priority"
                  />
                  <Input
                    options={[
                      { label: "Active", value: 0 },
                      { label: "Waiting", value: 1 },
                      { label: "Closed", value: 2 },
                      { label: "Closed and Locked", value: 3 },
                    ]}
                    type="select"
                    name="status"
                    label="Status"
                  />
                  <Input
                    options={departmentsData}
                    type="select"
                    name="departmentId"
                    label="Select Department"
                  />

                  <Input
                    options={usersData?.sort((a, b) =>
                      a?.isActive === b?.isActive ? 0 : a?.isActive ? -1 : 1
                    )}
                    placeholder="Auto Assign"
                    type="select"
                    name="assignTo"
                    label="Assign To"
                  />
                  <SearchableField
                    name="clientId"
                    label="Client"
                    data={filtered}
                    defaultValue={initialValues?.userFullName}
                  />
                </div>
                <div className="flex justify-between items-center pr-5 pt-4">
                  <label className="ml-2 text-white text-[14px]">
                    Description
                  </label>
                  <div className="flex items-center">
                    <Checkbox
                      name="incomingFromClient"
                      value={values?.incomingFromClient}
                      onChange={(e) =>
                        setFieldValue("incomingFromClient", e.target.checked)
                      }
                    />
                    <label className="ml-2 text-white text-[14px]">
                      Incoming Ticket
                    </label>
                  </div>
                </div>
                <ConfigurationEditor
                  editorState={values.bodyHolder}
                  placeholder="Enter Short Description..."
                  onBlur={() => setFieldTouched("description", true)}
                  onEditorStateChange={(state) => {
                    setFieldValue("bodyHolder", state);
                    const currentContentAsHTML = convertToHTML({
                      entityToHTML: (entity, originalText) => {
                        if (entity.type === "IMAGE") {
                          return `<img src="${entity.data.src}" />`;
                        }
                        if (entity.type === "LINK") {
                          return ` <a href="${entity.data.url}">${originalText}</a> `;
                        }
                        return originalText;
                      },
                    })(state.getCurrentContent());
                    if (
                      convertToRaw(state.getCurrentContent()).blocks.length ===
                      1 &&
                      convertToRaw(state.getCurrentContent()).blocks[0].text ===
                      ""
                    ) {
                      setFieldValue("description", "");
                    } else {
                      setFieldValue("description", currentContentAsHTML);
                    }
                  }}
                />
                {touched["description"] && errors["description"] && (
                  <div className="error whitespace-nowrap ml-[32px] mb-[16px] w-[20%]">
                    {errors["description"]}
                  </div>
                )}
                <div className="flex items-center gap-[12px]">
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isLoading}
                    className="w-[fit_content] h-[55px] mt-[32px]"
                  >
                    {isLoading ? "Generating..." : "Generate Ticket"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </div>
  );
};
