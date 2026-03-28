# Valo .next cache ir node_modules/.cache
# Paleiskite šį skriptą kai atsiranda:
# - "Cannot find module './vendor-chunks/@formatjs.js'"
# - "Invalid hook call" / "useContext" klaidos
# - Keisti elgesys po pakeitimų

Write-Host "Valoma .next cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  .next istrintas" -ForegroundColor Green
} else {
    Write-Host "  .next neegzistuoja" -ForegroundColor Gray
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "  node_modules/.cache istrintas" -ForegroundColor Green
}

Write-Host "`nValymas baigtas. Paleiskite: npm run dev" -ForegroundColor Cyan
