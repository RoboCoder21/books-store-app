import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Themed';

export type SectionHeadingProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeading({ title, actionLabel, onActionPress }: SectionHeadingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onActionPress} accessibilityRole="button">
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  action: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
});
