import { getConfig } from 'lib';

const notificationsConfig = (action) => getConfig({ module: 'Notifications', action });

const prefix = `/api/v1/admin/notifications`;

export const getNotificationsConfig = () => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [],
      keyword: '',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
  },
  config:  notificationsConfig('View'),
});

export const notificationsReadConfig = () => ({
  url: `${prefix}/read`,
  config:  notificationsConfig('View'),
});
