/* Imports */
import React, { forwardRef } from 'react';
import dynamic from "next/dynamic";

/* Using dynamic import of Jodit component as it can't render in server side*/
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/*functions*/
const YourComponent = forwardRef((props, ref) => {
  return <JoditEditor ref={ref} {...props} />;
});

YourComponent.displayName = "JoditEditor";

export default YourComponent;