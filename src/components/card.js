import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import { red, grey } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PhotoIcon from '@material-ui/icons/PhotoOutlined';
import FaceIcon from '@material-ui/icons/Face';
import ShareIcon from '@material-ui/icons/Share';
import Clipboard from 'clipboard';
import clsx from 'clsx';
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userContext from '../context/userContext';
import CardMenu from './CardMenu';
import AtUserNameDotTime from './gadget/AtUserNameDotTime';
import ImgDisplay from './ImgDisplay';
// import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: 0,
    margin: 'auto',
    maxWidth: '500px',
  },
  cardHeader: {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  subTitle: {
    fontSize: '0.8rem',
  },
  cardContentButton: {
    width: '100%',
  },
  cardContent: {
    width: '100%',
    textAlign: 'left',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  cardContentTitle: {
    fontSize: '',
  },
  cardContentText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  expandContent: {
    paddingTop: '0px',
    whiteSpace: 'pre-wrap',
  },
  cardAction: {
    paddingTop: '0px',
    paddingBottom: '8px',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
    width: '35px',
    height: '35px',
  },
  chip: {
    height: '20px',
    fontSize: '0.7rem',
    borderRadius: '3px',
  },
}));

export default function PostCard({ data, inSection, collected }) {
  const context = useContext(userContext);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const {
    userId,
    postId,
    sectionName,
    sectionId,
    title,
    content,
    imgNum,
    nickName,
    // viewNum,
    commentCount,
    anonymous,
  } = data;
  let { postTime } = data;
  postTime = `${postTime}000`;

  useEffect(() => {
    // eslint-disable-next-line
    let clipboard = new Clipboard('.btn');
    return (() => {
      clipboard = null;
    });
  }, []);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  function handleShare() {
    context.setShowMsgBar('default', '链接已复制');
  }

  function Header() {
    // const cardTitle = <Chip className={classes.chip} label={sectionName} />;
    const cardTitle = (
      <ButtonBase
        component={Link}
        to={'/section/'.concat(sectionId)}
      >
        <Chip className={classes.chip} label={sectionName} />
      </ButtonBase>
    );
    const cardSubTitle = <AtUserNameDotTime nickName={nickName} postTime={postTime} />;
    const action = (
      <CardMenu
        postId={postId}
        userId={userId}
        userName={nickName}
        collected={collected}
      />
    );
    const avatar = (
      <Avatar
        className={classes.avatar}
        style={{ backgroundColor: anonymous && grey[500] }}
      >
        {anonymous ? <FaceIcon /> : nickName[0]}
      </Avatar>
    );
    return (
      <CardHeader
        className={classes.cardHeader}
        avatar={avatar}
        action={action}
        title={!inSection && cardTitle}
        subheader={cardSubTitle}
      />
    );
  }

  return (
    // <Slide direction="left" in mountOnEnter unmountOnExit>
    <div>
      <Card className={classes.card}>
        <Header />
        <ButtonBase
          component={Link}
          to={'/post/'.concat(postId)}
          className={classes.cardContentButton}
          onClick={() => {
            sessionStorage.setItem('currentPostInfo', JSON.stringify(data));
          }}
        >
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" color="textPrimary">
              {title}
              {/* 有照片则显示图标 */}
              {imgNum !== 0 && <PhotoIcon style={{ verticalAlign: 'sub', color: 'grey' }} />}
            </Typography>
            {!expanded
              && (
                <Typography className={classes.cardContentText} variant="body2" color="textSecondary" component="p" noWrap>
                  {content}
                </Typography>
              )}
          </CardContent>
        </ButtonBase>
        <CardActions disableSpacing className={classes.cardAction}>
          <IconButton aria-label="views" disableRipple>
            <CommentIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="textSecondary" component="p">
            {/* {viewNum} */}
            {commentCount}
          </Typography>
          <IconButton
            // eslint-disable-next-line
            className={'btn'}
            aria-label="Share"
            onClick={handleShare}
            data-clipboard-text={`${window.location.href}post/${postId}`}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.expandContent}>
            {content}
            <ImgDisplay postId={postId} imgNum={imgNum} />
          </CardContent>
        </Collapse>
      </Card>
    </div>
    // </Slide>
  );
}
