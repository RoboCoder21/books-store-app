import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { Text } from './Themed';
import { useColorScheme } from './useColorScheme';

export type AudioTrack = {
  title: string;
  author: string;
  accent?: string;
  cover?: string;
  audioUrl: string;
};

export function AudioMiniPlayer({ track }: { track: AudioTrack }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const subtitleColor = colorScheme === 'dark' ? 'rgba(226,232,240,0.7)' : 'rgba(15,23,42,0.6)';
  const trackColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const progress = useMemo(() => {
    if (!status || !status.isLoaded || !status.durationMillis) return 0;
    return status.positionMillis / status.durationMillis;
  }, [status]);

  useEffect(() => {
    let mounted = true;

    async function setup() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: track.audioUrl },
          { shouldPlay: false },
          (nextStatus) => mounted && setStatus(nextStatus)
        );
        if (mounted) setSound(newSound);
      } catch (error) {
        console.warn('Audio init failed', error);
      }
    }

    setup();

    return () => {
      mounted = false;
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [track.audioUrl]);

  const togglePlay = async () => {
    if (!sound || !status || !status.isLoaded) return;
    if (status.isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { borderColor: colorScheme === 'dark' ? '#1f2937' : '#e2e8f0' }]}>
        {track.cover ? (
          <Image source={{ uri: track.cover }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, { backgroundColor: track.accent ?? theme.tint }]} />
        )}
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={[styles.subtitle, { color: subtitleColor }]} numberOfLines={1}>
            {track.author}
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
            <View style={[styles.progressFill, { width: `${Math.min(1, progress) * 100}%`, backgroundColor: track.accent ?? theme.tint }]} />
          </View>
        </View>
        <Pressable onPress={togglePlay} style={styles.playButton} accessibilityLabel={status?.isPlaying ? 'Pause audio' : 'Play audio'}>
          <FontAwesome
            name={status?.isLoaded && status.isPlaying ? 'pause' : 'play'}
            size={18}
            color={track.accent ?? theme.tint}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,23,42,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    backgroundColor: '#ffffff',
  },
});
