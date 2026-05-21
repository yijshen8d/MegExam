import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import guidesData from '../data/studyGuides.json';

export default function StudyGuideScreen({ onBack }) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (selectedTopic) {
    const guide = guidesData.find(g => g.topicNumber === selectedTopic);
    if (!guide) return null;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedTopic(null)} style={styles.backLink}>
          <Text style={styles.backLinkText}>← All Topics</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.guideContent}>
          <Text style={styles.guideTitle}>{guide.topicName}</Text>
          <Text style={styles.overview}>{guide.overview}</Text>

          {guide.sections.map((section, i) => (
            <View key={i} style={styles.section}>
              <Text style={styles.sectionHeading}>{section.heading}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}

          {guide.keyTerms.length > 0 && (
            <View style={styles.keyTermsSection}>
              <Text style={styles.keyTermsTitle}>Key Terms</Text>
              {guide.keyTerms.map((kt, i) => (
                <View key={i} style={styles.keyTerm}>
                  <Text style={styles.keyTermName}>{kt.term}</Text>
                  <Text style={styles.keyTermDef}>{kt.definition}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Guides</Text>
      <ScrollView>
        {guidesData.map((g) => (
          <TouchableOpacity
            key={g.topicNumber}
            style={styles.topicRow}
            onPress={() => setSelectedTopic(g.topicNumber)}
            activeOpacity={0.7}
          >
            <Text style={styles.topicNumber}>{g.topicNumber}</Text>
            <Text style={styles.topicName}>{g.topicName}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },
  topicRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    backgroundColor: '#f8f8f8', borderRadius: 10, marginBottom: 8,
  },
  topicNumber: { fontSize: 16, fontWeight: '700', color: '#007AFF', width: 28 },
  topicName: { fontSize: 16, flex: 1, color: '#1a1a1a' },
  arrow: { fontSize: 24, color: '#ccc' },
  backLink: { marginBottom: 16 },
  backLinkText: { fontSize: 15, color: '#007AFF' },
  guideContent: { paddingBottom: 40 },
  guideTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 },
  overview: { fontSize: 15, lineHeight: 22, color: '#444', marginBottom: 20, fontStyle: 'italic' },
  section: { marginBottom: 20 },
  sectionHeading: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  sectionBody: { fontSize: 14, lineHeight: 22, color: '#444' },
  keyTermsSection: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 20 },
  keyTermsTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  keyTerm: { marginBottom: 12, backgroundColor: '#f8f8f8', padding: 12, borderRadius: 8 },
  keyTermName: { fontSize: 14, fontWeight: '700', color: '#007AFF', marginBottom: 4 },
  keyTermDef: { fontSize: 13, color: '#555', lineHeight: 20 },
  backBtn: { alignItems: 'center', marginTop: 12 },
  backText: { color: '#007AFF', fontSize: 15 },
});
