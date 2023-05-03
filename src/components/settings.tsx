import * as React from 'react'
import { CustomSwitch } from './switch'
import { settings } from './settings.css'

export function Settings({ setColumns, setGap, columns, gap }: { setColumns: (columns: number) => void; setGap: (gap: boolean) => void; columns: number; gap: boolean }) {
  return <header className={settings}>
    <input onChange={e => setColumns(parseInt(e.target.value))} value={columns} type="number" min="3" max="10" placeholder="Number of columns" style={{ minWidth: '300px', color: 'black' }} />
    {columns}
    <CustomSwitch setSelected={setGap}>
      Add gap
    </CustomSwitch>
    {gap ? 'true' : 'false'}
  </header>
}
