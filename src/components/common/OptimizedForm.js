import React, { useState, useCallback, useMemo } from 'react';

const FormField = React.memo(({ 
  type = 'text', 
  name, 
  label, 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  options = [],
  ...props 
}) => {
  const fieldId = `field-${name}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            {...props}
          >
            <option value="">{placeholder || 'Chọn...'}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            {...props}
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={fieldId}
            name={name}
            checked={value}
            onChange={onChange}
            required={required}
            {...props}
          />
        );
      default:
        return (
          <input
            type={type}
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`form-group ${error ? 'error' : ''}`}>
      <label htmlFor={fieldId}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      {renderInput()}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

const OptimizedForm = ({ 
  initialValues = {}, 
  validationSchema = {}, 
  onSubmit, 
  children,
  className = ''
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};

    Object.keys(validationSchema).forEach(field => {
      const rules = validationSchema[field];
      const value = values[field];

      if (rules.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = `${rules.label || field} là bắt buộc`;
        return;
      }

      if (value && rules.minLength && value.toString().length < rules.minLength) {
        newErrors[field] = `${rules.label || field} phải có ít nhất ${rules.minLength} ký tự`;
        return;
      }

      if (value && rules.maxLength && value.toString().length > rules.maxLength) {
        newErrors[field] = `${rules.label || field} không được vượt quá ${rules.maxLength} ký tự`;
        return;
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.message || `${rules.label || field} không đúng định dạng`;
        return;
      }

      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(value, values);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });

    return newErrors;
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const formContext = useMemo(() => ({
    values,
    errors,
    isSubmitting,
    handleChange
  }), [values, errors, isSubmitting, handleChange]);

  return (
    <form onSubmit={handleSubmit} className={className}>
      {typeof children === 'function' ? children(formContext) : children}
    </form>
  );
};

OptimizedForm.Field = FormField;

export default OptimizedForm;