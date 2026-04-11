import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Folder, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import Fab from '~/src/components/Fab';
import EmptyState from '~/src/components/EmptyState';
import PromptModal from '~/src/components/PromptModal';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/context/AuthProvider';

type FolderItem = {
  id: string;
  name: string;
  created_at: string;
  connectionCount: number;
};

const Folders = () => {
  const { session } = useAuth();
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderConnections, setFolderConnections] = useState<any[]>([]);

  const fetchFolders = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    // Fetch folders
    const { data: folderData, error: folderError } = await supabase
      .from('folders')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });

    if (folderError || !folderData) {
      setLoading(false);
      return;
    }

    // Fetch connection counts per folder
    const { data: connData } = await supabase
      .from('connections')
      .select('folder')
      .eq('owner_id', session.user.id)
      .not('folder', 'is', null);

    const countMap: Record<string, number> = {};
    (connData ?? []).forEach((c: any) => {
      if (c.folder) countMap[c.folder] = (countMap[c.folder] || 0) + 1;
    });

    const mapped: FolderItem[] = folderData.map((f: any) => ({
      id: f.id,
      name: f.name,
      created_at: f.created_at,
      connectionCount: countMap[f.name] || 0,
    }));

    setFolders(mapped);
    setLoading(false);
  }, [session?.user?.id]);

  const fetchFolderConnections = async (folderName: string) => {
    if (!session?.user?.id) return;

    const { data } = await supabase
      .from('connections')
      .select('id, connected_to, folder, created_at, profiles!connections_connected_to_fkey(*)')
      .eq('owner_id', session.user.id)
      .eq('folder', folderName)
      .order('created_at', { ascending: false });

    setFolderConnections(data ?? []);
    setSelectedFolder(folderName);
  };

  const createFolder = async (name: string) => {
    if (!session?.user?.id) return;
    setShowCreate(false);

    const { error } = await supabase.from('folders').insert({
      owner_id: session.user.id,
      name,
    });

    if (error) {
      if (error.code === '23505') {
        Alert.alert('Oops', 'A folder with that name already exists');
      } else {
        Alert.alert('Error', error.message);
      }
      return;
    }

    fetchFolders();
  };

  const deleteFolder = (folder: FolderItem) => {
    Alert.alert('Delete Folder', `Delete "${folder.name}"? Connections inside won't be deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          // Remove folder tag from connections
          await supabase
            .from('connections')
            .update({ folder: null })
            .eq('owner_id', session!.user.id)
            .eq('folder', folder.name);

          // Delete the folder
          await supabase.from('folders').delete().eq('id', folder.id);
          fetchFolders();
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchFolders();
      setSelectedFolder(null);
    }, [fetchFolders])
  );

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n.charAt(0)).join('').toUpperCase();

  // Viewing connections inside a folder
  if (selectedFolder) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        {/* Back header */}
        <TouchableOpacity
          className="flex-row items-center px-4 py-3 border-b border-neutral-100 dark:border-neutral-800"
          onPress={() => setSelectedFolder(null)}>
          <Text className="text-base text-black dark:text-white">←</Text>
          <Text className="ml-2 text-lg font-semibold text-black dark:text-white">
            {selectedFolder}
          </Text>
          <Text className="ml-2 text-sm text-neutral-500">
            ({folderConnections.length})
          </Text>
        </TouchableOpacity>

        {folderConnections.length === 0 ? (
          <EmptyState
            title="No connections here"
            description="Assign connections to this folder from the All Connections tab"
          />
        ) : (
          <FlatList
            data={folderConnections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center border-b border-neutral-100 px-4 py-3 dark:border-neutral-800"
                onPress={() => router.push({ pathname: '/connectionDetail', params: { userId: item.connected_to } })}
                activeOpacity={0.7}>
                <View className="h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <Text className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
                    {getInitials(item.profiles?.fullname ?? '?')}
                  </Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-black dark:text-white">
                    {item.profiles?.fullname}
                  </Text>
                  <Text className="text-sm text-neutral-500">{item.profiles?.email}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  // Folder list view
  return (
    <View className="flex-1 bg-white dark:bg-black">
      {!loading && folders.length === 0 ? (
        <EmptyState
          title="No Folders yet."
          description="Create a folder to organize your connections"
        />
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center border-b border-neutral-100 px-4 py-4 dark:border-neutral-800"
              onPress={() => fetchFolderConnections(item.name)}
              activeOpacity={0.7}>
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900">
                <Folder size={22} color="#D97706" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-black dark:text-white">
                  {item.name}
                </Text>
                <Text className="text-sm text-neutral-500">
                  {item.connectionCount} {item.connectionCount === 1 ? 'connection' : 'connections'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteFolder(item)}
                hitSlop={12}
                className="p-2">
                <Trash2 size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <Fab label="Create" onPress={() => setShowCreate(true)} />

      <PromptModal
        visible={showCreate}
        title="Create Folder"
        placeholder="Folder name"
        submitLabel="Create"
        onCancel={() => setShowCreate(false)}
        onSubmit={createFolder}
      />
    </View>
  );
};

export default Folders;
