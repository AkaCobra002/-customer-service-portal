import React from "react";
import PropTypes from "prop-types";

/**
 * Generic Button
 *
 * Props:
 * - variant: "normal" | "background" | "alert"
 * - children: button content
 * - className: additional class names
 * - disabled, onClick, type, ...rest
 *
 * Behavior:
 * - "normal" -> text button (no background)
 * - "background" -> primary filled button
 * - "alert" -> danger filled button
 */

const baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 6,
  fontSize: 14,
  lineHeight: 1,
  border: "1px solid transparent",
  cursor: "pointer",
  userSelect: "none",
  transition:
    "background-color 120ms ease, transform 80ms ease, opacity 120ms ease",
};

const VARIANT = {
  normal: {
    background: "transparent",
    color: "#0b69ff", // primary text color
    border: "1px solid transparent",
  },
  background: {
    background: "#0b69ff",
    color: "#ffffff",
    border: "1px solid rgba(11,105,255,0.9)",
  },
  alert: {
    background: "#e23b3b",
    color: "#ffffff",
    border: "1px solid rgba(226,59,59,0.95)",
  },
};

const disabledStyle = {
  opacity: 0.6,
  cursor: "not-allowed",
  pointerEvents: "none",
  transform: "none",
};

/**
 * Button component
 */
export default function Button({
  variant = "normal",
  children,
  className = "",
  disabled = false,
  type = "button",
  style = {},
  ...rest
}) {
  const variantStyle = VARIANT[variant] || VARIANT.normal;
  const combinedStyle = {
    ...baseStyle,
    ...variantStyle,
    ...(disabled ? disabledStyle : {}),
    ...style,
  };

  return (
    <button
      type={type}
      className={className}
      style={combinedStyle}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(["normal", "background", "alert"]),
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  style: PropTypes.object,
};
