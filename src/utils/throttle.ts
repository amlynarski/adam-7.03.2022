export const throttle = (callback: Function, limit: number) => {
  // todo remove lodash or keep this
  let waiting = false;

  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
};
