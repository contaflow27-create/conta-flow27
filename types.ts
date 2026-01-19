export interface PromptScene {
  id: string;
  phase: 'Hook' | 'Scarcity' | 'CTA';
  duration: string;
  description: string;
  cameraMovement: string;
  lighting: string;
}

export interface GeneratedPrompts {
  scenes: PromptScene[];
  productName: string;
  marketingAngle: string;
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  progress: number; // 0 to 100
  message: string;
  error?: string;
}

export interface MediaFile {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
}