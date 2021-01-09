import {
  AsyncLocalStorage,
} from 'async_hooks';
import {
  calculateDirection,
} from '@dmitry-n-medvedev/libdirectioncalculator';

const als = new AsyncLocalStorage();

const calc = async () => {
  const heading = als.getStore().get('heading') ?? null;
  const target = als.getStore().get('target') ?? null;

  return calculateDirection(heading, target);
};

export const handleDirection = async (res, req) => {
  als.run(new Map(), async () => {
    res.aborted = false;

    res.onAborted(() => {
      res.aborted = true;
    });

    try {
      const heading = parseFloat(req.getQuery('heading')) ?? null;
      const target = parseFloat(req.getQuery('target')) ?? null;

      als.getStore()
        .set('heading', heading)
        .set('target', target);

      if (res.aborted === false) {
        res.end(JSON.stringify({
          direction: (await calc()),
        }));
      }
    } catch (anyError) {
      if (res.aborted === false) {
        res.writeStatus(`400 ${anyError.message}`);
        res.end();
      }
    }
  });
};
