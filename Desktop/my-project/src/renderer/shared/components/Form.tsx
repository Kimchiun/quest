import React from 'react';
import styled from 'styled-components';
import Input from './Input';
import Button from './Button';
import { Theme } from '../theme';

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'password' | 'textarea' | 'select';
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
};

interface FormProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  layout?: 'vertical' | 'horizontal';
  variant?: 'default' | 'bordered';
  submitLabel?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  ariaDescribedby?: string;
  id?: string;
}

const StyledForm = styled.form<{ $layout: string; $variant: string }>`
  display: flex;
  flex-direction: ${({ $layout }) => $layout === 'horizontal' ? 'row' : 'column'};
  gap: 16px;
  background: ${({ $variant, theme }) => $variant === 'bordered' ? theme.color.background : 'none'};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ $variant }) => $variant === 'bordered' ? '16px' : '0'};
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #22223b;
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-family: inherit;
  color: #22223b;
  background: #fff;
  transition: border 0.15s;
  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
    border-color: #2563eb;
    z-index: 1;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-family: inherit;
  color: #22223b;
  background: #fff;
  transition: border 0.15s;
  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
    border-color: #2563eb;
    z-index: 1;
  }
`;

const Form: React.FC<FormProps> = ({ fields, initialValues = {}, onSubmit, layout = 'vertical', variant = 'default', submitLabel = '저장', style, ariaLabel, ariaDescribedby, id }) => {
  const [values, setValues] = React.useState<Record<string, any>>(initialValues);
  const formId = id || React.useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <StyledForm
      $layout={layout}
      $variant={variant}
      onSubmit={handleSubmit}
      style={style}
      role="form"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      id={formId}
    >
      {fields.map(field => {
        const inputId = `${formId}-${field.name}`;
        return (
          <FieldWrapper key={field.name}>
            <Label htmlFor={inputId}>
              {field.label}
              {field.required && <Required aria-hidden="true">*</Required>}
            </Label>
            {field.type === 'textarea' ? (
              <StyledTextarea
                id={inputId}
                name={field.name}
                value={values[field.name] ?? ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                aria-label={field.label}
                aria-required={field.required}
                required={field.required}
              />
            ) : field.type === 'select' && field.options ? (
              <StyledSelect
                id={inputId}
                name={field.name}
                value={values[field.name] ?? ''}
                onChange={handleChange}
                aria-label={field.label}
                aria-required={field.required}
                required={field.required}
              >
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </StyledSelect>
            ) : (
              <Input
                id={inputId}
                name={field.name}
                type={field.type}
                value={values[field.name] ?? ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                ariaLabel={field.label}
                aria-required={field.required}
                required={field.required}
              />
            )}
          </FieldWrapper>
        );
      })}
      <Button type="submit" ariaLabel={submitLabel}>{submitLabel}</Button>
    </StyledForm>
  );
};

export default Form; 