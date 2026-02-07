import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type MenuRoute = "index" | "library" | "review" | "statistics" | "add book" | "profile";

type MenuProps = {
  title: string;
  showSearch?: boolean;
  onSearchPress?: () => void;
};

export default function Menu({ title, showSearch = false, onSearchPress }: MenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuItemPress = (route: MenuRoute) => {
    setMenuOpen(false);
    // Navigate to the selected route
    if (route === "index") {
      router.push("/(tabs)");
      return;
    }
    if (route === "library") {
      router.push("/(tabs)/library");
      return;
    }
    if (route === "review") {
      router.push("/(tabs)/review");
      return;
    }
    if (route === "profile") {
      router.push("/(tabs)/profile");
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Menu Drawer */}
      {menuOpen && (
        <Modal transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
          <View style={styles.menuOverlay}>
            <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)} />
            <View style={styles.menuDrawer}>
              <Pressable
                style={styles.menuCloseButton}
                onPress={() => setMenuOpen(false)}
              >
                <Text style={styles.menuCloseIcon}>✕</Text>
              </Pressable>

              <View style={styles.menuContent}>
                <Pressable
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('index')}
                >
                  <Ionicons name="home" size={24} color="#333" style={{ marginRight: 16 }} />
                  <Text style={styles.menuItemText}>Home</Text>
                </Pressable>

                <Pressable
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('library')}
                >
                  <Ionicons name="book" size={24} color="#333" style={{ marginRight: 16 }} />
                  <Text style={styles.menuItemText}>Library</Text>
                </Pressable>

                <Pressable
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('review')}
                >
                  <Ionicons name="star" size={24} color="#333" style={{ marginRight: 16 }} />
                  <Text style={styles.menuItemText}>Review</Text>
                </Pressable>

                <View style={styles.menuDivider} />

                <Pressable
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress("profile")}
                >
                  <Text style={styles.menuItemIcon}>👤</Text>
                  <Text style={styles.menuItemText}>Profile</Text>
                </Pressable>

                <Pressable style={styles.menuItem} onPress={() => setMenuOpen(false)}>
                  <Ionicons name="settings" size={24} color="#333" style={{ marginRight: 16 }} />
                  <Text style={styles.menuItemText}>Settings</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.menuButton}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        {showSearch ? (
          <Pressable style={styles.searchButton} onPress={onSearchPress}>
            <Text style={styles.searchIcon}>🔍</Text>
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },
  menuOverlay: {
    flex: 1,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 1001,
    paddingTop: 16,
  },
  menuCloseButton: {
    padding: 16,
    alignItems: 'flex-end',
  },
  menuCloseIcon: {
    fontSize: 24,
    color: '#5d4037',
    fontWeight: 'bold',
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f1f0',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#5d4037',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5d4037',
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
  },
  headerSpacer: {
    width: 32,
  },
})