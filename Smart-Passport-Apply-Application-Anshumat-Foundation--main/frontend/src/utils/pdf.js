const escapePdfText = (value) =>
  String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const buildPdfContentStream = ({ title, subtitle, sections }) => {
  const commands = [
    "BT",
    "/F1 24 Tf",
    "50 790 Td",
    `(${escapePdfText(title)}) Tj`,
  ];

  if (subtitle) {
    commands.push("0 -28 Td");
    commands.push("/F1 12 Tf");
    commands.push(`(${escapePdfText(subtitle)}) Tj`);
  }

  commands.push("0 -36 Td");
  commands.push("/F1 13 Tf");

  sections.forEach((section, sectionIndex) => {
    commands.push(`(${escapePdfText(section.heading)}) Tj`);
    commands.push("0 -20 Td");
    commands.push("/F1 11 Tf");

    section.lines.forEach((line) => {
      commands.push(`(${escapePdfText(line)}) Tj`);
      commands.push("0 -16 Td");
    });

    if (sectionIndex < sections.length - 1) {
      commands.push("0 -10 Td");
      commands.push("/F1 13 Tf");
    }
  });

  commands.push("ET");
  return commands.join("\n");
};

export const downloadPdfDocument = ({ filename, title, subtitle, sections }) => {
  const stream = buildPdfContentStream({ title, subtitle, sections });

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
