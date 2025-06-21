export type ExcalidrawElement = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: string;
  strokeWidth: number;
  roughness: number;
  opacity: number;
  groupIds: string[];
  roundness?: number | null;
};

export type AppState = {
  viewBackgroundColor: string;
  zoom?: { value: number };
  scrollX?: number;
  scrollY?: number;
  collaborators?: Record<string, any>;
};

export type BinaryFiles = Record<string, {
  id: string;
  dataURL: string;
  mimeType: string;
  created: number;
  lastRetrieved: number;
}>;
