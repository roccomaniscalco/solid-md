import { Button as KbButton } from "@kobalte/core"
import { ComponentProps, splitProps } from "solid-js"
import { cn } from "../util/cn"

type ButtonProps = ComponentProps<typeof KbButton.Root>

export default function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["class", "children", "onClick"])

  return (
    <KbButton.Root
      onClick={local.onClick}
      class={cn(
        "rounded-md bg-teal-700 px-4 py-2 text-white outline-none ring-offset-2 ring-offset-gray-950 hover:bg-teal-800 focus:ring-2 focus:ring-teal-400 kb-disabled:bg-gray-500 kb-disabled:text-gray-200",
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </KbButton.Root>
  )
}
