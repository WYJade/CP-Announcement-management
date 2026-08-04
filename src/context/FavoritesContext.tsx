import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FavoriteItem {
  path: string
  label: string
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  isFavorited: (path: string) => boolean
  toggleFavorite: (path: string, label: string) => void
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorited: () => false,
  toggleFavorite: () => {},
})

const STORAGE_KEY = 'cp_favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorited = (path: string) => favorites.some(f => f.path === path)

  const toggleFavorite = (path: string, label: string) => {
    setFavorites(prev =>
      prev.some(f => f.path === path)
        ? prev.filter(f => f.path !== path)
        : [...prev, { path, label }]
    )
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorited, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
