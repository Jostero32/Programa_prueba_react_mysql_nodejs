import { jsPDF } from 'jspdf';
import '../home.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const PDFDownloadComponent = ({ informes }) => {
    const alerta = withReactContent(Swal);


    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('ANEXO 11', 105, 20, { align: 'center' });
        doc.setFontSize(16);
        doc.text('INFORME FINAL DEL AVANCE DEL TRABAJO DE TITULACIÓN', 105, 30, { align: 'center' });

        // Sub-Encabezado
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('UNIVERSIDAD TÉCNICA DE AMBATO', 105, 40, { align: 'center' });
        doc.text('FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL.', 105, 50, { align: 'center' });
        doc.text(`CARRERA DE ${informes[0].carrera.toUpperCase()}`, 105, 60, { align: 'center' });

        // Información del estudiante
        doc.text(`FECHA: ${informes[0].fecha_informe}`, 10, 70);
        doc.text(`NOMBRE DEL ESTUDIANTE: ${informes[0].nombre_estudiante}`, 10, 80);

        // División del texto largo para el tema del trabajo
        let temaLines = doc.splitTextToSize(`TEMA DEL TRABAJO DE TITULACIÓN: ${informes[0].tema}`, 180);
        doc.text(temaLines, 10, 100);

        // División del texto largo para la fecha de aprobación
        let fechaAprobacionLines = doc.splitTextToSize(`FECHA DE APROBACIÓN DE LA PROPUESTA DEL PERFIL DEL TRABAJO DE TITULACIÓN POR EL CONSEJO DIRECTIVO: ${informes[0].fechaAprobacion}`, 180);
        doc.text(fechaAprobacionLines, 10, 120);

        doc.text(`PORCENTAJE DE AVANCE DE ACUERDO AL CRONOGRAMA: 100 %.`, 10, 140);

        // Tabla de actividades
        const startY = 160;
        const tableTopY = startY;
        const cellHeight = 10;
        const cellWidthDate = 50;
        const cellWidthActivity = 140;

        // Encabezados de la tabla
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha', 10, tableTopY);
        doc.text('Actividades', 60, tableTopY);
        doc.setFont('helvetica', 'normal');

        // Dibujar líneas de la tabla
        doc.line(10, tableTopY + 2, 200, tableTopY + 2); // línea superior de la tabla
        doc.line(10, tableTopY + cellHeight, 200, tableTopY + cellHeight); // línea inferior de los encabezados
        doc.line(10, tableTopY + 2, 10, tableTopY + cellHeight); // línea izquierda
        doc.line(200, tableTopY + 2, 200, tableTopY + cellHeight); // línea derecha

        // Ajustar el inicio de las actividades
        let currentY = tableTopY + cellHeight;

        informes.forEach((informe, index) => {
            const fechaInforme = new Date(informe.fecha_informe.split('/').reverse().join('-'));
            const primerDiaMes = new Date(fechaInforme.getFullYear(), fechaInforme.getMonth(), 1);
            const esPrimerInforme = index === 0;
            const fechaInicio = esPrimerInforme ? new Date(informe.fechaAprobacion.split('/').reverse().join('-')) : primerDiaMes;
            const rangoFecha = `Del ${fechaInicio.getDate()} al ${fechaInforme.getDate()} de ${fechaInforme.toLocaleString('default', { month: 'long' })}`;

            // Concatenar todas las actividades en una sola cadena de texto
            let allActivities = informe.actividades.map((activity, idx) => `${idx + 1}. ${activity.descripcion}`).join('\n');
            let actividadLines = doc.splitTextToSize(allActivities, cellWidthActivity - 2);

            // Dibujar líneas de la tabla para cada actividad
            let a=(index===informes.length-1)?0:25;
            doc.line(10, currentY, 10, currentY + actividadLines.length * cellHeight+a); // línea izquierda
            doc.line(60, currentY, 60, currentY + actividadLines.length * cellHeight+a); // línea en medio
            doc.line(200, currentY, 200, currentY + actividadLines.length * cellHeight+a); // línea derecha
            doc.line(10, currentY + actividadLines.length * cellHeight, 200, currentY + actividadLines.length * cellHeight); // línea inferior

            // Agregar rango de fechas y actividades a la tabla
            doc.text(rangoFecha, 12, currentY + cellHeight - 2);
            doc.text(actividadLines, 62, currentY + cellHeight - 2);

            // Ajustar el espacio vertical para la siguiente fila
            currentY += actividadLines.length * cellHeight + cellHeight;
        });

        // Firma
        const signatureY = currentY + 20;
        doc.text('_________________________________________', 105, signatureY, { align: 'center' });
        doc.text('NOMBRE Y FIRMA', 105, signatureY + 10, { align: 'center' });
        doc.text('TUTOR TRABAJO TITULACIÓN', 105, signatureY + 20, { align: 'center' });

        // Nota
        doc.setFontSize(10);

        doc.save('ANEXO_11.pdf');
    };

    return (
        <button className="boton" onClick={() => {
            if(informes[informes.length-1].progreso===100){
                generatePDF();
            }else{
                alerta.fire({
                    title: '¡Alerta!',
                    text: 'No ha llegado al 100% de avance para poder generar el informe.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                  });
            }
        }}>Generar Anexo 11</button>
    );
};

export default PDFDownloadComponent;
