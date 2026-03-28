"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "@/lib/routing"

type BackButtonProps = {
  label: string
}

export function BackButton({ label }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.back()}>
      {label}
    </Button>
  )
}
