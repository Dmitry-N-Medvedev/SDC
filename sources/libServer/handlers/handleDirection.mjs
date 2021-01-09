import {
  calculateDirection,
} from '@dmitry-n-medvedev/libdirectioncalculator';

export const handleDirection = async (res, req) => {
  res.aborted = false;

  res.onAborted(() => {
    res.aborted = true;
  });

  const heading = parseFloat(req.getQuery('heading')) ?? null;
  const target = parseFloat(req.getQuery('target')) ?? null;

  try {
    if (res.aborted === false) {
      res.end(JSON.stringify({
        direction: calculateDirection(heading, target),
      }));
    }
  } catch (anyError) {
    if (res.aborted === false) {
      res.writeStatus(`400 ${anyError.message}`);
      res.end();
    }
  }
};
