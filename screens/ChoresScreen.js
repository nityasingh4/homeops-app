import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChoreCard from "../components/ChoreCard";
import { useAppContext } from "../context/AppContext";
import { colors } from "../theme/colors";

const ChoresScreen = ({ navigation }) => {
  const { chores, roommates, completeChore } = useAppContext();
  const [collapsedMonths, setCollapsedMonths] = useState({});

  const handleAddChore = () => {
    navigation.navigate("AddChore");
  };

  const getAssigneeName = (assigneeId) => {
    const match = roommates.find((r) => r.id === assigneeId);
    return match?.displayName || match?.email || "Someone";
  };

  const getDateFromTimestamp = (timestamp) => {
    if (!timestamp) return new Date();
    if (typeof timestamp === "number") return new Date(timestamp);
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
    return new Date(timestamp);
  };

  const pendingChores = useMemo(
    () => chores.filter((item) => item.status === "pending"),
    [chores],
  );

  const completedGroups = useMemo(() => {
    const groupsMap = {};
    const completed = chores.filter((item) => item.status === "completed");

    completed.forEach((chore) => {
      const date = getDateFromTimestamp(chore.completedAt || chore.createdAt);
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

      groupsMap[monthKey].data.push(chore);
    });

    return Object.values(groupsMap).sort((a, b) => b.sortValue - a.sortValue);
  }, [chores]);

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
          <Text style={styles.title}>Chores</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleAddChore}
          >
            <Text style={styles.primaryButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {chores.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No chores yet</Text>
            <Text style={styles.emptySubtitle}>
              Keep the house happy by adding a chore.
            </Text>
          </View>
        ) : (
          <FlatList
            data={completedGroups}
            keyExtractor={(item) => item.key}
            ListHeaderComponent={
              <>
                {pendingChores.length > 0 && (
                  <View style={styles.sectionWrapper}>
                    <Text style={styles.sectionTitle}>Pending chores</Text>
                    {pendingChores.map((item) => (
                      <ChoreCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        assigneeName={getAssigneeName(item.assignedTo)}
                        status={item.status}
                        dueDate={item.dueDate}
                        onComplete={() => completeChore(item.id, item.title)}
                      />
                    ))}
                  </View>
                )}
                {completedGroups.length > 0 && (
                  <Text style={styles.sectionTitle}>Completed chores</Text>
                )}
              </>
            }
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
                    item.data.map((chore) => (
                      <ChoreCard
                        key={chore.id}
                        id={chore.id}
                        title={chore.title}
                        assigneeName={getAssigneeName(chore.assignedTo)}
                        status={chore.status}
                        dueDate={chore.dueDate}
                      />
                    ))}
                </View>
              );
            }}
            ListEmptyComponent={
              pendingChores.length > 0 ? null : (
                <Text style={styles.emptySubtitle}>
                  No completed chores yet.
                </Text>
              )
            }
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
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
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
  sectionWrapper: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 2,
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

export default ChoresScreen;
