import React, { useContext, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import WarningIcon from '@material-ui/icons/Warning';
import instance from './axios';
import userContext from '../context/userContext';

export default function CardMenu(props) {
  const {
    postId,
    userName,
    userId,
  } = props;
  const context = useContext(userContext);
  const { userState } = context;

  const [anchorEl, setAnchorEl] = useState(null);
  const [collected, setCollected] = useState(Boolean(props.collected));

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleCollect() {
    instance.post('addCollect/', {
      postId,
      cancel: collected,
    })
      .then((res) => {
        if (res.data.status === 'success') {
          context.setShowMsgBar('success', res.data.msg);
        } else {
          context.setShowMsgBar('error', res.data.msg);
        }
        setCollected(!collected);
      })
      .catch(() => {
        context.setShowMsgBar('error', '发生错误');
      });
  }

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
        <MenuItem onClick={handleCollect}>
          <IconButton color="default">
            {collected ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
          {collected ? '取消收藏' : '收藏'}
        </MenuItem>
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
