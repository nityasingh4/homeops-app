import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import ExpenseCard from '../components/ExpenseCard';
import { colors } from '../theme/colors';

const ExpensesScreen = ({ navigation }) => {
  const { expenses, roommates } = useAppContext();

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Expenses</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddExpense}>
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
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseCard
                title={item.title}
                amount={item.amount || 0}
                category={item.category}
                paidBy={roommates.find((r) => r.uid === item.paidBy) || null}
                createdAt={item.createdAt}
              />
            )}
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
    backgroundColor: '#F6F7FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default ExpensesScreen;

