import { useEffect } from 'react'

export const useOutsideHandler = (ref: any, callback: Function) => {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (event.target.type === 'submit') {
        return
      }

      if (ref && ref.current && ref.current.contains && !ref.current.contains(event.target)) {
        callback()
      }
    }

    // add event listener to capture mouse down
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // remove the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return ref
}