import * as React from 'react'
import type { SpacerSize } from './spacer.css'
import { spacerVariants } from './spacer.css'

export function Spacer({ size }: { size: SpacerSize }) {
  return <span className={spacerVariants[size]} />
}
