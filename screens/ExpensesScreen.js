import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpenseCard from "../components/ExpenseCard";
import { useAppContext } from "../context/AppContext";

const ExpensesScreen = ({ navigation }) => {
  const { expenses, roommates } = useAppContext();
  const [collapsedMonths, setCollapsedMonths] = useState({});

  const handleAddExpense = () => {
    navigation.navigate("AddExpense");
  };

  const getDateFromTimestamp = (timestamp) => {
    if (!timestamp) return new Date();
    if (typeof timestamp === "number") return new Date(timestamp);
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
    return new Date(timestamp);
  };

  const groupedExpenses = useMemo(() => {
    const groupsMap = {};

    expenses.forEach((expense) => {
      const date = getDateFromTimestamp(expense.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = date.toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      });

      if (!groupsMap[monthKey]) {
        groupsMap[monthKey] = {
          key: monthKey,
          title: monthLabel,
          sortValue: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
          data: [],
        };
      }

      groupsMap[monthKey].data.push(expense);
    });

    return Object.values(groupsMap).sort((a, b) => b.sortValue - a.sortValue);
  }, [expenses]);

  const toggleMonth = (monthKey) => {
    setCollapsedMonths((prev) => ({
      ...prev,
      [monthKey]: !prev[monthKey],
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Expenses</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleAddExpense}
          >
            <Text style={styles.primaryButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {expenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No expenses yet</Text>
            <Text style={styles.emptySubtitle}>
              Start by adding your first shared cost.
            </Text>
          </View>
        ) : (
          <FlatList
            data={groupedExpenses}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              const isCollapsed = collapsedMonths[item.key] ?? false;
              return (
                <View style={styles.monthSection}>
                  <TouchableOpacity
                    style={styles.monthHeader}
                    onPress={() => toggleMonth(item.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.monthTitle}>{item.title}</Text>
                    <Text style={styles.monthToggle}>
                      {isCollapsed ? "+" : "-"}
                    </Text>
                  </TouchableOpacity>

                  {!isCollapsed &&
                    item.data.map((expense) => (
                      <ExpenseCard
                        key={expense.id}
                        title={expense.title}
                        amount={expense.amount || 0}
                        category={expense.category}
                        paidBy={
                          roommates.find((r) => r.uid === expense.paidBy) ||
                          null
                        }
                        createdAt={expense.createdAt}
                      />
                    ))}
                </View>
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  primaryButton: {
    backgroundColor: "#111827",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  monthSection: {
    marginBottom: 8,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  monthToggle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B7280",
    width: 18,
    textAlign: "center",
  },
});

export default ExpensesScreen;
