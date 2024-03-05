import { z } from "zod"

export const textMessageSchema = z.object({
  type: z.literal("add"),
  user: z.string(),
  content: z.string(),
})
export type TextMessage = z.infer<typeof textMessageSchema>

export const joinMessageSchema = z.object({
  type: z.literal("join"),
  texts: z.array(textMessageSchema),
})
export type JoinMessage = z.infer<typeof joinMessageSchema>

export const cursorMessageSchema = z.object({
  type: z.literal("cursor"),
  x: z.number(),
  y: z.number(),
  user: z.string(),
})
export type CursorMessage = z.infer<typeof cursorMessageSchema>

export const messageSchema = z.union([
  textMessageSchema,
  joinMessageSchema,
  cursorMessageSchema,
])
