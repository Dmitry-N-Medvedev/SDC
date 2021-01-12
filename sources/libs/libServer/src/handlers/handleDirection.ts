import util from 'util';
import {
  calculateDirection,
} from '@dmitry-n-medvedev/libdirectioncalculator/src/calculateDirection';
import {
  QueryParameterNames,
} from '@dmitry-n-medvedev/libcommon/src/constants/QueryParameterNames';
import * as uWS from 'uWebSockets.js/index';

const debuglog = util.debuglog('FN_HANDLE_DIRECTION');

export const handleDirection = async (res:uWS.HttpResponse, req:uWS.HttpRequest) => {
  res.aborted = false;

  res.onAborted(() => {
    res.aborted = true;
  });

  // @ts-ignore TODO: wait for the uWS maintainer to ship updated index.d.ts
  const heading = parseFloat(req.getQuery(QueryParameterNames.HEADING)) ?? null;
  // @ts-ignore TODO: wait for the uWS maintainer to ship updated index.d.ts
  const target = parseFloat(req.getQuery(QueryParameterNames.TARGET)) ?? null;

  try {
    if (res.aborted === false) {
      const direction = calculateDirection(heading, target);

      res.end(JSON.stringify({
        direction,
      }));
    } else {
      debuglog(`res.aborted: ${res.aborted}`);
    }
  } catch (anyError) {
    debuglog('ER:', anyError.message);

    if (res.aborted === false) {
      res.writeStatus(`400 ${anyError.message}`);
      res.end();
    }
  }
};
