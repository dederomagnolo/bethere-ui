
import { MouseEventHandler, useState } from 'react'
import { Tooltip } from 'react-tooltip'

import {
  BiSave as SaveIcon,
  BiEdit as EditIcon
} from 'react-icons/bi'

import { 
  RiCloseCircleLine as CancelIcon
} from 'react-icons/ri'

import './styles.scss'

export interface EditWithTooltipProps {
  onSave?: MouseEventHandler
  onEdit?: MouseEventHandler
  onToggle?: Function
  onCancel?: Function
  uniqueId: string
  shouldToggleToShowSave?: boolean
}

export const EditIconWithTooltip = ({
  onSave,
  onEdit,
  onCancel,
  onToggle,
  uniqueId,
  shouldToggleToShowSave = true
} : EditWithTooltipProps ) => {
  const [editing, setEditing] = useState(false)

  const handleSave = (event: any) => {
    onSave && onSave(event)
    onToggle && onToggle()
    setEditing(false)
  }

  const handleEdit = (event: any) => {
    onEdit && onEdit(event)
    onToggle && onToggle()
    shouldToggleToShowSave && setEditing(true)
  }

  const handleCancel = (event: any) => {
    setEditing(false)
    onCancel && onCancel(event)
    onToggle && onToggle()
  }

  const Icon = ({ id }: { id: string }) => editing
    ? <div className='app-tooltip__icon-container'>
        <Tooltip id='app-tooltip' anchorSelect={`#app-tooltip-cancel-${id}`}>
          Cancelar
        </Tooltip>
        <div className='app-tooltip__icon-container__group'>
          <SaveIcon id={id} onClick={handleSave} />
          <CancelIcon id={`app-tooltip-cancel-${id}`} onClick={handleCancel}
          />
        </div>
      </div>
    : <EditIcon id={id} onClick={handleEdit} />

  const id = `tooltip-action-${uniqueId}`

  return (
    <div key={id}>
      <Tooltip id='app-tooltip' anchorSelect={`#${id}`}>
        {editing ? 'Salvar alteração' : 'Editar'}
      </Tooltip>
      <Icon id={id} />
    </div>
  )
}