import { Formik, Form } from "formik";
import { useCountries } from "use-react-countries";
import { Button, Card, Input } from "components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deepEqual } from "lib";
import { toast } from "react-toastify";
import { updateAppSettings } from "store";

export function GeneralSettings() {
  const [countriesData, setCountriesData] = useState([]);
  const { countries } = useCountries();

  useEffect(() => {
    const cArr = countries.map((defaultCountry) => ({
      label: defaultCountry?.name,
      value: defaultCountry?.name,
    }));
    cArr.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    const finalValues = [
      ...cArr,
      // TODO: Remove after updating to available countries
      { label: "Canada1", value: "CAD" },
      { label: "Other", value: "Other" },
    ];
    setCountriesData(finalValues);
  }, [countries]);

  // Fields
  const fields = [
    {
      name: "dateFormat",
      label: "Date Format",
      type: "select",
      options: [
        { label: "DD-MM-YYYY", value: "DD-MM-YYYY" },
        { label: "MM-DD-YYYY", value: "MM-DD-YYYY" },
        { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
        { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },

        { label: "DD/MM/YYYY HH:mm:ss", value: "DD/MM/YYYY HH:mm:ss" },
        { label: "DD/MM/YYYY HH:mm:ss a", value: "DD/MM/YYYY HH:mm:ss a" },

        { label: "MM/DD/YYYY HH:mm:ss", value: "MM/DD/YYYY HH:mm:ss" },
        { label: "MM/DD/YYYY HH:mm:ss a", value: "MM/DD/YYYY HH:mm:ss a" },

        { label: "MM-DD-YYYY HH:mm:ss", value: "MM-DD-YYYY HH:mm:ss" },
        { label: "MM-DD-YYYY HH:mm:ss a", value: "MM-DD-YYYY HH:mm:ss a" },

        { label: "DD-MM-YYYY HH:mm:ss", value: "DD-MM-YYYY HH:mm:ss" },
        { label: "DD-MM-YYYY HH:mm:ss a", value: "DD-MM-YYYY HH:mm:ss a" },

        {
          label: "dddd, MMMM Do YYYY, h:mm:ss",
          value: "dddd, MMMM Do YYYY, h:mm:ss",
        },
        {
          label: "dddd, MMMM Do YYYY, h:mm:ss a",
          value: "dddd, MMMM Do YYYY, h:mm:ss a",
        },

        {
          label: "ddd, MMMM Do YYYY h:mm:ss",
          value: "ddd, MMMM Do YYYY h:mm:ss",
        },
        {
          label: "ddd, MMMM Do YYYY h:mm:ss a",
          value: "ddd, MMMM Do YYYY h:mm:ss a",
        },
      ],
    },
    {
      name: "defaultCountry",
      label: "Country",
      type: "select",
      options: countriesData,
    },
    // {
    //   name: "termsOfServiceURL",
    //   label: "Terms of Service",
    //   type: "text",
    // },
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
    },
    // {
    //   name: "termsOfServiceAgreement",
    //   label: "Terms of Service Agreement",
    //   type: "switch",
    // },
    // {
    //   name: "recordsToDisplay",
    //   label: "Records To Display",
    //   type: "select",
    //   options: [
    //     { label: "05", value: 5 },
    //     { label: "10", value: 10 },
    //     { label: "20", value: 20 },
    //     { label: "30", value: 30 },
    //   ],
    // },
    {
      name: "autoRefreshInterval",
      label: "Auto Refresh Interval",
      type: "select",
      options: [
        { label: "05 Seconds", value: 5 },
        { label: "10 Seconds", value: 10 },
        { label: "20 Seconds", value: 20 },
        { label: "30 Seconds", value: 30 },
        { label: "60 Seconds", value: 60 },
        { label: "90 Seconds", value: 90 },
        { label: "120 Seconds", value: 120 },
      ],
    },
    {
      name: "defaultInactivityMinutesLockAdmin",
      label: "Lock Admin after Inactive Minutes",
      type: "number",
    },
    {
      name: "defaultInactivityMinutesLockClient",
      label: "Lock Client after Inactive Minutes",
      type: "number",
    },
    {
      name: "loginRequestsPerIPAdmin",
      label: "Login Requests Per IP (Admin)",
      type: "number",
    },
    {
      name: "loginRequestsPerIPClient",
      label: "Login Requests Per IP (Client)",
      type: "number",
    },
    {
      name: "requestsIntervalPerIPAfterLimitAdminInSeconds",
      label: "Request Interval Per IP After Limit in Seconds (Admin)",
      type: "number",
    },
    {
      name: "requestsIntervalPerIPAfterLimitClientInSeconds",
      label: "Request Interval Per IP After Limit in Seconds (Client)",
      type: "number",
    },
    {
      name: "requestsPerIPAdmin",
      label: "Request Per IP (Admin)",
      type: "number",
    },
    {
      name: "requestsPerIPClient",
      label: "Request Per IP (Client)",
      type: "number",
    },
    {
      name: "vat",
      label: "VAT",
      type: "number",
      min: 0,
      max: 100,
    },
    {
      name: "enableClientRecaptcha",
      label: "Enable Client Recaptcha",
      type: "switch",
    },
    {
      name: "enableAdminRecaptcha",
      label: "Enable Admin Recaptcha",
      type: "switch",
    },
  ];

  const { settings } = useSelector((state) => state?.appSettings);
  const dispatch = useDispatch();
  const initialValues = {
    dateFormat: settings?.dateFormat,
    defaultCountry: settings?.defaultCountry,
    termsOfServiceURL: settings?.termsOfServiceURL,
    termsOfServiceAgreement: settings?.termsOfServiceAgreement,
    recordsToDisplay: settings?.recordsToDisplay,
    autoRefreshInterval: settings?.autoRefreshInterval,
    defaultInactivityMinutesLockAdmin:
      settings?.defaultInactivityMinutesLockAdmin,
    defaultInactivityMinutesLockClient:
      settings?.defaultInactivityMinutesLockClient,
    loginRequestsPerIPAdmin: settings?.loginRequestsPerIPAdmin,
    loginRequestsPerIPClient: settings?.loginRequestsPerIPClient,
    requestsIntervalPerIPAfterLimitAdminInSeconds:
      settings?.requestsIntervalPerIPAfterLimitAdminInSeconds,
    requestsIntervalPerIPAfterLimitClientInSeconds:
      settings?.requestsIntervalPerIPAfterLimitClientInSeconds,
    requestsPerIPAdmin: settings?.requestsPerIPAdmin,
    requestsPerIPClient: settings?.requestsPerIPClient,
    vat: settings?.vat,
    companyName: settings?.companyName,
    enableClientRecaptcha: settings?.enableClientRecaptcha,
    enableAdminRecaptcha: settings?.enableAdminRecaptcha,
  };

  return (
    <Card heading="General Settings">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          if (deepEqual(values, initialValues)) {
            toast.info("No changes were made");
          } else {
            await dispatch(
              updateAppSettings({ tenant: 'Admin', data: values })
            );
          }
        }}
        enableReinitialize
      >
        <Form>
          <div className="grid grid-cols-4 gap-[20px] mb-[32px] items-end">
            {fields.map((field) => (
              <div className="flex items-end" key={field?.name}>
                <Input
                  key={field.name}
                  name={field.name}
                  label={field?.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  options={field.options}
                  min={field?.min}
                  max={field?.max}
                />
              </div>
            ))}
          </div>
          <Button htmlType="submit" type="ghost" className="px-[32px] h-[52px]">
            Save Changes
          </Button>
        </Form>
      </Formik>
    </Card>
  );
}
