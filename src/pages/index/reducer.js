export default function (state, action) {
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
      sessionStorage.setItem('postList', JSON.stringify(data.slice(0, 20)));

      return {
        ...state,
        isLoading: false,
        isError: false,
        latestPostTime: data[0].postTime,
        data,
      };
    case 'FETCH_INCROFFSET':
      return {
        ...state,
        offsetCount: state.offsetCount + 1,
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
}
