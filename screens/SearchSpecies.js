import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { MaterialIcons, Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const protectionLevels = [
  "All",
  "Least Concern",
  "Near Threatened",
  "Vulnerable",
  "Endangered",
  "Critically Endangered",
  "Extinct",
  "Data Deficient",
  "Not Evaluated"
];

const SearchSpecies = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState('Species Name');
  const [protectionLevel, setProtectionLevel] = useState('All');
  const [speciesList, setSpeciesList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(true); // Collapsible search section
  const perPage = 5;

  const fetchSpecies = async (selectedQuery = query, pageNo = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/species/searchSpecies`, {
        params: {
          query: selectedQuery,
          protectionLevel,
          searchBy,
          limit: perPage,
          page: pageNo
        }
      });
      setSpeciesList(res.data.species || []);
      setTotalPages(Math.ceil((res.data.total || 0) / perPage));
    } catch (error) {
      console.error("Error fetching species:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (text) => {
    setQuery(text);
    if (searchBy !== 'Species Name') return;
    if (text.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/species/speciesSuggestions`, {
        params: { query: text }
      });
      setSuggestions(res.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelectSuggestion = (name) => {
    setQuery(name);
    setShowSuggestions(false);
    setPage(1);
    fetchSpecies(name, 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      fetchSpecies(query, prev);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      const next = page + 1;
      setPage(next);
      fetchSpecies(query, next);
    }
  };

  useEffect(() => {
    if (searchBy === 'Protection Level') {
      setPage(1);
      fetchSpecies('', 1);
    }
  }, [protectionLevel, searchBy]);

  useEffect(() => {
    setPage(1);
    fetchSpecies('', 1);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Collapsible Search Header */}
        <TouchableOpacity
          style={styles.collapseHeader}
          onPress={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Text style={styles.collapseTitle}>Search Options</Text>
          {isSearchOpen ? (
            <Ionicons name="chevron-up" size={20} color="#146C94" />
          ) : (
            <Ionicons name="chevron-down" size={20} color="#146C94" />
          )}
        </TouchableOpacity>

        {/* Collapsible Search Section */}
        {isSearchOpen && (
          <View style={styles.searchSection}>
            {/* Search By */}
            <View style={styles.section}>
              <Text style={styles.label}>Search By</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={searchBy}
                  onValueChange={(val) => {
                    setSearchBy(val);
                    setSuggestions([]);
                    setShowSuggestions(false);
                    setQuery('');
                    setSpeciesList([]);
                  }}
                  dropdownIconColor="#146C94"
                  style={styles.picker}
                >
                  <Picker.Item label="Species Name" value="Species Name" />
                  <Picker.Item label="Protection Level" value="Protection Level" />
                </Picker>
              </View>
            </View>

            {/* Conditional Input */}
            {searchBy === 'Species Name' && (
              <>
                <View style={styles.searchContainer}>
                  <MaterialIcons
                    name="search"
                    size={22}
                    color="#146C94"
                    style={{ marginRight: 6 }}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by species name..."
                    placeholderTextColor="#8CA6B7"
                    value={query}
                    onChangeText={fetchSuggestions}
                  />
                  <TouchableOpacity>
                    <Entypo name="mic" size={20} color="#146C94" />
                  </TouchableOpacity>
                </View>

                {showSuggestions && suggestions.length > 0 && (
                  <View style={styles.suggestionsBox}>
                    {suggestions.map((item) => (
                      <TouchableOpacity
                        key={item._id}
                        onPress={() =>
                          handleSelectSuggestion(item.CommonName || item.ScientificName)
                        }
                        style={styles.suggestionRow}
                      >
                        <Text style={styles.suggestionText}>
                          {item.CommonName} ({item.ScientificName})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => {
                    setPage(1);
                    fetchSpecies(query, 1);
                  }}
                >
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </>
            )}

            {searchBy === 'Protection Level' && (
              <View style={styles.section}>
                <Text style={styles.label}>Select Protection Level</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={protectionLevel}
                    onValueChange={(val) => setProtectionLevel(val)}
                    dropdownIconColor="#146C94"
                    style={styles.picker}
                  >
                    {protectionLevels.map((lvl, idx) => (
                      <Picker.Item key={idx} label={lvl} value={lvl} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Results */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#146C94"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={speciesList}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {item.ImageURL && (
                  <Image source={{ uri: item.ImageURL }} style={styles.cardImage} />
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.CommonName}</Text>
                  <View style={styles.nameRow}>
                    <Text style={styles.cardSubtitle}>{item.ScientificName}</Text>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => navigation.navigate('viewOneSpecies', { speciesId: item._id })}
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="pricetag"
                      size={16}
                      color="#19A7CE"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.detailValue}>{item.SpeciesCategory}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <FontAwesome5
                      name="shield-alt"
                      size={16}
                      color="#19A7CE"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.detailValue}>{item.ProtectionLevel}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons
                      name="terrain"
                      size={16}
                      color="#19A7CE"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.detailValue}>{item.Habitat}</Text>
                  </View>
                  <Text style={styles.description}>{item.Description}</Text>
                </View>
              </View>
            )}
            ListFooterComponent={() => (
              <View style={styles.pagination}>
                <TouchableOpacity
                  disabled={page === 1}
                  onPress={handlePrevPage}
                  style={[styles.pageButton, page === 1 && { opacity: 0.5 }]}
                >
                  <Text style={styles.pageButtonText}>Prev</Text>
                </TouchableOpacity>

                <Text style={styles.paginationText}>
                  Page {page} of {totalPages}
                </Text>

                <TouchableOpacity
                  disabled={page === totalPages}
                  onPress={handleNextPage}
                  style={[styles.pageButton, page === totalPages && { opacity: 0.5 }]}
                >
                  <Text style={styles.pageButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 15, paddingTop: 15, backgroundColor: '#F6F9FC' },
  section: { marginBottom: 10 },
  label: { color: '#146C94', fontWeight: '600', marginBottom: 5, fontSize: 14 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D0E3F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
  },
  picker: { height: 55, color: '#146C94' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0E3F0',
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 40,
  },
  searchInput: { flex: 1, color: '#146C94', fontSize: 16 },
  suggestionsBox: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#D0E3F0', marginBottom: 10 },
  suggestionRow: { paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderColor: '#E6E6E6' },
  suggestionText: { color: '#146C94', fontWeight: '500' },
  searchButton: { backgroundColor: '#19A7CE', borderRadius: 12, paddingVertical: 12, marginVertical: 10, alignItems: 'center' },
  searchButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  // Collapsible
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D0E3F0',
  },
  collapseTitle: { fontSize: 16, fontWeight: '600', color: '#146C94' },
  searchSection: { marginBottom: 10 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 200 },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#146C94' },
  cardSubtitle: { fontSize: 15, color: '#19A7CE', marginBottom: 10 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  detailValue: { color: '#19A7CE', fontSize: 14 },
  description: { color: '#146C94', marginTop: 10, fontSize: 14, lineHeight: 20 },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  paginationText: { color: '#146C94', fontWeight: '600', fontSize: 14 },
  pageButton: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#19A7CE', borderRadius: 8 },
  pageButtonText: { color: '#fff', fontWeight: '600' },
  viewButton: { backgroundColor: '#19A7CE', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, elevation: 2 },
  viewButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});

export default SearchSpecies;
