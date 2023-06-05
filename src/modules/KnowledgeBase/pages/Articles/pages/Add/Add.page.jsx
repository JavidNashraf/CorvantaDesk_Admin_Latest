import { EditorState, convertToRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

// Custom Modules
import { ConfigurationEditor, EmailBodyInput, Button } from "components";
import { createArticle } from "store";
import "./Add.styles.scss";
import { useEffect, useState } from "react";
import { getAllArticleCategories } from "store";
import { createServerImage } from "lib";
import { getBrands } from "store";

// const ConfigurationEditor = ({ editorState, onEditorStateChange, onBlur }) => {
//   return (
//     <div className="configuration-editor">
//       <div className="configuration-editor__container">
//         <SMTPEditor
//           editorState={editorState}
//           wrapperClassName="configuration-editor__container-wrapper"
//           editorClassName="configuration-editor__container-editor"
//           onChange={onEditorStateChange}
//           placeholder="Start typing here..."
//           onBlur={onBlur}
//         />
//       </div>
//     </div>
//   );
// };

// const getInputEl = ({ options, name, placeholder, type }) => {
//   switch (type) {
//     case 'multiselect':
//       return (
//         <div className="custom-multiselect-kba w-full">
//           <MultiSelect
//             name={name}
//             options={options}
//             mode="multiple"
//             placeholder={placeholder}
//           />
//         </div>
//       );
//     case 'text':
//       return (
//         <Field
//           name={name}
//           placeholder={placeholder}
//           className="h-[52px] w-[60%] text-[#FFFFFF] placeholder:text-[#FFFFFF] bg-[transparent] focus-visible:outline-none"
//         />
//       );
//     case 'select':
//       return (
//         <div className="custom-select-kba w-full">
//           <Input
//             type={type}
//             placeholder={placeholder}
//             name={name}
//             options={options}
//           />
//         </div>
//       );
//     case 'image':
//       return (
//         <div className="custom-select-kba w-full">
//           <ImageUpload name={name} />
//         </div>
//       );
//     default:
//       break;
//   }
// };

// const EmailBodyInput = ({
//   touched,
//   errors,
//   name,
//   placeholder,
//   type,
//   label,
//   options,
// }) => {
//   return (
//     <div className="flex gap-[20px] bg-[transparent] items-center border-b-[1px] border-b-[#323248] border-dashed">
//       <h6 className="pl-[32px] text-white whitespace-nowrap w-[15%]">
//         {label}
//       </h6>
//       {getInputEl({ options, name, placeholder, type })}
//       {touched[name] && errors[name] && (
//         <div className="error whitespace-nowrap mr-[12px] mt-[0px] w-[20%]">
//           {errors[name]}
//         </div>
//       )}
//     </div>
//   );
// };

export const Add = () => {
  const initialValues = {
    title: "",
    categories: [],
    visibility: true,
    articleStatus: "draft",
    brandIds: [],
    bodyText: "",
    bodyHolder: EditorState.createEmpty(),
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllArticleCategories());
    dispatch(getBrands());
  }, []);

  const { loading, articleCategories } = useSelector(
    (state) => state?.articleCategories
  );
  const { brands } = useSelector((state) => state?.brands);
  const brandsLoading = useSelector((state) => state?.brands?.loading);
  const articleLoading = useSelector((state) => state?.articles?.loading);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (articleCategories.length) {
      const newCat = articleCategories?.filter(
        (c) => c.parentCategoryId !== "00000000-0000-0000-0000-000000000000"
      );
      setSubCategories(newCat);
    }
  }, [articleCategories]);

  const fields = [
    {
      name: "title",
      type: "text",
      label: "Article Ttitle",
      placeholder: "Enter Article Title Here",
    },
    {
      name: "brandIds",
      type: "multiselect",
      label: "Brands",
      placeholder: "All Brands",
      options: brands?.map((brand) => ({
        label: brand?.name,
        value: brand?.id,
      })),
    },
    {
      name: "categories",
      type: "multiselect",
      placeholder: "Select Categories",
      options: subCategories?.map((category) => ({
        label: category.name,
        value: category.id,
      })),
      label: "Categories",
    },
    {
      name: "visibility",
      type: "select",
      label: "Visibility",
      options: [
        { label: "Public", value: true },
        { label: "Private", value: false },
      ],
    },
    {
      name: "articleStatus",
      type: "select",
      label: "Status",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Publish", value: "publish" },
        {label: "Submitted", value: "submitted"}
      ],
    },
    {
      name: "image",
      type: "image",
      label: "Select Image",
    },
  ];

  const navigate = useNavigate();
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (values) => {
        const serverImage = await createServerImage(values?.image);
        const finalVisibility = values?.visibility === "false" ? false : true;
        const finalValues = {
          visibility: finalVisibility,
          image: serverImage,
          categories: values?.categories,
          bodyText: values?.bodyText,
          title: values?.title,
          articleStatus: values?.articleStatus,
          brandIds: values?.brandIds,
        };
        await dispatch(createArticle(finalValues));
        navigate("/admin/dashboard/knowledge-base/articles");
      }}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched }) => {
        return (
          <Form>
            <Spin spinning={loading || articleLoading || brandsLoading}>
              <div className="grid grid-cols-[1fr] gap-[20px] px-[32px] py-[40px]">
                <div className="flex flex-col gap-[20px]">
                  <div className="bg-[#000000] rounded-[8px]">
                    <h6 className="text-white font-medium p-[32px] text-[16px]">
                      Create New Article
                    </h6>
                    {/* Other Inputs */}
                    <div className="flex flex-col gap-[2px]">
                      {fields?.map((field, idx) => {
                        return (
                          <EmailBodyInput
                            key={`field-${idx}`}
                            options={field?.options}
                            name={field?.name}
                            label={field?.label}
                            type={field?.type}
                            placeholder={field?.placeholder}
                            touched={touched}
                            errors={errors}
                          />
                        );
                      })}
                    </div>
                    <ConfigurationEditor
                      editorState={values.bodyHolder}
                      onBlur={() => setFieldTouched("bodyText", true)}
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
                          convertToRaw(state.getCurrentContent()).blocks
                            .length === 1 &&
                          convertToRaw(state.getCurrentContent()).blocks[0]
                            .text === ""
                        ) {
                          setFieldValue("bodyText", "");
                        } else {
                          setFieldValue("bodyText", currentContentAsHTML);
                        }
                      }}
                    />
                    {touched["bodyText"] && errors["bodyText"] && (
                      <div className="error whitespace-nowrap ml-[32px] mb-[16px] w-[20%]">
                        {errors["bodyText"]}
                      </div>
                    )}
                    <div className="p-[32px] pt-[10px]">
                      <Button
                        htmlType="submit"
                        className="w-[fit_content]"
                        disabled={
                          !values?.title ||
                          !values?.articleStatus ||
                          !values?.bodyText ||
                          !values?.categories?.length ||
                          !values?.visibility
                        }
                      >
                        Create New Article
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Spin>
          </Form>
        );
      }}
    </Formik>
  );
};
