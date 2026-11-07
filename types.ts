
export interface ConversionResult {
  id?: string;
  artistName: string;
  safeDescription: string;
  timestamp: number;
}

export interface AppState {
  history: ConversionResult[];
  isLoading: boolean;
  error: string | null;
  currentResult: ConversionResult | null;
}
