import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#030712] border-t border-slate-800/50 py-8 text-center text-slate-500 text-xs font-bold">
      <p>جميع الحقوق محفوظة © {new Date().getFullYear()} - إمبراطورية XERIV.</p>
    </footer>
  );
};

export default Footer;