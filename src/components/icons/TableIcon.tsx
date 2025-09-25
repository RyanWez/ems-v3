
import React from 'react';

const TableIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125V5.625A1.125 1.125 0 0 1 3.375 4.5h17.25A1.125 1.125 0 0 1 21.75 5.625v12.75c0 .621-.504 1.125-1.125 1.125M9 4.5v15m6-15v15m-12.75-9h17.25" />
    </svg>
);

export default TableIcon;
