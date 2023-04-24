import Collapsible from 'react-collapsible';

import { 
  MdOutlineKeyboardArrowDown as ArrowDown,
  MdOutlineKeyboardArrowUp as ArrowUp
} from 'react-icons/md'

const renderCollapsibleTitle = (title: string, whenOpen?: boolean) => {
  return (
    <div className='collapsible__title'>
      <h2>{title}</h2>
      {whenOpen ? (
        <ArrowUp size={24} />
      ) : (
        <ArrowDown size={24} />
      )}
    </div>
  );
};

interface CollapsibleProps {
  title: string
  innerComponent: any
  className?: string
}

export const AppCollapsible: React.FC<CollapsibleProps> = ({ title, innerComponent, className }) => {
  return (
    <Collapsible
      className={`app-collapsible ${className}`}
      trigger={renderCollapsibleTitle(title)}
      triggerWhenOpen={renderCollapsibleTitle(
        title,
        true
      )}
      transitionTime={150}
    >
      {innerComponent}
    </Collapsible>
  )
}
