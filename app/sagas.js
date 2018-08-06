import { call, put, takeLatest } from 'redux-saga/effects';

function feedFetchApi(board) {
  const session = PDK.getSession()
  if (!session) {
    return new Promise((resolve, reject) => {
      reject("Unauthorized")
    });
  }
  return fetch(`/api/fetch/${board}?access_token=${session.accessToken}`).then(res => res.json())
}

function* feedPin(action) {
  try {
    const data = yield call(feedFetchApi, "janew/delicious");
    if (data.pins) {
      yield put({ type: "FEED_LOAD_SUCCEED", pins: data.pins });
    } else {
      yield put({ type: "FEED_LOAD_FAILED", err: data.err });
    }
  } catch (e) {
    yield put({ type: "FEED_LOAD_FAILED", err: e });
  }
}

//const { isAuthenticated } = this.props;

export default function* root() {
  yield takeLatest(["FEED_LOAD_REQUESTED", "USER_AUTH_SUCCEEDED"], feedPin);
}

