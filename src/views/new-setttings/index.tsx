import { 
  MdOutlineKeyboardArrowRight as ArrowRight
} from 'react-icons/md'

import './styles.scss'
import { View } from 'components/app-view'

export const NewSettingsView = () => {
  const settings = [
    {
      title: 'Meus dispositivos',
      path: 'dispositivos'
    },
    {
      title: 'Automação',
      path: 'automacao'
    },
    {
      title: 'Medições',
      path: 'medicoes'
    },
    {
      title: 'Alertas',
      path: 'alertas'
    },
    {
      title: 'Minha conta',
      path: 'minha-conta'
    }
  ]

  return (
    <View title='Configurações' className='settings-view'>
      <div className='settings-list'>
        {settings.map((option) => {
          return (
            <a
              href={`/configuracoes/${option.path}`}
              className='settings-list__item'>
              <div className='settings-list__item__title'>
                {option.title}
              </div>
              <div>
                <ArrowRight size={24} />
              </div>
            </a>
          )
        })}
      </div>
    </View>
  )
}