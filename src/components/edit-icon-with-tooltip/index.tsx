
import { MouseEventHandler, useState } from 'react'
import { Tooltip } from 'react-tooltip'

import {
  BiSave as SaveIcon,
  BiEdit as EditIcon
} from 'react-icons/bi'

import { 
  RiCloseCircleLine as CancelIcon
} from 'react-icons/ri'


export interface EditWithTooltipProps {
  onSave?: MouseEventHandler
  onEdit?: MouseEventHandler,
  onToggle?: Function
  uniqueId: string
}

export const EditIconWithTooltip = ({
  onSave,
  onEdit,
  onToggle,
  uniqueId
} : EditWithTooltipProps ) => {
  const [editMode, setEditMode] = useState(false)

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
    ? <div>
        <Tooltip id='app-tooltip' anchorSelect={`#app-tooltip-cancel-${id}`}>
          Cancelar
        </Tooltip>
        <SaveIcon id={id} onClick={handleSave} />
        <CancelIcon id={`app-tooltip-cancel-${id}`} onClick={() => {
            setEditMode(false)
            onToggle && onToggle()
          }}
        />
      </div>
    : <EditIcon id={id} onClick={handleEdit} />

  const id = `tooltip-action-${uniqueId}`

  return(
    <div key={id}>
      <Tooltip id='app-tooltip' anchorSelect={`#${id}`}>
        {editMode ? 'Salvar alteração' : 'Editar'}
      </Tooltip>
      <Icon id={id} />
    </div>
  )
}