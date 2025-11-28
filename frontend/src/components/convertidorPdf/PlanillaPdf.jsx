import { PDFDownloadLink } from "@react-pdf/renderer";
import FichaPdf from "../convertidorPdf/ConvertidorPdf";
import "./planillaPdf.css"
const PlanillaPdf = ({ ficha }) => {

    return (
        <PDFDownloadLink
            className="pdf-maker"
            document={<FichaPdf ficha={ficha} />}
            fileName={`planilla-${ficha.id_ficha}.pdf`}
        >
            {({ loading }) =>
                loading ? "Generando PDF..." : "Descargar PDF"
            }
        </PDFDownloadLink>
    );
};

export default PlanillaPdf;
