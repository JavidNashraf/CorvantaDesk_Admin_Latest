import { getConfig } from './getConfig';

const emailTemplatesConfig = (action) =>
  getConfig({ module: 'EmailTemplates', action });
const prefix = `/api/v1/admin/emailtemplates`;

// Add Email Template Config
export const addEmailTemplateConfig = () => ({
  url: `${prefix}`,
  config: emailTemplatesConfig('Create'),
});
// Edit Email Template Config
export const editEmailTemplateConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: emailTemplatesConfig('Update'),
});
// Delete Email Template Config
export const deleteEmailTemplateConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: emailTemplatesConfig('Remove'),
});
// Get Email Template By ID Config
export const getEmailTemplateByIdConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: emailTemplatesConfig('View'),
});
// Get All Email Templates
export const getAllEmailTemplatesConfig = () => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [''],
      keyword: '',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
  },
  config: emailTemplatesConfig('View'),
});
