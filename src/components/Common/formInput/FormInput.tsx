import React from "react";
import './FormInput.scss'
interface IOption {
  label: string;
  value: string | number;
}

interface IFormInputProps {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  options?: IOption[];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

class FormInput extends React.Component<IFormInputProps> {
  render() {
    const {
      label,
      name,
      value,
      type = "text",
      required = false,
      error,
      maxLength,
      placeholder,
      as = "input",
      options,
      onChange,
    } = this.props;
    return (
      <div className="mb-2">
        <label htmlFor={name} className="form-label m-0 d-flex gap-1">
          <span className="input">{label}</span>
          {required && <span className="text-danger">*</span>}
        </label>
        {as === "textarea" && (
          <textarea
            id={name}
            name={name}
            className="form-control"
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={onChange}
          />
        )}
        {as === "select" && (
          <select
            id={name}
            name={name}
            className="form-select"
            value={value}
            onChange={onChange}
          >
            <option value="">Select {label}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {as === "input" && (
          <input
            id={name}
            name={name}
            type={type}
            className="form-control"
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={onChange}
          />
        )}

        {error && <small className="text-danger">{error||""}</small>}
      </div>
    );
  }
}

export default FormInput;