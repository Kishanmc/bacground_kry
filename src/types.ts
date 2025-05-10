export interface ChemicalItem {
  id: number;
  name: string;
  color: string;
  type: 'acid' | 'base' | 'indicator';
  volume: number;
  maxVolume: number;
}

export interface MixedChemical {
  id: string;
  color: string;
  volume: number;
  chemicals: ChemicalItem[];
}

export type ContainerType = 'beaker' | 'test_tube' | 'flask';

export interface LabContainer {
  id: string;
  type: ContainerType;
  chemical?: MixedChemical;
  position: [number, number, number];
  maxVolume: number;
}