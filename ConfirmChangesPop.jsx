import PropTypes from "prop-types";
import React from "react";
import { useReducer } from "react";

export const ConfirmChangesPop = ({ stateProp, className }) => {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp || "default",
  });

  return (
    <div
      className={`w-[599px] left-5 grid grid-rows-3 gap-[36px_43px] grid-cols-2 h-[270px] px-[34px] py-[27px] rounded-[3px] bg-white relative ${state.state === "confirm-hover" ? "top-[310px]" : (state.state === "cancel-hover") ? "top-[600px]" : "top-5"} ${className}`}
    >
      <div
        className="w-[222px] row-[3_/_4] col-[2_/_3] h-16 relative"
        onMouseEnter={() => {
          dispatch("mouse_enter");
        }}
        onMouseLeave={() => {
          dispatch("mouse_leave");
        }}
      >
        <div
          className={`w-[220px] left-0 top-0 h-16 rounded-[3px] absolute ${state.state === "confirm-hover" ? "bg-variable-collection-primary-color" : "bg-[#6cdbef]"}`}
        />

        <div
          className={`[font-family:'Roboto-Regular',Helvetica] tracking-[0] text-[32px] top-[13px] text-brand-neutral-900 absolute font-normal leading-[normal] ${state.state === "default" ? "w-[220px]" : "w-[127px]"} ${state.state === "default" ? "left-0" : "left-14"}`}
        >
          {state.state === "default" && (
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Confirm</>
          )}

          {["cancel-hover", "confirm-hover"].includes(state.state) && (
            <>Confirm</>
          )}
        </div>
      </div>

      <div
        className="w-[222px] row-[3_/_4] col-[1_/_2] justify-self-end h-16 relative"
        onMouseEnter={() => {
          dispatch("mouse_enter_15");
        }}
        onMouseLeave={() => {
          dispatch("mouse_leave_15");
        }}
      >
        <div
          className={`w-[220px] left-0 top-0 h-16 rounded-[3px] absolute ${state.state === "cancel-hover" ? "bg-brand-neutral-400" : "bg-brand-neutral-300"}`}
        />

        <div className="[font-family:'Roboto-Regular',Helvetica] w-[109px] left-14 tracking-[0] text-[32px] top-[13px] text-brand-neutral-900 absolute font-normal leading-[normal]">
          Cancel
        </div>
      </div>

      <p className="[font-family:'Roboto-Regular',Helvetica] w-full row-[2_/_3] [align-self:start] tracking-[0] col-[1_/_3] text-2xl justify-self-start text-brand-neutral-900 relative h-7 font-normal whitespace-nowrap leading-[normal]">
        Are you sure you want to save the changes?
      </p>

      <div className="[font-family:'Roboto-Regular',Helvetica] w-[243px] row-[1_/_2] tracking-[0] col-[1_/_2] text-[32px] text-brand-neutral-900 relative h-[38px] font-normal whitespace-nowrap leading-[normal]">
        Confirm changes
      </div>
    </div>
  );
};

function reducer(state, action) {
  if (state.state === "default") {
    switch (action) {
      case "mouse_enter":
        return {
          state: "confirm-hover",
        };

      case "mouse_enter_15":
        return {
          state: "cancel-hover",
        };
    }
  }

  if (state.state === "confirm-hover") {
    switch (action) {
      case "mouse_leave":
        return {
          state: "default",
        };
    }
  }

  if (state.state === "cancel-hover") {
    switch (action) {
      case "mouse_leave_15":
        return {
          state: "default",
        };
    }
  }

  return state;
}

ConfirmChangesPop.propTypes = {
  stateProp: PropTypes.oneOf(["cancel-hover", "confirm-hover", "default"]),
};
