import { ComputedRef, InjectionKey } from 'vue'
import { ReactiveVariable } from 'vue/macros'

export const Canvas = Symbol() as InjectionKey<ComputedRef<Coords>>

export type Coords = {
  x: ReactiveVariable<number>
  y: ReactiveVariable<number>
  scale: ReactiveVariable<number>
}
