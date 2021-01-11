import util from 'util';
import {
  calculateDirection,
} from '@dmitry-n-medvedev/libdirectioncalculator';

const debuglog = util.debuglog('FN_HANDLE_DIRECTION');

export const handleDirection = async (res, req) => {
  res.aborted = false;

  res.onAborted(() => {
    res.aborted = true;
  });

  const heading = parseFloat(req.getQuery('heading')) ?? null;
  const target = parseFloat(req.getQuery('target')) ?? null;

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
