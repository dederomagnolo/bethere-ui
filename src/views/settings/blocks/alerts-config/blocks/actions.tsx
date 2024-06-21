import { Tooltip } from 'react-tooltip'
import { FaTrashAlt as TrashIcon } from 'react-icons/fa'

import { Button } from 'components'

export const Actions = ({
  onSave,
  onCancel,
  onDelete,
  showDelete
}: any) => {
  return (
    <div className='alert-form__button-components'>
      <div className='alert-form__button-components__main'>
        <Button
          onClick={onSave}
          className='alert-configs__button'>
          Salvar
        </Button>
        <Button
          onClick={onCancel}
          className='alert-configs__button'
          variant='cancel'>
            Cancelar
        </Button>
      </div>
      <div className='alert-form__button-components__delete'>
        <Tooltip id='app-tooltip' anchorSelect={`#alert-delete-button`}>
          Excluir alerta
        </Tooltip>
        {showDelete ? <Button
          id='alert-delete-button'
          onClick={onDelete}
          variant='cancel'>
            <TrashIcon />
        </Button> : null}
      </div>
    </div>
  )
}