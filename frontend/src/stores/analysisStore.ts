import { create } from 'zustand'
import type { AnalysisResult } from '@types/index'

interface AnalysisState {
  currentAnalysis: AnalysisResult | null
  recentAnalyses: AnalysisResult[]
  isAnalyzing: boolean
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void
  addAnalysis: (analysis: AnalysisResult) => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  clearAnalyses: () => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  recentAnalyses: [],
  isAnalyzing: false,
  
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  
  addAnalysis: (analysis) =>
    set((state) => ({
      recentAnalyses: [analysis, ...state.recentAnalyses].slice(0, 10),
    })),
  
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  
  clearAnalyses: () =>
    set({ currentAnalysis: null, recentAnalyses: [], isAnalyzing: false }),
}))
