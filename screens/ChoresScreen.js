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
import ChoreCard from '../components/ChoreCard';
import { colors } from '../theme/colors';

const ChoresScreen = ({ navigation }) => {
  const { chores, roommates, completeChore } = useAppContext();

  const handleAddChore = () => {
    navigation.navigate('AddChore');
  };

  const getAssigneeName = (assigneeId) => {
    const match = roommates.find((r) => r.id === assigneeId);
    return match?.displayName || match?.email || 'Someone';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Chores</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddChore}>
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
            data={chores}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChoreCard
                id={item.id}
                title={item.title}
                assigneeName={getAssigneeName(item.assignedTo)}
                status={item.status}
                dueDate={item.dueDate}
                onComplete={() => completeChore(item.id, item.title)}
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
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
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

export default ChoresScreen;

