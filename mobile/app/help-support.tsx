import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function HelpSupportScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed
                ? styles.pressed
                : null,
            ]}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#111827"
            />
          </Pressable>

          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>
              112
            </Text>
          </View>
        </View>

        {/* INTRO */}

        <Text style={styles.eyebrow}>
          HELP & SUPPORT
        </Text>

        <Text style={styles.title}>
          How can we help?
        </Text>

        <Text style={styles.subtitle}>
          Find answers about the 112 app,
          emergency requests, your account,
          and responder tracking.
        </Text>

        {/* AI */}

        <Pressable
          style={({ pressed }) => [
            styles.aiCard,
            pressed
              ? styles.pressed
              : null,
          ]}
          onPress={() =>
            router.push('/ai-chat')
          }
        >
          <View style={styles.aiTop}>
            <View style={styles.aiIcon}>
              <Ionicons
                name="sparkles"
                size={22}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.availableBadge}>
              <View
                style={
                  styles.availableDot
                }
              />

              <Text
                style={
                  styles.availableText
                }
              >
                AVAILABLE
              </Text>
            </View>
          </View>

          <Text style={styles.aiTitle}>
            Ask 112 AI
          </Text>

          <Text style={styles.aiText}>
            Get help using the platform,
            understanding emergency services,
            or asking general safety questions.
          </Text>

          <View style={styles.aiAction}>
            <Text
              style={styles.aiActionText}
            >
              Open assistant
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFFFFF"
            />
          </View>
        </Pressable>

        {/* FAQ */}

        <Text style={styles.sectionLabel}>
          FREQUENTLY ASKED QUESTIONS
        </Text>

        <View style={styles.faqCard}>
          <View style={styles.faqIcon}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#111827"
            />
          </View>

          <View style={styles.faqContent}>
            <Text style={styles.faqTitle}>
              When is my location shared?
            </Text>

            <Text style={styles.faqText}>
              Your location is shared when
              you submit an emergency request
              so emergency services can locate
              you.
            </Text>
          </View>
        </View>

        <View style={styles.faqCard}>
          <View style={styles.faqIcon}>
            <Ionicons
              name="car-outline"
              size={20}
              color="#111827"
            />
          </View>

          <View style={styles.faqContent}>
            <Text style={styles.faqTitle}>
              Can I track the responder?
            </Text>

            <Text style={styles.faqText}>
              Yes. Once a responder shares
              live GPS, the emergency status
              screen can show their location
              and approximate arrival time.
            </Text>
          </View>
        </View>

        <View style={styles.faqCard}>
          <View style={styles.faqIcon}>
            <Ionicons
              name="people-outline"
              size={20}
              color="#111827"
            />
          </View>

          <View style={styles.faqContent}>
            <Text style={styles.faqTitle}>
              What are emergency contacts?
            </Text>

            <Text style={styles.faqText}>
              They are trusted people linked
              to your profile who can be
              attached to emergency requests.
            </Text>
          </View>
        </View>

        <View style={styles.faqCard}>
          <View style={styles.faqIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#111827"
            />
          </View>

          <View style={styles.faqContent}>
            <Text style={styles.faqTitle}>
              Does 112 AI dispatch help?
            </Text>

            <Text style={styles.faqText}>
              No. 112 AI can guide you, but
              emergency services are only
              contacted through the actual
              emergency request flow.
            </Text>
          </View>
        </View>

        {/* CONTACT */}

        <Text style={styles.sectionLabel}>
          SUPPORT
        </Text>

        <View style={styles.supportCard}>
          <View style={styles.supportIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={21}
              color="#111827"
            />
          </View>

          <View style={styles.supportContent}>
            <Text
              style={styles.supportTitle}
            >
              Contact Support
            </Text>

            <Text
              style={styles.supportText}
            >
              Direct support messaging will
              be added in a future version.
            </Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#7A838D"
          />

          <Text style={styles.noticeText}>
            For active emergencies, use the
            emergency request feature instead
            of Help & Support.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 34,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 32,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },

  logoBadge: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#111827',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  eyebrow: {
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  title: {
    marginTop: 7,
    color: '#18212B',
    fontSize: 29,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 8,
    maxWidth: 330,
    color: '#7A838D',
    fontSize: 12,
    lineHeight: 18,
  },

  aiCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#111827',
  },

  aiTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  aiIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#253043',
  },

  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#253043',
  },

  availableDot: {
    width: 6,
    height: 6,
    marginRight: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },

  availableText: {
    color: '#D1D5DB',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  aiTitle: {
    marginTop: 15,
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  aiText: {
    marginTop: 7,
    color: '#C7CDD6',
    fontSize: 11,
    lineHeight: 17,
  },

  aiAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginTop: 17,
  },

  aiActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  sectionLabel: {
    marginTop: 27,
    marginBottom: 10,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  faqCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E7EAEE',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  faqIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 13,
    backgroundColor: '#EEF2F6',
  },

  faqContent: {
    flex: 1,
  },

  faqTitle: {
    color: '#29333D',
    fontSize: 12,
    fontWeight: '900',
  },

  faqText: {
    marginTop: 5,
    color: '#8A939D',
    fontSize: 9,
    lineHeight: 14,
  },

  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E7EAEE',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  supportIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#EEF2F6',
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    color: '#29333D',
    fontSize: 12,
    fontWeight: '900',
  },

  supportText: {
    marginTop: 4,
    color: '#8A939D',
    fontSize: 9,
    lineHeight: 14,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    paddingHorizontal: 4,
  },

  noticeText: {
    flex: 1,
    marginLeft: 7,
    color: '#929AA4',
    fontSize: 8,
    lineHeight: 13,
  },

  pressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
})