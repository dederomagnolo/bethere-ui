import './styles.scss'

export const Loading = ({ Component }: any) => {
  return (
    <div className='loading-container'>
      <Component />
    </div>
  )
}