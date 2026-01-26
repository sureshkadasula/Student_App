import React, { useState } from 'react';
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
import RNFS from 'react-native-fs';

// Sample mark sheet data
const markSheetData = {
  studentName: 'Rahul Sharma',
  rollNumber: '2024-00123',
  class: '10th Grade',
  section: 'A',
  academicYear: '2024-2025',
  terms: {
    midTerm: {
      subjects: [
        { name: 'Mathematics', marks: 78, maxMarks: 100, grade: 'C+' },
        { name: 'Science', marks: 85, maxMarks: 100, grade: 'B+' },
        { name: 'English', marks: 82, maxMarks: 100, grade: 'B+' },
        { name: 'Social Studies', marks: 75, maxMarks: 100, grade: 'C+' },
        { name: 'Hindi', marks: 88, maxMarks: 100, grade: 'A-' },
        { name: 'Computer Science', marks: 92, maxMarks: 100, grade: 'A' },
      ],
      totalMarks: 500,
      maxTotal: 600,
      percentage: 83.3,
      grade: 'B+',
      attendance: '92%',
    },
    finalTerm: {
      subjects: [
        { name: 'Mathematics', marks: 85, maxMarks: 100, grade: 'B+' },
        { name: 'Science', marks: 90, maxMarks: 100, grade: 'A-' },
        { name: 'English', marks: 88, maxMarks: 100, grade: 'A-' },
        { name: 'Social Studies', marks: 82, maxMarks: 100, grade: 'B+' },
        { name: 'Hindi', marks: 92, maxMarks: 100, grade: 'A' },
        { name: 'Computer Science', marks: 95, maxMarks: 100, grade: 'A' },
      ],
      totalMarks: 532,
      maxTotal: 600,
      percentage: 88.7,
      grade: 'A-',
      attendance: '95%',
    },
    quarterly: {
      subjects: [
        { name: 'Mathematics', marks: 72, maxMarks: 100, grade: 'C' },
        { name: 'Science', marks: 78, maxMarks: 100, grade: 'C+' },
        { name: 'English', marks: 80, maxMarks: 100, grade: 'B' },
        { name: 'Social Studies', marks: 70, maxMarks: 100, grade: 'C' },
        { name: 'Hindi', marks: 85, maxMarks: 100, grade: 'B+' },
        { name: 'Computer Science', marks: 88, maxMarks: 100, grade: 'A-' },
      ],
      totalMarks: 473,
      maxTotal: 600,
      percentage: 78.8,
      grade: 'C+',
      attendance: '88%',
    },
  },
};

const MarkSheetsScreen = () => {
  const [selectedTerm, setSelectedTerm] = useState('finalTerm');
  const [isDownloading, setIsDownloading] = useState(false);

  const getGradeColor = grade => {
    if (grade.startsWith('A')) return '#4CAF50'; // Green
    if (grade.startsWith('B')) return '#FFC107'; // Yellow
    if (grade.startsWith('C')) return '#FF9800'; // Orange
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
      <Text style={[styles.subjectName, { flex: 2 }]}>{item.name}</Text>
      <Text style={[styles.marksText, { flex: 1 }]}>{item.marks}</Text>
      <Text style={[styles.marksText, { flex: 1 }]}>/ {item.maxMarks}</Text>
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

  const currentTerm = markSheetData.terms[selectedTerm];

  const generateHTMLContent = () => {
    const termName =
      selectedTerm === 'midTerm'
        ? 'Mid Term'
        : selectedTerm === 'finalTerm'
        ? 'Final Term'
        : 'Quarterly';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Mark Sheet - ${markSheetData.studentName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            background: #2E7D32;
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            text-align: center;
          }
          .student-info {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            color: #e0e0e0;
          }
          .info-value {
            color: white;
          }
          .section {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid #e0e0e0;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 12px;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          th {
            background: #4CAF50;
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: bold;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #f0f0f0;
            text-align: center;
          }
          .subject-name {
            text-align: left;
            font-weight: 500;
          }
          .grade-badge {
            padding: 4px 8px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            display: inline-block;
          }
          .grade-A { background: #4CAF50; }
          .grade-B { background: #FFC107; }
          .grade-C { background: #FF9800; }
          .grade-D { background: #F44336; }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .summary-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e0e0e0;
          }
          .summary-label {
            font-size: 12px;
            color: #666;
            font-weight: 600;
            margin-bottom: 5px;
          }
          .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
          .performance-bar {
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
          }
          .performance-fill {
            height: 100%;
            border-radius: 10px;
          }
          .performance-text {
            text-align: center;
            font-weight: 600;
            color: #666;
          }
          .footer {
            background: #fff3cd;
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
            font-size: 12px;
            color: #856404;
            font-style: italic;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Mark Sheet</h1>
          <div class="student-info">
            <div class="info-row">
              <span class="info-label">Student:</span>
              <span class="info-value">${markSheetData.studentName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Roll No:</span>
              <span class="info-value">${markSheetData.rollNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Class:</span>
              <span class="info-value">${markSheetData.class} - ${
      markSheetData.section
    }</span>
            </div>
            <div class="info-row">
              <span class="info-label">Academic Year:</span>
              <span class="info-value">${markSheetData.academicYear}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Term:</span>
              <span class="info-value">${termName}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Subject-wise Marks</div>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Max</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${currentTerm.subjects
                .map(
                  subject => `
                <tr>
                  <td class="subject-name">${subject.name}</td>
                  <td>${subject.marks}</td>
                  <td>${subject.maxMarks}</td>
                  <td>
                    <span class="grade-badge grade-${subject.grade.charAt(
                      0,
                    )}">${subject.grade}</span>
                  </td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Summary</div>
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-label">Total Marks</div>
              <div class="summary-value">${currentTerm.totalMarks}</div>
              <div style="font-size: 12px; color: #999;">/ ${
                currentTerm.maxTotal
              }</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Percentage</div>
              <div class="summary-value" style="color: ${getPercentageColor(
                currentTerm.percentage,
              )}">${currentTerm.percentage}%</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Grade</div>
              <div class="grade-badge grade-${currentTerm.grade.charAt(
                0,
              )}" style="font-size: 16px; padding: 6px 12px;">${
      currentTerm.grade
    }</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Attendance</div>
              <div class="summary-value">${currentTerm.attendance}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Performance Analysis</div>
          <div class="performance-bar">
            <div class="performance-fill" style="width: ${
              currentTerm.percentage
            }%; background: ${getPercentageColor(
      currentTerm.percentage,
    )}"></div>
          </div>
          <div class="performance-text">
            Overall Performance: ${
              currentTerm.percentage >= 90
                ? 'Excellent'
                : currentTerm.percentage >= 75
                ? 'Good'
                : currentTerm.percentage >= 60
                ? 'Average'
                : 'Needs Improvement'
            }
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
    try {
      setIsDownloading(true);

      // Create HTML content
      const htmlContent = generateHTMLContent();

      // Create a unique filename with timestamp
      const fileName = `marksheet_${markSheetData.studentName.replace(
        /\s+/g,
        '_',
      )}_${Date.now()}.pdf`;

      // Check if react-native-html-to-pdf is available
      try {
        // Try to import the library dynamically
        const RNHTMLtoPDF = require('react-native-html-to-pdf');

        // Configure PDF options
        const options = {
          html: htmlContent,
          fileName: fileName,
          directory: 'Documents',
          base64: false,
        };

        // Generate PDF file
        const pdfPath = await RNHTMLtoPDF.convert(options);

        // Show success message with file location
        Alert.alert(
          '✅ Download Complete',
          `Mark sheet has been saved successfully as PDF!\n\nFile: ${fileName}\nLocation: Documents\n\nYou can now:\n• Open it from your file manager\n• Share it using the Share button\n• View it in any PDF viewer`,
          [
            {
              text: 'Open PDF',
              onPress: async () => {
                try {
                  // Try to open with FileViewer
                  const FileViewer = require('react-native-file-viewer');
                  await FileViewer.open(pdfPath);
                } catch (openError) {
                  // If FileViewer fails, show instructions
                  Alert.alert(
                    'Open PDF',
                    'To view the PDF, please open your file manager app and navigate to:\n\nDocuments > marksheet_' +
                      markSheetData.studentName.replace(/\s+/g, '_') +
                      '_' +
                      Date.now() +
                      '.pdf',
                    [{ text: 'OK', style: 'default' }],
                  );
                }
              },
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
        );
      } catch (libraryError) {
        // Library not installed, show installation instructions
        console.log('PDF library not available:', libraryError);
        Alert.alert(
          '⚠️ PDF Library Not Installed',
          'To download marksheets as PDF, please install the required library:\n\n1. Run: npm install react-native-html-to-pdf\n2. Run: cd android && ./gradlew clean\n3. Rebuild the app\n\nAfter installation, try downloading again.',
          [
            {
              text: 'OK',
              style: 'default',
            },
          ],
        );
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        '❌ Download Failed',
        'Failed to download marksheet. Please check storage permissions and try again.',
        [{ text: 'OK', style: 'default' }],
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareMarks = async () => {
    try {
      setIsDownloading(true);

      // Create a simple text summary
      const termName =
        selectedTerm === 'midTerm'
          ? 'Mid Term'
          : selectedTerm === 'finalTerm'
          ? 'Final Term'
          : 'Quarterly';
      const summary = `
Mark Sheet - ${markSheetData.studentName}
Roll No: ${markSheetData.rollNumber}
Class: ${markSheetData.class} - ${markSheetData.section}
Academic Year: ${markSheetData.academicYear}
Term: ${termName}

Subject-wise Marks:
${currentTerm.subjects
  .map(s => `${s.name}: ${s.marks}/${s.maxMarks} (${s.grade})`)
  .join('\n')}

Summary:
Total Marks: ${currentTerm.totalMarks}/${currentTerm.maxTotal}
Percentage: ${currentTerm.percentage}%
Grade: ${currentTerm.grade}
Attendance: ${currentTerm.attendance}

Performance: ${
        currentTerm.percentage >= 90
          ? 'Excellent'
          : currentTerm.percentage >= 75
          ? 'Good'
          : currentTerm.percentage >= 60
          ? 'Average'
          : 'Needs Improvement'
      }
      `.trim();

      // Share the text directly using React Native Share
      await Share.share({
        title: 'Mark Sheet Summary',
        message: summary,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share marksheet. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mark Sheet</Text>
        <View style={styles.studentInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student:</Text>
            <Text style={styles.infoValue}>{markSheetData.studentName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Roll No:</Text>
            <Text style={styles.infoValue}>{markSheetData.rollNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Class:</Text>
            <Text style={styles.infoValue}>
              {markSheetData.class} - {markSheetData.section}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Academic Year:</Text>
            <Text style={styles.infoValue}>{markSheetData.academicYear}</Text>
          </View>
        </View>
      </View>

      {/* Term Selection */}
      <View style={styles.termSection}>
        <Text style={styles.sectionTitle}>Select Term</Text>
        <View style={styles.termButtons}>
          {Object.keys(markSheetData.terms).map(term => (
            <TouchableOpacity
              key={term}
              style={[
                styles.termButton,
                selectedTerm === term && styles.termButtonActive,
              ]}
              onPress={() => setSelectedTerm(term)}
            >
              <Text
                style={[
                  styles.termButtonText,
                  selectedTerm === term && styles.termButtonTextActive,
                ]}
              >
                {term === 'midTerm'
                  ? 'Mid Term'
                  : term === 'finalTerm'
                  ? 'Final Term'
                  : 'Quarterly'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Marks Table */}
      <View style={styles.marksSection}>
        <Text style={styles.sectionTitle}>Subject-wise Marks</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 2 }]}>Subject</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Marks</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Max</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Grade</Text>
        </View>
        <FlatList
          data={currentTerm.subjects}
          renderItem={renderSubjectRow}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Marks</Text>
            <Text style={styles.summaryValue}>{currentTerm.totalMarks}</Text>
            <Text style={styles.summarySubtext}>/ {currentTerm.maxTotal}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Percentage</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: getPercentageColor(currentTerm.percentage) },
              ]}
            >
              {currentTerm.percentage}%
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Grade</Text>
            <View
              style={[
                styles.gradeBadgeLarge,
                { backgroundColor: getGradeColor(currentTerm.grade) },
              ]}
            >
              <Text style={styles.gradeTextLarge}>{currentTerm.grade}</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Attendance</Text>
            <Text style={styles.summaryValue}>{currentTerm.attendance}</Text>
          </View>
        </View>
      </View>

      {/* Performance Indicator */}
      <View style={styles.performanceSection}>
        <Text style={styles.sectionTitle}>Performance Analysis</Text>
        <View style={styles.performanceBar}>
          <View
            style={[
              styles.performanceFill,
              {
                width: `${currentTerm.percentage}%`,
                backgroundColor: getPercentageColor(currentTerm.percentage),
              },
            ]}
          />
        </View>
        <Text style={styles.performanceText}>
          Overall Performance:{' '}
          {currentTerm.percentage >= 90
            ? 'Excellent'
            : currentTerm.percentage >= 75
            ? 'Good'
            : currentTerm.percentage >= 60
            ? 'Average'
            : 'Needs Improvement'}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
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
      </View>

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
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    color: '#fff',
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
    justifyContent: 'space-between',
    gap: 8,
  },
  termButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  termButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
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
    backgroundColor: '#4CAF50',
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
    minWidth: '45%',
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
    backgroundColor: '#2196F3',
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
