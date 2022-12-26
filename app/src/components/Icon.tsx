import { HiOutlineBookOpen, HiOutlineChat, HiOutlineCode } from 'react-icons/hi'

export const Icon = ({
  icon,
  className,
  size
}: {
  icon: 'book' | 'code' | 'chat'
  className?: string
  size: number
}) => {
  if (icon === 'book') {
    return (
      <HiOutlineBookOpen
        className={className}
        height={size}
        width={size}
      />
    )
  }
  if (icon === 'code') {
    return (
      <HiOutlineCode
        className={className}
        height={size}
        width={size}
      />
    )
  }
  if (icon === 'chat') {
    return (
      <HiOutlineChat
        className={className}
        height={size}
        width={size}
      />
    )
  }
  return <></>
}
