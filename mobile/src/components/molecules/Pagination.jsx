import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Button from '../atoms/Button';

export default function Pagination({ currentPage, totalPages, onPageChange, style }) {
  if (!totalPages || totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      if (onPageChange) onPageChange(page);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Button
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={[
          styles.navButton,
          currentPage === 1 ? styles.disabledButton : styles.activeNavButton
        ]}
        textStyle={currentPage === 1 ? styles.disabledText : styles.activeNavText}
      >
        «
      </Button>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.numbersContainer}
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
          const isActive = currentPage === number;
          return (
            <Button
              key={number}
              onPress={() => handlePageChange(number)}
              style={[
                styles.numberButton,
                isActive ? styles.activeNumberButton : styles.inactiveNumberButton
              ]}
              textStyle={[
                styles.numberText,
                isActive ? styles.activeNumberText : styles.inactiveNumberText
              ]}
            >
              {number}
            </Button>
          );
        })}
      </ScrollView>

      <Button
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={[
          styles.navButton,
          currentPage === totalPages ? styles.disabledButton : styles.activeNavButton
        ]}
        textStyle={currentPage === totalPages ? styles.disabledText : styles.activeNavText}
      >
        »
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingTop: 10,
    width: '100%',
  },
  numbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0, 
  },
  activeNavButton: {
    backgroundColor: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
    borderColor: '#e0e0e0',
  },
  activeNavText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#a0aec0',
  },
  numberButton: {
    width: 36,
    height: 36,
    borderRadius: 18, 
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginVertical: 0, 
  },
  
  activeNumberButton: {
    backgroundColor: '#b0faa8', 
    borderColor: '#b0faa8',
  },
  inactiveNumberButton: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  numberText: {
    fontSize: 14,
    textAlign: 'center',
  },
  activeNumberText: {
    color: '#ffffff', 
    fontWeight: 'bold',
  },
  inactiveNumberText: {
    color: '#333333', 
    fontWeight: '500',
  },
});