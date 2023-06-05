import { Modal } from "components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUserById } from "store";
import { deleteAPIKey } from "store";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  id: Yup.string().required("ID is required"),
});

export const Delete = ({ show, setShow, id, type }) => {
  const { loading } = useSelector((state) => state?.apiKeys);
  const { loading: isLoading } = useSelector((state) => state?.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let deleteType = {type: "apiKey", text: "API Key"}
  switch (type) {
    case "client":
      deleteType = {type, text: "Client"}
      break;
    case "admin":
      deleteType = {type, text: "Admin"}
      break;
    default:
      break;
  }
  
  return (
    <Modal
      heading={`Delete ${deleteType.text}`}
      customBody={
        <div className="mb-[32px]">
          Are you sure you wish to delete this{" "}
          {deleteType.text}? This action is permanent
          and can not be undone.
        </div>
      }
      initialValues={{ id }}
      validationSchema={validationSchema}
      submitText={`Delete ${deleteType.text}`}
      loading={type === "client" || type === "admin" ? isLoading : loading}
      handleSubmit={async (values) => {
        if (type === "client") {
          await dispatch(deleteUserById(values?.id, true));
          navigate("/admin/dashboard/billing/clients/list/show");
        } 
        if (type === "admin") {
          await dispatch(deleteUserById(values?.id));
          navigate("/admin/dashboard/settings/users/list");
        }
        if (type === "apiKey") {
          await dispatch(deleteAPIKey(values?.id));
        }
        setShow(false);
      }}
      show={show}
      setShow={setShow}
    />
  );
};
