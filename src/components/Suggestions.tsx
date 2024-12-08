import React from 'react'

export const Suggestions = ({text, setInput}:any) => {
  return (
    <div className='my-2 py-2.5 px-5 text-lg text-black text-opacity-75 rounded-3xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:text-opacity-100'>
     <p onClick={()=>{setInput(text)}} >{text}</p>
    </div>
  )
}

// import React, { useState, useEffect } from 'react';

// export const Suggestions = ({ text }: { text: string }) => {
//   const [displayedText, setDisplayedText] = useState('');

//   useEffect(() => {
//     let index = 0;
//     const interval = setInterval(() => {
//       setDisplayedText((prev) => prev + text[index]);
//       index++;
//       if (index === text.length) {
//         clearInterval(interval);
//       }
//     }, 16); // Adjust the interval (50ms) for speed of typing effect

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [text]);

//   return (
//     <div className="h-[45px] my-2 py-2.5 px-5 text-lg text-black text-opacity-75 rounded-3xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:text-opacity-100">
//       <p>{displayedText}</p>
//     </div>
//   );
// };
