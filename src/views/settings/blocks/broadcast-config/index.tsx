import { useState } from "react"
import { InputOption } from "views/settings/input-option"

export const BroadcastConfig =  ({
  saveChanges,
  remoteMeasureInterval
}: any) => {
  const [editedBroadcastTime, setEditedBroadcastTime] = useState(remoteMeasureInterval)
  return (
    <div className='options options--single'>
      <InputOption
        initialValue={remoteMeasureInterval}
        onSave={() => saveChanges({ remoteMeasureInterval: editedBroadcastTime })}
        title='Intervalo de envio (min)'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedBroadcastTime(e.target.value)}
        value={editedBroadcastTime}
        name='remoteMeasureInterval'
      />
      <div className='description'>
        Intervalo em que as medições serão salvas no histórico do dispositivo. Não afeta o recebimento em tempo real na tela de início.
      </div>
    </div>
  )
}