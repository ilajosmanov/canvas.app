import { createEffect } from 'effector'
import { nanoid } from 'nanoid'

export const fxGenerateId = createEffect(nanoid)
