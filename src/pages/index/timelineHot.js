import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';
import instance from '../../components/axios';
import Card from '../../components/Card';
import userContext from '../../context/userContext';
import dataFetchReducer from './reducer';
import RefreshFab from './RefreshFab';

const offsetBase = 20;

const useDataApi = (initialUrl, initialData) => {
  const context = useContext(userContext);
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    offsetCount: 0,
    latestPostTime: 0,
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
            dispatch({ type: 'FETCH_INCROFFSET' });
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
            case 400:
            case 401:
            case 403:
              context.setShowMsgBar('fail', err.response.data.msg);
              break;
            case 500:
            case 502:
              context.setShowMsgBar('fail', '服务器发生错误，请稍后再试。');
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

export default function TimelineHot() {
  const [{
    data,
    // isLoading,
    // isError,
    latestPostTime,
    offsetCount,
    hasMore,
  }, doFetch] = useDataApi(
    'getPostHot?offset=0',
    [],
  );

  function latestPostUrl() {
    return `getPostHot?time=${latestPostTime}?rand=${Math.random()}`;
  }

  function nextPageUrl() {
    return `getPostHot?offset=${offsetCount * offsetBase}`;
  }

  return (
    <div>
      <RefreshFab fetchNewData={() => doFetch(latestPostUrl)} />

      {/* {isError && <div>发生错误</div>} */}
      {/* {isLoading && <LinearProgress />} */}
      <InfiniteScroll
        pageStart={0}
        loadMore={() => doFetch(nextPageUrl)}
        hasMore={hasMore}
        threshold={200}
        loader={<div style={{ textAlign: 'center', marginTop: 10 }} key={0}><CircularProgress /></div>}
      >
        {data && (
          data.map(post => (
            <Card
              key={post.postId}
              data={post}
            />
          ))
        )}
      </InfiniteScroll>
    </div>
  );
}
