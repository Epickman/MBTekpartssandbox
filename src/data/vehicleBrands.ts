import type { VehicleBrand, VehicleModel } from '@/types'

// Add or remove brands and models here — reflected everywhere on the site
// NOTE: Only list brands MBTEK actually carries. This list is a starting point.
// Actual compatibility per product lives in src/data/products.ts

export const vehicleBrands: VehicleBrand[] = [
  {
    id: 'yamaha',
    name: 'YAMAHA',
    models: [
      { id: 'yamaha-raptor-700', name: 'Raptor 700', type: 'atv', years: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'] },
      { id: 'yamaha-raptor-350', name: 'Raptor 350', type: 'atv', years: ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'] },
      { id: 'yamaha-yfz450r', name: 'YFZ450R', type: 'atv', years: ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'] },
      { id: 'yamaha-yfz450f', name: 'YFZ450F', type: 'atv', years: ['2003', '2004', '2005', '2006', '2007', '2008', '2009'] },
      { id: 'yamaha-grizzly-700', name: 'Grizzly 700', type: 'atv' },
      { id: 'yamaha-banshee', name: 'Banshee 350', type: 'atv' },
    ],
  },
  {
    id: 'honda',
    name: 'HONDA',
    models: [
      { id: 'honda-trx450r', name: 'TRX450R', type: 'atv' },
      { id: 'honda-trx700xx', name: 'TRX700XX', type: 'atv' },
      { id: 'honda-foreman-500', name: 'Foreman 500', type: 'atv' },
      { id: 'honda-rancher-420', name: 'Rancher 420', type: 'atv' },
    ],
  },
  {
    id: 'can-am',
    name: 'CAN-AM',
    models: [
      { id: 'canam-renegade-1000', name: 'Renegade 1000R', type: 'atv' },
      { id: 'canam-renegade-570', name: 'Renegade 570', type: 'atv' },
      { id: 'canam-outlander-1000', name: 'Outlander 1000', type: 'atv' },
    ],
  },
  {
    id: 'polaris',
    name: 'POLARIS',
    models: [
      { id: 'polaris-sportsman-850', name: 'Sportsman 850', type: 'atv' },
      { id: 'polaris-scrambler-1000', name: 'Scrambler 1000', type: 'atv' },
    ],
  },
  {
    id: 'suzuki',
    name: 'SUZUKI',
    models: [
      { id: 'suzuki-ltz400', name: 'LTZ400', type: 'atv' },
      { id: 'suzuki-kingquad-750', name: 'KingQuad 750', type: 'atv' },
    ],
  },
  {
    id: 'kawasaki',
    name: 'KAWASAKI',
    models: [
      { id: 'kawasaki-kfx700', name: 'KFX700', type: 'atv' },
      { id: 'kawasaki-brute-force-750', name: 'Brute Force 750', type: 'atv' },
    ],
  },
  {
    id: 'cfmoto',
    name: 'CFMOTO',
    models: [
      { id: 'cfmoto-cforce-450', name: 'CForce 450', type: 'atv' },
      { id: 'cfmoto-cforce-800', name: 'CForce 800', type: 'atv' },
    ],
  },
]

// Short brand names for the top marquee bar
export const brandMarqueeNames: string[] = vehicleBrands.map((b) => b.name)

const modelTypes = new Map(vehicleBrands.flatMap((b) => b.models.map((m) => [m.id, m.type] as const)))

/**
 * ¿El producto sirve para este tipo de vehículo? Se deduce de los modelos compatibles;
 * un producto sin modelos cargados se considera universal.
 */
export function productFitsVehicleType(product: { vehicles: string[] }, type: VehicleModel['type']): boolean {
  if (product.vehicles.length === 0) return true
  return product.vehicles.some((id) => modelTypes.get(id) === type)
}
