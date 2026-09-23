import { NewsletterSummaryItem } from '../types';

/**
 * Exports a single newsletter summary to a clean, printable PDF document
 */
export function exportSummaryToPDF(item: NewsletterSummaryItem): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export the PDF.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const highlightsHtml =
    item.keyPoints && item.keyPoints.length > 0
      ? `
      <div style="background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; padding: 16px; margin: 18px 0;">
        <h3 style="margin: 0 0 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9d174d; font-weight: 800;">
          Key Highlights
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #1f2937; font-size: 13px; line-height: 1.6;">
          ${item.keyPoints.map((pt) => `<li style="margin-bottom: 6px;">${pt}</li>`).join('')}
        </ul>
      </div>
    `
      : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${item.title} — Newsletter Summarizer</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1c1917;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            max-width: 680px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #1c1917;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand {
            font-size: 16px;
            font-weight: 900;
            color: #1c1917;
          }
          .brand-badge {
            background-color: #f472b6;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            margin-left: 8px;
          }
          .date {
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
          }
          .tag-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }
          .category-tag {
            background-color: #fce7f3;
            color: #831843;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid #fbcfe8;
          }
          .source-tag {
            font-size: 12px;
            color: #4b5563;
            font-weight: 600;
          }
          h1 {
            font-size: 26px;
            font-weight: 900;
            line-height: 1.25;
            margin: 0 0 16px 0;
            color: #1c1917;
          }
          .summary-text {
            font-size: 15px;
            line-height: 1.65;
            color: #374151;
            margin-bottom: 16px;
          }
          .why-box {
            border: 2px solid #1c1917;
            border-radius: 12px;
            padding: 14px 16px;
            background-color: #ffffff;
            margin: 18px 0;
          }
          .why-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #1c1917;
            margin: 0 0 6px 0;
          }
          .why-desc {
            font-size: 13px;
            color: #4b5563;
            margin: 0;
            line-height: 1.5;
          }
          .footer {
            margin-top: 36px;
            padding-top: 14px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            Newsletter Summarizer <span class="brand-badge">PDF Briefing</span>
          </div>
          <div class="date">${currentDate}</div>
        </div>

        <div class="tag-row">
          <span class="category-tag">${item.category}</span>
          <span class="source-tag">Source: ${item.source} • ${item.readTime || '2 min read'}</span>
        </div>

        <h1>${item.title}</h1>

        <div class="summary-text">
          ${item.summary}
        </div>

        ${highlightsHtml}

        <div class="why-box">
          <div class="why-title">Why It Matters</div>
          <div class="why-desc">${item.whyItMatters}</div>
        </div>

        <div class="footer">
          <span>Generated by Newsletter Summarizer</span>
          <span>Read what matters in 2 minutes</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Exports all active newsletter summaries in one comprehensive PDF digest
 */
export function exportAllSummariesToPDF(items: NewsletterSummaryItem[], title: string = 'My Newsletter Digest'): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export the PDF.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const cardsHtml = items
    .map(
      (item, idx) => `
      <div style="border: 2px solid #1c1917; border-radius: 14px; padding: 18px; margin-bottom: 20px; page-break-inside: avoid; background-color: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="background-color: #fce7f3; color: #831843; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 6px;">
            ${item.category}
          </span>
          <span style="font-size: 11px; color: #6b7280; font-weight: 600;">
            ${item.source} • ${item.readTime || '2 min'}
          </span>
        </div>

        <h2 style="font-size: 18px; font-weight: 900; margin: 0 0 10px 0; color: #1c1917;">
          ${idx + 1}. ${item.title}
        </h2>

        <p style="font-size: 13px; color: #374151; line-height: 1.6; margin: 0 0 12px 0;">
          ${item.summary}
        </p>

        ${
          item.keyPoints && item.keyPoints.length > 0
            ? `
          <ul style="margin: 0 0 12px 0; padding-left: 18px; font-size: 12px; color: #4b5563; line-height: 1.5;">
            ${item.keyPoints.map((pt) => `<li>${pt}</li>`).join('')}
          </ul>
        `
            : ''
        }

        <div style="background-color: #FFF5F8; border-left: 3px solid #f472b6; padding: 8px 12px; border-radius: 6px;">
          <strong style="font-size: 11px; color: #831843; text-transform: uppercase;">Why it matters:</strong>
          <span style="font-size: 12px; color: #374151; margin-left: 4px;">${item.whyItMatters}</span>
        </div>
      </div>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title} — Newsletter Summarizer</title>
        <style>
          @page {
            size: A4;
            margin: 18mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1c1917;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            max-width: 720px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 2px solid #1c1917;
            padding-bottom: 14px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          h1 {
            font-size: 24px;
            font-weight: 900;
            margin: 0 0 4px 0;
          }
          .subtitle {
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>✨ ${title}</h1>
            <div class="subtitle">Compiled by Newsletter Summarizer • ${items.length} Stories Included</div>
          </div>
          <div style="font-size: 12px; color: #6b7280; font-weight: 600;">
            ${currentDate}
          </div>
        </div>

        ${cardsHtml}

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
