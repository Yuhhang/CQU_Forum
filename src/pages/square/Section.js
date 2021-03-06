import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import instance from '../../components/axios';
import Card from '../../components/Card';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(3, 2),
    margin: 'auto',
    // backgroundColor: theme.,
    // display: 'flex',
    alignItems: 'center',
    maxWidth: '500px',
  },
  avatarGrid: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    margin: 'auto',
    width: '50px',
    height: '50px',
  },
}));

export default function PaperSheet(props) {
  // const context = useContext(userContext); // global user context
  const [posts, setPosts] = useState(null);
  const [sectionInfo, setSectionInfo] = useState(null);

  const { match } = props;
  const { params } = match;
  const { id } = params;

  const classes = useStyles();
  // useEffect(() => {
  //   context.setShowBackButton(() => {
  //     props.history.goBack();
  //   });
  // }, []);
  useEffect(() => {
    instance.get('/getPostBySection?id='.concat(id))
      .then((res) => {
        if (!res.data[0]) {
          setPosts('暂无发帖');
          return;
        }
        const data = res.data.sort((a, b) => b.postTime - a.postTime);
        const postList = data.map(post => (
          <Card
            key={post.postId}
            data={post}
            inSection
          />
        ));
        setPosts(postList);
      })
      .catch(() => {
        // handle error

      }).finally(() => {
        // setCaptchaToken('');
        // setCaptchaLoading(true);
      });
    const sectionList = JSON.parse(sessionStorage.getItem('sectionList'));
    const currentSection = sectionList.filter(section => section.section_id == id);
    setSectionInfo(currentSection[0]);
  }, []);

  return (
    <div>
      {/* <button type="button" onClick={() => { props.history.goBack(); }}>GO BACK</button> */}
      {sectionInfo
      && (
        <Paper className={classes.header}>
          <Grid container justify="center" alignContent="center">
            <Grid className={classes.avatarGrid} item xs={3}>
              <Avatar className={classes.avatar}>
                {sectionInfo.name[0]}
              </Avatar>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="h6">
                {sectionInfo.name}
              </Typography>
              <Typography variant="caption" component="p">
                {sectionInfo.msg || '暂无介绍'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
      {posts}
    </div>
  );
}
