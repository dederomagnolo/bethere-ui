import { Button, Checkbox } from 'components'
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
  const [deletingMode, setDeletingMode] = useState(false)
  const [clickedProgram, setClickedProgram] = useState<Automation | undefined>(undefined)
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([])

  const renderActions = () => {
    if (showForm) return null

    if (deletingMode) {
      return (
        <div className='programs__actions'>
          <Button
            variant='cancel'
            onClick={() => {
            setDeletingMode(false)
            setItemsToDelete([])
          }}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
            setDeletingMode(false)
          }}>
            Salvar
          </Button>
        </div>
      )
    }

    return (
      <div className='programs__actions'>
        <Button
          onClick={() => {
          setClickedProgram(undefined)
          setShowForm(true)
        }}>
          Novo Programa
        </Button>
        <Button
          variant='cancel'
          onClick={() => {
          setClickedProgram(undefined)
          setDeletingMode(true)
        }}>
          Deletar programas
        </Button>
      </div>
    )
  }

  const handleCheckItemForDelete = (programId: string, checked: boolean) => {
    console.log({ programId, checked })
    setItemsToDelete([...itemsToDelete, programId])
  }

  const list = !showForm ? (
    <div className='programs-list'>
      {programs.map((program: Automation) => {
        const Card = (
          <ProgramCard
            key={program._id}
            cardOnClick={() => {
              setClickedProgram(program)
              setShowForm(true)
            }}
            program={program} />
          )
        
        return deletingMode ? (
          <div className='deleting-container'>
            <Checkbox
              onChange={(e: any) => handleCheckItemForDelete(program._id, e.target.checked)} />
            {Card}
          </div>
        ) : Card
      })}
    </div>
  ) : null

  return (
    <div className='programs'>
      {list}
      {showForm &&
        <Form onCancel={() => { setShowForm(false) }} program={clickedProgram} />}
      
      {renderActions()}
    </div>
  )
}