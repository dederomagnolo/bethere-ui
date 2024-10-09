import { Button } from 'components'
import { useState } from 'react'
import { Form } from '../blocks/form'
import { Automation } from 'types/interfaces'
import { ProgramCard } from '../blocks/program-card'

import './styles.scss'

interface Props {
  programs: Automation[]
}

export const AutomationPrograms = ({
  programs = []
}: Props) => {
  const [showForm, setShowForm] = useState(false)
  const [clickedProgram, setClickedProgram] = useState<Automation | undefined>(undefined)

  console.log({ programs })

  const renderNewProgramButton = () => {
    if (showForm) return null

    return (
      <Button
        className=''
        onClick={() => {
        setClickedProgram(undefined)
        setShowForm(true)
      }}>
        Novo Programa
      </Button>
    )
  }

  return (
    <div className='programs'>
      {!showForm ? <div className='programs-list'>
        {programs.map((program: Automation) => {
          return (
            <ProgramCard
              key={program._id}
              cardOnClick={() => {
                setClickedProgram(program)
                setShowForm(true)
              }}
              program={program} />
          )
        })}
      </div> : null}
      {showForm &&
        <Form onCancel={() => { setShowForm(false) }} program={clickedProgram} />}
      
      {renderNewProgramButton()}
    </div>
  )
}