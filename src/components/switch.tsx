import * as React from 'react'
import { Switch as SwitchPrimitive } from 'react-aria-components'
import type { SwitchProps } from 'react-aria-components'
import { indicator, root } from './switch.css'

type SwitchPropsWithoutChildren = Omit<SwitchProps, 'children'>

interface CustomSwitchProps extends SwitchPropsWithoutChildren {
  children: React.ReactNode
  setSelected: (selected: boolean) => void
}

export function CustomSwitch({ children, setSelected, ...props }: CustomSwitchProps) {
  return (
    <SwitchPrimitive onChange={setSelected} className={root} {...props}>
      <div className={indicator} />
      {children}
    </SwitchPrimitive>
  )
}
