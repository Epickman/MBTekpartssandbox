import type { Metadata } from 'next'
import { isDiagramType } from '@/data/vehicleDiagrams'
import PersonalizarClient from './PersonalizarClient'

export const metadata: Metadata = {
  title: 'Personalizá tu vehículo',
  description: 'Elegí ATV o MX y tocá cada parte para ver qué componentes tenés en el carrito y sumar los que te faltan.',
}

export default async function PersonalizarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { tipo } = await searchParams
  const type = isDiagramType(tipo) ? tipo : null
  // key: al cambiar de vehículo se arranca sin parte seleccionada
  return <PersonalizarClient key={type ?? 'elegir'} type={type} />
}
