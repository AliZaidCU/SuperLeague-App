import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { Game } from '@/types';
import { theme } from '@/constants/theme';

type UpdateScoreModalProps = {
  visible: boolean;
  game: Game;
  onClose: () => void;
  onUpdate: (homeScore: number, awayScore: number) => void;
};

export default function UpdateScoreModal({ visible, game, onClose, onUpdate }: UpdateScoreModalProps) {
  const [homeScore, setHomeScore] = useState(game.homeScore.toString());
  const [awayScore, setAwayScore] = useState(game.awayScore.toString());

  useEffect(() => {
    if (visible) {
      setHomeScore(game.homeScore.toString());
      setAwayScore(game.awayScore.toString());
    }
  }, [visible, game]);

  const handleUpdate = () => {
    const parsedHomeScore = parseInt(homeScore, 10) || 0;
    const parsedAwayScore = parseInt(awayScore, 10) || 0;
    onUpdate(parsedHomeScore, parsedAwayScore);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Score</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{game.homeTeam.name} vs {game.awayTeam.name}</Text>
            <Text style={styles.gameSubtitle}>{game.league.name}</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <View style={styles.teamScoreContainer}>
              <Text style={styles.teamName}>{game.homeTeam.name}</Text>
              <TextInput
                style={styles.scoreInput}
                value={homeScore}
                onChangeText={setHomeScore}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            
            <Text style={styles.scoreSeparator}>-</Text>
            
            <View style={styles.teamScoreContainer}>
              <Text style={styles.teamName}>{game.awayTeam.name}</Text>
              <TextInput
                style={styles.scoreInput}
                value={awayScore}
                onChangeText={setAwayScore}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.updateButtonText}>Update Score</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  gameInfo: {
    marginBottom: 24,
  },
  gameTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  gameSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  teamScoreContainer: {
    alignItems: 'center',
    width: '40%',
  },
  teamName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: theme.colors.text.primary,
    textAlign: 'center',
    width: 80,
    height: 64,
    backgroundColor: theme.colors.gray[100],
    borderRadius: 8,
    padding: 8,
  },
  scoreSeparator: {
    fontFamily: 'Inter-Regular',
    fontSize: 28,
    color: theme.colors.text.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 8,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  updateButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[600],
    borderRadius: 8,
    paddingVertical: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
  },
});