
import React from 'react';

const DominoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-10 w-10 sm:h-12 sm:w-12 ml-3 text-cyan-400 drop-shadow-lg">
      <rect width="256" height="256" fill="none"/>
      <path d="M164.3,67.7,67.7,164.3a8,8,0,0,1-11.4,0l-16-16a8,8,0,0,1,0-11.4L137.7,40.3a8,8,0,0,1,11.4,0l16,16A8,8,0,0,1,164.3,67.7Z" opacity="0.2"/>
      <path d="M216,40H112a8,8,0,0,0,0,16h88V184H152a8,8,0,0,0-6.9,4.1,8,8,0,0,0,1.9,8.7l16,16a8,8,0,0,0,5.7,2.3,8.3,8.3,0,0,0,5.7-2.3l48-48a8,8,0,0,0,0-11.4Z" fill="currentColor" opacity="0.2"/>
      <path d="M216,32H112a16,16,0,0,0-16,16v88a16,16,0,0,0,32,0V59.3l88.7,88.7a16.1,16.1,0,0,0,22.6,0l16-16a16.1,16.1,0,0,0,0-22.6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" fill="currentColor" className="text-slate-700"/>
      <path d="M40.3,118.3,118.3,40.3a16.1,16.1,0,0,1,22.6,0l16,16a16.1,16.1,0,0,1,0,22.6L78.9,156.9,40.3,118.3Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" fill="currentColor" className="text-slate-400"/>
      <line x1="168" y1="88" x2="88" y2="168" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" className="text-slate-700"/>
      <circle cx="80" cy="80" r="12" fill="currentColor" className="text-slate-700"/>
      <circle cx="176" cy="176" r="12" fill="currentColor" className="text-slate-400"/>
    </svg>
)

const HistoryIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);


interface HeaderProps {
    onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="w-full flex items-center justify-between">
      <button onClick={onHistoryClick} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors" aria-label="عرض سجل اللعبة">
        <HistoryIcon className="h-7 w-7 text-slate-400" />
      </button>
      <div className="flex items-center justify-center flex-grow">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-md">
            حاسبة الدومينو
          </h1>
          <DominoIcon />
      </div>
      <div className="w-11"></div> {/* Spacer to balance the history button */}
    </header>
  );
};

export default Header;
