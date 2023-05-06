import React from 'react';
import {useTranslation} from 'react-i18next'

const Footer = () => {
  const {t} = useTranslation();
  return(
  <div className="mt-24">
    <p className="dark:text-gray-200 text-gray-700 text-center m-20">
      {t('rights_reserved')}
    </p>
  </div>
  )};

export default Footer;
