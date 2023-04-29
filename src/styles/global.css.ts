import { globalStyle } from '@vanilla-extract/css'
import { vars } from './vars.css'

globalStyle('body', {
  fontFamily: vars.fontFamily.sans,
  color: vars.color.text,
  background: vars.color.background,
  lineHeight: vars.lineHeight.base,
  transitionProperty: 'background-color, color',
  transitionDuration: '0.3s',
  position: 'relative',
  minHeight: vars.spacing.full,
  fontFeatureSettings: '\'kern\'',
})

globalStyle('*', {
  borderColor: vars.color.transparent,
  wordWrap: 'break-word',
  boxSizing: 'border-box',
  margin: vars.spacing[0],
  borderWidth: vars.spacing[0],
  borderStyle: 'solid',
})

globalStyle('a', {
  backgroundColor: vars.color.transparent,
  color: 'inherit',
  textDecoration: 'inherit',
})

globalStyle('img', {
  borderStyle: 'none',
})

globalStyle('hr', {
  boxSizing: 'content-box',
  height: vars.spacing[0],
  overflow: 'visible',
})

globalStyle('pre, code, kbd', {
  fontFamily: vars.fontFamily.mono,
  fontSize: '1em',
})

globalStyle('button, input, select, textarea', {
  fontFamily: 'inherit',
  fontSize: '100%',
  lineHeight: 1.15,
  margin: vars.spacing[0],
})

globalStyle('button, input', {
  overflow: 'visible',
})

globalStyle('button, select', {
  textTransform: 'none',
})

globalStyle('textarea', {
  overflow: 'auto',
})

globalStyle('details', {
  display: 'block',
})

globalStyle('summary', {
  display: 'list-item',
})

globalStyle('body, blockquote, h1, h2, h3, h4, h5, h6, hr, figure, p, pre', {
  margin: vars.spacing[0],
})

globalStyle('button', {
  background: vars.color.transparent,
  padding: vars.spacing[0],
  cursor: 'pointer',
})

globalStyle('ol, ul', {
  margin: vars.spacing[0],
  padding: vars.spacing[0],
})

globalStyle('table', {
  borderCollapse: 'collapse',
})

globalStyle('h1, h2, h3, h4, h5, h6', {
  fontSize: 'inherit',
  fontWeight: 'inherit',
})

globalStyle('button, input, select, textarea', {
  padding: vars.spacing[0],
  lineHeight: 'inherit',
  color: 'inherit',
})

globalStyle('img, svg, video, canvas, audio, iframe, embed, object', {
  display: 'block',
})

globalStyle('img, video', {
  maxWidth: vars.spacing.full,
  height: vars.spacing.auto,
})
