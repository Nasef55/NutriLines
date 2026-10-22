
import { MedicalReport } from '../types';

export interface AnalysisResponse {
  success: boolean;
  source?: string;
  analysis?: {
    reportTitle: string;
    laboratoryName?: string;
    patientName?: string;
    reportDate?: string;
    overallSummary: string;
    arabicSummary: string;
    results: Array<{
      testName: string;
      value: string;
      unit: string;
      referenceRange: string;
      status: 'Normal' | 'High' | 'Low';
      arabicExplanation: string;
      clinicalNote?: string;
    }>;
    actionableAdvice: string[];
    disclaimer?: string;
  } | null;
  error?: string;
}

export async function analyzeReportWithAI(params: {
  imageBase64?: string;
  rawText?: string;
  sampleType?: string;
}): Promise<AnalysisResponse> {
  try {
    const res = await fetch('/api/analyze-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data: AnalysisResponse = await res.json().catch(() => ({
      success: false,
      error: 'استجابة غير صالحة من السيرفر.',
    }));

    if (!res.ok || !data.success) {
      return {
        success: false,
        source: data.source || 'error',
        analysis: null,
        error:
          data.error ||
          (res.status === 422
            ? 'الصورة ليست تقرير تحاليل طبية واضحًا، أو لا تحتوي على نتائج قابلة للقراءة.'
            : `فشل تحليل الصورة (HTTP ${res.status}). حاول مرة أخرى.`),
      };
    }

    if (!data.analysis) {
      return {
        success: false,
        source: 'error',
        analysis: null,
        error: 'لم يتمكن النظام من استخراج نتائج التحاليل. جرّب صورة أوضح.',
      };
    }

    return data;
  } catch (error: unknown) {
    console.error('AI analysis fetch failed:', error);

    return {
      success: false,
      source: 'error',
      analysis: null,
      error: 'تعذر الاتصال بخدمة تحليل الصور. تحقق من الاتصال وحاول مرة أخرى.',
    };
  }
}
