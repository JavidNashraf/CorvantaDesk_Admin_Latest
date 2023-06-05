import { getConfig } from 'lib';

// NotificationTemplate End-Points
const NotificationTemplate = 'Clients';
const prefix = '/api/v1/admin/notificationstemplate';
// Get List of All Notification Templates
export const getNotificationTemplatesConfig = () => ({
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
  config: getConfig({ module: NotificationTemplate, action: 'View' }),
});

// // Get List of All Notifications
// export const getNotificationsConfig = () => ({
//   url: `/api/v1/admin/notifications/search`,
//   defaultData: {
//     advancedSearch: {
//       fields: [''],
//       keyword: '',
//     },
//     keyword: '',
//     pageNumber: 0,
//     pageSize: 0,
//     orderBy: [''],
//     // startDate: '',
//     // endDate: '',
//   },
//   config: getConfig({ module: NotificationTemplate, action: 'View' }),
// });

// Add Notification Template
export const addNotificationTemplateConfig = () => ({
  url: `${prefix}`,
  config: getConfig({ module: NotificationTemplate, action: 'Create' }),
});

// Edit Notification Template
export const editNotificationTemplateConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: getConfig({ module: NotificationTemplate, action: 'Update' }),
});

// Get Notification Template By ID
export const getNotificationTemplateByIDConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: getConfig({ module: NotificationTemplate, action: 'View' }),
});

// Delete Notification Template
export const deleteNotificationTemplateConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: getConfig({ module: NotificationTemplate, action: 'Remove' }),
});

// Send Notification
export const sendNotificatoinConfig = () => ({
  url: `/api/v1/admin/notifications/send`,
  config: getConfig({ module: NotificationTemplate, action: 'Create' }),
});
