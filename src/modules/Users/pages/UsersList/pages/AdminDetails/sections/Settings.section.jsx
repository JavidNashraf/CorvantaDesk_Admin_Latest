import { Formik, Form, Field } from "formik";
import moment from "moment";
import { Spin, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { getUserSettingsById } from "store";
import { updateUserSettings } from "store";
import { DatePicker, Input } from "components";
import { deepEqual } from "lib";

// TODO: INTEGRATE ONCE ISSUES ARE RESOVLED
export const Settings = () => {
  const { t } = useTranslation("/Users/ns");
  const [loading, setLoading] = useState(false);

  const { user, userSettings } = useSelector((state) => state?.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      (async () => {
        setLoading(true);
        await dispatch(getUserSettingsById(user?.id));
        setLoading(false);
      })();
    }
  }, [user]);

  const initialValues = {
    clientStatus: userSettings?.clientStatus || false,
    requestPerIPOverride: userSettings?.requestPerIPOverride || 0,
    ipRestrictionIntervalOverrideInSeconds:
      userSettings?.ipRestrictionIntervalOverrideInSeconds || 0,
    apiKeyLimitOverride: userSettings?.apiKeyLimitOverride || 0,
    apiKeyIntervalOverrideInSeconds:
      userSettings?.apiKeyIntervalOverrideInSeconds || 0,
    restrictAccessToIPAddress: userSettings?.restrictAccessToIPAddress || "",
    extendSuspensionDate:
      moment(userSettings?.extendSuspensionDate).year() >= 2023 ? moment(userSettings?.extendSuspensionDate) : moment(),
    userId: user?.id,
    id: userSettings?.id,
  };
  const fields = [
    {
      label: t("apiKeyInterval"),
      name: "apiKeyIntervalOverrideInSeconds",
      type: "input",
      disabled: true
    },
    { label: t("apiKeyLimit"), name: "apiKeyLimitOverride", type: "number" },
    // { label: t('adminStatus'), name: 'adminStatus', type: 'switch' },
    // { label: "Client Status", name: "clientStatus", type: "switch" },
    // { label: t("suspensionDate"), name: "extendSuspensionDate", type: "date" },
    {
      label: t("IPRestrictionOverride"),
      name: "ipRestrictionIntervalOverrideInSeconds",
      type: "number",
    },
    {
      label: "Request Per IP Override",
      name: "requestPerIPOverride",
      type: "number",
    },
    {
      label: t("ipAddress"),
      name: "restrictAccessToIPAddress",
      type: "input",
    },
  ];

  return (
    <div className="bg-[#000000] mt-[20px] rounded-[8px]">
      <h6 className="text-white text-[16px] px-[32px] pt-[32px]">
        {t("settings")}
      </h6>
      <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[32px] mb-[32px]" />
      {/* FORM ROW */}
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          setLoading(true);
          const finalValues = {
            ...values,
            extendSuspensionDate: values?.extendSuspensionDate?.toISOString(),
            restrictAccessToIPAddress: [`${values?.restrictAccessToIPAddress}`]
          };
          await dispatch(updateUserSettings({ data: finalValues }));
          setLoading(false);
        }}
        enableReinitialize
      >
        {({ values }) => {
          return (
            <Form className="pb-[32px]">
              <Spin spinning={loading}>
                <div className="grid grid-cols-3 p-[32px] gap-[20px] items-end">
                  {fields?.map((el) => {
                    return (
                      <Fragment key={el?.name}>
                        {el?.type === "date" ? (
                          <div className="w-full">
                            <div className="text-white mb-[12px] text-[14px]">
                              {el?.label}
                            </div>
                            <DatePicker name={el?.name} />
                          </div>
                        ) : el?.type === "switch" ? (
                          <Field name={el?.name}>
                            {({
                              field, // { name, value, onChange, onBlur }
                              form: { setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                              meta,
                            }) => (
                              <div className="w-full">
                                <div className="text-white mb-[12px] text-[14px]">
                                  {el?.label}
                                </div>
                                <div className="flex items-center justify-between w-full h-[52px] px-[16px] py-[0px] bg-[#171723] text-[#92928F] rounded-[8px]">
                                  <div className="text-[#92928F]">
                                    {field?.value ? "Enabled" : "Disabled"}
                                  </div>
                                  <Switch
                                    checked={field?.value}
                                    onChange={(e) => {
                                      setFieldValue(el?.name, e);
                                    }}
                                  />
                                </div>
                                {meta.touched && meta.error && (
                                  <div className="error">{meta.error}</div>
                                )}
                              </div>
                            )}
                          </Field>
                        ) : (
                          <Input
                            key={el.name}
                            name={el.name}
                            disabled={JSON.parse(localStorage.getItem("CurrentUser")).id == initialValues.userId }
                            label={el?.label}
                            placeholder={el.placeholder}
                            type={el.type}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
                {
                JSON.parse(localStorage.getItem("CurrentUser")).id !== initialValues.userId ?
                <div className="flex items-center gap-[10px] px-[32px]">
                  <button
                    type="button"
                    className="bg-[#323248] text-white rounded-[8px] py-[12px] px-[24px]"
                  >
                    {t("discard")}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#3699FF] text-white rounded-[8px] py-[12px] px-[24px] disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={deepEqual(initialValues, values)}
                  >
                    {t("saveChanges")}
                  </button>
                </div>
                :
                null
                }
              </Spin>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
