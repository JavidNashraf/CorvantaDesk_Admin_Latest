import { Route, Routes } from 'react-router-dom';
import { List, AddTemplate, EditTemplate } from './pages';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllEmailTemplates } from 'store';
import { getAllSMTPs } from 'store';
import { getUsers } from 'store';

function EmailTemplates() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getAllEmailTemplates());
      await dispatch(getAllSMTPs());
      await dispatch(getUsers());
    })();
  }, []);

  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="template/add" element={<AddTemplate />} />
      <Route path="edit/:id" element={<EditTemplate />} />
    </Routes>
  );
}

export default EmailTemplates;
