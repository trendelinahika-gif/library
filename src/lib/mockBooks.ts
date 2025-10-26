'use client'

export type Book = {
  id: string
  title: string
  author: string
  category?: string
  year?: number
  description?: string
}

export const MOCK_BOOKS: Book[] = [
  { id: '1', title: 'History of Kosovo', author: 'J. Smith', category: 'History', year: 2015, description: 'A comprehensive look at the history of Kosovo.' },
  { id: '2', title: 'Albanian Literature', author: 'A. Berisha', category: 'Literature', year: 2018, description: 'An anthology of Albanian literary works.' },
  { id: '3', title: 'Serbian Poetry', author: 'M. Petrovic', category: 'Poetry', year: 2020, description: 'A collection of modern Serbian poetry.' },
  { id: '4', title: 'Technology in the Balkans', author: 'L. Kelmendi', category: 'Technology', year: 2022, description: 'Exploring the rise of technology in the Balkan region.' },
  { id: '5', title: 'Architecture of Prishtina', author: 'E. Krasniqi', category: 'Architecture', year: 2012, description: 'A visual guide to the city architecture.' },
  { id: '6', title: 'Cultural Heritage', author: 'M. Hoxha', category: 'Culture', year: 2019, description: 'Preserving cultural identity through archives.' },
  { id: '7', title: 'Children Stories', author: 'A. Dreshaj', category: 'Children', year: 2017, description: 'Stories for young readers to enjoy.' },
  { id: '8', title: 'Modern Art', author: 'B. Krasniqi', category: 'Art', year: 2021, description: 'An overview of modern art movements in region.' }
]
