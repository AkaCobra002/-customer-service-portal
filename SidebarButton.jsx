import React from "react";

export default function SidebarButton({
  children,
  selected = false,
  className = "",
  activeClassName = "text-primary font-semibold",
  inactiveClassName = "text-gray-500 hover:text-primary hover:text-opacity-80",
  indicatorClassName = "bg-primary",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`group flex w-full h-16 items-center py-2 transition-colors ${
        selected ? activeClassName : inactiveClassName
      } ${className}`}
      {...props}
    >
      <div
        className={`h-full w-1 rounded-r-lg ${indicatorClassName} transition-opacity ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        }`}
      />

      {/* Button Content */}
      <div className="flex flex-1 items-center justify-start gap-4 px-7">
        {typeof children === "object" && children?.icon ? (
          <>
            {children.icon}
            <span className="truncate">{children.name}</span>
          </>
        ) : (
          children
        )}
      </div>
    </button>
  );
}
