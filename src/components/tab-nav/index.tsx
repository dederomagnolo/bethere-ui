import { useEffect, useState } from 'react'
import './styles.scss'

export const TabNav = ({
  onNavChange,
  menuLinks = []
}: { menuLinks: string[], onNavChange?: (arg: any) => void}) => {
  const [selectedOption, setSelectedOption] = useState(0)

  useEffect(() => {
    onNavChange && onNavChange(selectedOption)
  }, [selectedOption])

  const handleOnClick = (itemClicked: number) => {
    setSelectedOption(itemClicked)
  }

  return (
    <div className='tab-nav'>
      <ul className='tab-nav__list'>
        {menuLinks.map((item: string, index: number) => {
          return (
            <li
              onClick={() => handleOnClick(index)}
              className={`tab-nav__item ${index === selectedOption ? 'active' : ''}`}>
                {item}
            </li>
          )
        })}
      </ul>
    </div>
  )
}