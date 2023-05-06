import React, { useEffect, useState } from 'react'
import {BsFillImageFill} from 'react-icons/bs'
import {FaTrashAlt} from 'react-icons/fa'
import {ImSpinner9} from 'react-icons/im'

function FileItem({file, image, removeImage, removeFile, colorMode}) {
  const [isUploading, setIsUploading] = useState(file?.isUploading || false)

  return (
    <div className='grid grid-cols-12 p-2 rounded-md' style={{border:`2px solid ${colorMode}`, color: colorMode}}>
      <div className="col-span-2 flex justify-center items-center">
        {image && <img src={image.src} className='text-gray-700 dark:text-white h-14 w-14'/>}
        {file && <img src={URL.createObjectURL(file)} className='text-gray-700 dark:text-white h-14 w-14'/>}
      </div>
      <div className="col-span-9 px-1">
        {image && <p className='text-sm text-gray-600 dark:text-gray-400'>{image.type}</p>}
        {image && <p className='truncate text-gray-800 dark:text-gray-200'>{image.src.split('/')[image.src.split('/').length - 1]}</p>}
        {image && <p className='text-sm text-gray-600 dark:text-gray-400'>{Math.round((image.size/1024 + Number.EPSILON) * 10) / 10} KB</p>}
        {file && <p className='text-sm text-gray-600 dark:text-gray-400'>{file.type}</p>}
        {file && <p className='truncate text-gray-800 dark:text-gray-200'>{file.name}</p>}
        {file && <p className='text-sm text-gray-600 dark:text-gray-400'>{Math.round((file.size/1024 + Number.EPSILON) * 10) / 10} KB</p>}
      </div>
      <div className="col-span-1 flex justify-center items-center">
        {image && (isUploading?(
          <ImSpinner9 onClick={() => {removeImage(image)}} className='text-2xl cursor-pointer hover:scale(150) text-red-500 animate-spin'/>
        ):(
          <FaTrashAlt onClick={() => {removeImage(image)}} className='text-2xl cursor-pointer hover:scale(150) transform duration-200 transition text-red-500'/>
        ))}
        {file && (isUploading?(
          <ImSpinner9 onClick={() => {removeFile(file.name)}} className='text-2xl cursor-pointer hover:scale(150) text-red-500 animate-spin'/>
        ):(
          <FaTrashAlt onClick={() => {removeFile(file.name)}} className='text-2xl cursor-pointer hover:scale(150) transform duration-200 transition text-red-500'/>
        ))}
      </div>
    </div>
  )
}

export default FileItem