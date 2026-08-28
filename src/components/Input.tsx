import type {
  ChangeEvent,
  InputHTMLAttributes,
} from 'react'

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

function Input({
  label,
  value,
  onChange,
  error,
  id,
  ...props
}: InputProps) {
  const inputId =
    id || label.toLowerCase().replace(/\s+/g, '-')

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onChange(event.target.value)
  }

  return (
    <div className="input-group">
      <label htmlFor={inputId}>
        {label}
      </label>

      <input
        id={inputId}
        value={value}
        onChange={handleChange}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : undefined
        }
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="input-error"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default Input