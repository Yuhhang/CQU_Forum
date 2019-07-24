import React, { useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import WarningIcon from '@material-ui/icons/Warning';
import instance from './axios';
import userContext from '../context/userContext';

export default function CardMenu({ postId, userName, userId }) {
  const context = useContext(userContext);
  const { userState } = context;

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  // function handleCollect() {

  // }

  // function handleReport() {

  // }

  function handleDelete() {
    instance.post('deletePost/', {
      userId,
      postId,
    })
      .then((res) => {
        if (res.data.status === 'success') {
          context.setShowMsgBar('success', '删帖成功');
          sessionStorage.removeItem('postList');
          sessionStorage.removeItem('currentPostInfo');
          window.location.reload();
        } else {
          context.setShowMsgBar('error', res.data.msg);
        }
      })
      .catch(() => {
        // handle error
        context.setShowMsgBar('error', '发生错误');
      });
  }
  const menuId = `post-menu${postId}`;
  const deletePrivilege = (userState.userName === userName)
    || (userState.auth.mode === 'superAdmin');
  return (
    <div>
      <IconButton
        aria-controls={menuId}
        aria-haspopup="true"
        disabled={!userState.isLoggedIn}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <IconButton color="default">
            <BookmarkIcon />
          </IconButton>
          收藏
        </MenuItem>
        {/* <MenuItem>
          <IconButton color="default">
            <VisibilityOffIcon />
          </IconButton>
          屏蔽
        </MenuItem> */}
        <MenuItem>
          <IconButton color="default">
            <WarningIcon />
          </IconButton>
          举报
        </MenuItem>
        {deletePrivilege && (
          <MenuItem onClick={handleDelete}>
            <IconButton color="secondary">
              <DeleteForeverIcon />
            </IconButton>
            删除
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
