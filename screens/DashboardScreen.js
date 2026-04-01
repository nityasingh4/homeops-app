import React, { useMemo } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityItem from "../components/ActivityItem";
import QuickActionCard from "../components/QuickActionCard";
import SummaryCard from "../components/SummaryCard";
import { useAppContext } from "../context/AppContext";
import { colors } from "../theme/colors";

const DashboardScreen = ({ navigation }) => {
  const {
    home,
    expenses,
    chores,
    roommates,
    activity,
    userInvites,
    acceptInvite,
  } = useAppContext();

  const { totalExpenses, pendingChores, recentExpenses, totalRoommates } =
    useMemo(() => {
      const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      const pending = chores.filter((c) => c.status === "pending").length;
      const recent = expenses.slice(0, 5);
      const memberCount = Array.isArray(home?.members)
        ? home.members.length
        : roommates.length;

      return {
        totalExpenses: total,
        pendingChores: pending,
        recentExpenses: recent,
        totalRoommates: memberCount || 0,
      };
    }, [expenses, chores, roommates, home]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.caption}>Welcome home</Text>
            <Text style={styles.title}>{home?.name || "Your home"}</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {totalRoommates} roommate{totalRoommates === 1 ? "" : "s"}
            </Text>
          </View>
        </View>

        {roommates.length > 0 && (
          <View style={styles.roommatesRow}>
            {roommates.slice(0, 5).map((r) => (
              <View key={r.id} style={styles.roommateAvatar}>
                <Text style={styles.roommateAvatarText}>
                  {(r.displayName || r.email || "?").slice(0, 1).toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {userInvites && userInvites.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Invitations</Text>
            {userInvites.map((inv) => (
              <View key={inv.id} style={styles.inviteRow}>
                <View>
                  <Text style={styles.expenseTitle}>Home invitation</Text>
                  <Text style={styles.inviteMeta}>For {inv.email}</Text>
                </View>
                <TouchableOpacity
                  style={styles.inviteAcceptButton}
                  onPress={() => acceptInvite(inv)}
                >
                  <Text style={styles.inviteAcceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.summaryRow}>
          <SummaryCard
            title="Shared expenses"
            subtitle="Total this month"
            value={`₹${totalExpenses.toFixed(2)}`}
          />
          <View style={{ width: 12 }} />
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.pressableCardWrapper}
            onPress={() => navigation.navigate("Chores")}
          >
            <SummaryCard
              title="Pending chores"
              subtitle="Still to be done"
              value={pendingChores}
              tone="accent"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsRow}>
          <QuickActionCard
            label="Add expense"
            icon="card-outline"
            onPress={() => navigation.navigate("AddExpense")}
          />
          <QuickActionCard
            label="Add chore"
            icon="checkmark-done-outline"
            onPress={() => navigation.navigate("AddChore")}
          />
          <QuickActionCard
            label="Invite"
            icon="person-add-outline"
            onPress={() => navigation.navigate("Account")}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent expenses</Text>
          {recentExpenses.length === 0 ? (
            <Text style={styles.emptyText}>
              No expenses yet. Add your first expense.
            </Text>
          ) : (
            recentExpenses.map((item) => {
              const payer =
                roommates.find((r) => r.uid === item.paidBy) || null;
              const payerLabel =
                payer?.displayName || payer?.email || "Someone";
              const dateLabel = item.createdAt
                ? new Date(
                    item.createdAt.seconds
                      ? item.createdAt.seconds * 1000
                      : item.createdAt,
                  ).toLocaleDateString()
                : "";

              return (
                <View key={item.id} style={styles.expenseRow}>
                  <View>
                    <Text style={styles.expenseTitle}>{item.title}</Text>
                    <Text style={styles.expenseMeta}>
                      {payerLabel}
                      {dateLabel ? ` • ${dateLabel}` : ""}
                    </Text>
                  </View>
                  <Text style={styles.expenseAmount}>
                    ₹{(item.amount || 0).toFixed(2)}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          {activity && activity.length > 0 ? (
            activity
              .slice(0, 10)
              .map((item) => (
                <ActivityItem
                  key={item.id}
                  type={item.type}
                  title={item.title}
                  timestamp={item.createdAt}
                  by={item.byDisplayName || ""}
                />
              ))
          ) : (
            <Text style={styles.emptyText}>No activity yet.</Text>
          )}
        </View>
      </ScrollView>
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
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
  },
  headerBadgeText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: "600",
  },
  roommatesRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  roommateAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  roommateAvatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  pressableCardWrapper: {
    flex: 1,
  },
  quickActionsRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  sectionCard: {
    marginTop: 4,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  expenseTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  expenseMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  inviteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  inviteMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  inviteAcceptButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  inviteAcceptText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default DashboardScreen;
