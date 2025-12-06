'use client';

// material-ui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// icons
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';

// ==============================|| DELETE CONFIRMATION MODAL ||============================== //

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  itemName: string;
  itemType: 'movie' | 'tv-show';
}

export default function DeleteConfirmationModal({ open, onClose, title, itemName, itemType }: DeleteConfirmationModalProps) {
  // DESIGN-ONLY: Prevent any delete action
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Do nothing - this is design-only
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningOutlined style={{ color: '#ff9800', fontSize: '1.5rem' }} />
          <Typography variant="h5">Confirm Deletion</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this {itemType === 'movie' ? 'movie' : 'TV show'}?
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {itemName}
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        {/* DESIGN-ONLY: Delete button is disabled - no backend functionality */}
        <Button
          onClick={handleDeleteClick}
          variant="contained"
          color="error"
          startIcon={<DeleteOutlined />}
          disabled
          sx={{
            '&.Mui-disabled': {
              backgroundColor: 'action.disabledBackground',
              color: 'action.disabled'
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

