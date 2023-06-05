import { useEffect, useState } from "react";
import { convertToRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";

// Custom Modules
import { ConfigurationEditor, EmailBodyInput, Button } from "components";
import "./Edit.styles.scss";
import { convertHTMLToDraftState, createServerImage } from "lib";
import { getArticleByID, updateArticle } from "store/Actions/articles";
import { getAllArticleCategories } from "store";
// import { getBrands } from 'store';

export const Edit = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  useEffect(() => {
    (async () => {
      await dispatch(getAllArticleCategories());
      // await dispatch(getBrands());
      await dispatch(getArticleByID({ id }));
    })();
  }, []);

  const { loading, articleCategories } = useSelector(
    (state) => state?.articleCategories
  );
  const articleLoading = useSelector((state) => state?.articles?.loading);
  const { article } = useSelector((state) => state?.articles);
  // const brands = useSelector((state) => state?.brands);

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (articleCategories.length) {
      const newCat = articleCategories?.filter(
        (c) => c.parentCategoryId !== "00000000-0000-0000-0000-000000000000"
      );
      setSubCategories(newCat);
    }
  }, [articleCategories]);

  const initialValues = {
    title: article?.title,
    categories: article?.articleCategories?.map((cat) => cat?.categoryId),
    brandIds: article?.brandArticles?.map((brand) => brand?.brandId),
    visibility: article?.visibility,
    articleStatus: article?.articleStatus,
    bodyText: article?.bodyText,
    bodyHolder: convertHTMLToDraftState(article?.bodyText),
    preview: article?.base64Image,
  };

  const fields = [
    {
      name: "title",
      type: "text",
      label: "Article Ttitle",
      placeholder: "Enter Article Title Here",
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
    // {
    //   name: 'brandIds',
    //   type: 'multiselect',
    //   label: 'Brands',
    //   placeholder: 'All Brands',
    //   options: brands?.map((brand) => ({
    //     label: brand?.name,
    //     value: brand?.id,
    //   })),
    // },
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
        {label: "Submitted", value: "submitted"},
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
      // validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values) => {
        const serverImage = await createServerImage(values?.image);
        const finalVisibility = values?.visibility === true ? true : false;
        const finalValues = {
          visibility: finalVisibility,
          image: serverImage,
          categories: values?.categories,
          bodyText: values?.bodyText,
          title: values?.title,
          articleStatus: values?.articleStatus,
          brandIds: values?.brandIds,
        };
        await dispatch(updateArticle({ id: article?.id, data: finalValues }));
        navigate("/admin/dashboard/knowledge-base/articles");
      }}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched }) => {
        return (
          <Form>
            <Spin spinning={loading || articleLoading}>
              <div className="grid grid-cols-[1fr] gap-[20px] px-[32px] py-[40px]">
                <div className="flex flex-col gap-[20px]">
                  <div className="bg-[#000000] rounded-[8px]">
                    <h6 className="text-white font-medium p-[32px] text-[16px]">
                      Edit Article
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
                        const currentContentAsHTML = convertToHTML(
                          state.getCurrentContent()
                        );
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
                          !values?.categories?.length
                        }
                      >
                        Edit Article
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
