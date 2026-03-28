import { getTranslations } from "next-intl/server"
import { ContactForm } from "@/components/contact/ContactForm"

export default async function ContactPage() {
  const t = await getTranslations("common")
  const tContact = await getTranslations("contact")

  return (
    <div className="py-8 sm:py-12 max-w-4xl">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">{t("contact")}</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Susisiekite su mumis - mielai atsakysime į jūsų klausimus
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Kontaktinė informacija</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Adresas</h3>
              <p>{t("city")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">El. paštas</h3>
              <p>info@artvilna.lt</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Telefonas</h3>
              <p>+370 5 123 4567</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Darbo laikas</h3>
              <p>Pr-Pt: 10:00 - 18:00</p>
              <p>Št: 11:00 - 16:00</p>
              <p>Sk: Uždaryta</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Siųsti žinutę</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
