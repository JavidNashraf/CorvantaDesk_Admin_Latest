import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, ImageUpload, Input } from "components";
import { createServerImage, deepEqual } from "lib";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "store";

const fields = [
  { name: "image", label: "Avatar", type: "image" },
  { name: "fullName", label: "Full Name", type: "text", },
  // { name: "status", label: "Status", type: "switch" },
  { name: "ipAddress", label: "IP Address", type: "text" },
  {
    name: "recordsToDisplay",
    label: "Records To Display",
    placeholder: "Select records to display",
    type: "select",
    options: [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20", value: 20 },
      { label: "30", value: 30 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
      { label: "200", value: 200 },
    ],
  },
];

const validationSchema = Yup.object().shape({});

export const ProfileDetails = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const initialValues = {
    image: user?.imageUrl,
    // preview: "data:image/png;base64," + user?.base64Image,
    // fullName: user?.fullName,
    ipAddress: user?.restrictAccessIPAddress,
    recordsToDisplay: user?.recordsToDisplay,  
  };

  const dispatch = useDispatch();

  return (
    <div className="mt-[20px] bg-[#000000] rounded-[8px]">
      <div className="p-[32px] border-b-[1px] border-b-[#323248] border-dashed text-white text-[16px]">
        Profile Details
      </div>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values) => {
            const img = await createServerImage(values?.image);
            const newValues = {
              image: img && Object.keys(img).length ? img : undefined,
              fullName: values?.fullName,
              status: values?.status,
              // ipAddress: values?.ipAddress,
              recordsToDisplay: Number(values?.recordsToDisplay),
            };
            dispatch(updateUserProfile(user?.id, newValues));
          }}
        >
          {({ values, handleReset }) => {
            return (
              <Form>
                <div className="p-[32px] border-b-[1px] border-b-[#323248] border-dashed flex flex-col gap-[18px]">
                  {fields?.map((field) => {
                    return (
                      <div
                        className="grid grid-cols-[1fr_2fr] items-center"
                        key={field?.name}
                      >
                        <label
                          htmlFor={field?.name}
                          className="text-white text-[14px]"
                        >
                          {field?.label}
                        </label>
                        {field?.type === "image" ? (
                          <ImageUpload name={field?.name} />
                        ) : (
                          <Input
                            placeholder={field?.placeholder}
                            name={field?.name}
                            type={field?.type}
                            options={field?.options}
                            disabled={field?.name == "ipAddress"}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
         
                <div className="p-[32px] flex items-center gap-[8px]">
                  <Button type="secondary" onClick={handleReset}>
                    Discard
                  </Button>
                  <Button
                    htmlType="submit"
                    disabled={deepEqual(initialValues, values)}
                    loading={isLoading}
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
