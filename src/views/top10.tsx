'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// icons
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import ShareAltOutlined from '@ant-design/icons/ShareAltOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

// project imports
import MainCard from 'components/MainCard';
import ContentPicker, { type SelectedContent } from 'components/ContentPicker';

// ==============================|| TOP 10S PAGE ||============================== //

interface ListItem {
  rank: number;
  movieId?: number;
  title?: string;
  posterUrl?: string;
  contentType?: 'movie' | 'tv-show';
}

interface Top10List {
  id: number;
  title: string;
  createdAt: string;
  type: string;
  description?: string;
  items: ListItem[];
}

export default function Top10Page() {
  const { status } = useSession();
  const [lists, setLists] = useState<Top10List[]>([]);
  const [selectedList, setSelectedList] = useState<Top10List | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<Top10List | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<number | null>(null);

  // Fetch lists from the API
  useEffect(() => {
    async function fetchLists() {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/lists');

        if (!response.ok) {
          throw new Error('Failed to fetch lists');
        }

        const result = await response.json();
        setLists(result.data || []);
      } catch (err: any) {
        console.error('Error fetching lists:', err);
        setError(err.message || 'Failed to load lists');
      } finally {
        setLoading(false);
      }
    }

    fetchLists();
  }, [status]);

  const handleCreateNewList = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setListName('');
    setListDescription('');
  };

  const handleCreateList = async () => {
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: listName,
          type: 'mixed',
          description: listDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const result = await response.json();
      const newList: Top10List = {
        id: result.data.id,
        title: result.data.title,
        createdAt: result.data.createdAt,
        type: result.data.type,
        description: result.data.description,
        items: Array.from({ length: 10 }, (_, i) => ({ rank: i + 1 }))
      };

      setLists([newList, ...lists]);
      handleCloseDialog();

      // Immediately open the newly created list
      setSelectedList(newList);
    } catch (err: any) {
      console.error('Error creating list:', err);
      setError(err.message || 'Failed to create list');
    }
  };

  const handleListClick = async (list: Top10List) => {
    try {
      // Fetch the full list with items
      const response = await fetch(`/api/lists/${list.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch list details');
      }

      const result = await response.json();
      setSelectedList(result.data);
    } catch (err: any) {
      console.error('Error fetching list details:', err);
      setError(err.message || 'Failed to load list details');
    }
  };

  const handleBackToDashboard = async () => {
    // Refresh the lists to update item counts
    try {
      const response = await fetch('/api/lists');
      if (response.ok) {
        const result = await response.json();
        setLists(result.data || []);
      }
    } catch (err) {
      console.error('Error refreshing lists:', err);
    }
    setSelectedList(null);
  };

  const handleShareList = () => {
    setOpenShareDialog(true);
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };

  const handleDeleteClick = (list: Top10List, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent card click when clicking delete
    }
    setListToDelete(list);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setListToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!listToDelete) return;

    try {
      const response = await fetch(`/api/lists/${listToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      // Remove from local state
      setLists(lists.filter((l) => l.id !== listToDelete.id));

      // If we're viewing this list, go back to dashboard
      if (selectedList && selectedList.id === listToDelete.id) {
        setSelectedList(null);
      }

      handleCloseDeleteConfirm();
    } catch (err: any) {
      console.error('Error deleting list:', err);
      setError(err.message || 'Failed to delete list');
      handleCloseDeleteConfirm();
    }
  };

  const handleAddItemClick = (rank: number) => {
    setSelectedRank(rank);
    setPickerOpen(true);
  };

  const handleCloseContentPicker = () => {
    setPickerOpen(false);
    setSelectedRank(null);
  };

  const handleSelectContent = async (content: SelectedContent) => {
    if (!selectedList || selectedRank === null) return;

    try {
      const response = await fetch(`/api/lists/${selectedList.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rank: selectedRank,
          contentId: content.id,
          contentType: content.type,
          title: content.title,
          posterUrl: content.posterUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      // Refresh the list to get updated items
      const listResponse = await fetch(`/api/lists/${selectedList.id}`);
      if (listResponse.ok) {
        const result = await listResponse.json();
        setSelectedList(result.data);
      }
    } catch (err: any) {
      console.error('Error adding item:', err);
      setError(err.message || 'Failed to add item');
    }
  };

  const handleRemoveItem = async (rank: number) => {
    if (!selectedList) return;

    try {
      const response = await fetch(
        `/api/lists/${selectedList.id}/items?rank=${rank}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Update the list locally
      const updatedItems = selectedList.items.map((item) =>
        item.rank === rank ? { rank: item.rank } : item
      );

      setSelectedList({
        ...selectedList,
        items: updatedItems
      });
    } catch (err: any) {
      console.error('Error removing item:', err);
      setError(err.message || 'Failed to remove item');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // Check if user is authenticated
  if (status === 'unauthenticated') {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5">
          Please sign in to view your Top 10s
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', p: 3 }}>
      <MainCard
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {selectedList ? (
          /* Detailed List View */
          <Box>
            {/* Back Button and Share Button */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Button
                startIcon={<LeftOutlined />}
                onClick={handleBackToDashboard}
              >
                Save and Return to Dashboard
              </Button>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(selectedList)}
                >
                  Delete List
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ShareAltOutlined />}
                  onClick={handleShareList}
                >
                  Share Your List
                </Button>
              </Stack>
            </Stack>

            {/* List Title and Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h2" gutterBottom>
                {selectedList.title}
              </Typography>
              {selectedList.description && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {selectedList.description}
                </Typography>
              )}
              <Stack direction="row" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Type:{' '}
                  {selectedList.type.charAt(0).toUpperCase() +
                    selectedList.type.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created:{' '}
                  {new Date(selectedList.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Ranking List */}
            <Stack spacing={2}>
              {selectedList.items.map((item) => (
                <Card
                  key={item.rank}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    transition: 'box-shadow 0.2s',
                    cursor: item.movieId ? 'default' : 'pointer',
                    '&:hover': {
                      boxShadow: 4
                    }
                  }}
                  onClick={() => !item.movieId && handleAddItemClick(item.rank)}
                >
                  {/* Rank Number */}
                  <Box
                    sx={{
                      minWidth: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: 2,
                      mr: 3
                    }}
                  >
                    <Typography variant="h3">{item.rank}</Typography>
                  </Box>

                  {/* Movie/Show Content */}
                  {item.movieId ? (
                    <>
                      <Box
                        sx={{
                          width: 80,
                          height: 120,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          mr: 2,
                          backgroundImage: item.posterUrl
                            ? `url(${item.posterUrl})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5">{item.title}</Typography>
                        {item.contentType && (
                          <Typography variant="caption" color="text.secondary">
                            {item.contentType === 'movie' ? 'Movie' : 'TV Show'}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddItemClick(item.rank);
                          }}
                        >
                          Change
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item.rank);
                          }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </>
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 120,
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Click to add a movie or TV show
                      </Typography>
                    </Box>
                  )}
                </Card>
              ))}
            </Stack>
          </Box>
        ) : (
          /* Dashboard View */
          <>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h2" gutterBottom>
                Top 10s Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Rank your top 10 favorite movies or TV shows and share them with
                others!
              </Typography>

              {/* Create New List Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<PlusOutlined />}
                onClick={handleCreateNewList}
                sx={{ mt: 2, mb: 3 }}
              >
                Create New List
              </Button>

              {/* Divider */}
              <Typography variant="h4" sx={{ mb: 2 }}>
                Your Lists
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Box>

            {/* Lists Section */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {lists.length > 0 ? (
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{
                    overflowX: 'auto',
                    pb: 2,
                    '&::-webkit-scrollbar': {
                      height: '12px'
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'background.paper'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#424242',
                      borderRadius: '6px',
                      '&:hover': {
                        backgroundColor: '#303030'
                      }
                    }
                  }}
                >
                  {lists.map((list) => (
                    <Card
                      key={list.id}
                      onClick={() => handleListClick(list)}
                      sx={{
                        minWidth: 280,
                        maxWidth: 280,
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <IconButton
                        onClick={(e) => handleDeleteClick(list, e)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: 'error.lighter'
                          }
                        }}
                        size="small"
                      >
                        <DeleteOutlined />
                      </IconButton>
                      <CardContent>
                        <Typography variant="h5" gutterBottom sx={{ pr: 4 }}>
                          {list.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {(list as any).itemCount || 0} / 10 items
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Created:{' '}
                          {new Date(list.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    No lists yet. Create your first Top 10 list!
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </MainCard>

      {/* Create New List Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h3">Create New List</Typography>
            <Button
              onClick={handleCloseDialog}
              sx={{ minWidth: 'auto', p: 1 }}
              color="inherit"
            >
              <CloseOutlined />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* List Name */}
            <TextField
              label="List Name"
              placeholder="e.g., My Favorite Action Movies"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              fullWidth
              required
            />

            {/* Description */}
            <TextField
              label="Description (Optional)"
              placeholder="Brief description of your list..."
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            {/* Max Items Info */}
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                You can add up to 10 items to your list. You&apos;ll be able to
                rank and reorder them after creation.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" size="large">
            Cancel
          </Button>
          <Button
            onClick={handleCreateList}
            variant="contained"
            size="large"
            disabled={!listName}
          >
            Create List
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share List Dialog */}
      <Dialog
        open={openShareDialog}
        onClose={handleCloseShareDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h3">Share Your List</Typography>
            <Button
              onClick={handleCloseShareDialog}
              sx={{ minWidth: 'auto', p: 1 }}
              color="inherit"
            >
              <CloseOutlined />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedList && (
            <Box
              sx={{
                bgcolor: 'background.paper',
                p: 2.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              {/* List Header */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" gutterBottom>
                  {selectedList.title}
                </Typography>
                {selectedList.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {selectedList.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Created:{' '}
                  {new Date(selectedList.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Compact List - 2 columns */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1.5
                }}
              >
                {selectedList.items.map((item) => (
                  <Box
                    key={item.rank}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      bgcolor: 'action.hover',
                      borderRadius: 1
                    }}
                  >
                    {/* Rank Number */}
                    <Box
                      sx={{
                        minWidth: 35,
                        height: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        borderRadius: 1,
                        mr: 1.5
                      }}
                    >
                      <Typography variant="h6">{item.rank}</Typography>
                    </Box>

                    {/* Movie/Show Info */}
                    {item.movieId ? (
                      <>
                        <Box
                          sx={{
                            width: 40,
                            height: 60,
                            bgcolor: 'action.disabled',
                            borderRadius: 1,
                            mr: 1,
                            backgroundImage: item.posterUrl
                              ? `url(${item.posterUrl})`
                              : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: '0.875rem' }}
                          >
                            {item.title}
                          </Typography>
                          {item.contentType && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: '0.7rem' }}
                            >
                              {item.contentType === 'movie'
                                ? 'Movie'
                                : 'TV Show'}
                            </Typography>
                          )}
                        </Box>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flex: 1, fontSize: '0.8rem' }}
                      >
                        Empty slot
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '0.7rem' }}
                >
                  Made with Group 5&apos;s Movie & TV Show App
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5, pt: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flex: 1, fontSize: '0.85rem' }}
          >
            Take a screenshot to share your list!
          </Typography>
          <Button
            onClick={handleCloseShareDialog}
            variant="contained"
            size="medium"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete List?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{listToDelete?.title}&quot;?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteConfirm} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content Picker Dialog */}
      {selectedList && selectedRank !== null && (
        <ContentPicker
          open={pickerOpen}
          onClose={handleCloseContentPicker}
          onSelect={handleSelectContent}
          listType={selectedList.type as 'movies' | 'tv-shows' | 'mixed'}
          currentRank={selectedRank}
        />
      )}
    </Box>
  );
}
