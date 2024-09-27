import { Checkbox, Modal } from 'components'
import { Automation } from 'types/interfaces'
import { InputOption } from 'views/settings/input-option'

import './styles.scss'
import { useState } from 'react'

interface Props {
  program: Automation | undefined
}

export const Form = ({
  program
}: Props) => {
  const [fields, setFields] = useState({
    name: program?.name,
    type: program?.type
  })

  const renderTriggerFields = () => {
    if (!program) return

    return (
      <div>
        
      </div>
    )
  }

  const renderTimerFields = () => {
    return (
      <div className='program-form__timer-fields'>
        <div>Período de Atividade</div>
        <div>
          <div>Operação contínua</div>
          <div>
            <input
              name='startTime'
              id='startTime'
              type='time' />
          </div>
        </div>
      </div>
    )
  }

  const handleChangeFormField = () => {
    return 
  }

  return (
    <div className='program-container'>
      <div className='alert-configs__modal-title'>
        {program ? 'Editar programa' : 'Novo programa'}
      </div>
      <div className='program-form'>
        <InputOption
          name='program-name'
          className=''
          showEditAndSave={false}
          onChange={() => handleChangeFormField()}
          title='Nome do programa (opcional)' />
        <div className='program-form__field'>
          <div>Tipo de programa</div>
          <div className='program-form__types'>
            <Checkbox
              radio
              checked={true}
              name='timer'
              initialState={true}
              label='Timer'
              onChange={() => handleChangeFormField()} />
            <Checkbox
              radio
              checked={true}
              name='timer'
              initialState={true}
              label='Acionamento por sensor'
              onChange={() => handleChangeFormField()} />
            </div>
          </div>
        </div>
        {renderTimerFields()}
    </div>
  )
}