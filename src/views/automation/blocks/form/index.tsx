import { Button, Checkbox, Input, Modal } from 'components'
import { Automation } from 'types/interfaces'

import './styles.scss'
import { useState } from 'react'
import { TimerFields } from 'views/automation/timer-fields'
import { createAutomationProgram } from 'services/automation'
import { useSelector } from 'react-redux'
import { getToken } from 'redux/user/selectors'

interface Props {
  program: Automation | undefined
  onCancel: () => void
}

export const Form = ({
  program,
  onCancel
}: Props) => {
  const token = useSelector(getToken)
  const initialState = {
    name: program?.name,
    type: 0,
    timer: program?.timer
  }

  const [fields, setFields] = useState(initialState)

  const setTimerFields = (editedTimerObj: Automation['timer']) => {
    setFields({ ...fields, timer: { ...fields.timer, ...editedTimerObj } })
  }

  const renderTimerFields = () => {
    return (
      <TimerFields
        setTimerFields={setTimerFields}
        timerSettings={fields.timer} />
    )
  }

  const handleChangeFormField = (e: React.ChangeEvent<HTMLInputElement> ) => {
    const name = e.target.name

    if (name === 'trigger') {
      return setFields({ ...fields, type: 1 })
    }

    if (name === 'timer') {
      return setFields({ ...fields, type: 0 })
    }

    return setFields({ ...fields, [name]: e.target.value })
  }

  const handleSaveOrEditProgram = async () => {
    return await createAutomationProgram({
      token,
      ...fields
    })
  }

  return (
    <div className='program-form'>
      <div className='program-form__title'>
        {program ? 'Editar programa' : 'Novo programa'}
      </div>
      <div className='program-form__container'>
        <div className='program-form__field'>
          <div>Nome do programa (opcional)</div>
          <Input
            value={fields.name}
            name='name'
            className='program-form__name-input'
            onChange={handleChangeFormField} />
        </div>
        <div className='program-form__field'>
          <div>Tipo de programa</div>
          <div className='program-form__types'>
            <Checkbox
              radio
              checked={true}
              name='timer'
              label='Timer'
              onChange={handleChangeFormField} />
          </div>
        </div>
        {renderTimerFields()}
      </div>
      <div className='program-form__actions'>
        <Button variant='cancel' onClick={() => {
          setFields(initialState)
          onCancel()
        }}>Cancelar</Button>
        <Button onClick={handleSaveOrEditProgram}>Salvar</Button>
      </div>
    </div>
  )
}