
import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AnalysisResult from "./AnalysisResult";

type AnalysisModalProps = {
  open: boolean;
  reportId: string | null;
  onClose: () => void;
};

function AnalysisModal({ open, reportId, onClose }: AnalysisModalProps) {
  const [analysisData, setAnalysisData] = React.useState<any>(null);
  const [downloading, setDownloading] = React.useState(false);

  const downloadPDF = async () => {
    if (!analysisData) {
      alert("Analysis not ready yet");
      return;
    }

    setDownloading(true);
    let reportElement: HTMLDivElement | null = null;

    try {
      const data = analysisData;
      const results = Array.isArray(data.results) ? data.results : [];

      reportElement = document.createElement("div");
      reportElement.dir = "rtl";

      Object.assign(reportElement.style, {
        position: "fixed",
        left: "-10000px",
        top: "0",
        width: "750px",
        padding: "36px",
        background: "#ffffff",
        color: "#172033",
        fontFamily: "Arial, Tahoma, sans-serif",
        fontSize: "16px",
        lineHeight: "1.8",
        direction: "rtl",
        textAlign: "right",
        boxSizing: "border-box",
      });

      const addText = (
        parent: HTMLElement,
        text: unknown,
        style: Partial<CSSStyleDeclaration> = {}
      ) => {
        const element = document.createElement("div");
        element.textContent = String(text ?? "");
        Object.assign(element.style, style);
        parent.appendChild(element);
        return element;
      };

      const addSection = (
        text: string,
        style: Partial<CSSStyleDeclaration> = {}
      ) => addText(reportElement!, text, style);

      addSection("NutriLines - AI Medical Analysis", {
        direction: "ltr",
        textAlign: "left",
        fontSize: "23px",
        fontWeight: "bold",
        color: "#174ea6",
        marginBottom: "24px",
      });

      addSection(data.reportTitle || "Medical Report", {
        fontSize: "21px",
        fontWeight: "bold",
        marginBottom: "16px",
      });

      addSection("الملخص", {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "8px",
      });

      addSection(
        data.arabicSummary ||
          data.overallSummary ||
          "لا يوجد ملخص متاح.",
        { whiteSpace: "pre-wrap", marginBottom: "24px" }
      );

      addSection("نتائج التحاليل", {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "12px",
      });

      if (results.length === 0) {
        addSection(
          "لم يتم العثور على نتائج تحاليل قابلة للعرض في هذا التقرير.",
          { marginBottom: "20px" }
        );
      } else {
        results.forEach((item: any) => {
          const card = document.createElement("div");

          Object.assign(card.style, {
            border: "1px solid #dbe3ee",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "10px",
            breakInside: "avoid",
            pageBreakInside: "avoid",
            boxSizing: "border-box",
          });

          addText(
            card,
            `${item.testName || "تحليل"}: ${item.value ?? "غير متاح"} ${
              item.unit || ""
            }`,
            { fontWeight: "bold" }
          );

          addText(card, `الحالة: ${item.status || "غير محددة"}`);

          if (item.referenceRange) {
            addText(card, `النطاق المرجعي: ${item.referenceRange}`);
          }

          if (item.arabicExplanation) {
            addText(card, item.arabicExplanation, {
              marginTop: "5px",
            });
          }

          reportElement!.appendChild(card);
        });
      }

      if (
        Array.isArray(data.actionableAdvice) &&
        data.actionableAdvice.length
      ) {
        addSection("التوصيات", {
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "8px",
        });

        data.actionableAdvice.forEach((advice: string) => {
          addSection(`• ${advice}`, { marginBottom: "6px" });
        });
      }

      addSection(
        data.disclaimer ||
          "هذا التقرير استرشادي ولا يغني عن استشارة الطبيب المختص.",
        {
          borderTop: "1px solid #dbe3ee",
          marginTop: "24px",
          paddingTop: "12px",
          fontSize: "12px",
          color: "#596579",
        }
      );

      document.body.appendChild(reportElement);

      if ("fonts" in document) {
        await document.fonts.ready;
      }

      // Render each top-level block separately to avoid overlapping page slices.
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const printableWidth = pageWidth - margin * 2;
      const printableHeight = pageHeight - margin * 2;
      const gap = 3;

      let currentY = margin;
      let hasContentOnPage = false;

      const addNewPage = () => {
        pdf.addPage();
        currentY = margin;
        hasContentOnPage = false;
      };

      const blocks = Array.from(reportElement.children) as HTMLElement[];

      for (const block of blocks) {
        const canvas = await html2canvas(block, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
        });

        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        const renderedHeight = (canvas.height * printableWidth) / canvas.width;

        // Move the complete block to the next page if it does not fit.
        if (
          hasContentOnPage &&
          currentY + renderedHeight > pageHeight - margin
        ) {
          addNewPage();
        }

        // A very tall block needs to be split into non-overlapping slices.
        if (renderedHeight > printableHeight) {
          if (hasContentOnPage) {
            addNewPage();
          }

          const sliceHeightPx = Math.max(
            1,
            Math.floor((printableHeight * canvas.width) / printableWidth)
          );

          let sourceY = 0;

          while (sourceY < canvas.height) {
            const partHeight = Math.min(
              sliceHeightPx,
              canvas.height - sourceY
            );

            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = partHeight;

            const context = sliceCanvas.getContext("2d");
            if (!context) {
              throw new Error("Could not create PDF canvas context");
            }

            context.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              partHeight,
              0,
              0,
              canvas.width,
              partHeight
            );

            const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.95);
            const sliceHeightMm =
              (partHeight * printableWidth) / canvas.width;

            pdf.addImage(
              sliceData,
              "JPEG",
              margin,
              margin,
              printableWidth,
              sliceHeightMm
            );

            sourceY += partHeight;

            if (sourceY < canvas.height) {
              addNewPage();
            }
          }

          // Start subsequent content on a fresh page after a tall block.
          addNewPage();
          continue;
        }

        pdf.addImage(
          imageData,
          "JPEG",
          margin,
          currentY,
          printableWidth,
          renderedHeight
        );

        currentY += renderedHeight + gap;
        hasContentOnPage = true;
      }

      pdf.save("NutriLines-Analysis.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("تعذر إنشاء ملف PDF. حاول مرة أخرى.");
    } finally {
      reportElement?.remove();
      setDownloading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-3xl max-h-[85vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 w-10 h-10 rounded-full text-gray-600 hover:bg-red-100 hover:text-red-600 text-xl transition"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-5 text-blue-700 border-b pb-3">
          🤖 AI Medical Analysis
        </h2>

        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="mb-4 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-60"
        >
          {downloading ? "جاري تجهيز الملف..." : "📄 Download Analysis PDF"}
        </button>

        <AnalysisResult
          reportId={reportId || ""}
          onAnalysisLoaded={setAnalysisData}
        />
      </div>
    </div>
  );
}

export default AnalysisModal;
