import { BsGithub } from 'react-icons/bs'
import { HiOutlineBookOpen, HiOutlineChat, HiOutlineCode } from 'react-icons/hi'

export const Icon = ({
  icon,
  className,
  size
}: {
  icon: 'book' | 'code' | 'chat' | 'github'
  className?: string
  size: number
}) => {
  if (icon === 'book') {
    return (
      <HiOutlineBookOpen
        className={className}
        size={size}
      />
    )
  }
  if (icon === 'code') {
    return (
      <HiOutlineCode
        className={className}
        size={size}
      />
    )
  }
  if (icon === 'chat') {
    return (
      <HiOutlineChat
        className={className}
        size={size}
      />
    )
  }
  if (icon === 'github') {
    return (
      <BsGithub
        className={className}
        size={size}
      />
    )
  }
  return null
}
