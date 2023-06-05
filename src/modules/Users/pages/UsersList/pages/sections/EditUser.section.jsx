import { Modal } from "components";
import { deepEqual } from "lib";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUser } from "store";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  status: Yup.bool().required("Status is required"),
});

export const EditUser = ({ t, show, setShow, user }) => {
  const initialValues = {
    fullName: user?.fullName,
    status: user?.status,
    adminGroupId: user?.adminGroupId,
  };

  const { loading } = useSelector((state) => state?.users);
  const { userGroups } = useSelector((state) => state?.userGroups);

  const dispatch = useDispatch();

  const fields = [
    {
      type: "input",
      name: "fullName",
      placeholder: "Paul.Elliott",
      title: t("fullName"),
    }
  ];

  if (JSON.parse(localStorage.getItem("CurrentUser")).id !== user?.id) {
    fields.push(
      {
        type: "select",
        options: userGroups?.length
          ? userGroups?.map((group) => ({
              label: group?.groupName,
              value: group?.id,
            }))
          : [],
        name: "adminGroupId",
        placeholder: "Select Admin Group...",
        title: t("adminGroup"),
      },
      {
        type: "switch",
        name: "status",
        title: t("status"),
      },
    )
  }

  return (
    <Modal
      show={show}
      setShow={setShow}
      heading={`Edit User ${user?.userName}`}
      submitText={t("editUser")}
      initialValues={initialValues}
      validationSchema={validationSchema}
      loading={loading}
      fields={fields}
      handleSubmit={async (values) => {
        if (deepEqual(values, initialValues)) {
          toast.warn("Nothing is changed!");
        } else {
          await dispatch(updateUser(user?.id, values));
        }
        setShow(false);
      }}
    />
  );
};
