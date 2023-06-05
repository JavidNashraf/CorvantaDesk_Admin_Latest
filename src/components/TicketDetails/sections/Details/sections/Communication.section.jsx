import { useParams } from 'react-router-dom';
import { Reply as ReplyIcon } from 'icons';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, List, Button, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  getTicketById,
  addTicketReplies,
  addTicketComments,
  editTicket,
} from 'store';
import { Button as CustomButton, Input, FollowUp } from 'components';
import { genrateFirstLetterName, getTimeDiff } from 'lib';
import { deleteComment } from 'store';
import { setTicketCommentLoading } from 'store';
import { updateTicketComments } from 'store';
import { getCurrentOnlineUsers } from 'store';
import moment from 'moment';
import { deleteTicketReplies } from 'store';

const CustomSelectUpdate = ({
  label,
  name,
  options,
  value,
  disabled,
  onChange,
  className,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={name} className='mb-[16px] text-white text-[14px]'>
        {label}
      </label>
      <select
        name={name}
        disabled={disabled}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        className='form-select appearance-none block w-full px-[16px] h-[52px] text-base font-normal text-[#FFFFFF] bg-[#08090A] bg-clip-padding bg-no-repeat border-none rounded-[8px] transition ease-in-out m-0 focus:bg-[#08090A] focus:border-none focus:outline-none'
      >
        {options?.map((option) => (
          <option
            value={option?.value}
            key={option?.value}
            className={option?.isActive ? 'text-[#3dff02]' : ''}
          >
            {option?.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const initialValues = {
  commentText: '',
};

const initialRepliesValues = {
  commentText: '',
};

const validationSchema = Yup.object().shape({
  commentText: Yup.string().required('Comment text is required'),
});

const validationSchemaReplies = Yup.object().shape({
  commentText: Yup.string().required('Comment text is required'),
});

export const Communication = () => {
  const { t } = useTranslation('/Tickets/ns');
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const [selected, setSelected] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const { users, onlineUsers } = useSelector((state) => state?.users);
  const { commentLoading } = useSelector((state) => state?.ticketComments);
  const { repliesLoading } = useSelector((state) => state?.ticketReplies);
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ticket } = useSelector((state) => state?.tickets);

  useEffect(() => {
    dispatch(getCurrentOnlineUsers());
  }, []);

  const commentSource = ticket?.ticketComments?.filter(
    (comment) => !comment?.isDraft
  );

  const finalComments = commentSource
    ?.sort((a, b) => (moment(a?.createdOn) < moment(b?.createdOn) ? -1 : 1))
    .sort((a, b) => Number(b?.isSticky) - Number(a?.isSticky));

  const fields = [
    {
      name: 'assignedTo',
      label: t('assignTo'),
      type: 'select',
      value: ticket?.assignedTo,
      options: () => {
        let usersData = [{ label: 'Any', value: '' }];
        users?.forEach((user) => {
          const isOnline = onlineUsers?.find(
            (admin) => admin?.userId === user?.id
          )
            ? true
            : false;
          usersData.push({
            value: user?.id,
            label: user?.fullName
              ? `${user?.fullName}${isOnline ? '   (Online)' : ''}`
              : 'N/A',
            isActive: isOnline ? true : false,
          });
        });

        return usersData?.sort((a, b) =>
          a?.isActive === b?.isActive ? 0 : a?.isActive ? -1 : 1
        );
      },
    },
    {
      name: 'ticketStatus',
      label: t('status'),
      type: 'select',
      value: ticket?.ticketStatus,
      options: () =>
        ['Active', 'Waiting', 'Closed', 'Closed and Locked']?.map(
          (el, idx) => ({
            label: el,
            value: idx,
          })
        ),
    },
    {
      name: 'ticketPriority',
      label: t('priority'),
      type: 'select',
      value: ticket?.ticketPriority,
      options: () =>
        ['Low', 'Normal', 'High'].map((el, idx) => ({
          label: el,
          value: idx,
        })),
    },
  ];

  // Ticket Data
  const ticketData = [
    { title: 'Ticket #', value: ticket?.id },
    {
      title: 'Client Email',
      value: ticket?.clientEmail,
    },
    {
      title: 'Client Full Name',
      value: ticket?.clientFullName,
    },
    { title: 'Product / Service', value: ticket?.product },
    { title: 'Brand', value: ticket?.brand?.name },
    { title: 'Department', value: ticket?.department?.name },
    {
      title: 'Idle',
      value: `${getTimeDiff(ticket?.lastModifiedOn)} since modified`,
    },
    {
      title: 'Duration',
      value: `${getTimeDiff(ticket?.createdOn)} since created`,
    },
    {
      title: 'Assigned To',
      value: ticket?.assignedToFullName,
    },
    {
      title: 'Number of Messages',
      value: ticket?.ticketComments?.length || '0',
    },
  ];

  const handleReplyInput = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleUpdateTicket = (e) => {
    if (e.target.value !== '') {
      const newValues = {
        ...ticket,
      };
      if (e.target.name === 'assignedTo') {
        newValues[e.target.name] = e.target.value;
      } else if (e.target.name === 'ticketStatus') {
        newValues[e.target.name] = parseInt(e.target.value);
      } else {
        newValues[e.target.name] = parseInt(e.target.value);
      }
      (async () => {
        await dispatch(editTicket({ data: newValues }));
        await dispatch(getTicketById(ticket?.id));
      })();
    }
  };
  // Follow-Up Modal
  const [showFollowUp, setShowFollowUp] = useState(false);

  return (
    <>
      <FollowUp show={showFollowUp} setShow={setShowFollowUp} />
      <div className='mt-[40px] grid grid-cols-3 gap-[32px]'>
        {ticketData?.map((data) => {
          return (
            <div className='flex items-center gap-[12px]'>
              <div className='text-[16px] text-[#474761] whitespace-nowrap'>
                {data?.title}:
              </div>
              <div className={'text-[14px]'}>
                {data?.value ? data?.value : 'N/A'}
              </div>
            </div>
          );
        })}
      </div>
      <div className={'text-[14px] mt-[40px] mb-[40px]'}>
        <div className='flex items-center gap-[12px]'>
          <div className='text-[16px] text-[#474761]'>Description:</div>
          <div
            className={'text-[14px]'}
            dangerouslySetInnerHTML={{ __html: ticket?.description }}
          ></div>
        </div>
      </div>
      <div className={`form ticket-form `}>
        <div className='grid grid-cols-3 gap-[20px] mb-[32px] items-end'>
          {fields.map((field) => (
            <div className='flex items-end' key={field?.name}>
              <CustomSelectUpdate
                key={field.name}
                name={field.name}
                label={field?.label}
                placeholder={field.placeholder}
                type={field.type}
                options={field.options()}
                className={'custom-selectt'}
                value={field.value}
                onChange={(e) => handleUpdateTicket(e)}
              />
            </div>
          ))}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values) => {}}
        >
          {({ values }) => (
            <Form>
              <div
                className={`relative mb-[32px] items-end ${
                  ticket?.ticketStatus === 3 || ticket?.assignedTo === ''
                    ? 'pointer-events-none opacity-30'
                    : ''
                }`}
              >
                <Input
                  key={'commentText'}
                  name={'commentText'}
                  label={''}
                  placeholder={'Share Your Comments'}
                  type={'textarea'}
                  rows={'7'}
                />
                <div className='absolute bottom-5 right-5 flex items-center gap-[12px]'>
                  <Dropdown
                    overlay = {
                      <>
                        {[
                          'Send and Mark Active',
                          'Send and Mark Waiting',
                          'Send and Mark Closed',
                          'Send and Mark Closed & Locked',
                        ].map((el, idx) => {
                          return (
                            <Button
                              onClick={async () => {
                                const newValues = {
                                  commentText: values?.commentText,
                                  ticketId: ticket?.id,
                                  isSticky: false,
                                  isDraft: false,
                                  ticketCommentType: 0,
                                  ticketCommentAction: 0,
                                };
                                await dispatch(addTicketComments(newValues));
                                dispatch(setTicketCommentLoading(true));
                                await dispatch(
                                  editTicket({
                                    data: { ...ticket, ticketStatus: idx },
                                  })
                                );
                                await dispatch(getTicketById(ticket?.id, true));
                                dispatch(setTicketCommentLoading(false));
                              }}
                              loading={commentLoading}
                            >
                              {el}
                            </Button>
                          );
                        })}
                      </>
                    }
                    overlayClassName='custom-table__table-dropdown-overlay'
                    className='custom-table__table-dropdown'
                    destroyPopupOnHide
                    placement='bottomRight'
                    trigger={['click', 'contextMenu']}
                  >
                    <CustomButton
                      loading={commentLoading}
                      className='px-[16px] py-[5px] text-[14px] h-[36px]'
                    >
                      Send
                    </CustomButton>
                  </Dropdown>
                  <CustomButton
                    loading={commentLoading}
                    onClick={async () => {
                      const newValues = {
                        commentText: values?.commentText,
                        ticketId: ticket?.id,
                        isSticky: false,
                        isDraft: true,
                        ticketCommentType: 0,
                      };
                      await dispatch(addTicketComments(newValues));
                      dispatch(setTicketCommentLoading(true));
                      await dispatch(getTicketById(ticket?.id, true));
                      dispatch(setTicketCommentLoading(false));
                    }}
                    className='px-[16px] py-[5px] text-[14px] h-[36px]'
                  >
                    Save as Draft
                  </CustomButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Description */}
      <div
        id={ticket?.id}
        className={`${
          ticket?.clientFullName ? 'border-[#FFA800]/50' : 'border-[#8950FC]/70'
        } p-[20px] border-[1px] rounded-[8px]`}
      >
        <div className='w-full relative flex gap-3'>
          <div className='image w-[55px] h-full rounded-[5px] overflow-hidden'>
            {ticket?.clientFullName ? (
              ticket?.userImagePath ? (
                <img
                  src={ticket?.userImagePath}
                  alt={ticket?.clientFullName}
                  className='w-[47px] h-[47px]'
                />
              ) : (
                <div className='bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center'>
                  {genrateFirstLetterName(ticket?.clientFullName)}
                </div>
              )
            ) : (
              <div className='bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center'>
                {genrateFirstLetterName('A')}
              </div>
            )}
          </div>

          <div className='flex flex-col w-full gap-[2px]'>
            <div className='flex justify-between w-full items-center'>
              <div className='flex align-center items-center'>
                <p className='text-[#fff] text-[16px] h-fit'>
                  {ticket?.clientFullName || 'Admin'}
                </p>
                <span
                  className={`${
                    ticket?.clientFullName
                      ? 'bg-[#392F28] text-[#FFA800]'
                      : 'bg-[#2F264F] text-[#8950FC]'
                  } py-1 px-2 rounded text-xs ml-2 flex items-center justify-center`}
                >
                  {ticket?.clientFullName ? 'CLIENT' : 'ADMIN'}
                </span>
              </div>

              <div className='flex items-center gap-[12px] text-[16px]'></div>
            </div>
            <p className='text-[14px] text-[#474761] rounded-sm'>
              {getTimeDiff(ticket?.createdOn)} ago
            </p>
          </div>
        </div>
        <div className='text-[16px] text-[#92928F] mt-[20px] leading-7'>
          <div dangerouslySetInnerHTML={{ __html: ticket?.description }}></div>
        </div>
      </div>

      {/* Comments */}
      <div className={'ticket-list-wrap custom-table__table mt-4'}>
        <List
          itemLayout='vertical'
          size='large'
          pagination={{
            defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50', '100', '200'],
          }}
          dataSource={finalComments}
          footer={''}
          renderItem={(item) => (
            <List.Item key={item.id} actions={''} extra={''}>
              <div
                id={item.id}
                className={`${
                  item?.ticketCommentType === 1 &&
                  users?.find((user) => user?.id === item.createdBy)
                    ? 'border-[#0BB783]/30'
                    : item?.ticketCommentType === 1 &&
                      users?.find((user) => user?.id !== item.createdBy)
                    ? 'border-[#FFA800]/50'
                    : users?.find((user) => user?.id === item.createdBy)
                    ? ' border-[#8950FC]/50'
                    : ' border-[#FFA800]/50'
                } p-[20px] border-[1px] rounded-[8px]`}
              >
                <div className={'w-full relative'}>
                  <div className='flex'>
                    <div className='image w-[47px] rounded-[5px] overflow-hidden'>
                      {item?.userImagePath ? (
                        <img
                          src={item?.userImagePath}
                          alt={item?.userFullName}
                        />
                      ) : (
                        <div className='bg-[#171723] text-[#0BB783]  px-[8px] py-[4px] uppercase w-[40px] h-[40px] rounded-[4px] flex justify-center items-center'>
                          {genrateFirstLetterName(
                            item.userFullName || 'Client'
                          )}
                        </div>
                      )}
                    </div>
                    <div className='meta ml-[16px]'>
                      <div className='flex align-center'>
                        <span className='text-[#fff] text-[16px]'>
                          {item?.userFullName || 'Client'}
                        </span>
                        <span
                          className={`${
                            users?.find((user) => user?.id === item.createdBy)
                              ? 'bg-[#2F264F] text-[#8950FC]'
                              : 'bg-[#392F28] text-[#FFA800]'
                          } rounded-[4px] text-[14px] px-[8px] py-[4px] ml-3`}
                        >
                          {users?.find((user) => user?.id === item.createdBy)
                            ? 'Admin'
                            : 'Client'}
                        </span>
                        {item?.ticketCommentType === 1 && (
                          <span
                            className={`bg-[#1C3238]/50 text-[#0BB783]/70 rounded-[4px] text-[14px] px-[8px] py-[4px] ml-3`}
                          >
                            {item?.ticketCommentAction === 0
                              ? 'GENERAL COMMENT'
                              : item?.ticketCommentAction === 1
                              ? 'TRANSFER COMMENT'
                              : item?.ticketCommentAction === 2
                              ? 'FOLLOW-UP COMMENT'
                              : item?.ticketCommentAction === 3
                              ? 'PRIORITY COMMENT'
                              : ''}
                          </span>
                        )}

                        {/* {item.createdBy === ticket.createdBy && (
                          <span className="bg-[#3A2434] p-[4px] text-[#F64E60] rounded-[4px] text-[14px] px-[8px] py-[4px] ml-2">
                            AUTHOR
                          </span>
                        )} */}

                        <div className='flex items-center  ml-3'>
                          <p className='text-[14px] text-[#474761]'>
                            -{' '}
                            {moment(item?.createdOn)?.format(
                              dateFormat
                            )}{' '}
                            -
                          </p>
                          <p className='text-[14px] text-[#FFFFFF] bg-[#323248] px-2 rounded-sm mx-2'>
                            {`${getTimeDiff(item?.createdOn)} ago`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {ticket?.ticketStatus !== 3 && (
                    <div className='flex items-center gap-[12px] text-[16px] absolute right-5 top-1'>
                      {item?.ticketCommentType !== 1 && (
                        <span
                          onClick={() => handleReplyInput(item.id)}
                          className={
                            'text-[#474761] cursor-pointer hover:text-[#40a9ff]'
                          }
                        >
                          Reply
                        </span>
                      )}
                      {item?.createdBy === user?.id ? (
                        <Popconfirm
                          okButtonProps={{
                            className: 'bg-[#40a9ff]',
                          }}
                          title='Are you sure you want to delete this comment?'
                          onConfirm={async () => {
                            await dispatch(deleteComment({ id: item?.id }));
                            dispatch(setTicketCommentLoading(true));
                            await dispatch(getTicketById(ticket?.id, true));
                            dispatch(setTicketCommentLoading(false));
                          }}
                        >
                          <div
                            className={
                              'text-[#474761] cursor-pointer hover:text-[#F64E60]'
                            }
                          >
                            Delete
                          </div>
                        </Popconfirm>
                      ) : (
                        <></>
                      )}

                      <span
                        to='#'
                        onClick={async () => {
                          await dispatch(
                            updateTicketComments({
                              data: {
                                ...item,
                                isSticky: !item?.isSticky,
                              },
                            })
                          );
                          dispatch(setTicketCommentLoading(true));
                          await dispatch(getTicketById(ticket?.id, true));
                          dispatch(setTicketCommentLoading(false));
                        }}
                        className={`cursor-pointer ${
                          item?.isSticky ? ' text-[#40a9ff]' : ' text-[#474761]'
                        }`}
                      >
                        {item?.isSticky ? 'Unpin' : 'Pin'}
                      </span>
                    </div>
                  )}
                </div>
                <div className='text-[16px] text-[#92928F] mt-[20px] leading-7'>
                  {item?.commentText}
                </div>
                {isSelected(item.id) && (
                  <div className={'reply-box mt-[20px] relative'}>
                    <Formik
                      initialValues={initialRepliesValues}
                      validationSchema={validationSchemaReplies}
                      enableReinitialize
                      onSubmit={async (values) => {
                        const newValues = {
                          commentText: values?.commentText,
                          ticketCommentId: item.id,
                        };
                        (async () => {
                          await dispatch(addTicketReplies(newValues));
                          await dispatch(getTicketById(id));
                          setSelected([]);
                        })();
                      }}
                    >
                      {({ errors, touched }) => {
                        return (
                          <Form>
                            <div
                              className={`relative  ${
                                ticket?.ticketStatus === 3 ||
                                ticket?.assignedTo === ''
                                  ? 'pointer-events-none opacity-30'
                                  : ''
                              }`}
                            >
                              <Field
                                className='modal__form-el-field'
                                key='commentText'
                                type='text'
                                name='commentText'
                                placeholder='Write Something'
                              />
                              <Button
                                htmlType='submit'
                                loading={repliesLoading}
                                className='absolute bottom-5 right-4 py-[0px] px-[0px] bg-none bg-transparent border-none'
                              >
                                <ReplyIcon />
                              </Button>
                            </div>
                            {touched['commentText'] &&
                              errors['commentText'] && (
                                <div className='error mt-[8px]'>
                                  {errors['commentText']}
                                </div>
                              )}
                          </Form>
                        );
                      }}
                    </Formik>
                  </div>
                )}
              </div>
              <div className='ml-[40px]'>
                {item?.ticketCommentReplies
                  ?.slice()
                  .sort((a, b) => moment(a.createdOn) - moment(b.createdOn))
                  ?.map((data, i) =>
                    !data.ticketCommentParentReplyId ? (
                      <div>
                        {/* Reply on Comment */}
                        <div
                          key={i}
                          id={data?.id}
                          className={`${
                            users?.find((user) => user?.id === data?.createdBy)
                              ? ' border-[#8950FC]/70'
                              : ' border-[#FFA800]/70'
                          } p-[20px] border-[1px] rounded-[8px] mt-[20px]`}
                        >
                          <div className={'w-full relative'}>
                            <div className='flex'>
                              <div className='image w-[47px] rounded-[5px] overflow-hidden'>
                                {data?.userImagePath ? (
                                  <img
                                    src={data?.userImagePath}
                                    alt={data?.userFullName}
                                  />
                                ) : (
                                  <div className='bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[40px] h-[40px] rounded-[4px] flex justify-center items-center'>
                                    {genrateFirstLetterName(
                                      data?.userFullName || 'Client'
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className='meta ml-[16px]'>
                                <div className='flex align-center'>
                                  <span className='text-[#fff] text-[16px]'>
                                    {data?.userFullName || 'Client'}
                                  </span>
                                  <span
                                    className={`${
                                      users?.find(
                                        (user) => user?.id === data?.createdBy
                                      )
                                        ? 'bg-[#2F264F] text-[#8950FC]'
                                        : 'bg-[#392F28] text-[#FFA800]'
                                    } rounded-[4px] text-[14px] px-[8px] py-[4px] ml-3`}
                                  >
                                    {users?.find(
                                      (user) => user?.id === data.createdBy
                                    )
                                      ? 'Admin'
                                      : 'Client'}
                                  </span>
                                  {/* {data.createdBy === ticket.createdBy && (
                              <span className="bg-[#3A2434] p-[4px] text-[#F64E60] rounded-[4px] text-[14px] px-[8px] py-[4px] ml-2">
                                AUTHOR
                              </span>
                            )} */}
                                  <div className='flex items-center  ml-3'>
                                    <p className='text-[14px] text-[#474761]'>
                                      -{' '}
                                      {moment(data?.createdOn)?.format(
                                        dateFormat
                                      )}{' '}
                                      -
                                    </p>
                                    <p className='text-[14px] text-[#FFFFFF] bg-[#323248] px-2 rounded-sm mx-2'>
                                      {`${getTimeDiff(data?.createdOn)} ago`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {ticket?.ticketStatus !== 3 && (
                              <div className='flex items-center gap-[12px] text-[16px] absolute right-5 top-1'>
                                {data?.ticketCommentType !== 1 && (
                                  <span
                                    onClick={() => handleReplyInput(data.id)}
                                    className={
                                      'text-[#474761] cursor-pointer hover:text-[#40a9ff]'
                                    }
                                  >
                                    Reply
                                  </span>
                                )}
                                {data?.createdBy === user?.id &&
                                ticket?.ticketStatus !== 3 ? (
                                  <Popconfirm
                                    okButtonProps={{
                                      className: 'bg-[#40a9ff]',
                                    }}
                                    title='Are you sure you want to delete this reply?'
                                    onConfirm={async () => {
                                      await dispatch(
                                        deleteTicketReplies(data?.id)
                                      );
                                      dispatch(setTicketCommentLoading(true));
                                      await dispatch(
                                        getTicketById(ticket?.id, true)
                                      );
                                      dispatch(setTicketCommentLoading(false));
                                    }}
                                  >
                                    <span
                                      className={
                                        'text-[#474761] cursor-pointer hover:text-[#F64E60]'
                                      }
                                    >
                                      Delete
                                    </span>
                                  </Popconfirm>
                                ) : (
                                  <></>
                                )}
                              </div>
                            )}
                          </div>
                          <div className='text-[16px] text-[#92928F] mt-[20px] leading-7'>
                            {data?.commentText}
                          </div>
                          {isSelected(data.id) && (
                            <div className={'reply-box mt-[20px] relative'}>
                              <Formik
                                initialValues={initialRepliesValues}
                                validationSchema={validationSchemaReplies}
                                enableReinitialize
                                onSubmit={async (values) => {
                                  const newValues = {
                                    commentText: values?.commentText,
                                    ticketCommentId: item.id,
                                    ticketCommentParentReplyId: data.id,
                                  };
                                  (async () => {
                                    await dispatch(addTicketReplies(newValues));
                                    await dispatch(getTicketById(id));
                                    setSelected([]);
                                  })();
                                }}
                              >
                                {({ errors, touched, values }) => {
                                  return (
                                    <Form>
                                      <Field
                                        className='modal__form-el-field'
                                        key='commentText'
                                        type='text'
                                        name='commentText'
                                        placeholder='Write Something'
                                      />
                                      {touched['commentText'] &&
                                        errors['commentText'] && (
                                          <div className='error mt-[8px]'>
                                            {errors['commentText']}
                                          </div>
                                        )}
                                      <Button
                                        htmlType='submit'
                                        loading={repliesLoading}
                                        className='absolute bottom-5 right-4 py-[0px] px-[0px] bg-none bg-transparent border-none'
                                      >
                                        <ReplyIcon />
                                      </Button>
                                    </Form>
                                  );
                                }}
                              </Formik>
                            </div>
                          )}
                        </div>

                        {/* Replies on Reply */}
                        {item.ticketCommentReplies
                          .filter(
                            (repliesOnReply) =>
                              repliesOnReply.ticketCommentParentReplyId ===
                              data.id
                          )
                          ?.slice()
                          ?.sort(
                            (a, b) => moment(a.createdOn) - moment(b.createdOn)
                          )
                          ?.map((repliesOnReplyData, i) => (
                            <div
                              key={i}
                              id={repliesOnReplyData?.id}
                              className={`${
                                users?.find(
                                  (user) =>
                                    user?.id === repliesOnReplyData?.createdBy
                                )
                                  ? ' border-[#8950FC]/70'
                                  : ' border-[#FFA800]/70'
                              } p-[20px] border-[1px] rounded-[8px] mt-[20px] ml-[40px]`}
                            >
                              <div className={'w-full relative'}>
                                <div className='flex'>
                                  <div className='image w-[47px] rounded-[5px] overflow-hidden'>
                                    {repliesOnReplyData?.userImagePath ? (
                                      <img
                                        src={repliesOnReplyData?.userImagePath}
                                        alt={repliesOnReplyData?.userFullName}
                                      />
                                    ) : (
                                      <div className='bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[40px] h-[40px] rounded-[4px] flex justify-center items-center'>
                                        {genrateFirstLetterName(
                                          repliesOnReplyData?.userFullName ||
                                            'Client'
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className='meta ml-[16px]'>
                                    <div className='flex align-center'>
                                      <span className='text-[#fff] text-[16px]'>
                                        {repliesOnReplyData?.userFullName ||
                                          'Client'}
                                      </span>
                                      <span
                                        className={`${
                                          users?.find(
                                            (user) =>
                                              user?.id ===
                                              repliesOnReplyData?.createdBy
                                          )
                                            ? 'bg-[#2F264F] text-[#8950FC]'
                                            : 'bg-[#392F28] text-[#FFA800]'
                                        } rounded-[4px] text-[14px] px-[8px] py-[4px] ml-3`}
                                      >
                                        {users?.find(
                                          (user) =>
                                            user?.id ===
                                            repliesOnReplyData.createdBy
                                        )
                                          ? 'Admin'
                                          : 'Client'}
                                      </span>

                                      <div className='flex items-center  ml-3'>
                                        <p className='text-[14px] text-[#474761]'>
                                          -{' '}
                                          {moment(
                                            repliesOnReplyData?.createdOn
                                          )?.format(localStorage.getItem('dateFormat'))}{' '}
                                          -
                                        </p>
                                        <p className='text-[14px] text-[#FFFFFF] bg-[#323248] px-2 rounded-sm mx-2'>
                                          {`${getTimeDiff(
                                            repliesOnReplyData?.createdOn
                                          )} ago`}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {repliesOnReplyData?.createdBy === user?.id &&
                                  ticket?.ticketStatus !== 3 && (
                                    <div className='flex items-center gap-[12px] text-[16px] absolute right-5 top-1'>
                                      {repliesOnReplyData?.createdBy ===
                                      user?.id ? (
                                        <Popconfirm
                                          okButtonProps={{
                                            className: 'bg-[#40a9ff]',
                                          }}
                                          title='Are you sure you want to delete this reply?'
                                          onConfirm={async () => {
                                            await dispatch(
                                              deleteTicketReplies(
                                                repliesOnReplyData?.id
                                              )
                                            );
                                            dispatch(
                                              setTicketCommentLoading(true)
                                            );
                                            await dispatch(
                                              getTicketById(ticket?.id, true)
                                            );
                                            dispatch(
                                              setTicketCommentLoading(false)
                                            );
                                          }}
                                        >
                                          <span
                                            className={
                                              'text-[#474761] cursor-pointer hover:text-[#F64E60]'
                                            }
                                          >
                                            Delete
                                          </span>
                                        </Popconfirm>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  )}
                              </div>
                              <div className='text-[16px] text-[#92928F] mt-[20px] leading-7'>
                                {repliesOnReplyData?.commentText}
                              </div>
                              {isSelected(repliesOnReplyData.id) && (
                                <div className={'reply-box mt-[20px] relative'}>
                                  <Formik
                                    initialValues={initialRepliesValues}
                                    validationSchema={validationSchemaReplies}
                                    enableReinitialize
                                    onSubmit={async (values) => {
                                      const newValues = {
                                        commentText: values?.commentText,
                                        ticketCommentId: item.id,
                                        ticketCommentParentReplyId:
                                          repliesOnReplyData.id,
                                      };
                                      (async () => {
                                        await dispatch(
                                          addTicketReplies(newValues)
                                        );
                                        await dispatch(getTicketById(id), true);
                                        setSelected([]);
                                      })();
                                    }}
                                  >
                                    {({ errors, touched, values }) => {
                                      return (
                                        <Form>
                                          <Field
                                            className='modal__form-el-field'
                                            key='commentText'
                                            type='text'
                                            name='commentText'
                                            placeholder='Write Something'
                                          />
                                          {touched['commentText'] &&
                                            errors['commentText'] && (
                                              <div className='error mt-[8px]'>
                                                {errors['commentText']}
                                              </div>
                                            )}
                                          <Button
                                            htmlType='submit'
                                            loading={repliesLoading}
                                            className='absolute bottom-5 right-4 py-[0px] px-[0px] bg-none bg-transparent border-none'
                                          >
                                            <ReplyIcon />
                                          </Button>
                                        </Form>
                                      );
                                    }}
                                  </Formik>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : null
                  )}
              </div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
