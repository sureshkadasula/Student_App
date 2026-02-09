import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Dimensions,
  Image,
  TextInput,
  StatusBar,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import { request } from '../services/api';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const LibraryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // PDF Viewer State
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfPath, setPdfPath] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionStr = await AsyncStorage.getItem('auth_session');
      let token = null;
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        token = session.token;
      }

      const response = await request('/library/books', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.success) {
        setBooks(response.data || []);
      } else {
        console.log("Library API error or empty, using mock data for demo.");
        setBooks(MOCK_BOOKS);
      }
    } catch (err) {
      console.error('Fetch Books Error:', err);
      setError('Failed to load books');
      setBooks(MOCK_BOOKS);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (url, bookId) => {
    if (!url) return null;

    const fileName = `book_${bookId}.pdf`;
    const localFile = `${RNFS.CachesDirectoryPath}/${fileName}`;

    // Check if already exists
    const exists = await RNFS.exists(localFile);
    if (exists) {
      return localFile;
    }

    setDownloading(true);
    setDownloadProgress(0);

    try {
      const options = {
        fromUrl: url,
        toFile: localFile,
        background: true,
        begin: (res) => {
          console.log('Download has begun:', res);
        },
        progress: (res) => {
          let progress = 0;
          if (res.contentLength > 0) {
            progress = (res.bytesWritten / res.contentLength);
          } else if (res.bytesWritten > 0) {
            // Fallback if no content-length
            progress = 0.1 + (Math.log(res.bytesWritten) / 20); // Fake progress curve
            if (progress > 0.9) progress = 0.9;
          }
          setDownloadProgress(progress);
        }
      };

      const ret = RNFS.downloadFile(options);
      await ret.promise;
      setDownloading(false);
      return localFile;
    } catch (err) {
      console.error("Download error:", err);
      setDownloading(false);
      Alert.alert("Error", "Failed to download book: " + (err.message || "Unknown error"));
      return null;
    }
  };

  const handleBookPress = async (book) => {
    setCurrentBook(book);
    setPdfModalVisible(true);
    setPdfPath(null); // Reset prev path
    const url = book.pdf_url;
    if (!url) {
      Alert.alert("No PDF", "This book does not have a PDF attached.");
      setPdfModalVisible(false);
      return;
    }
    const localPath = await downloadPdf(url, book.id);
    if (localPath) {
      setPdfPath(localPath);
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchSearch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'All' || book.category === selectedCategory || book.category_name === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  const categories = ['All', ...new Set(books.map(b => b.category || b.category_name || 'General'))];

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => handleBookPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.coverContainer}>
        {item.cover_image ? (
          <Image source={{ uri: item.cover_image }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={[styles.coverPlaceholder, { backgroundColor: getCategoryColor(item.category || item.category_name) }]}>
            <Icon name="book-open-variant" size={40} color="rgba(255,255,255,0.8)" />
            <Text style={styles.coverPlaceholderText} numberOfLines={2}>{item.category || item.category_name || 'Book'}</Text>
          </View>
        )}
        {item.status === 'borrowed' || item.availability === 'borrowed' ? (
          <View style={styles.badgeBorrowed}>
            <Text style={styles.badgeText}>Borrowed</Text>
          </View>
        ) : (
          <View style={styles.badgeAvailable}>
            <Text style={styles.badgeText}>Available</Text>
          </View>
        )}
      </View>

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF751F" />

      {/* Search Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Library</Text>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Grid Content */}
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bookshelf" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No books found</Text>
          </View>
        }
      />

      {/* PDF Viewer Modal */}
      <Modal
        visible={pdfModalVisible}
        animationType="slide"
        onRequestClose={() => setPdfModalVisible(false)}
      >
        <View style={styles.pdfContainer}>
          {/* PDF Header */}
          <View style={styles.pdfHeader}>
            <TouchableOpacity onPress={() => setPdfModalVisible(false)} style={styles.closeButton}>
              <Icon name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.pdfTitleContainer}>
              <Text style={styles.pdfTitle} numberOfLines={1}>{currentBook?.title}</Text>
              {pdfPath && <Text style={styles.pdfSubtitle}>Page {currentPage} of {totalPages}</Text>}
            </View>
            <View style={{ width: 24 }} />
          </View>

          {/* Loading Indicator */}
          {downloading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF751F" />
              <Text style={styles.loadingText}>Downloading Book... {Math.round(downloadProgress * 100)}%</Text>
            </View>
          )}

          {/* PDF View */}
          {!downloading && pdfPath && (
            <Pdf
              source={{ uri: `file://${pdfPath}`, cache: false }}
              style={styles.pdf}
              onLoadComplete={(numberOfPages) => {
                setTotalPages(numberOfPages);
              }}
              onPageChanged={(page) => {
                setCurrentPage(page);
              }}
              onError={(error) => {
                console.log('PDF Load Error:', error);
                Alert.alert('Error', 'Failed to render PDF');
              }}
              enablePaging={true}
              horizontal={false}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

// Helper colors
const getCategoryColor = (cat) => {
  if (!cat) return '#64748b';
  const c = cat.toLowerCase();
  if (c.includes('science')) return '#3b82f6';
  if (c.includes('hist')) return '#d97706';
  if (c.includes('math')) return '#ef4444';
  if (c.includes('fiction')) return '#8b5cf6';
  return '#64748b';
};

const MOCK_BOOKS = [
  { id: 1, title: 'Physics for Scientists', author: 'Dr. Sheldon', category: 'Science', availability: 'available', cover_image: 'https://m.media-amazon.com/images/I/91Mkw889RmL._AC_UF1000,1000_QL80_.jpg', pdf_url: 'https://arxiv.org/pdf/1706.03762.pdf' },
  { id: 2, title: 'World History', author: 'H. Wells', category: 'History', availability: 'available', pdf_url: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
  { id: 3, title: 'Calculus Made Easy', author: 'S. Thompson', category: 'Math', availability: 'borrowed', pdf_url: 'https://arxiv.org/pdf/1706.03762.pdf' },
  { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', availability: 'available', cover_image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg', pdf_url: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
  { id: 5, title: 'Clean Code', author: 'Robert C. Martin', category: 'Computer Science', availability: 'available', pdf_url: 'https://arxiv.org/pdf/1706.03762.pdf' },
  { id: 6, title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', availability: 'borrowed', pdf_url: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 16,

  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF751F',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e1e1ff',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#0f172a',
  },
  categoryList: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FF751F',
  },
  categoryChipActive: {
    backgroundColor: '#FF751F',
  },
  categoryText: {
    color: '#FF751F',
    fontWeight: '600',
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#fffdfcff',
  },

  // Grid
  gridContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bookCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverContainer: {
    height: 180,
    backgroundColor: '#f1f5f9',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  coverPlaceholderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  badgeAvailable: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeBorrowed: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#64748b',
  },

  // PDF Modal
  pdfContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
    elevation: 2,
  },
  closeButton: {
    padding: 4,
  },
  pdfTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  pdfSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  pdf: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#f1f5f9',
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 14
  }

});

export default LibraryScreen;
