"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import { loginSchema, type LoginInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useToast } from "@/components/ui/use-toast"

export function LoginForm() {
  const t = useTranslations("auth")
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Ištraukiame locale iš pathname (pvz., /lt/login -> lt)
  const locale = pathname.split("/")[1] || "lt"
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        console.error("Login error:", result.error)
        console.error("Error details:", {
          error: result.error,
          status: result.status,
          ok: result.ok,
        })
        
        // Detalesnė klaidos informacija
        let errorMessage = t("invalidCredentials")
        if (result.error === "CredentialsSignin") {
          errorMessage = t("invalidCredentials")
        } else if (result.error) {
          errorMessage = `${t("error")}: ${result.error}`
        }
        
        toast({
          variant: "destructive",
          title: t("error"),
          description: errorMessage,
        })
      } else if (result?.ok) {
        // Palaukiame šiek tiek, kad session būtų atnaujintas
        await new Promise((resolve) => setTimeout(resolve, 100))
        
        // Gauname session, kad patikrintume vartotojo rolę
        const session = await getSession()
        
        console.log("Session after login:", session)
        
        // Jei vartotojas yra ADMIN, nukreipiame į admin puslapį
        const redirectUrl = session?.user?.role === "ADMIN" 
          ? `/${locale}/admin`
          : callbackUrl

        toast({
          title: t("success"),
          description: t("loginSuccess"),
        })
        router.push(redirectUrl)
        router.refresh()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("loginError"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("signingIn") : t("signIn")}
        </Button>
      </form>
    </Form>
  )
}
