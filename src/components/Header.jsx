import React from 'react';

const Header = ({ category, title }) => (
  <nav className=" mb-10">
    <p className="text-lg text-gray-400">{category}</p>
    <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      {title}
    </p>
  </nav>
);

export default Header;
