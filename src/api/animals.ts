import client from './client'
import type { Animal, AnimalType } from '../types/animal'
import { routes } from './routes'

export interface CategoryRec { id: string; title: string }
export interface LinkRec { id: string; animalId: string; categoryId: string }

export interface Category {
  key: AnimalType
  title: string
  imageUrl: string
}


const CAT_IMAGE = 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=800&q=60'
const DOG_IMAGE = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=60'
const BIRD_IMAGE = 'https://images.unsplash.com/photo-1480044965905-02098d419e96?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
const FISH_IMAGE = 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

function normalizeToType(title: string): AnimalType | null {
  const t = title.toLowerCase()
  if (t.includes('cat')) return 'cats'
  if (t.includes('dog')) return 'dogs'
  if (t.includes('bird')) return 'birds'
  if (t.includes('fish')) return 'fishes'
  return null
}

function pickImage(type: AnimalType): string {
  return type === 'cats'
    ? CAT_IMAGE
    : type === 'dogs'
    ? DOG_IMAGE
    : type === 'birds'
    ? BIRD_IMAGE
    : FISH_IMAGE
}


function baseAnimal(rec: any): Omit<Animal, 'type' | 'imageUrl'> & { imageUrl?: string } {
  return {
    id: String(rec.id),
    name: String(rec.name ?? ''),
    price: Number(rec.price ?? 0),
    description: String(rec.description ?? ''),
  }
}

const mockAnimals: Animal[] = [
  { id: 'cat-1', name: 'Whiskers', type: 'cats', price: 120, description: 'Playful tabby cat.', imageUrl: CAT_IMAGE },
  { id: 'dog-1', name: 'Buddy', type: 'dogs', price: 220, description: 'Friendly golden retriever.', imageUrl: DOG_IMAGE },
  { id: 'bird-1', name: 'Kiwi', type: 'birds', price: 60, description: 'Colorful parakeet.', imageUrl: BIRD_IMAGE },
  { id: 'fish-1', name: 'Bubbles', type: 'fishes', price: 25, description: 'Vibrant betta fish.', imageUrl: FISH_IMAGE },
]

const cache = {
  all: null as Promise<Animal[]> | null,
  byType: new Map<AnimalType, Promise<Animal[]>>(),
  byId: new Map<string, Promise<Animal>>()
}

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export async function fetchCategories(): Promise<Category[]> {
  if (useMock) {
    return [
      { key: 'cats', title: 'Cats', imageUrl: CAT_IMAGE },
      { key: 'dogs', title: 'Dogs', imageUrl: DOG_IMAGE },
      { key: 'birds', title: 'Birds', imageUrl: BIRD_IMAGE },
      { key: 'fishes', title: 'Fishes', imageUrl: FISH_IMAGE },
    ]
  }
  const recs = await client.get<CategoryRec[]>(routes.categories)
  const seen = new Set<AnimalType>()
  const result: Category[] = []
  for (const rec of recs) {
    const type = normalizeToType(rec.title)
    if (!type || seen.has(type)) continue
    seen.add(type)
    result.push({ key: type, title: rec.title, imageUrl: pickImage(type) })
  }
  
  ;(['cats','dogs','birds','fishes'] as AnimalType[]).forEach((k) => {
    if (!seen.has(k)) result.push({ key: k, title: k.charAt(0).toUpperCase()+k.slice(1), imageUrl: pickImage(k) })
  })
  return result
}

async function fetchJoinedAnimals(): Promise<Animal[]> {
  if (useMock) return mockAnimals
  const [animalRecs, categoryRecs, links] = await Promise.all([
    client.get<any[]>(routes.animals),
    client.get<CategoryRec[]>(routes.categories),
    client.get<LinkRec[]>(routes.animalsWithCategories),
  ])

  const categoryById = new Map(categoryRecs.map((c) => [c.id, c]))
  const typeByAnimalId = new Map<string, AnimalType>()
  links.forEach((l) => {
    const cat = categoryById.get(l.categoryId)
    if (!cat) return
    const key = normalizeToType(cat.title)
    if (key) typeByAnimalId.set(l.animalId, key)
  })

  return animalRecs.map((rec) => {
    const base = baseAnimal(rec)
    const type = typeByAnimalId.get(base.id) ?? 'cats'
    return {
      id: base.id,
      name: base.name,
      price: base.price,
      description: base.description,
      type,
      imageUrl: pickImage(type),
    }
  })
}

export async function fetchAllAnimals(): Promise<Animal[]> {
  if (!cache.all) cache.all = fetchJoinedAnimals()
  return cache.all
}

export async function fetchAnimalsByType(type: AnimalType): Promise<Animal[]> {
  if (!cache.byType.has(type)) {
    cache.byType.set(type, (async () => {
      const all = await fetchAllAnimals()
      return all.filter((a) => a.type === type)
    })())
  }
  return cache.byType.get(type) as Promise<Animal[]>
}

export async function fetchAnimalById(id: string): Promise<Animal> {
  if (!cache.byId.has(id)) {
    cache.byId.set(id, (async () => {
      const all = await fetchAllAnimals()
      const found = all.find((a) => a.id === id)
      if (!found) throw new Error('Animal not found')
      return found
    })())
  }
  return cache.byId.get(id) as Promise<Animal>
}

export interface PurchaseItem { id: string; quantity: number }
export interface PurchaseResponse { success: boolean }

export async function purchase(items: PurchaseItem[]): Promise<PurchaseResponse> {
  if (useMock) return { success: true }
  return client.post<PurchaseResponse>(routes.purchase, { items })
} 