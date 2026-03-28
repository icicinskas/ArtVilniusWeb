# Autentifikacijos Sistemos Taisyklės

## 1. Bendrosios Principai

### SOLID Principai
- **Single Responsibility**: Kiekvienas modulis atsakingas už vieną funkciją
  - `lib/auth.ts` - tik NextAuth konfigūracija
  - `lib/session.ts` - tik session helper funkcijos
  - `app/api/auth/register/route.ts` - tik registracijos logika
  - Middleware - tik autorizacijos patikra

- **Open/Closed**: Sistema atvira plėtrai (nauji provider'iai), uždara modifikacijoms
- **Liskov Substitution**: Visi role-based helper'ai veikia su bet kokia role
- **Interface Segregation**: Atskiri helper'ai skirtingoms funkcijoms
- **Dependency Inversion**: Priklausomybės nuo abstrakcijų (session helper'ai, ne tiesioginis NextAuth)

### KISS Principas
- Paprasta, aiški struktūra
- Minimalus boilerplate kodas
- Aiškūs funkcijų pavadinimai
- Nėra per daug abstrakcijų

## 2. Saugumo Reikalavimai

### Slaptažodžių Valdymas
- **Hashing**: bcryptjs su salt rounds = 12
- **Validacija**: 
  - Minimum 8 simbolių
  - Bent vienas didžioji raidė
  - Bent vienas skaičius
  - Bent vienas specialus simbolis
- **Niekada** negrąžiname slaptažodžio API atsakymuose

### Session Valdymas
- JWT strategija (NextAuth default)
- Session timeout: 30 dienų
- Secure cookies production aplinkoje
- HttpOnly cookies (XSS apsauga)

### Input Validacija
- Zod schemos visoms formoms
- Server-side validacija (ne tik client-side)
- Email format validacija
- XSS apsauga (React automatiškai)

### CSRF Apsauga
- NextAuth automatinė CSRF apsauga
- SameSite cookie policy

## 3. Vartotojų Rolės

### Role Hierarchija
```
GUEST < USER < MODERATOR < ADMIN
```

### Role Reikšmės
- `GUEST` - Neregistruotas vartotojas (default)
- `USER` - Registruotas vartotojas
- `MODERATOR` - Moderatorius (turinio valdymas)
- `ADMIN` - Administratorius (pilnos teisės)

### Role Validacija
- Tik leistinos reikšmės: "GUEST", "USER", "MODERATOR", "ADMIN"
- Default role: "USER" (registracijos metu)
- Role keitimą gali atlikti tik ADMIN

## 4. Autentifikacijos Srautas

### Registracija
1. Vartotojas užpildo formą (email, password, name)
2. Client-side validacija (Zod)
3. API request į `/api/auth/register`
4. Server-side validacija
5. Patikrinimas ar email jau egzistuoja
6. Slaptažodžio hash'inimas
7. Vartotojo sukūrimas DB su role="USER"
8. Automatinis prisijungimas (redirect į login su success message)

### Prisijungimas
1. Vartotojas užpildo formą (email, password)
2. Client-side validacija
3. NextAuth `signIn()` funkcija
4. Credentials provider `authorize()` funkcija
5. Email ir password patikrinimas
6. Session sukūrimas
7. Redirect pagal `callbackUrl` arba default

### Atsijungimas
1. NextAuth `signOut()` funkcija
2. Session ištrynimas
3. Redirect į pagrindinį puslapį

## 5. Autorizacijos Sistema

### Middleware Autorizacija
- Middleware tikrina route'us pagal role reikalavimus
- Protected routes:
  - `/admin/**` - tik ADMIN
  - `/moderator/**` - MODERATOR arba ADMIN
  - `/profile` - USER, MODERATOR, ADMIN
  - `/api/admin/**` - tik ADMIN
  - `/api/moderator/**` - MODERATOR arba ADMIN

### Helper Funkcijos
- `getServerSession()` - gauti session server-side
- `requireAuth()` - reikalauti autentifikacijos
- `requireRole(role)` - reikalauti specifinės rolės
- `hasRole(session, role)` - patikrinti ar turi rolę
- `canAccess(session, requiredRole)` - patikrinti ar gali prieiti

### API Route Apsauga
- Kiekvienas protected API route turi:
  1. Session patikrinimą
  2. Role patikrinimą (jei reikia)
  3. Error handling su tinkamais status kodais

## 6. Klaidų Valdymas

### Klaidų Tipai
- **400 Bad Request**: Neteisingi duomenys
- **401 Unauthorized**: Neautentifikuotas vartotojas
- **403 Forbidden**: Neturi teisių
- **409 Conflict**: Email jau egzistuoja
- **500 Internal Server Error**: Serverio klaida

### Klaidų Pranešimai
- Aiškūs, vartotojui suprantami pranešimai
- Never reveal sensitive information
- Internationalized error messages (lt/en)

## 7. Formų Validacija

### Registracijos Forma
- Email: validus email formatas, unikalus
- Password: min 8 simbolių, didžioji raidė, skaičius, specialus simbolis
- Name: min 2 simboliai, max 100 simbolių

### Prisijungimo Forma
- Email: validus email formatas
- Password: ne tuščias

### Validacijos Lygiai
1. **Client-side**: Zod schema + React Hook Form
2. **Server-side**: Zod schema (kartojama)

## 8. API Endpoint'ai

### POST /api/auth/register
- **Request Body**: `{ email: string, password: string, name?: string }`
- **Response**: `{ success: boolean, message: string }`
- **Status Codes**: 200, 400, 409, 500

### POST /api/auth/login (NextAuth)
- NextAuth default endpoint
- Credentials provider

### POST /api/auth/logout (NextAuth)
- NextAuth default endpoint

## 9. Session Helper Funkcijos

### Server-side
- `getServerSession()` - gauti session
- `requireAuth()` - reikalauti autentifikacijos, throw jei nėra
- `requireRole(role)` - reikalauti rolės, throw jei neturi
- `hasRole(session, role)` - boolean patikrinimas
- `canAccess(session, requiredRole)` - boolean patikrinimas su hierarchija

### Client-side
- `useSession()` - NextAuth hook
- Custom hooks pagal poreikius

## 10. Middleware Integracija

### Middleware Funkcionalumas
1. Internacionalizacijos valdymas (next-intl)
2. Autentifikacijos patikra (protected routes)
3. Autorizacijos patikra (role-based)
4. Redirect logika

### Route Grupės
- `(auth)` - login, register (neautentifikuotiems)
- `(main)` - viešas turinys
- `(admin)` - admin panel (tik ADMIN)
- `(moderator)` - moderator panel (MODERATOR/ADMIN)

## 11. UI Komponentai

### Reikalingi Komponentai
- Input field (su validacija)
- Button (su loading state)
- Form wrapper
- Toast notifications (klaidų/sėkmės pranešimams)
- Loading spinner

### Formų Struktūra
- React Hook Form
- Zod resolver
- Error messages (i18n)
- Loading states
- Success/error feedback

## 12. Testavimo Reikalavimai

### Testuoti Reikia
- Registracija su validais duomenimis
- Registracija su nevalidais duomenimis
- Registracija su egzistuojančiu email
- Prisijungimas su teisingais duomenimis
- Prisijungimas su neteisingais duomenimis
- Session valdymas
- Role-based access control
- Middleware redirect'ai

## 13. Saugumo Geriausios Praktikos

### Rekomendacijos
- ✅ Naudoti HTTPS production
- ✅ Rate limiting (būsimas)
- ✅ Email verification (būsimas)
- ✅ Password reset (būsimas)
- ✅ Account lockout po X neteisingų bandymų (būsimas)
- ✅ Session refresh mechanism
- ✅ Secure cookie settings
- ✅ Input sanitization
- ✅ SQL injection apsauga (Prisma)

## 14. Internacionalizacija

### i18n Pranešimai
- Visi error messages turi būti i18n
- Form labels ir placeholder'ai i18n
- Success messages i18n
- Naudoti `next-intl` hook'us

## 15. Kodo Struktūra

### Failų Organizacija
```
lib/
  auth.ts          # NextAuth konfigūracija
  session.ts       # Session helper funkcijos
  validations.ts   # Zod schemos

app/
  api/
    auth/
      register/
        route.ts   # Registracijos endpoint
      [...nextauth]/
        route.ts   # NextAuth handler

  [locale]/
    (auth)/
      login/
        page.tsx   # Prisijungimo puslapis
      register/
        page.tsx   # Registracijos puslapis

components/
  auth/
    LoginForm.tsx
    RegisterForm.tsx
  ui/
    input.tsx
    button.tsx
    form.tsx
    toast.tsx

types/
  next-auth.d.ts   # NextAuth tipų plėtinys
```

## 16. Performance

### Optimizacijos
- Server Components kur įmanoma
- Client Components tik kur reikia interaktyvumo
- Minimalus JavaScript bundle
- Efficient session checks

## 17. Admin Vartotojo Sukūrimas

### Script'ai

Yra du būdai sukurti admin vartotoją:

#### 1. Interaktyvus Script'as
```bash
npm run create-admin
```
Script'as interaktyviai prašys įvesti:
- El. paštą
- Slaptažodį
- Vardą (optional)

Jei vartotojas su tokiu el. paštu jau egzistuoja, script'as pasiūlys jį atnaujinti į ADMIN.

#### 2. Paprastas Script'as su Argumentais
```bash
npm run create-admin:simple -- email@example.com Password123! "Admin Name"
```

Arba be vardo:
```bash
npm run create-admin:simple -- admin@example.com Password123!
```

### Reikalavimai
- El. paštas turi būti validus (turi @ simbolį)
- Slaptažodis turi būti bent 8 simbolių
- Jei vartotojas jau egzistuoja, jis bus atnaujintas į ADMIN rolę

### Saugumas
- Script'ai turėtų būti naudojami tik development aplinkoje arba saugioje production aplinkoje
- Slaptažodis hash'inamas su bcrypt (12 salt rounds)
- Production aplinkoje rekomenduojama naudoti interaktyvų script'ą, kad slaptažodis nebūtų matomas komandinės eilutės istorijoje

---

**Pastaba**: Šios taisyklės yra pagrindas autentifikacijos sistemai. Visos implementacijos turi laikytis šių principų ir reikalavimų.
