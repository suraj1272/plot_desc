export type PlotStatus = 'available' | 'booked' | 'sold';

export interface PlotDimensions {
  length: number; // in feet
  width: number;  // in feet
  area: number;   // in sq ft
  areaMetric?: number; // in sq m
  dimensionLabel?: string; // e.g. "9m x 12m" or "Irregular"
}

export interface PlotHotspot {
  // SVG overlay coordinates (relative to the master plan image container)
  x: number;      // % from left
  y: number;      // % from top
  width: number;  // % of container width
  height: number; // % of container height
  rotation?: number; // degrees, for non-orthogonal plots
  polygon?: string; // SVG polygon points string (relative %, comma separated "x1,y1 x2,y2 ...")
}

export interface Plot {
  id: string;
  number: number;
  hotspot: PlotHotspot;
  dimensions: PlotDimensions;
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  price?: number;       // per sq ft price in INR
  totalPrice?: number;  // Total price in INR
  status: PlotStatus;
  features?: string[];
  model3dUrl?: string;  // future 3D model URL
  block?: string;       // e.g. "A", "B"
  corner?: boolean;     // is it a corner plot?
  surveyNo?: string;    // "98" or "101"
  layoutName?: string;  // e.g. "Shreemant Jagadevrao Deshmukh Layout"
}

export interface ProjectInfo {
  name: string;
  developerName: string;
  tagline: string;
  location: string;
  totalPlots: number;
  totalArea: string; // e.g. "12 Acres"
  reraNumber?: string;
}
