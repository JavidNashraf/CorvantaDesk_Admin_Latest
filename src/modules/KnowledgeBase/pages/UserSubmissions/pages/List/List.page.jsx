import { Submissions } from './sections';
import {getUsersSubmissions, approveUserSubmission } from "store/Actions/articles"
import GenerateNewTicket from 'components/GenerateTicket/GenerateNewTicket';
import { Modal } from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import { useEffect, useState } from "react";
import { Spin } from "antd";

export const List = () => {
  const dispatch = useDispatch();
  const {userSubmissions, loading} = useSelector((state) => state.articles);
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');
  const [clientId, setClientId] = useState('');
  
  async function handleApprove(id) {
    await dispatch(approveUserSubmission({id}));
    await dispatch(getUsersSubmissions());
  }

  function handleGenerateTicket(id, clientId) {
    setId(id);
    setClientId(clientId);
    setShow(true);
  }

  useEffect(() => {
    dispatch(getUsersSubmissions());
  }, []);
  return (
    <div className="p-[40px]">
      <Modal 
      size="lg"
       show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <GenerateNewTicket 
          id={id}
          clientId={clientId}
          />
        </Modal.Body>
      </Modal>
      <Spin tip={"Loading Please Wait..."}
      spinning={loading}>
      <Submissions 
      articles={userSubmissions}
      handleApprove={handleApprove}
      handleGenerateTicket={handleGenerateTicket}
       />
      </Spin>
    </div>
  );
};
