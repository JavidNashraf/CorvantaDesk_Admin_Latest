import { useFormikContext } from 'formik';
import { convertToHTML } from 'draft-convert';
import { convertToRaw } from 'draft-js';

import { ConfigurationEditor, Button, EmailBodyInput } from 'components';
import './Right.styles.scss';

export function Right() {
  const { values, setFieldValue, setFieldTouched, touched, errors } =
    useFormikContext();
  return (
    <>
      {/* Header, Footer, and Signature Side */}
      <div className="flex flex-col gap-[20px]">
        {/* Notification Body Side */}
        <div className="flex flex-col gap-[20px]">
          <div className="bg-[#000000] rounded-[8px]">
            <h6 className="text-white font-medium p-[32px]">
              Notification Content
            </h6>
            {/* Other Inputs */}
            <div className="flex flex-col gap-[2px]">
              <EmailBodyInput
                name="clientName"
                label="Client Name"
                placeholder="[[fullName]]"
                touched={touched}
                errors={errors}
                type="readOnly"
              />
              <EmailBodyInput
                name="company"
                label="Company"
                placeholder="[[company]]"
                touched={touched}
                errors={errors}
                type="readOnly"
              />
              <EmailBodyInput
                name="address"
                label="Address"
                placeholder="[[address]]"
                touched={touched}
                errors={errors}
                type="readOnly"
              />
              <EmailBodyInput
                name="title"
                label="Title"
                placeholder="Enter Title Here..."
                touched={touched}
                errors={errors}
                type="text"
                darkBg
              />
            </div>
            <ConfigurationEditor
              editorState={values?.bodyHolder}
              onBlur={() => setFieldTouched('body', true)}
              onEditorStateChange={(state) => {
                setFieldValue('bodyHolder', state);
                const currentContentAsHTML = convertToHTML(
                  state.getCurrentContent()
                );
                if (
                  convertToRaw(state.getCurrentContent()).blocks.length === 1 &&
                  convertToRaw(state.getCurrentContent()).blocks[0].text === ''
                ) {
                  setFieldValue('body', '');
                } else {
                  setFieldValue('body', currentContentAsHTML);
                }
              }}
            />
            {touched['body'] && errors['body'] && (
              <div className="error whitespace-nowrap ml-[32px] mb-[16px] w-[20%]">
                {errors['body']}
              </div>
            )}
            <div className="flex flex-col gap-[2px]">
              <EmailBodyInput
                name="startDate"
                label="Start Date"
                placeholder="[Enter Start Date]"
                touched={touched}
                errors={errors}
                type="date"
                darkBg
              />
              <EmailBodyInput
                name="endDate"
                label="End Date"
                placeholder="[Enter End Date]"
                touched={touched}
                errors={errors}
                type="date"
                darkBg
              />
            </div>
            <div className="p-[32px]">
              <Button htmlType="submit">Save Template</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
