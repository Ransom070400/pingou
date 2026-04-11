import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FolderPlus } from 'lucide-react-native';
import { router } from 'expo-router';
import EmptyState from '~/src/components/EmptyState';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/context/AuthProvider';
import { ProfileType } from '~/src/types/ProfileTypes';
import { Feedback } from '~/src/utils/Feedback';

type ConnectionWithProfile = {
  id: string;
  connected_to: string;
  folder: string | null;
  created_at: string;
  profile: ProfileType;
};

const Connections = () => {
  const { session } = useAuth();
  const [connections, setConnections] = useState<ConnectionWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('connections')
      .select('id, connected_to, folder, created_at, profiles!connections_connected_to_fkey(*)')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map((row: any) => ({
        id: row.id,
        connected_to: row.connected_to,
        folder: row.folder,
        created_at: row.created_at,
        profile: row.profiles as ProfileType,
      }));
      setConnections(mapped);
    }
    setLoading(false);
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchConnections();
    }, [fetchConnections])
  );

  const deleteConnection = (connection: ConnectionWithProfile) => {
    Alert.alert(
      'Delete Connection',
      `Remove ${connection.profile.fullname} from your connections?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('connections')
              .delete()
              .eq('id', connection.id);

            if (error) {
              Alert.alert('Error', error.message);
            } else {
              Feedback.success();
              fetchConnections();
            }
          },
        },
      ]
    );
  };

  const showConnectionActions = async (connection: ConnectionWithProfile) => {
    if (!session?.user?.id) return;
    Feedback.medium();

    const { data: folders } = await supabase
      .from('folders')
      .select('name')
      .eq('owner_id', session.user.id)
      .order('name');

    const buttons: { text: string; style?: 'cancel' | 'destructive' | 'default'; onPress?: () => void }[] = [];

    if (folders && folders.length > 0) {
      buttons.push({
        text: connection.folder ? 'Change folder' : 'Move to folder',
        onPress: () => {
          const options = folders.map((f: any) => f.name);
          if (connection.folder) options.push('Remove from folder');
          options.push('Cancel');

          Alert.alert(
            'Assign to Folder',
            `Move ${connection.profile.fullname} to a folder`,
            options.map((name) => ({
              text: name,
              style: name === 'Cancel' ? 'cancel' as const : name === 'Remove from folder' ? 'destructive' as const : 'default' as const,
              onPress: name === 'Cancel'
                ? undefined
                : async () => {
                    const newFolder = name === 'Remove from folder' ? null : name;
                    const { error } = await supabase
                      .from('connections')
                      .update({ folder: newFolder })
                      .eq('id', connection.id);
                    if (error) {
                      Alert.alert('Error', error.message);
                    } else {
                      Feedback.success();
                      fetchConnections();
                    }
                  },
            }))
          );
        },
      });
    }

    buttons.push({
      text: 'Delete connection',
      style: 'destructive',
      onPress: () => deleteConnection(connection),
    });

    buttons.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(connection.profile.fullname, undefined, buttons);
  };

  if (!loading && connections.length === 0) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <EmptyState
          title="No Connections yet"
          description="Scan another user's QR code to add a new connection"
        />
      </View>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <FlatList
        data={connections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center border-b border-neutral-100 px-4 py-3 dark:border-neutral-800"
            onPress={() => router.push({ pathname: '/connectionDetail', params: { userId: item.connected_to } })}
            onLongPress={() => showConnectionActions(item)}
            activeOpacity={0.7}>
            {/* Avatar circle */}
            <View className="h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
              <Text className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
                {getInitials(item.profile.fullname)}
              </Text>
            </View>
            {/* Name + email */}
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-black dark:text-white">
                {item.profile.fullname}
              </Text>
              <Text className="text-sm text-neutral-500">{item.profile.email}</Text>
            </View>
            {/* Folder badge or assign button */}
            {item.folder ? (
              <TouchableOpacity
                onPress={() => showConnectionActions(item)}
                className="rounded-full bg-amber-100 px-2 py-1">
                <Text className="text-xs font-medium text-amber-700">{item.folder}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => showConnectionActions(item)}
                hitSlop={8}
                className="p-1">
                <FolderPlus size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Connections;
