import { Ticket as TicketIcon } from 'icons';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getTicketById } from 'store';
import { getTimeDiff } from 'lib';
import {
  Communication,
  TicketHistory,
  Navigation,
  Comments,
  Drafts,
} from './sections';
import { Link, useLocation } from 'react-router-dom';
import { getUsersByDepartmentID } from 'store';
import moment from 'moment';

export function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export const Details = () => {
  const dispatch = useDispatch();
  const { detailsLoading, ticket, ticketHistory } = useSelector(
    (state) => state?.tickets
  );
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const { usersLoading } = useSelector((state) => state?.departments);
  const { users, clients } = useSelector((state) => state?.users);
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let repliesId = params.get('id');
  const query = useQuery();
  const id = query.get('tid');

  const createdByAdmin = users?.find((user) => user?.id === ticket?.createdBy);
  // const createdByClient = clients?.find(
  //   (user) => user?.id === ticket?.createdBy
  // );
  useEffect(() => {
    (async () => {
      if (id) {
        await dispatch(getTicketById(id, false));
        goToViolation(repliesId);
      }
    })();
  }, [id, repliesId]);

  useEffect(() => {
    (async () => {
      if (ticket?.departmentId) {
        await dispatch(getUsersByDepartmentID({ id: ticket?.departmentId }));
      }
    })();
  }, [ticket]);

  const goToViolation = (id) => {
    const violation = document.getElementById(id);
    if (violation) {
      violation.scrollIntoView();
    }
  };

  const communication = ticket?.ticketComments?.filter(
    (comment) => !comment?.isDraft
  );
  const comments = ticket?.ticketComments?.filter(
    (comment) => comment?.ticketCommentType === 1 && !comment?.isDraft
  );
  const drafts = ticket?.ticketComments?.filter(
    (comment) => comment?.isDraft === true
  );

  const linksArr = [
    {
      label: 'Communication',
      count: communication?.length > 0 ? communication?.length : 0,
    },
    {
      label: 'Drafts',
      count: drafts?.length > 0 ? drafts?.length : 0,
    },
    {
      label: 'Comments',
      count: comments?.length > 0 ? comments?.length : 0,
    },
    {
      label: 'History',
      count: ticketHistory?.length > 0 ? ticketHistory?.length : 0,
    },
  ];
  // Handle Navigation
  const [active, setActive] = useState(linksArr[0]?.label);
  const links = linksArr?.map((link) => {
    return {
      label: link?.label,
      count: link?.count,
      showCount: true,
      onClick: () => setActive(link?.label),
    };
  });

  const ticketStatus = ticket?.ticketStatus;

  return (
    <>
      {id ? (
        <div className='ticket-wrap bg-[#000000] text-[#ffffff] p-[40px] rounded-[8px]'>
          {ticket === null && !detailsLoading && !usersLoading ? (
            <></>
          ) : detailsLoading || usersLoading ? (
            <div className='text-center'>
              <Spin
                size='large'
                style={{ gridColumn: '1/3', alignSelf: 'center' }}
              />
            </div>
          ) : (
            <div className=''>
              <div className='flex'>
                <div className='w-[50px] tick'>
                  <TicketIcon />
                </div>
                <div className='ml-[20px]'>
                  <h3 className={'text-[24px] text-[#fff]'}>
                    {ticket?.ticketTitle} -
                    <span
                      className={`ml-1
                        ${
                          ticketStatus === 0
                            ? 'text-[#0BB783]'
                            : ticketStatus === 1
                            ? 'text-[#FFA400]'
                            : 'text-[#DD3224]'
                        }
                      `}
                    >
                      {ticketStatus === 0
                        ? 'Active'
                        : ticketStatus === 1
                        ? 'Waiting'
                        : ticketStatus === 2
                        ? 'Closed'
                        : 'Closed and Locked'}
                    </span>
                  </h3>
                  <div className='flex items-center  my-[12px]'>
                    <p className='text-[14px] text-[#474761]'>
                      {moment(ticket?.createdOn)?.format(localStorage.getItem('dateFormat'))}{' '}
                      -
                    </p>
                    <p className='text-[14px] text-[#FFFFFF] bg-[#323248] px-2 rounded-sm mx-2'>
                      {`Duration ${getTimeDiff(ticket?.createdOn)}`}
                    </p>
                    <p className='text-[14px] text-[#FFFFFF] bg-[#323248] px-2 rounded-sm mr-2'>
                      {`Idle ${getTimeDiff(ticket?.lastModifiedOn)}`}
                    </p>
                  </div>
                  <div
                    className={
                      'mt-[8px] text-[#474761] flex items-center gap-[12px]'
                    }
                  >
                    <p className='text-[14px]'>
                      By{' '}
                      {!ticket?.incomingFromClient && createdByAdmin?.fullName
                        ? createdByAdmin?.fullName
                        : ticket?.clientFullName
                        ? ticket?.clientFullName
                        : 'N/A'}
                    </p>{' '}
                    <Link
                      to={
                        !ticket?.incomingFromClient && createdByAdmin?.fullName
                          ? `/admin/dashboard/settings/users/list/admin-details/${createdByAdmin?.id}`
                          : `/admin/dashboard/billing/clients/list/details/${
                              clients?.find(
                                (client) =>
                                  client?.fullName === ticket?.clientFullName
                              )?.id
                            }`
                      }
                      className={`${
                        !ticket?.incomingFromClient && createdByAdmin?.fullName
                          ? 'bg-[#2F264F] text-[#8950FC]'
                          : 'bg-[#392F28] text-[#FFA800]'
                      } rounded-[4px] text-[14px] px-[8px] py-[4px]`}
                    >
                      {!ticket?.incomingFromClient && createdByAdmin?.fullName
                        ? 'Admin'
                        : ticket?.clientFullName
                        ? 'Client'
                        : 'N/A'}
                    </Link>
                  </div>
                </div>
              </div>
              {/* navigation */}
              <Navigation active={active} links={links} />
              {active === 'Communication' ? <Communication /> : <></>}
              {active === 'Drafts' ? <Drafts setActive={setActive} /> : <></>}
              {active === 'Comments' ? <Comments /> : <></>}
              {active === 'History' ? <TicketHistory /> : <></>}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
