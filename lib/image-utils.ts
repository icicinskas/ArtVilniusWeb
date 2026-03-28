/**
 * Helper funkcija, kuri patikrina ir paruošia paveikslėlio URL
 * Jei paveikslėlis yra local, grąžina teisingą kelią
 * Jei paveikslėlis yra remote, grąžina originalų URL
 */
export function prepareImageUrl(imagePath: string): string {
  // Jei jau yra pilnas URL (http/https), grąžiname kaip yra
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Jei yra local failas, užtikriname, kad prasideda nuo /
  if (!imagePath.startsWith('/')) {
    return `/${imagePath}`
  }

  return imagePath
}

/**
 * Patikrina, ar paveikslėlis egzistuoja (client-side)
 * Bandoma užkrauti paveikslėlį ir patikrinti, ar jis užsikrauna
 */
export async function checkImageExists(imagePath: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false
  }

  return new Promise((resolve) => {
    const img = new window.Image()
    const timeout = setTimeout(() => {
      resolve(false)
    }, 5000) // 5 sekundžių timeout
    
    img.onload = () => {
      clearTimeout(timeout)
      resolve(true)
    }
    img.onerror = () => {
      clearTimeout(timeout)
      resolve(false)
    }
    img.src = prepareImageUrl(imagePath)
  })
}
