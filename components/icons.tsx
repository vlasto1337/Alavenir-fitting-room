import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.93 2.57a1.44 1.44 0 0 0-1.86 0L6.63 4.29a1.44 1.44 0 0 1-1.86 0L3.33 2.57a1.44 1.44 0 0 0-1.86 0L.03 4.29c-.5.52-.5 1.34 0 1.86l1.44 1.72a1.44 1.44 0 0 1 0 1.86l-1.44 1.72c-.5.52-.5 1.34 0 1.86l1.44 1.72a1.44 1.44 0 0 0 1.86 0l1.44-1.72a1.44 1.44 0 0 1 1.86 0l1.44 1.72a1.44 1.44 0 0 0 1.86 0l1.44-1.72a1.44 1.44 0 0 1 0-1.86l-1.44-1.72a1.44 1.44 0 0 1 0-1.86l1.44-1.72c.5-.52.5-1.34 0-1.86l-1.44-1.72a1.44 1.44 0 0 0-1.86 0Z M12 6.86v0M12 17.14v0" />
    <path d="M19.33 2.57a1.44 1.44 0 0 0-1.86 0l-1.44 1.72a1.44 1.44 0 0 1-1.86 0l-1.44-1.72a1.44 1.44 0 0 0-1.86 0l-1.44 1.72a1.44 1.44 0 0 0 0 1.86l1.44 1.72a1.44 1.44 0 0 1 0 1.86l-1.44 1.72a1.44 1.44 0 0 0 0 1.86l1.44 1.72a1.44 1.44 0 0 0 1.86 0l1.44-1.72a1.44 1.44 0 0 1 1.86 0l1.44 1.72a1.44 1.44 0 0 0 1.86 0l1.44-1.72a1.44 1.44 0 0 0 0-1.86l-1.44-1.72a1.44 1.44 0 0 1 0-1.86l1.44-1.72c.5-.52.5-1.34 0-1.86Z M24 6.86v0" />
  </svg>
);

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);


export const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const RedoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 7v6h-6"></path>
        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
    </svg>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m6 9 6 6 6-6"></path>
    </svg>
);