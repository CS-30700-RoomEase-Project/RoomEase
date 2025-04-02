// had to build this to avoid addig weird dependencies
import React from "react";

export const Select = ({ children, ...props }) => (
  <select {...props}>{children}</select>
);

export const SelectTrigger = ({ children, ...props }) => (
  <div {...props} style={{ border: "1px solid #ccc", padding: "5px" }}>
    {children}
  </div>
);

export const SelectContent = ({ children }) => <>{children}</>;

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
