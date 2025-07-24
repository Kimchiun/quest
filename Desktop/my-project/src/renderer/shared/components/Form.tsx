import React, { useState, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type FormFieldType = 'text' | 'textarea' | 'select' | 'number' | 'password';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  options?: { label: string; value: string }[]; // select용
  required?: boolean;
  placeholder?: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  layout?: 'vertical' | 'horizontal';
  variant?: 'default' | 'bordered';
  submitLabel?: string;
  style?: React.CSSProperties;
  id?: string;
}

const FormWrap = styled.form<{ layout: 'vertical' | 'horizontal'; variant: string; theme: Theme }>`
  display: flex;
  flex-direction: ${({ layout }) => (layout === 'horizontal' ? 'row' : 'column')};
  gap: ${({ theme }) => theme.spacing.md};
  ${({ variant, theme }) =>
    variant === 'bordered' &&
    css`
      border: 1px solid ${theme.color.border};
      border-radius: ${theme.radius.md};
      padding: ${theme.spacing.lg};
      background: ${theme.color.surface};
    `}
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 0.95em;
  color: ${({ theme }) => theme.color.textSecondary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.sizeBase};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.sizeBase};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.sizeBase};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
`;

const SubmitBtn = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.color.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.sizeBase};
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.color.primaryHover}; }
`;

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ fields, onSubmit, initialValues = {}, layout = 'vertical', variant = 'default', submitLabel = '저장', style, id }, ref) => {
    const [values, setValues] = useState<Record<string, any>>(initialValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues(v => ({ ...v, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(values);
    };

    return (
      <FormWrap ref={ref} id={id} layout={layout} variant={variant} style={style} onSubmit={handleSubmit}>
        {fields.map(field => (
          <FieldWrap key={field.name}>
            <Label htmlFor={field.name}>{field.label}{field.required && ' *'}</Label>
            {field.type === 'textarea' ? (
              <Textarea id={field.name} name={field.name} required={field.required} placeholder={field.placeholder} value={values[field.name] || ''} onChange={handleChange} />
            ) : field.type === 'select' ? (
              <Select id={field.name} name={field.name} required={field.required} value={values[field.name] || ''} onChange={handleChange}>
                <option value="">선택</option>
                {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </Select>
            ) : (
              <Input id={field.name} name={field.name} type={field.type} required={field.required} placeholder={field.placeholder} value={values[field.name] || ''} onChange={handleChange} />
            )}
          </FieldWrap>
        ))}
        <SubmitBtn type="submit">{submitLabel}</SubmitBtn>
      </FormWrap>
    );
  }
);

export default Form; 