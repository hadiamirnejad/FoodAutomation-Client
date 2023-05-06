import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import {Toast} from './'

function Layout({ children}, {user }) {
  const { t } = useTranslation();
  const location = useLocation();

  document.title = location.pathname === '/' ? 'سامانه جامع' : t(location.pathname.replace('/', ''));
  return (
    <>
      {location.pathname !== '/signin' && <header className='bg-main-bg dark:bg-main-dark-bg navbar w-full'>
        <Navbar user={user}/>
      </header>}
      <main>{children}</main>
      <Toast duration={2} positionX='end-0' positionY='bottom-5'/>
    </>
  );
}

export default Layout;
