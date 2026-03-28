# Kūrimo gairės – kaip išvengti kodo sutrikimų

## Problema

Po kiekvieno pakeitimo ar papildymo gali atsirasti klaidų, pvz.:

- `Cannot find module './vendor-chunks/@formatjs.js'`
- `Invalid hook call` / `Cannot read properties of null (reading 'useContext')`
- `entryCSSFiles` arba kitos Webpack klaidos

## Priežastys

1. **Sugedęs `.next` cache** – Next.js build cache gali sugesti, kai:
   - keičiate kodą, kol veikia `npm run dev`
   - dalinai trinate `.next` aplanką
   - keičiate `package.json` arba `next.config.js` be pilno perkrovimo

2. **Fast Refresh** – kartais HMR (Hot Module Replacement) sukelia neteisingus modulių nuorodas.

3. **Keli React egzemplioriai** – kai kurios priklausomybės gali įtraukti savo React kopiją.

## Sprendimas: valymas ir perkrovimas

### Kai kyla klaidos

1. Sustabdykite dev serverį (Ctrl+C).
2. Paleiskite valymą ir vėl paleiskite dev:

   ```bash
   npm run dev:clean
   ```

   Arba atskirai:

   ```bash
   npm run clean
   npm run dev
   ```

### Rekomenduojamas darbo procesas

| Situacija | Veiksmai |
|-----------|----------|
| Paprasti kodo pakeitimai | Tęskite darbą – Fast Refresh turėtų veikti |
| Pakeitimai `package.json` | Sustabdykite dev → `npm install` → `npm run dev:clean` |
| Pakeitimai `next.config.js` | Sustabdykite dev → `npm run dev:clean` |
| Keistos priklausomybės | Sustabdykite dev → `npm install` → `npm run clean` → `npm run dev` |
| Keistos struktūros (pvz. layout) | Jei matote keistą elgesį → `npm run dev:clean` |

### Valymo skriptai

- **`npm run clean`** – išvalo `.next` ir `node_modules/.cache`
- **`npm run dev:clean`** – valo ir paleidžia dev serverį

PowerShell:

```powershell
.\scripts\clean.ps1
```

## Kada tikėtis problemų

- Po didesnių refaktoravimų
- Po `next-intl` ar kitų i18n pakeitimų
- Po layout arba routing pakeitimų
- Kai dev serveris veikia ilgai ir atsiranda daug HMR perkrovimų

## Jei problemos lieka

1. Pilnas valymas:

   ```bash
   npm run clean
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run dev
   ```

2. Patikrinkite, ar nėra kelių React versijų:

   ```bash
   npm ls react
   ```

3. Užtikrinkite, kad `react` ir `react-dom` versijos sutampa su Next.js rekomendacijomis.
