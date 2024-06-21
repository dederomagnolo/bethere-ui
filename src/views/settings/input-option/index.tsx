import { MouseEventHandler, useState, useEffect } from 'react'
import { Input, InputProps } from 'components/ui-atoms/input';
import { EditIconWithTooltip, EditWithTooltipProps } from 'components/edit-icon-with-tooltip';

export const InputOption = ({
  onBlur,
  min,
  pattern,
  inputMode,
  className,
  value,
  onChange, 
  name, 
  title,
  onSave,
  initialValue,
  showEditAndSave = true,
  type,
  error,
  disabled = false
} : InputProps & { title: string, onSave?: MouseEventHandler, showEditAndSave?: boolean }) => {
  const [editMode, setEditMode] = useState(false)
  const [editedValue, setEditedValue] = useState(value)

  useEffect(() => {
    setEditedValue(value)
  }, [value])

  const handleOnCancel = () => {
    setEditedValue(initialValue)
  }

  return (
    <div className='input-option' key={name}>
      <div className='title'>{title}</div>
      <Input
        onBlur={onBlur}
        error={error}
        pattern={pattern}
        inputMode={inputMode}
        min={min}
        type={type}
        className={className}
        disabled={showEditAndSave ? !editMode : disabled}
        name={name}
        onChange={onChange}
        value={editedValue} />
      {showEditAndSave
        ? <EditIconWithTooltip
            onCancel={handleOnCancel}
            onSave={onSave}
            uniqueId={name ? name : 'input-option'}
            onToggle={() => setEditMode(!editMode)} />
        : null}
    </div>
  )
}
