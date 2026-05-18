import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ToastMessage = ({ 
  text1, 
  text2, 
  iconName, 
  iconColor, 
  borderColor 
}: { 
  text1?: string, 
  text2?: string, 
  iconName: React.ComponentProps<typeof MaterialIcons>['name'], 
  iconColor: string, 
  borderColor: string 
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.toastContainer, { borderLeftColor: borderColor, marginTop: insets.top }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <MaterialIcons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        {text1 ? <Text style={styles.title}>{text1}</Text> : null}
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  );
};

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <ToastMessage
      text1={props.text1}
      text2={props.text2}
      iconName="check-circle"
      iconColor="#43e5b1"
      borderColor="#43e5b1"
    />
  ),
  error: (props: BaseToastProps) => (
    <ToastMessage
      text1={props.text1}
      text2={props.text2}
      iconName="error"
      iconColor="#ff5451"
      borderColor="#ff5451"
    />
  ),
  info: (props: BaseToastProps) => (
    <ToastMessage
      text1={props.text1}
      text2={props.text2}
      iconName="info"
      iconColor="#4d8eff"
      borderColor="#4d8eff"
    />
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    backgroundColor: '#1c2026',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    color: '#a0aab8',
    fontSize: 14,
    lineHeight: 20,
  },
});
