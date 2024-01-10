import { MouseEventHandler, useState, useEffect } from 'react'
import { Input, InputProps } from 'components/ui-atoms/input';
import { EditIconWithTooltip, EditWithTooltipProps } from 'components/edit-icon-with-tooltip';

export const InputOption = ({ 
  value,
  onChange, 
  name, 
  title,
  onSave
} : InputProps & { title: string, onSave: MouseEventHandler }) => {
  const [editMode, setEditMode] = useState(false)

  return (
    <div className='input-option' key={name}>
      <span className='title'>{title}</span>
      <Input
        disabled={!editMode}
        name={name}
        onChange={onChange}
        value={value} />
      <EditIconWithTooltip
        onSave={onSave}
        uniqueId={name ? name : 'input-option'}
        onToggle={() => setEditMode(!editMode)} />
    </div>
  )
}
