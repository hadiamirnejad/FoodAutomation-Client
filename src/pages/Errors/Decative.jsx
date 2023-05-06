import React from 'react'

function Decative() {
  return (
    <div
    className={`mx-1 box-border bg-white dark:bg-secondary-dark-bg p-2 md:transition-2 pt-4 mt-[7.5rem] w-full h-96 flex justify-center items-center`}
  >
      <div className="w-96 rounded-md">
        <p className='text-sm text-red-500 dark:text-amber-500'>خطا:</p>
        <p>شما غیرفعال هستید.</p>
      </div>
    </div>
  )
}

export default Decative