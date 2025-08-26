export type AnimalType = 'cats' | 'dogs' | 'birds' | 'fishes'

export interface Animal {
  id: string
  name: string
  type: AnimalType
  price: number
  description: string
  imageUrl: string
} 