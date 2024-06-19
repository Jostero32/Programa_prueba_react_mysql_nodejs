import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import PDFViewer from './PDFViewer';

const PDFGenerator = ({informe}) => {
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        generatePDF();
    }, [informe]); 

    const generatePDF = () => {
        const doc = new jsPDF();
    
        // Encabezado
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('ANEXO 5', 105, 20, { align: 'center' });
        doc.setFontSize(16);
        doc.text('INFORME MENSUAL DEL AVANCE DEL TRABAJO DE TITULACIÓN', 105, 30, { align: 'center' });
    
        // Sub-Encabezado
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('UNIVERSIDAD TÉCNICA DE AMBATO', 105, 40, { align: 'center' });
        doc.text('FACULTAD DE INGENIERIA EN SISTEMAS, ELECTRONICA E INDUSTRIAL.', 105, 50, { align: 'center' });
        doc.text(`CARRERA DE ${informe.carrera.toUpperCase()}`, 105, 60, { align: 'center' });
    
        // Información del estudiante
        doc.text(`FECHA: ${informe.fecha_informe}`, 10, 70);
        doc.text(`NOMBRE DEL ESTUDIANTE: ${informe.nombre_estudiante}`, 10, 80);
    
        // División del texto largo para el tema del trabajo
        let temaLines = doc.splitTextToSize(`TEMA DEL TRABAJO DE TITULACIÓN: ${informe.tema}`, 180);
        doc.text(temaLines, 10, 100);
    
        // División del texto largo para la fecha de aprobación
        let fechaAprobacionLines = doc.splitTextToSize(`FECHA DE APROBACIÓN DE LA PROPUESTA DEL PERFIL DEL TRABAJO DE TITULACIÓN POR EL CONSEJO DIRECTIVO: ${informe.fechaAprobacion}`, 180);
        doc.text(fechaAprobacionLines, 10, 120);
    
        doc.text(`PORCENTAJE DE AVANCE DE ACUERDO AL CRONOGRAMA: ${informe.progreso} %.`, 10, 140);
    
        // Tabla de actividades
        const startY = 150;
        const cellHeight = 10;
        const cellWidthDate = 50;
        const cellWidthActivity = 140;
        const tableTopY = startY + 10;
    
        // Encabezados de la tabla
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha', 10, startY);
        doc.text('Actividad', 60, startY);
        doc.setFont('helvetica', 'normal');
    
        // Filas de la tabla
        informe.actividades.map((activity, index) => {
            const rowY = tableTopY + index * cellHeight;
            doc.rect(10, rowY - 8, cellWidthDate, cellHeight);
            doc.rect(60, rowY - 8, cellWidthActivity, cellHeight);
            doc.text(activity.fecha.split('T')[0].split('-').reverse().join('/'), 12, rowY);
    
            let actividadLines = doc.splitTextToSize(activity.descripcion, cellWidthActivity - 2);
            doc.text(actividadLines, 62, rowY);
        });
    
        // Firma
        const signatureY = tableTopY + informe.actividades.length * cellHeight + 20 + 40;
        doc.text('_________________________________________', 105, signatureY, { align: 'center' });
        doc.text('NOMBRE Y FIRMA', 105, signatureY + 10, { align: 'center' });
        doc.text('TUTOR TRABAJO TITULACIÓN', 105, signatureY + 20, { align: 'center' });
    
        // Nota
        doc.setFontSize(10);
        const noteY = signatureY + 30;
    
        const pdfOutput = doc.output('datauristring');
        setPdfData(pdfOutput);
    };

    return (
        <div>
            {pdfData && <PDFViewer pdfData={pdfData} />}
            <button onClick={generatePDF}></button>
        </div>
    );
};

export default PDFGenerator;
