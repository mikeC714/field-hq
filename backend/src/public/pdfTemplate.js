import PDFDocument from 'pdfkit';

export async function pdf({ quote, materials, labor, user, customer, expiry }) {
	const { data, created_at } = quote;
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const blue = '#1a3a6b';
        const white = '#ffffff';
        const pageWidth = 515;

        // ── Header ──────────────────────────────────────────
        doc.rect(0, 0, 612, 80).fill(blue);

        doc.fillColor(white).fontSize(15).font('Helvetica-Bold')
            .text(`${user.first_name} ${user.last_name}`, 50, 24);
        doc.fillColor('rgba(255,255,255,0.7)').fontSize(13).font('Helvetica')
            .text(user.email, 50, 44);
        doc.fillColor(white).fontSize(28).font('Helvetica-Bold')
            .text('QUOTE', 400, 24, { align: 'right', width: 160 });

        // ── Bill To / Dates ──────────────────────────────────
        doc.moveDown(3);
        const billToY = doc.y;

        doc.fillColor(blue).fontSize(11).font('Helvetica-Bold')
            .text('BILL TO', 50, billToY);
        doc.fillColor('#333333').fontSize(18).font('Helvetica')
            .text(`${customer.firstName} ${customer.lastName}`, 50, billToY + 16);
        doc.fillColor('#666666').fontSize(13)
            .text(customer.address, 50, billToY + 38);

        doc.fillColor(blue).fontSize(13).font('Helvetica-Bold')
            .text('Quote date', 350, billToY, { continued: true })
            .font('Helvetica').fillColor('#333333')
            .text(`${created_at}`, { align: 'right' });

        doc.fillColor(blue).fontSize(13).font('Helvetica-Bold')
            .text('Due date', 350, billToY + 20, { continued: true })
            .font('Helvetica').fillColor('#333333')
            .text(`${expiry}`, { align: 'right' });

        // ── Materials Table Header ────────────────────────────
        const materialsTableTop = billToY + 80;
        doc.rect(50, materialsTableTop, pageWidth, 30).fill(blue);

        doc.fillColor(white).fontSize(11).font('Helvetica-Bold')
            .text('MATERIALS', 55, materialsTableTop + 9);

        const matHeaderY = materialsTableTop + 30;
        doc.rect(50, matHeaderY, pageWidth, 25).fill('#e8edf5');

        doc.fillColor(blue).fontSize(12).font('Helvetica-Bold');
        doc.text('QTY',         55,  matHeaderY + 7);
        doc.text('Description', 110, matHeaderY + 7);
        doc.text('Unit Cost',   350, matHeaderY + 7, { width: 100, align: 'right' });
        doc.text('Amount',      455, matHeaderY + 7, { width: 100, align: 'right' });

        // ── Materials Rows ────────────────────────────────────
        let rowY = matHeaderY + 25;
        materials.forEach((item, i) => {
            const isLast = i === materials.length - 1;

            doc.fillColor('#333333').fontSize(12).font('Helvetica');
            doc.text(String(item.quantity),   55,  rowY + 8);
            doc.text(item.description,        110, rowY + 8);
            doc.text(String(item.unitCost),   350, rowY + 8, { width: 100, align: 'right' });
            doc.text(String(item.total),      455, rowY + 8, { width: 100, align: 'right' });

            rowY += 35;
            doc.moveTo(50, rowY)
                .lineTo(565, rowY)
                .strokeColor(isLast ? blue : '#eeeeee')
                .lineWidth(isLast ? 2 : 1)
                .stroke();
        });

        // ── Labor Table Header ────────────────────────────────
        const laborTableTop = rowY + 24;
        doc.rect(50, laborTableTop, pageWidth, 30).fill(blue);

        doc.fillColor(white).fontSize(11).font('Helvetica-Bold')
            .text('LABOR', 55, laborTableTop + 9);

        const labHeaderY = laborTableTop + 30;
        doc.rect(50, labHeaderY, pageWidth, 25).fill('#e8edf5');

        doc.fillColor(blue).fontSize(12).font('Helvetica-Bold');
        doc.text('HRS',         55,  labHeaderY + 7);
        doc.text('Description', 110, labHeaderY + 7);
        doc.text('Hourly Rate', 350, labHeaderY + 7, { width: 100, align: 'right' });
        doc.text('Amount',      455, labHeaderY + 7, { width: 100, align: 'right' });

        // ── Labor Rows ────────────────────────────────────────
        let labRowY = labHeaderY + 25;
        labor.forEach((item, i) => {
            const isLast = i === labor.length - 1;

            doc.fillColor('#333333').fontSize(12).font('Helvetica');
            doc.text(String(item.hours),       55,  labRowY + 8);
            doc.text(item.description,         110, labRowY + 8);
            doc.text(String(item.hourlyRate),  350, labRowY + 8, { width: 100, align: 'right' });
            doc.text(String(item.total),       455, labRowY + 8, { width: 100, align: 'right' });

            labRowY += 35;
            doc.moveTo(50, labRowY)
                .lineTo(565, labRowY)
                .strokeColor(isLast ? blue : '#eeeeee')
                .lineWidth(isLast ? 2 : 1)
                .stroke();
        });

        // ── Totals ────────────────────────────────────────────
        const totalsY = labRowY + 16;
		const subTotal = data.subTotal.toFixed(2);

        doc.fillColor('#666666').fontSize(13).font('Helvetica')
            .text('Subtotal', 350, totalsY, { width: 100 });
        doc.fillColor('#333333')
            .text(String(subTotal), 455, totalsY, { width: 100, align: 'right' });


        doc.moveTo(350, totalsY + 20).lineTo(565, totalsY + 20)
            .strokeColor(blue).lineWidth(2).stroke();

        doc.fillColor(blue).fontSize(13).font('Helvetica-Bold')
            .text('Total (USD)', 350, totalsY + 28, { width: 100 });
        doc.fontSize(15)
            .text(String(data.total), 455, totalsY + 28, { width: 100, align: 'right' });

        // ── Footer ────────────────────────────────────────────
        const footerY = totalsY + 70;
        doc.rect(0, footerY, 612, 40).fill(blue);
        doc.fillColor('rgba(255,255,255,0.7)').fontSize(12).font('Helvetica')
            .text('This is an automatically generated quote. Please do not reply to this email.',
                50, footerY + 12, { align: 'center', width: pageWidth });

        doc.end();
    });
}
