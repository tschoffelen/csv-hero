import React from "react";
import { createPopper } from "@popperjs/core";

export const Tooltip = ({ children, title }) => {
  const [tooltipShow, setTooltipShow] = React.useState(false);
  const btnRef = React.createRef();
  const tooltipRef = React.createRef();
  const openLeftTooltip = () => {
    createPopper(btnRef.current, tooltipRef.current, {
      placement: "top",

    });
    setTooltipShow(true);
  };
  const closeLeftTooltip = () => setTooltipShow(false);

  return (
    <>
      <span
        onMouseEnter={openLeftTooltip}
        onMouseLeave={closeLeftTooltip}
        ref={btnRef}>
        {children}
      </span>
      <div
        className={
          (tooltipShow ? "" : "hidden ") +
          "bg-gray-900 border-b text-white mb-5 block z-50 font-normal leading-normal text-xs p-2 py-1 max-w-xs text-left no-underline break-words rounded-lg"
        }
        ref={tooltipRef}
      >
        {title}
      </div>
    </>
  );
};
