import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import PhotoIcon from '@material-ui/icons/PhotoOutlined';
import CommentIcon from '@material-ui/icons/Comment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import ImgDisplay from './ImgDisplay';
import RelativeTime from './RelativeTime';
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
  avatarSmall: {
    backgroundColor: red[500],
    width: '25px',
    height: '25px',
  },
  chip: {
    height: '20px',
    fontSize: '0.7rem',
    borderRadius: '3px',
  },
}));

export default function PostCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const {
    postId,
    sectionName,
    title,
    content,
    imgNum,
    postTime,
    userName,
    // viewNum,
    commentCount,
    inSection,
  } = props;
  const cardTitle = <Chip className={classes.chip} label={sectionName} />;
  const userNameDot = userName.concat(' • ');
  const cardSubTitle = (
    <div className={classes.subTitle}>
      <AlternateEmailIcon fontSize="small" style={{ verticalAlign: 'middle' }} />
      {userNameDot}
      <RelativeTime postTime={postTime} />
    </div>
  );
  function handleExpandClick() {
    setExpanded(!expanded);
  }

  function Header() {
    if (inSection === undefined) {
      return (
        <CardHeader
          className={classes.cardHeader}
          avatar={(
            <Avatar className={classes.avatar}>
              {userName[0]}
            </Avatar>
          )}
          action={(
            <IconButton aria-label="Settings" disabled>
              <MoreVertIcon />
            </IconButton>
          )}
          title={cardTitle}
          subheader={cardSubTitle}
        />
      );
    }
    return (
      <CardHeader
        className={classes.cardHeader}
        avatar={(
          <Avatar className={classes.avatarSmall}>
            {userName[0]}
          </Avatar>
        )}
        action={(
          <IconButton aria-label="Settings" disabled>
            <MoreVertIcon />
          </IconButton>
        )}
        subheader={cardSubTitle}
      />
    );
  }

  return (
  // <Slide direction="left" in mountOnEnter unmountOnExit>
    <Card className={classes.card}>
      <Header />
      <Link to={'/post/'.concat(postId)} style={{ textDecoration: 'none' }}>
        <ButtonBase
          className={classes.cardContentButton}
          onClick={() => {
            sessionStorage.setItem('currentPostInfo', JSON.stringify(props));
          }}
        >
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" color="textPrimary">
              {title}
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
      </Link>
      <CardActions disableSpacing className={classes.cardAction}>
        <IconButton aria-label="views" disableRipple>
          <CommentIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="textSecondary" component="p">
          {/* {viewNum} */}
          {commentCount}
        </Typography>
        <IconButton aria-label="Share" disabled>
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
  // </Slide>
  );
}
