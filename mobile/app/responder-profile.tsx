import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default function ResponderProfileScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Responder Profile
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
})