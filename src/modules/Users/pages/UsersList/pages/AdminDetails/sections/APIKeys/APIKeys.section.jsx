import {
  Button,
  // Select,
  Tooltip,
} from 'antd';
import {
  Copy,
  //  Down
} from 'icons';
import { Table } from 'components';
import './APIKeys.styles.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Add, Delete, EditAPIKey, EditPermissions } from './sections';
import { checkModule } from 'lib/checkModule';
import { useSelector, useDispatch } from 'react-redux';
import { getAPIKeysByUID } from 'store';
import { getAPIKeyByID } from 'store';

export const APIKeys = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  // Edit Modal State Start
  const [showEdit, setShowEdit] = useState(false);
  const [editPermissions, setEditPermissions] = useState(false);
  // Delete Modal State
  const [showDelete, setShowDelete] = useState(false);
  const [recordToDel, setRecordToDel] = useState(false);

  const { userModules } = useSelector((state) => state?.modules);
  const { apiKeys, loading } = useSelector((state) => state?.apiKeys);
  const { user } = useSelector((state) => state?.users);
  const { permissions } = checkModule({
    module: 'ManageUserApiKey',
    modules: userModules,
  });

  const { t } = useTranslation('/Users/ns');

  const columns = [
    {
      title: t('label'),
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: t('apiKey'),
      dataIndex: 'apiKey',
      key: 'apiKey',
      render: (text) => {
        return (
          <div className="flex gap-[8px] items-center">
            <div>{text}</div>
            <Tooltip title="Copied!" trigger="click">
              <div
                onClick={() => {
                  navigator.clipboard.writeText(text);
                }}
                className="cursor-pointer"
              >
                <Copy />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: t('validTill'),
      key: 'validTill',
      dataIndex: 'validTill',
    },
    {
      title: t('status'),
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <div
          className={`${
            status
              ? 'bg-[#1C3238] text-[#0BB783]'
              : 'bg-[#3A2434] text-[#F64E60]'
          } px-[8px] py-[4px] w-[fit-content] rounded-[4px]`}
        >
          {status ? 'ACTIVE' : 'INACTIVE'}
        </div>
      ),
    },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(getAPIKeysByUID(user?.id));
    }
  }, [user]);

  useEffect(() => {
    if (apiKeys) {
      let dataArr = [];
      apiKeys.forEach((key) => {
        dataArr.push({
          key: key?.id,
          label: key?.label !== null ? key?.label : 'N/A',
          apiKey: key?.applicationKey,
          // createdAt: key?.createdAt ? key?.createdAt : 'N/A',
          status: key?.statusApi,
          validTill: key?.validTill,
          tenant: key?.tenant,
        });
      });
      setData(dataArr);
    }
  }, [apiKeys]);

  return (
    <div className="mt-[20px] bg-[#000000] rounded-[8px] pb-[32px]">
      <h6 className="text-white text-[16px] px-[32px] pt-[32px]">API Keys</h6>
      <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[32px] mb-[32px]" />
      <div className="up-api-keys__table">
        <Table
          data={data}
          columns={columns}
          loading={loading}
          btnData={{ text: 'Add API Key', onClick: () => setShow(true) }}
          fieldToFilter="label"
          pagination={false}
          editAction={(record) => (
            <>
              <Button
                onClick={async () => {
                  await dispatch(getAPIKeyByID(record?.key));
                  setShowEdit(true);
                }}
              >
                Edit
              </Button>
              <Button
                onClick={async () => {
                  await dispatch(getAPIKeyByID(record?.key));
                  setEditPermissions(true);
                }}
              >
                Permissions
              </Button>
            </>
          )}
          deleteAction={(record) => {
            return (
              <Button
                onClick={async () => {
                  setRecordToDel(record?.key);
                  setShowDelete(true);
                }}
              >
                Delete
              </Button>
            );
          }}
          permissions={permissions}
          t={t}
        />
      </div>
      {/* Modals */}
      <Add show={show} setShow={setShow} />
      <EditAPIKey show={showEdit} setShow={setShowEdit} />
      <EditPermissions show={editPermissions} setShow={setEditPermissions} />
      <Delete show={showDelete} setShow={setShowDelete} id={recordToDel} />
    </div>
  );
};
