import { createEffect, createEvent, createStore, sample } from 'effector'
import { debug } from 'patronum/debug'

import { fxGenerateId } from '../shared/lib/generate-id'

export const nodeAdded = createEvent<Node>()

const fxCreateNode = createEffect(async (node: Node) => {
  const id = await fxGenerateId()
  return { ...node, id }
})

export const $nodes = createStore<(Node & { id: string })[]>([])

$nodes.on(fxCreateNode.doneData, (nodes, node) => [...nodes, node])

sample({
  clock: nodeAdded,
  target: fxCreateNode,
})

debug($nodes)

type Node = {
  x: number
  y: number
}
