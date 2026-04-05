import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

interface SearchFilterBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchFilterBar({ value, onChangeText }: SearchFilterBarProps) {
  return (
    <Animated.View entering={FadeIn} className="mx-4 mb-2">
      <Animated.View
        className="bg-white rounded-2xl px-4 py-3 flex-row items-center"
        style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
      >
        <Ionicons name="search-outline" size={18} color={COLORS.textTertiary} />
        <TextInput
          className="flex-1 ml-3 text-sm"
          placeholder="Search reminders..."
          placeholderTextColor={COLORS.placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
}
