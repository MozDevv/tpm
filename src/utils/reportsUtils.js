// pdfUtils.js

export const generatePdfBlob = async (contentRef, setPdfBlob, setLoading) => {
  setTimeout(async () => {
    const element = contentRef.current;

    // Dynamically import html2pdf.js
    const html2pdf = (await import('html2pdf.js')).default;

    // Define fixed dimensions for the content (in pixels)
    const fixedWidth = 770; // Width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    // Define options for the PDF
    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Page 5.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    // Create a wrapper to hold the cloned content
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.overflow = 'hidden';

    const clonedElement = element.cloneNode(true);
    const scale = 0.99; // Scale factor to reduce the size
    clonedElement.style.transform = `scale(${scale})`;
    clonedElement.style.transformOrigin = 'top left';

    wrapper.appendChild(clonedElement);

    html2pdf()
      .set(options)
      .from(wrapper)
      .outputPdf('blob')
      .then((pdfBlob) => {
        setPdfBlob(pdfBlob);
      })
      .catch(() => {
        setLoading(false);
      });
  });
};
