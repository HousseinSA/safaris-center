import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import { Client } from "@/lib/types";
import formatDate from "@/lib/formatDate";

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    textSmall: {
        fontSize: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
});

interface InvoicePDFProps {
    userData: Client;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ userData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.textSmall}>Date de facture:</Text>
                        <Text style={styles.textSmall}>{formatDate(new Date().toISOString())}</Text>
                        <Image
                            src="/safariscenter.png"
                            style={styles.logo}
                        />
                        <Text style={styles.textSmall}>Tél: 27706495</Text>
                        <Text style={styles.textSmall}>Nif: 01454958</Text>
                    </View>

                    <View>
                        <Text style={styles.title}>FACTURE</Text>
                    </View>
                </View>

                {/* Add other sections (ClientInfo, ServicesTable, InvoiceTotal) here */}
            </Page>
        </Document>
    );
};

export default InvoicePDF;
