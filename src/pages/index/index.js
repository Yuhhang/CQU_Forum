import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
// import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';
import instance from '../../components/axios';
import Card from '../../components/Card';
import userContext from '../../context/userContext';
import RefreshFab from './RefreshFab';

const offsetBase = 20;
let offsetCount = 0;
let latestPostTime = 0;

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

      return {
        ...state,
        isLoading: false,
        isError: false,
        data,
      };
    case 'FETCH_NONEWDATA':
      return {
        ...state,
        isLoading: false,
      };
    case 'FETCH_NODATA':
      return {
        ...state,
        hasMore: false,
        isLoading: false,
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
    hasMore: true,
    data: initialData,
  });

  useEffect(() => {
    let unmounted = false; // 防止组件卸载后，仍处理网络请求

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await instance.get(url);

        if (!unmounted) {
          if (url.search('offset') !== -1) {
            offsetCount++;
          }
          if (result.data.length === 0) {
            if (url.search('offset') !== -1) {
              dispatch({ type: 'FETCH_NODATA' });
            } else {
              dispatch({ type: 'FETCH_NONEWDATA' });
            }
            context.setShowMsgBar('default', '没有更多帖子了');
            return;
          }
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (err) {
        if (!unmounted) {
          switch (err.response.status) {
            case 401:
              context.setShowMsgBar('fail', err.response.data.msg);
              break;
            case 403:
              context.setShowMsgBar('fail', err.response.data.msg);
              break;
            case 500:
              context.setShowMsgBar('fail', '服务器发生错误，请稍后再试。');
              break;
            case 502:
              context.setShowMsgBar('fail', '服务器无响应，请稍后再试。');
              break;
            default:
              context.setShowMsgBar('fail', `发生错误${err.response.status}`);
              break;
          }
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

  const [{
    data, isLoading, isError, hasMore,
  }, doFetch] = useDataApi(
    'getPost?offset=0',
    initData,
  );

  return (
    <div>
      <RefreshFab fetchNewData={() => doFetch(`getPost?time=${++latestPostTime}`)} />

      {isError && <div>发生错误</div>}

      {/* {isLoading && <LinearProgress />} */}
      <InfiniteScroll
        pageStart={0}
        loadMore={() => doFetch(`getPost?offset=${offsetCount * offsetBase}`)}
        hasMore={hasMore}
        loader={<div style={{ textAlign: 'center', marginTop: 10 }} key={0}><CircularProgress /></div>}
      >
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
              anonymous={post.anonymous}
              postTime={`${post.postTime}000`} // MySQL里的时间戳是秒, JS中的是毫秒
            />
          ))
        )}
      </InfiniteScroll>
    </div>
  );
}
