// src/screens/main/FeedScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  RefreshControl,
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../utils/colors';
import { horizontalScale, moderateScale, verticalScale, SPACING } from '../../utils/metrics';
import { BASE_URL, API_ENDPOINTS, USER_ROLES } from '../../utils/constants';
import { useUserStore } from '../../store/userStore';
import { Post } from '../../types';

const { height } = Dimensions.get('window');

const FeedScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const { userData } = useUserStore();

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  const fetchFeedPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.POSTS_ALL}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPosts(data.response || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeedPosts();
    setRefreshing(false);
  };

  const onCommentPress = (post: Post) => {
    if (userData?.role === USER_ROLES.FARMER) {
      Alert.alert('Info', 'Only experts can comment on posts');
      return;
    }
    setSelectedPost(post);
    setModalVisible(true);
  };

  const handleLikePost = async (postId: string) => {
    try {
      const cleanedToken = userData?.token?.replace(/"/g, '');
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.POSTS_LIKE}/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': cleanedToken || '',
        },
        body: JSON.stringify({ userId: userData?.id }),
      });

      if (response.ok) {
        // Update local state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likeCount: post.likeCount + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !selectedPost) return;

    try {
      // Simulate comment submission
      Alert.alert('Success', 'Comment submitted successfully');
      setCommentText('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to submit comment');
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard 
      post={item} 
      onLike={() => handleLikePost(item.id)}
      onComment={() => onCommentPress(item)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading community posts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={moderateScale(64)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptySubtitle}>
              Be the first to share your farming experience with the community
            </Text>
          </View>
        }
      />

      {/* Comment Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={moderateScale(24)} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.postPreview}>
              <Text style={styles.postContent} numberOfLines={2}>
                {selectedPost?.content}
              </Text>
            </View>

            <View style={styles.commentSection}>
              {selectedPost?.comments?.map((comment, index) => (
                <View key={index} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUsername}>{comment.user.name}</Text>
                    {comment.user.role === USER_ROLES.EXPERT && (
                      <View style={styles.expertBadge}>
                        <Text style={styles.expertBadgeText}>Expert</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.commentInputContainer}>
              <TextInput
                placeholder="Add a comment..."
                placeholderTextColor={colors.textSecondary}
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitComment}
              >
                <Text style={styles.submitButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  return (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image
          source={{
            uri: post.farmer.image || 'https://avatar.iran.liara.run/public/23',
          }}
          style={styles.profilePic}
        />
        <View style={styles.postHeaderText}>
          <Text style={styles.farmerName}>{post.farmer.name}</Text>
          <Text style={styles.postTime}>
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={moderateScale(20)} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.postContentContainer}>
        <Text style={styles.postText}>{post.content}</Text>
      </View>

      {/* Post Image */}
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <LinearGradient
            colors={[colors.error, colors.errorLight]}
            style={styles.actionGradient}
          >
            <Ionicons name="heart" size={moderateScale(18)} color={colors.textInverse} />
          </LinearGradient>
          <Text style={styles.actionText}>{post.likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <LinearGradient
            colors={[colors.info, colors.infoLight]}
            style={styles.actionGradient}
          >
            <Ionicons name="chatbubble" size={moderateScale(18)} color={colors.textInverse} />
          </LinearGradient>
          <Text style={styles.actionText}>{post.comments?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={[colors.success, colors.successLight]}
            style={styles.actionGradient}
          >
            <Ionicons name="share-social" size={moderateScale(18)} color={colors.textInverse} />
          </LinearGradient>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  listContent: {
    paddingVertical: verticalScale(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(80),
    paddingHorizontal: horizontalScale(32),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  postCard: {
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(16),
    marginVertical: verticalScale(8),
    borderRadius: moderateScale(16),
    padding: horizontalScale(16),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  profilePic: {
    width: horizontalScale(44),
    height: horizontalScale(44),
    borderRadius: horizontalScale(22),
    marginRight: horizontalScale(12),
  },
  postHeaderText: {
    flex: 1,
  },
  farmerName: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(2),
  },
  postTime: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  moreButton: {
    padding: horizontalScale(4),
  },
  postContentContainer: {
    marginBottom: verticalScale(12),
  },
  postText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: moderateScale(20),
  },
  postImage: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  actionGradient: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    marginRight: horizontalScale(6),
  },
  actionText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    maxHeight: height * 0.8,
    paddingBottom: verticalScale(40),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: horizontalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  closeButton: {
    padding: horizontalScale(4),
  },
  postPreview: {
    padding: horizontalScale(20),
    backgroundColor: colors.backgroundSecondary,
  },
  postContent: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
  },
  commentSection: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(16),
  },
  commentItem: {
    marginBottom: verticalScale(16),
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  commentUsername: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginRight: horizontalScale(8),
  },
  expertBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
  },
  expertBadgeText: {
    fontSize: moderateScale(9),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
  },
  commentText: {
    fontSize: moderateScale(13),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: moderateScale(18),
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    marginRight: horizontalScale(8),
    maxHeight: verticalScale(80),
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
  },
  submitButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
  },
});

export default FeedScreen;