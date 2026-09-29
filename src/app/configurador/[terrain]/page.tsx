import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { terrainData, getTerrainById } from '@/data/terrain'
import TerrainConfigurator from './TerrainConfigurator'

interface Props {
  params: Promise<{ terrain: string }>
}

export async function generateStaticParams() {
  return terrainData.map((t) => ({ terrain: t.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { terrain } = await params
  const t = getTerrainById(terrain)
  if (!t) return {}
  return {
    title: `Configurador ${t.name}`,
    description: `Armá tu ATV para ${t.name}. ${t.description}`,
  }
}

export default async function TerrainPage({ params }: Props) {
  const { terrain } = await params
  if (terrain !== 'tierra' && terrain !== 'arena') notFound()
  return <TerrainConfigurator terrain={terrain} />
}
