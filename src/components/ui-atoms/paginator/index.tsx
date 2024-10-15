import ReactPaginate from 'react-paginate'

import './styles.scss'

type SelectedPage = {
  selected: number
}

interface Props {
  forcePage?: number
  numberOfPages: number
  onChange: ({ selected }: SelectedPage) => void
}

export const Paginator = ({
  numberOfPages,
  forcePage,
  onChange
}: Props) => {
  return (
    <div className='app-paginator'>
      <ReactPaginate
        forcePage={forcePage}
        pageClassName='app-paginator__page'
        className='app-paginator__paginator'
        onPageChange={onChange}
        pageCount={numberOfPages}
        pageRangeDisplayed={1}
        nextLabel='Próximo >'
        previousLabel='< Anterior'
        breakLabel='...'
        renderOnZeroPageCount={null}
      />
    </div> 
  )
}