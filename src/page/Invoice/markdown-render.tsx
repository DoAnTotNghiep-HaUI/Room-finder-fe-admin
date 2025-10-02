import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { marked } from "marked";

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 11,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  heading1: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 6,
  },
  heading2: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 4,
  },
  listItem: {
    fontSize: 11,
    marginLeft: 12,
    marginBottom: 2,
  },
  table: {
    style: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontSize: 10,
    flexGrow: 1,
  },
});

export default function MarkdownRenderer({ md }: { md: string }) {
  const tokens = marked.lexer(md);

  return (
    <View>
      {tokens.map((token, i) => {
        switch (token.type) {
          case "heading":
            if (token.depth === 1) {
              return (
                <Text
                  key={i}
                  style={styles.heading1}
                >
                  {token.text}
                </Text>
              );
            }
            if (token.depth === 2) {
              return (
                <Text
                  key={i}
                  style={styles.heading2}
                >
                  {token.text}
                </Text>
              );
            }
            return (
              <Text
                key={i}
                style={styles.paragraph}
              >
                {token.text}
              </Text>
            );

          case "paragraph":
            return (
              <Text
                key={i}
                style={styles.paragraph}
              >
                {token.text}
              </Text>
            );

          case "list":
            return (
              <View key={i}>
                {token.items.map((item: any, j: number) => (
                  <Text
                    key={j}
                    style={styles.listItem}
                  >
                    • {item.text}
                  </Text>
                ))}
              </View>
            );

          case "table":
            return (
              <View
                key={i}
                style={styles.table}
              >
                {/* Header */}
                <View style={styles.tableRow}>
                  {token.header.map((cell: any, j: number) => (
                    <Text
                      key={j}
                      style={[styles.tableCell, styles.bold]}
                    >
                      {cell.text} {/* ✅ chỉ lấy text */}
                    </Text>
                  ))}
                </View>
                {/* Rows */}
                {token.rows.map((row: any[], r: number) => (
                  <View
                    key={r}
                    style={styles.tableRow}
                  >
                    {row.map((cell: any, c: number) => (
                      <Text
                        key={c}
                        style={styles.tableCell}
                      >
                        {cell.text}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );

          case "strong":
            return (
              <Text
                key={i}
                style={styles.bold}
              >
                {token.text}
              </Text>
            );

          case "em":
            return (
              <Text
                key={i}
                style={styles.italic}
              >
                {token.text}
              </Text>
            );

          case "space":
            return (
              <View
                key={i}
                style={{ marginVertical: 4 }}
              />
            );

          default:
            return null;
        }
      })}
    </View>
  );
}
