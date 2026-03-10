import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import RoommateCard from '../components/RoommateCard';
import { colors } from '../theme/colors';

const AccountScreen = () => {
  const {
    user,
    userProfile,
    home,
    roommates,
    roommateInvites,
    inviteRoommateByEmail,
    updateDisplayName,
    leaveHome,
    removeRoommate,
    logout,
    loadingAction,
  } = useAppContext();

  const [inviteEmail, setInviteEmail] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState(
    userProfile?.displayName || '',
  );

  const isAdmin = useMemo(
    () => !!home && user && home.createdBy === user.uid,
    [home, user],
  );

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await inviteRoommateByEmail(inviteEmail.trim());
      setInviteEmail('');
    } catch {
      // error handled in context toast/state
    }
  };

  const handleSaveDisplayName = async () => {
    if (!displayNameInput.trim()) return;
    await updateDisplayName(displayNameInput.trim());
  };

  const handleLeaveHome = async () => {
    await leaveHome();
  };

  const handleRemoveRoommate = async (roommateId) => {
    if (!isAdmin) return;
    await removeRoommate(roommateId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userProfile?.displayName || userProfile?.email || '?')
                .slice(0, 1)
                .toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userProfile?.displayName || 'Roommate'}
            </Text>
            <Text style={styles.profileEmail}>{userProfile?.email}</Text>
            <Text style={styles.profileHome}>
              Home: {home?.name || 'Not assigned yet'}
            </Text>
          </View>
          {isAdmin && (
            <View style={styles.rolePill}>
              <Text style={styles.rolePillText}>Admin</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Home</Text>
        <View style={styles.homeCard}>
          <Text style={styles.homeName}>{home?.name || 'No home yet'}</Text>
          <Text style={styles.homeMeta}>
            {roommates.length} roommate{roommates.length === 1 ? '' : 's'}
          </Text>
          {home && (
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeaveHome}
              disabled={loadingAction}
            >
              <Text style={styles.leaveButtonText}>
                Leave home
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Roommates</Text>
        <FlatList
          data={roommates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.roommateRow}>
              <RoommateCard
                name={item.displayName || item.email}
                subtitle={item.email}
              />
              <View style={styles.roommateMeta}>
                <Text style={styles.roleLabel}>
                  {item.uid === home?.createdBy ? 'Admin' : 'Member'}
                </Text>
                {isAdmin && item.uid !== home?.createdBy && (
                  <TouchableOpacity
                    onPress={() => handleRemoveRoommate(item.id)}
                    style={styles.removePill}
                  >
                    <Text style={styles.removePillText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No roommates yet.</Text>
          }
          contentContainerStyle={{ paddingBottom: 8 }}
        />

        <Text style={styles.sectionTitle}>Pending invites</Text>
        <FlatList
          data={roommateInvites}
          keyExtractor={(item, index) =>
            typeof item === 'string' ? `${item}-${index}` : item.id
          }
          renderItem={({ item }) => {
            const email = typeof item === 'string' ? item : item.email;
            return (
              <View style={styles.inviteRow}>
                <View style={styles.inviteInfo}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={colors.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.inviteEmail}>{email}</Text>
                </View>
                <Text style={styles.inviteStatus}>Pending</Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No pending invites.</Text>
          }
          contentContainerStyle={{ paddingBottom: 8 }}
        />

        <View style={styles.inviteCard}>
          <Text style={styles.sectionTitle}>Invite roommate</Text>
          <View style={styles.inviteRowInput}>
            <TextInput
              style={styles.inviteInput}
              placeholder="roommate@example.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={inviteEmail}
              onChangeText={setInviteEmail}
            />
            <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
              <Ionicons name="send-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <Text style={styles.settingsLabel}>Display name</Text>
          <View style={styles.settingsRow}>
            <TextInput
              style={styles.settingsInput}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              value={displayNameInput}
              onChangeText={setDisplayNameInput}
            />
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleSaveDisplayName}
              disabled={loadingAction}
            >
              <Text style={styles.settingsButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.logoutButton, loadingAction && styles.logoutButtonDisabled]}
            onPress={logout}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileHome: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 8,
  },
  homeCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 8,
  },
  homeName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  homeMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  leaveButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  leaveButtonText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
  roommateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roommateMeta: {
    marginLeft: 8,
  },
  roleLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  removePill: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
  },
  removePillText: {
    fontSize: 11,
    color: colors.danger,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  inviteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteEmail: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  inviteStatus: {
    fontSize: 12,
    color: colors.textMuted,
  },
  inviteCard: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
  },
  inviteRowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  inviteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 8,
  },
  inviteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCard: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
  },
  settingsLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 8,
  },
  settingsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  settingsButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default AccountScreen;

