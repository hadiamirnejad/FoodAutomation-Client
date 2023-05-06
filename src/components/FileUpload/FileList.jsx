import React from 'react'
import FileItem from './FileItem'

function FileList({images, files, removeImage, removeFile, colorMode}) {
  return (
    <div className='flex-col justify-center items-center gap-y-16'>
      {images && images.map((image, index)=> <FileItem
          key={index}
          image={image}
          removeImage = {() => {removeImage(image)}}
          colorMode={colorMode}
        />)}
      {
        files && 
        files.map((f,index) => <FileItem
          key={index}
          file={f}
          removeFile = {() => {removeFile(f.name)}}
          colorMode={colorMode}
        />)
      }
    </div>
  )
}

export default FileList