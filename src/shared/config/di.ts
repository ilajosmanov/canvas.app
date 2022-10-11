import { ComputedRef, InjectionKey } from 'vue'
import { ReactiveVariable } from 'vue/macros'

export const frameContainer = Symbol() as InjectionKey<
  ComputedRef<FrameContainerProvider>
>

export type FrameContainerProvider = {
  width: ReactiveVariable<number>
  height: ReactiveVariable<number>
  isAltPressed: ReactiveVariable<boolean>
  scroll: { x: number; y: number }
}
