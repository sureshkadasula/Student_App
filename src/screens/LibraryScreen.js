import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Sample books data
const booksData = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Computer Science',
    isbn: '978-0262033848',
    publisher: 'MIT Press',
    year: '2009',
    availability: 'available',
    borrowedBy: null,
    dueDate: null,
    coverImage: null,
  },
  {
    id: '2',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt, David Thomas',
    category: 'Computer Science',
    isbn: '978-0135957059',
    publisher: 'Addison-Wesley',
    year: '2019',
    availability: 'borrowed',
    borrowedBy: 'John Doe',
    dueDate: '2024-02-10',
    coverImage: null,
  },
  {
    id: '3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    isbn: '978-0061120084',
    publisher: 'HarperCollins',
    year: '1960',
    availability: 'available',
    borrowedBy: null,
    dueDate: null,
    coverImage: null,
  },
  {
    id: '4',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    isbn: '978-0553380163',
    publisher: 'Bantam Books',
    year: '1988',
    availability: 'available',
    borrowedBy: null,
    dueDate: null,
    coverImage: null,
  },
  {
    id: '5',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    category: 'Mathematics',
    isbn: '978-1285741550',
    publisher: 'Cengage Learning',
    year: '2015',
    availability: 'borrowed',
    borrowedBy: 'Jane Smith',
    dueDate: '2024-02-05',
    coverImage: null,
  },
  {
    id: '6',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    isbn: '978-0062316097',
    publisher: 'Harper',
    year: '2015',
    availability: 'available',
    borrowedBy: null,
    dueDate: null,
    coverImage: null,
  },
  {
    id: '7',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    isbn: '978-0132350884',
    publisher: 'Prentice Hall',
    year: '2008',
    availability: 'available',
    borrowedBy: null,
    dueDate: null,
    coverImage: null,
  },
  {
    id: '8',
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    isbn: '978-0451524935',
    publisher: 'Signet Classics',
    year: '1949',
    availability: 'borrowed',
    borrowedBy: 'Mike Johnson',
    dueDate: '2024-02-15',
    coverImage: null,
  },
  {
    id: '9',
    title: 'The Art of Computer Programming',
    author: 'Donald Knuth',
    category: 'Computer Science',
    isbn: '978-0201896831',
    publisher: 'Addison-Wesley',
    year: '1997',
    availability: 'available',
    borrowedBy: null,
    dueDate: null,
    coverImage: null,
  },
  {
    id: '10',
    title: 'Cosmos',
    author: 'Carl Sagan',
    category: 'Science',
    isbn: '978-0345539434',
    publisher: 'Ballantine Books',
    year: '2013',
    availability: 'available',
    borrowedBy: null,
    dueDate: null,
    coverImage: null,
  },
];

const LibraryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);

  // Get unique categories for filter options
  const categories = useMemo(() => {
    const uniqueCategories = [
      'All',
      ...new Set(booksData.map(b => b.category)),
    ];
    return uniqueCategories;
  }, []);

  // Filter and search books
  const filteredBooks = useMemo(() => {
    let filtered = booksData;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Apply availability filter
    if (selectedAvailability !== 'All') {
      filtered = filtered.filter(
        book => book.availability === selectedAvailability,
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query) ||
          book.isbn.toLowerCase().includes(query),
      );
    }

    // Sort by availability (available first) then by title
    return filtered.sort((a, b) => {
      if (a.availability !== b.availability) {
        return a.availability === 'available' ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    });
  }, [selectedCategory, selectedAvailability, searchQuery]);

  // Get availability color
  const getAvailabilityColor = availability => {
    switch (availability) {
      case 'available':
        return '#4CAF50'; // Green
      case 'borrowed':
        return '#F44336'; // Red
      default:
        return '#757575'; // Gray
    }
  };

  // Get category color
  const getCategoryColor = category => {
    switch (category) {
      case 'Computer Science':
        return '#2196F3'; // Blue
      case 'Fiction':
        return '#9C27B0'; // Purple
      case 'Science':
        return '#4CAF50'; // Green
      case 'Mathematics':
        return '#FF9800'; // Orange
      case 'History':
        return '#795548'; // Brown
      default:
        return '#607D8B'; // Gray
    }
  };

  // Format date
  const formatDate = dateStr => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle view book details
  const handleViewDetails = book => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  // Handle borrow book
  const handleBorrowBook = book => {
    setSelectedBook(book);
    setBorrowModalVisible(true);
  };

  // Handle return book
  const handleReturnBook = book => {
    setSelectedBook(book);
    setBorrowModalVisible(true);
  };

  // Handle confirm borrow/return
  const handleConfirmBorrowReturn = () => {
    if (!selectedBook) return;

    // Simulate borrow/return action
    Alert.alert(
      selectedBook.availability === 'available' ? 'Borrow Book' : 'Return Book',
      selectedBook.availability === 'available'
        ? `Borrowing "${selectedBook.title}"...`
        : `Returning "${selectedBook.title}"...`,
      [{ text: 'OK', style: 'default' }],
    );

    setBorrowModalVisible(false);
    setModalVisible(false);
  };

  // Render book card
  const renderBookCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.bookIconContainer}>
            <Icon name="book" size={24} color={colors.primary} />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
          </View>
          <View
            style={[
              styles.availabilityBadge,
              { backgroundColor: getAvailabilityColor(item.availability) },
            ]}
          >
            <Text style={styles.availabilityText}>
              {item.availability === 'available' ? 'Available' : 'Borrowed'}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="tag" size={14} color="#666" style={styles.icon} />
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(item.category) },
              ]}
            >
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="hashtag" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.isbn}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="building" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>
              {item.publisher} ({item.year})
            </Text>
          </View>

          {item.availability === 'borrowed' && item.borrowedBy && (
            <View style={styles.infoRow}>
              <Icon name="user" size={14} color="#666" style={styles.icon} />
              <Text style={styles.infoText}>
                Borrowed by: {item.borrowedBy}
              </Text>
            </View>
          )}

          {item.availability === 'borrowed' && item.dueDate && (
            <View style={styles.infoRow}>
              <Icon
                name="calendar"
                size={14}
                color="#666"
                style={styles.icon}
              />
              <Text style={[styles.infoText, { color: '#F44336' }]}>
                Due: {formatDate(item.dueDate)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewDetails(item)}
          >
            <Icon name="eye" size={14} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>

          {item.availability === 'available' ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.borrowButton]}
              onPress={() => handleBorrowBook(item)}
            >
              <Icon
                name="hand-paper"
                size={14}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Borrow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.returnButton]}
              onPress={() => handleReturnBook(item)}
            >
              <Icon
                name="undo"
                size={14}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Return</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter button
  const renderCategoryFilter = category => (
    <TouchableOpacity
      key={category}
      style={[
        styles.filterButton,
        selectedCategory === category && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedCategory === category && styles.filterButtonTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  // Render availability filter button
  const renderAvailabilityFilter = availability => (
    <TouchableOpacity
      key={availability}
      style={[
        styles.filterButton,
        selectedAvailability === availability && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedAvailability(availability)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedAvailability === availability &&
          styles.filterButtonTextActive,
        ]}
      >
        {availability}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <Text
          style={styles.searchInput}
          placeholder="Search books..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Category Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {categories.map(renderCategoryFilter)}
      </ScrollView>

      {/* Availability Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {['All', 'available', 'borrowed'].map(renderAvailabilityFilter)}
      </ScrollView>

      {/* Books List */}
      <FlatList
        data={filteredBooks}
        renderItem={renderBookCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="book" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>
              {selectedCategory === 'All' &&
                selectedAvailability === 'All' &&
                !searchQuery
                ? 'Books will appear here'
                : 'Try adjusting your filters'}
            </Text>
          </View>
        }
      />

      {/* Book Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedBook && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedBook.title}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Icon name="times" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Book Details</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Author:</Text>
                        <Text style={styles.detailValue}>
                          {selectedBook.author}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Category:</Text>
                        <View
                          style={[
                            styles.categoryBadge,
                            {
                              backgroundColor: getCategoryColor(
                                selectedBook.category,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.categoryText}>
                            {selectedBook.category}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ISBN:</Text>
                        <Text style={styles.detailValue}>
                          {selectedBook.isbn}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Publisher:</Text>
                        <Text style={styles.detailValue}>
                          {selectedBook.publisher} ({selectedBook.year})
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View
                          style={[
                            styles.availabilityBadge,
                            {
                              backgroundColor: getAvailabilityColor(
                                selectedBook.availability,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.availabilityText}>
                            {selectedBook.availability === 'available'
                              ? 'Available'
                              : 'Borrowed'}
                          </Text>
                        </View>
                      </View>
                      {selectedBook.availability === 'borrowed' && (
                        <>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Borrowed By:</Text>
                            <Text style={styles.detailValue}>
                              {selectedBook.borrowedBy}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Due Date:</Text>
                            <Text
                              style={[styles.detailValue, { color: '#F44336' }]}
                            >
                              {formatDate(selectedBook.dueDate)}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>

                  <View style={styles.modalActions}>
                    {selectedBook.availability === 'available' ? (
                      <TouchableOpacity
                        style={[styles.modalActionButton, styles.borrowButton]}
                        onPress={() => {
                          setModalVisible(false);
                          handleBorrowBook(selectedBook);
                        }}
                      >
                        <Icon
                          name="hand-paper"
                          size={16}
                          color="#fff"
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>Borrow Book</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.modalActionButton, styles.returnButton]}
                        onPress={() => {
                          setModalVisible(false);
                          handleReturnBook(selectedBook);
                        }}
                      >
                        <Icon
                          name="undo"
                          size={16}
                          color="#fff"
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>Return Book</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Borrow/Return Confirmation Modal */}
      <Modal
        visible={borrowModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBorrowModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedBook && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedBook.availability === 'available'
                        ? 'Borrow Book'
                        : 'Return Book'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setBorrowModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Icon name="times" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Book Information</Text>
                      <Text style={styles.modalDescription}>
                        {selectedBook.title} by {selectedBook.author}
                      </Text>
                      <Text style={styles.modalDescription}>
                        ISBN: {selectedBook.isbn}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>
                        {selectedBook.availability === 'available'
                          ? 'Borrow Confirmation'
                          : 'Return Confirmation'}
                      </Text>
                      <Text style={styles.modalDescription}>
                        {selectedBook.availability === 'available'
                          ? 'Are you sure you want to borrow this book? You will have 14 days to return it.'
                          : 'Are you sure you want to return this book?'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalActionButton, styles.cancelButton]}
                      onPress={() => setBorrowModalVisible(false)}
                    >
                      <Icon
                        name="times"
                        size={16}
                        color="#fff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalActionButton,
                        selectedBook.availability === 'available'
                          ? styles.borrowButton
                          : styles.returnButton,
                      ]}
                      onPress={handleConfirmBorrowReturn}
                    >
                      <Icon
                        name="check"
                        size={16}
                        color="#fff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>
                        {selectedBook.availability === 'available'
                          ? 'Confirm Borrow'
                          : 'Confirm Return'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

import { colors } from '../theme/colors';

// ... (component code)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  filterContainer: {
    paddingLeft: 15,
    marginBottom: 10,
  },
  filterContent: {
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
    maxWidth: 150,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    flexShrink: 0,
    flexWrap: 'wrap',
    numberOfLines: 2,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
    width: 16,
    textAlign: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  viewButton: {
    backgroundColor: '#2196F3',
  },
  borrowButton: {
    backgroundColor: '#4CAF50',
  },
  returnButton: {
    backgroundColor: '#FF9800',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default LibraryScreen;
