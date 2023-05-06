import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import useToken from '../../hooks/useToken';

function FileUpload({ files, setFiles, removeFile }) {
  const { user, theme } = useSelector((state) => ({
    user: state.auth.user,
    theme: state.item,
  }));
  const inputFile = useRef();
  const { t } = useTranslation();
  const [accessToken, setToken] = useToken();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (errMsg !== "") {
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
    }
  }, [errMsg]);

  const uploadHandler = async (e) => {
    if (e.target.files[0] && e.target.files[0].type.substring(0,5)==="image") {
      const nfiles = e.target.files;
      setFiles([...files, ...nfiles]);
    }
  };
  return (
    <>
      <div className="flex-col justify-center items-center border-2 border-dashed border-[#edf2f7] p-1 min-h-230 min-w-full mb-2 text-gray-700 dark:text-gray-200">
        <div className="">
          <input
            className="hidden"
            ref={inputFile}
            type="file"
            multiple="multiple"
            onChange={uploadHandler}
            accept="/image/*"
          />
          <button
            className='w-full rounded-md my-2 p-1 px-5 text-white'
            onClick={() => {

              if (files.length > 9) {
                setErrMsg(t("maximum_10_files_exceeded"));
                return;
              }
              inputFile.current.click();
            }}
          >{t("select_file")}</button>
        </div>
        <div className="flex justify-center gap-3">
          <p className="text-center">{t('supported_files')}:</p>
          <p className="text-center">JPG, JPEG, PNG</p>
          <p className="text-center">({files.length} / 10)</p>
        </div>
          {errMsg && <p className="text-center text-red-500">{errMsg}</p>}
      </div>
    </>
  );
}

export default FileUpload;
