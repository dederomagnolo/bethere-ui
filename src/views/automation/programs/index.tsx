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
  const [openModal, setOpenModal] = useState(false)
  const [clickedProgram, setClickedProgram] = useState<Automation | undefined>(undefined)

  console.log({ programs })

  return (
    <div className='programs'>
      <Button onClick={() => {
        setClickedProgram(undefined)
        setOpenModal(true)
      }}>
        Novo Programa
      </Button>

      <div className='programs-list'>
        {programs.map((program: Automation) => {
          return (
            <ProgramCard
              cardOnClick={() => {
                setClickedProgram(program)
                setOpenModal(true)
              }}
              program={program} />
          )
        })}
      </div>
      <Form program={clickedProgram} />
    </div>
  )
}