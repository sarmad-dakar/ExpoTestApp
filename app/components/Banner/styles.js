import {StyleSheet} from 'react-native';
import {vh} from '../../utils/units';
import {colors} from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    height: vh * 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ring1: {
    backgroundColor: 'red',
    height: vh * 25,
    width: vh * 25,
    borderRadius: vh * 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring2: {
    backgroundColor: 'yellow',
    height: vh * 20,
    width: vh * 20,
    borderRadius: vh * 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring3: {
    backgroundColor: 'green',
    height: vh * 15,
    width: vh * 15,
    borderRadius: vh * 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring4: {
    backgroundColor: 'white',
    height: vh * 10,
    width: vh * 10,
    borderRadius: vh * 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
