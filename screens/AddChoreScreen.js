import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import RoommateCard from '../components/RoommateCard';

let DateTimePicker;
try {
  // eslint-disable-next-line global-require
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  DateTimePicker = null;
}

const AddChoreScreen = ({ navigation }) => {
  const { roommates, addChore, loadingAction } = useAppContext();
  const [title, setTitle] = useState('');
  const [selectedRoommateId, setSelectedRoommateId] = useState(
    roommates.length > 0 ? roommates[0].id : null,
  );
  const [dueDate, setDueDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (!title || !selectedRoommateId) return;
    try {
      await addChore({ title, assignedTo: selectedRoommateId, dueDate });
      navigation.goBack();
    } catch {
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>New chore</Text>
            <Text style={styles.subtitle}>
              Assign it to a roommate to keep things balanced.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chore title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Take out trash"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {dueDate
                    ? new Date(
                        dueDate instanceof Date
                          ? dueDate
                          : dueDate.seconds
                            ? dueDate.seconds * 1000
                            : dueDate,
                      ).toLocaleDateString()
                    : 'Select a due date'}
                </Text>
              </TouchableOpacity>
              {DateTimePicker == null && (
                <Text style={styles.dateHelper}>
                  For a native date picker, run
                  {' '}
                  expo install @react-native-community/datetimepicker
                </Text>
              )}
              {showPicker && DateTimePicker && (
                <DateTimePicker
                  mode="date"
                  value={dueDate || new Date()}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS !== 'ios') {
                      setShowPicker(false);
                    }
                    if (selectedDate) {
                      setDueDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>

            <Text style={[styles.label, { marginBottom: 8 }]}>Assigned to</Text>
            <View style={styles.roommatesList}>
              {roommates.length === 0 ? (
                <Text style={styles.emptyText}>
                  No roommates yet. Invite them from the home setup.
                </Text>
              ) : (
                roommates.map((roommate) => (
                  <TouchableOpacity
                    key={roommate.id}
                    onPress={() => setSelectedRoommateId(roommate.id)}
                    activeOpacity={0.9}
                    style={[
                      styles.roommateWrapper,
                      roommate.id === selectedRoommateId && styles.roommateWrapperSelected,
                    ]}
                  >
                    <RoommateCard
                      name={roommate.displayName || roommate.email}
                      subtitle={roommate.email}
                      compact
                    />
                  </TouchableOpacity>
                ))
              )}
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loadingAction && styles.primaryButtonDisabled]}
              onPress={handleSave}
              disabled={loadingAction}
            >
              <Text style={styles.primaryButtonText}>
                {loadingAction ? 'Saving…' : 'Save chore'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
  },
  dateButtonText: {
    fontSize: 15,
    color: '#111827',
  },
  dateHelper: {
    marginTop: 4,
    fontSize: 11,
    color: '#9CA3AF',
  },
  roommatesList: {
    marginBottom: 16,
  },
  roommateWrapper: {
    marginBottom: 8,
    borderRadius: 16,
  },
  roommateWrapperSelected: {
    borderWidth: 1,
    borderColor: '#111827',
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default AddChoreScreen;

