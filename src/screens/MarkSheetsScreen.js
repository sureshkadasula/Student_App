import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { request } from '../services/api';
import AuthService from '../services/AuthService';

const MarkSheetsScreen = () => {
  const [studentData, setStudentData] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExamIndex, setSelectedExamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      setError(null);

      const session = await AuthService.getSession();
      const profileStr = await AsyncStorage.getItem('student_profile');
      let studentId = null;

      if (profileStr) {
        const profile = JSON.parse(profileStr);
        // Check for various ID fields that might be present
        studentId = profile.id || profile.id;
      }

      if (!studentId && session && session.user) {
        studentId = session.user.id;
      }

      if (!studentId) {
        setError('Student ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await request(`/grades/student-exam-report/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${session?.token}`,
        },
      });

      if (response.success) {
        console.log('response', response.data);
        setStudentData(response.data.student);
        setExams(response.data.exams || []);
        if (response.data.exams && response.data.exams.length > 0) {
          setSelectedExamIndex(0);
        }
      } else {
        setError(response.error || 'Failed to load exam data');
      }
    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = grade => {
    if (!grade) return '#666';
    const firstChar = grade.charAt(0).toUpperCase();
    if (firstChar === 'A') return '#4CAF50'; // Green
    if (firstChar === 'B') return '#FFC107'; // Yellow
    if (firstChar === 'C') return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getPercentageColor = percentage => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 75) return '#FFC107';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const renderSubjectRow = ({ item }) => (
    <View style={styles.subjectRow}>
      <Text style={[styles.subjectName, { flex: 2 }]}>{item.subject}</Text>
      <Text style={[styles.marksText, { flex: 1 }]}>{item.marks_obtained}</Text>
      <Text style={[styles.marksText, { flex: 1 }]}>/ {item.total_marks}</Text>
      <View
        style={[
          styles.gradeBadge,
          { backgroundColor: getGradeColor(item.grade) },
        ]}
      >
        <Text style={styles.gradeText}>{item.grade}</Text>
      </View>
    </View>
  );

  const currentExam = exams.length > 0 ? exams[selectedExamIndex] : null;

  const generateHTMLContent = () => {
    if (!currentExam || !studentData) return '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Mark Sheet - ${studentData.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { background: #FF751F; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .header h1 { margin: 0; text-align: center; }
          .student-info { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 10px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .info-label { font-weight: bold; color: #e0e0e0; }
          .info-value { color: white; }
          .section { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e0e0e0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th { background: #FF751F; color: white; padding: 12px; text-align: center; font-weight: bold; }
          td { padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: center; }
          .subject-name { text-align: left; font-weight: 500; }
          .grade-badge { padding: 4px 8px; border-radius: 6px; color: white; font-weight: bold; display: inline-block; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .summary-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e0e0e0; }
          .summary-label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 5px; }
          .summary-value { font-size: 20px; font-weight: bold; color: #333; }
          .performance-bar { height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
          .performance-fill { height: 100%; border-radius: 10px; }
          .performance-text { text-align: center; font-weight: 600; color: #666; }
          .footer { background: #fff3cd; padding: 12px; border-radius: 8px; border-left: 4px solid #ffc107; font-size: 12px; color: #856404; font-style: italic; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Mark Sheet</h1>
          <div class="student-info">
            <div class="info-row"><span class="info-label">Student:</span><span class="info-value">${studentData.name}</span></div>
            <div class="info-row"><span class="info-label">Class:</span><span class="info-value">${studentData.class_name}</span></div>
            <div class="info-row"><span class="info-label">Academic Year:</span><span class="info-value">${studentData.academic_year}</span></div>
            <div class="info-row"><span class="info-label">Exam:</span><span class="info-value">${currentExam.exam_name}</span></div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Subject-wise Marks</div>
          <table>
            <thead><tr><th>Subject</th><th>Marks</th><th>Max</th><th>Grade</th></tr></thead>
            <tbody>
              ${currentExam.subjects.map(subject => `
                <tr>
                  <td class="subject-name">${subject.subject}</td>
                  <td>${subject.marks_obtained}</td>
                  <td>${subject.total_marks}</td>
                  <td><span class="grade-badge" style="background-color: ${getGradeColor(subject.grade)}">${subject.grade}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="section">
          <div class="section-title">Summary</div>
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-label">Total Marks</div>
              <div class="summary-value">${currentExam.exam_marks_obtained}</div>
              <div style="font-size: 12px; color: #999;">/ ${currentExam.exam_total_marks}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Percentage</div>
              <div class="summary-value" style="color: ${getPercentageColor(currentExam.percentage)}">${currentExam.percentage}%</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Grade</div>
               <span class="grade-badge" style="font-size: 16px; padding: 6px 12px; background-color: ${getGradeColor(currentExam.grade)}">${currentExam.grade}</span>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Performance Analysis</div>
          <div class="performance-bar">
            <div class="performance-fill" style="width: ${currentExam.percentage}%; background: ${getPercentageColor(currentExam.percentage)}"></div>
          </div>
          <div class="performance-text">
            Overall Performance: ${currentExam.percentage >= 90 ? 'Excellent' : currentExam.percentage >= 75 ? 'Good' : currentExam.percentage >= 60 ? 'Average' : 'Needs Improvement'}
          </div>
        </div>
        <div class="footer">
          * This is a sample mark sheet. For official records, please contact the school office.
        </div>
      </body>
      </html>
    `;
  };

  const handleDownloadPDF = async () => {
    if (!currentExam) return;
    try {
      setIsDownloading(true);
      const htmlContent = generateHTMLContent();
      const fileName = `marksheet_${studentData.name.replace(/\s+/g, '_')}_${currentExam.exam_name.replace(/\s+/g, '_')}.pdf`;

      try {
        const RNHTMLtoPDF = require('react-native-html-to-pdf');
        const options = {
          html: htmlContent,
          fileName: fileName,
          directory: 'Documents',
          base64: false,
        };
        const pdfPath = await RNHTMLtoPDF.convert(options);
        Alert.alert(
          '✅ Download Complete',
          `Mark sheet saved!\nFile: ${fileName}`,
          [{ text: 'OK' }]
        );
      } catch (libraryError) {
        console.log('PDF library not available:', libraryError);
        Alert.alert('⚠️ PDF Library Not Installed', 'react-native-html-to-pdf is missing.');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('❌ Download Failed', 'Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareMarks = async () => {
    if (!currentExam || !studentData) return;
    try {
      setIsDownloading(true);
      const summary = `
Mark Sheet - ${studentData.name}
Class: ${studentData.class_name}
Academic Year: ${studentData.academic_year}
Exam: ${currentExam.exam_name}

Subject-wise Marks:
${currentExam.subjects.map(s => `${s.subject}: ${s.marks_obtained}/${s.total_marks} (${s.grade})`).join('\n')}

Summary:
Total Marks: ${currentExam.exam_marks_obtained}/${currentExam.exam_total_marks}
Percentage: ${currentExam.percentage}%
Grade: ${currentExam.grade}
      `.trim();

      await Share.share({
        title: 'Mark Sheet Summary',
        message: summary,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share marksheet.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF751F" />
        <Text style={styles.loadingText}>Loading exam records...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchExamData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!studentData || exams.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No exam records found for this student.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mark Sheet</Text>
        <View style={styles.studentInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student:</Text>
            <Text style={styles.infoValue}>{studentData.name}</Text>
          </View>
          <View style={styles.infoRow}>
            {/* ID is not always safe to show if it's UUID, maybe roll number if available in future */}
            <Text style={styles.infoLabel}>Class:</Text>
            <Text style={styles.infoValue}>{studentData.class_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Academic Year:</Text>
            <Text style={styles.infoValue}>{studentData.academic_year}</Text>
          </View>
        </View>
      </View>

      {/* Exam Selection */}
      <View style={styles.termSection}>
        <Text style={styles.sectionTitle}>Select Exam</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.termButtons}>
          {exams.map((exam, index) => (
            <TouchableOpacity
              key={exam.exam_id}
              style={[
                styles.termButton,
                selectedExamIndex === index && styles.termButtonActive,
              ]}
              onPress={() => setSelectedExamIndex(index)}
            >
              <Text
                style={[
                  styles.termButtonText,
                  selectedExamIndex === index && styles.termButtonTextActive,
                ]}
              >
                {exam.exam_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Marks Table */}
      {currentExam && (
        <View style={styles.marksSection}>
          <Text style={styles.sectionTitle}>Subject-wise Marks</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Subject</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Marks</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Max</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Grade</Text>
          </View>
          <FlatList
            data={currentExam.subjects}
            renderItem={renderSubjectRow}
            keyExtractor={(item, index) => item.subject_id || index.toString()}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Summary Section */}
      {currentExam && (
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Marks</Text>
              <Text style={styles.summaryValue}>{currentExam.exam_marks_obtained}</Text>
              <Text style={styles.summarySubtext}>/ {currentExam.exam_total_marks}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Percentage</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: getPercentageColor(currentExam.percentage) },
                ]}
              >
                {currentExam.percentage}%
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Grade</Text>
              <View
                style={[
                  styles.gradeBadgeLarge,
                  { backgroundColor: getGradeColor(currentExam.grade) },
                ]}
              >
                <Text style={styles.gradeTextLarge}>{currentExam.grade}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Performance Indicator */}
      {currentExam && (
        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performance Analysis</Text>
          <View style={styles.performanceBar}>
            <View
              style={[
                styles.performanceFill,
                {
                  width: `${Math.min(currentExam.percentage, 100)}%`,
                  backgroundColor: getPercentageColor(currentExam.percentage),
                },
              ]}
            />
          </View>
          <Text style={styles.performanceText}>
            Overall Performance:{' '}
            {currentExam.percentage >= 90
              ? 'Excellent'
              : currentExam.percentage >= 75
                ? 'Good'
                : currentExam.percentage >= 60
                  ? 'Average'
                  : 'Needs Improvement'}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      {/* <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton]}
          onPress={handleDownloadPDF}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.actionButtonText}>📥 Download PDF</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShareMarks}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.actionButtonText}>📤 Share Marks</Text>
          )}
        </TouchableOpacity>
      </View> */}

      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          * This is a sample mark sheet. For official records, please contact
          the school office.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#FF751F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF751F',
    textAlign: 'center',
    marginBottom: 15,
  },
  studentInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#464444ff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    color: '#464444ff',
    fontSize: 14,
    fontWeight: '500',
  },
  termSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  termButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  termButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    minWidth: 100,
  },
  termButtonActive: {
    backgroundColor: '#FF751F',
    borderColor: '#FF751F',
  },
  termButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  termButtonTextActive: {
    color: '#fff',
  },
  marksSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FF751F',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  subjectRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  marksText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  gradeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  summarySection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    minWidth: '30%', // Adjusted for 3 cards in a row
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  summarySubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  gradeBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    marginTop: 5,
  },
  gradeTextLarge: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  performanceSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  performanceBar: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  performanceFill: {
    height: '100%',
    borderRadius: 10,
  },
  performanceText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsSection: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  downloadButton: {
    backgroundColor: '#FF751F',
  },
  shareButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  footerText: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
  },
});

export default MarkSheetsScreen;
