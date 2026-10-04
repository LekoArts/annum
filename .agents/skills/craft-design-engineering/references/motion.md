# Motion

## Hover Restraint

> Frequent interactions should be instant.

- Section: Motion
- URL: https://craft.gustavofior.com/hover-restraint
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/hover-restraint.mdx

Hover fires more than any other interaction. When you sweep the cursor across a nav
you can cross ten items in a second. If each one fades in, the
interface is always a few frames behind the pointer, and it reads as slow
even when nothing is.

**The more often something happens, the less
animation it can afford.**

> **Interactive demo: Hover Restraint.** Open https://craft.gustavofior.com/hover-restraint to try it.

The right one switches its highlight on with no transition at all. Instant
is the correct default for hover.

### Tooltips

Tooltips are one hover case where a delay helps. Without one they pop
up while you are just passing through on the way to something else.

So the first tooltip should wait, around 400ms to 700ms, and then its neighbors
should appear at once. You have already shown you want the labels, and
making you wait again for each one is frustrating.

> **Interactive demo: Hover Tooltip.** Open https://craft.gustavofior.com/hover-restraint to try it.

### Keyboard actions

The same thinking applies away from the pointer.

> **Interactive demo: Keyboard Action.** Open https://craft.gustavofior.com/hover-restraint to try it.

Someone toggling a sidebar with a shortcut is your fastest user. They are
not looking for the panel to arrive from somewhere. They already know what
the shortcut does, and a 250ms slide is like a speeding ticket.

The line to draw is by frequency and intent, not by input device. A modal
that opens once a session can animate. A panel you flip forty times a day
should not.

Notable examples of interactions that would be worse if animated:

- [Raycast launcher](https://www.raycast.com/): Opens and closes with no transition, every time.
- [macOS Alt+Tab](https://rauno.me/craft/interaction-design): Rauno Freiberg on why the app switcher appears instantly.

### Resources

- [You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations): Emil Kowalski on when animation helps and when it gets in the way, with hover as the main case.
- [7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): Short, concrete rules for interface motion, including how tooltips should behave.
- [Base UI Tooltip](https://base-ui.com/react/components/tooltip): The tooltip used on this site, with the delay and instant-open behavior built in.
- [The :hover pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover): What counts as hover across mouse, pen and touch, and why it is unreliable on touch.
