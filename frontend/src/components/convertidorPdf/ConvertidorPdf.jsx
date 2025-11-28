import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12 },
    title: { fontSize: 18, marginBottom: 20, textAlign: "center" },
    field: { marginBottom: 8 },
    label: { fontWeight: "bold" },
});

const FichaPdf = ({ ficha }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Ficha de Salud</Text>

            {Object.entries(ficha).map(([key, value]) => (
                <Text key={key} style={styles.field}>
                    <Text style={styles.label}>{key}: </Text>
                    {String(value)}
                </Text>
            ))}
        </Page>
    </Document>
);
export default FichaPdf

