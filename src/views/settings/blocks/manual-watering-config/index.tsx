import { useState } from "react"
import { InputOption } from "views/settings/input-option"

export const ManualWateringConfig = ({
  saveChanges,
  manualWateringTimer
}: any) => {
  const [editedWateringTimer, setEditedWateringTimer] = useState(manualWateringTimer)

  return (
    <div className='options options--single'>
      <InputOption
        onSave={() => saveChanges({ wateringTimer: editedWateringTimer })}
        title='Tempo de irrigação manual (min)'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedWateringTimer(e.target.value)}
        value={editedWateringTimer}
        name='wateringTimer'
      />
      <span className='description'>Tempo que a irrigação permanece ligada após o acionamento pelo botão.</span>
    </div>
  )
}