import { getTranslations } from "next-intl/server"

export default async function AboutPage() {
  const t = await getTranslations("common")

  return (
    <div className="py-8 sm:py-12 max-w-4xl">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">{t("about")}</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Sužinokite daugiau apie Art Vilna studiją
        </p>
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Apie mus</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Art Vilna yra moderni meno parodų erdvė ir edukacinis centras Vilniuje, 
            skiriantis dėmesį šiuolaikinio meno kūriniams ir meno švietimui. 
            Mūsų misija - padėti žmonėms atrasti ir suprasti meną.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Mūsų kolekcijoje rasite įvairių stilių ir technikų meno kūrinius, 
            nuo klasikinės tapybos iki šiuolaikinės skulptūros. Taip pat siūlome 
            edukacines programas ir dirbtuves visiems, kurie nori giliau pažinti meno pasaulį.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Mūsų vertybės</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Kokybiškas meno kūrinių pasirinkimas</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Prieinamas meno švietimas visiems</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Palaikymas vietos menininkams</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Kultūrinis Vilniaus miesto palaikymas</span>
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Mūsų istorija</h2>
          <p className="text-muted-foreground leading-relaxed">
            Art Vilna studija buvo įkurta siekiant sukurti vietą, kur meno mėgėjai 
            galėtų rasti įkvėpimo, mokytis ir dalintis savo patirtimi. 
            Per metus mes išaugome į vieną iš svarbiausių meno centrų Vilniuje.
          </p>
        </section>
      </div>
    </div>
  )
}
