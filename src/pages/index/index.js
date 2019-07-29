import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import instance from '../../components/axios';
import Card from '../../components/Card';
import userContext from '../../context/userContext';
import RefreshFab from './RefreshFab';

const offsetBase = 20;
let offsetCount = 1;
let latestPostTime = 0;

let fetchPostLock = false;

const dataFetchReducer = (state, action) => {
  let data;
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      data = action.payload;
      data = state.data
        // 合并并去除重复项
        ? state.data.concat(data.filter(
          item => !(state.data.find(x => x.postId === item.postId) || false),
        ))
        : data;
      data = data.sort((a, b) => b.postTime - a.postTime);
      latestPostTime = data[0].postTime;
      sessionStorage.setItem('postList', JSON.stringify(data.slice(0, 20)));
      fetchPostLock = false; // 解除分页刷新限制

      return {
        ...state,
        isLoading: false,
        isError: false,
        data,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const useDataApi = (initialUrl, initialData) => {
  const context = useContext(userContext);
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let unmounted = false; // 防止组件卸载后，仍处理网络请求

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await instance.get(url);

        if (!unmounted) {
          if (result.data.length === 0) {
            context.setShowMsgBar('default', '没有更多帖子了');
            return;
          }
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!unmounted) {
          context.setShowMsgBar('fail', '网络错误');
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      unmounted = true;
    };
  }, [url]);

  return [state, setUrl];
};

export default function MainPage() {
  let initData = sessionStorage.getItem('postList');
  if (initData) {
    initData = JSON.parse(initData);
  } else {
    initData = [];
  }

  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'getPost?offset=0',
    initData,
  );

  window.onscroll = () => {
    if (((window.innerHeight + window.scrollY) > document.body.offsetHeight) && !fetchPostLock) {
      fetchPostLock = true;
      doFetch(`getPost?offset=${offsetCount * offsetBase}`);
      offsetCount += 1;
    }
  };
  useEffect(() => {
    // no action
    return () => {
      window.onscroll = null;
    };
  }, []);

  return (
    <div style={{ marginBottom: '56px' }} id="container">
      <RefreshFab fetchNewData={() => doFetch(`getPost?time=${++latestPostTime}`)} />

      {isError && <div>发生错误</div>}

      {isLoading && <LinearProgress />}
      {data && (
        data.map(post => (
          <Card
            key={post.postId}
            userId={post.userId}
            postId={post.postId}
            nickName={post.nickName}
            sectionName={post.sectionName}
            title={post.title}
            content={post.content}
            imgNum={post.imgNum}
            commentCount={post.commentCount}
            viewNum={post.views}
            postTime={`${post.postTime}000`} // MySQL里的时间戳是秒, JS中的是毫秒
          />
        ))
      )}
    </div>
  );
}
