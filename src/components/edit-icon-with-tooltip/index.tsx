
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
  saveMode?: boolean
}

export const EditIconWithTooltip = ({
  onSave,
  onEdit,
  onCancel,
  onToggle,
  uniqueId,
  saveMode
} : EditWithTooltipProps ) => {
  const [editMode, setEditMode] = useState(saveMode)

  const handleSave = (event: any) => {
    onSave && onSave(event)
    onToggle && onToggle()
    setEditMode(false)
  }

  const handleEdit = (event: any) => {
    onEdit && onEdit(event)
    onToggle && onToggle()
    setEditMode(true)
  }

  const Icon = ({ id }: { id: string }) => editMode
    ? <div className='app-tooltip__icon-container'>
        <Tooltip id='app-tooltip' anchorSelect={`#app-tooltip-cancel-${id}`}>
          Cancelar
        </Tooltip>
        <div className='app-tooltip__icon-container__group'>
          <SaveIcon id={id} onClick={handleSave} />
          <CancelIcon id={`app-tooltip-cancel-${id}`} onClick={() => {
              setEditMode(false)
              onCancel && onCancel()
              onToggle && onToggle()
            }}
          />
        </div>
      </div>
    : <EditIcon id={id} onClick={handleEdit} />

  const id = `tooltip-action-${uniqueId}`

  return (
    <div key={id}>
      <Tooltip id='app-tooltip' anchorSelect={`#${id}`}>
        {editMode ? 'Salvar alteração' : 'Editar'}
      </Tooltip>
      <Icon id={id} />
    </div>
  )
}