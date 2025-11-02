import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { backgroundColor: "#fff", padding: 20 },
  section: { marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 10 },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Invoice #123</Text>
        <Text>Customer: Nazmul Hossain</Text>
        <Text>Total: $250</Text>
      </View>
    </Page>
  </Document>
);

export default function App() {
  return (
    <PDFDownloadLink document={<MyDocument />} fileName="invoice.pdf">
      {({ loading }) => (loading ? "Preparing document..." : "Download PDF")}
    </PDFDownloadLink>
  );
}
