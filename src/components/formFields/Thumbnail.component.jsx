import { Field } from "formik";
import { useRef } from "react";
import { toast } from "react-toastify";
import "./style.scss";

export const Thumbnail = ({ name, disabled }) => {
  const inputRef = useRef(null);
  return (
    <Field name={name} className="image-upload">
      {({ meta, form: { setFieldValue, values } }) => (
        <>
          <input
            type="file"
            disabled={disabled}
            accept="image/*"
            id="imgInp"
            className="image-upload__el"
            ref={inputRef}
            onChange={(e) => {
              const [file] = e.target.files;
              if (file) {
                const fileSize = (file.size / 1024 / 1024).toFixed(4);
                if (fileSize <= 2) {
                  setFieldValue(name, e.target.files[0]);
                  setFieldValue("preview", URL.createObjectURL(file));
                } else {
                  toast.error("Please select image below 2MB.");
                }
              }
            }}
          />
          <div className="p-[32px] bg-[#000000] rounded-[8px]">
            <h6 className="text-white font-medium text-[16px]">Thumbnail</h6>
            <p className="text-[#474761] text-[14x] mt-[8px]">
              Set The Product Thumbnail
            </p>
            <div className="bg-[#fdcd35] w-full h-[200px] rounded-[8px] mt-[32px] flex items-center relative cursor-pointer">
              <div
                className="absolute shadow-xl rounded-[50%] bg-[#1e1e2d] right-[12px] top-[12px] h-[40px] w-[40px] flex items-center justify-center"
                onClick={() => inputRef.current.click()}
              >
                <img src="/img/edit.png" alt="edit-icon" />
              </div>
              {values?.preview ? (
                <img
                  src={values?.preview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-[8px]"
                />
              ) : null}
            </div>
          </div>
          {meta.touched && meta.error && (
            <div className="error">{meta.error}</div>
          )}
        </>
      )}
    </Field>
  );
};
