import React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { HamburgerMenuIcon, DotsVerticalIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'

interface MenuItemType {
  label: string
  action: () => void
}

interface DropdownMenuProps {
  primary: MenuItemType[]
  secondary: MenuItemType[]
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ primary = [], secondary = [] }) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className='inline-flex size-[35px] items-center justify-center text-gray-100 border-none outline-none hover:text-gray-500 transition-colors duration-200 focus:outline-none focus:ring-0'
          aria-label='Menu options'
        >
          <HamburgerMenuIcon className='w-6 h-6' />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className='min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]'
          sideOffset={5}
          align='end'
        >
          {primary.map((item, index) => (
            <DropdownMenuPrimitive.Item
              key={`first-${index}`}
              className='group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-gray-700 outline-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900'
              onClick={item.action}
            >
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}

          {primary.length > 0 && secondary.length > 0 && (
            <DropdownMenuPrimitive.Separator className='m-[5px] h-px bg-gray-200' />
          )}

          {secondary.map((item, index) => (
            <DropdownMenuPrimitive.Item
              key={`second-${index}`}
              className='group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-gray-700 outline-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900'
              onClick={item.action}
            >
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

export default DropdownMenu
