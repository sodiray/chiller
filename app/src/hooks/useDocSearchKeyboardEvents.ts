import { useEffect } from 'react'

function isEditingContent(event: KeyboardEvent) {
  let element = event.target as Element
  let tagName = element.tagName
  return (
    (element as any).isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  )
}

export function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose
}: {
  isOpen: boolean
  onOpen?: () => void
  onClose?: () => void
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      function open() {
        // We check that no other DocSearch modal is showing before opening
        // another one.
        if (!document.body.classList.contains('DocSearch--active')) {
          onOpen?.()
        }
      }

      if (
        (event.keyCode === 27 && isOpen) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey)) ||
        (!isEditingContent(event) && event.key === '/' && !isOpen)
      ) {
        event.preventDefault()

        if (isOpen) {
          onClose?.()
        } else if (!document.body.classList.contains('DocSearch--active')) {
          open()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onOpen, onClose])
}
