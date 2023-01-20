import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [deadlineFunc, setDeadlineFunc] = useState<Function>();

  function toggle(func) {
    setIsActive(!isActive);
    setDeadlineFunc(func);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
    setDeadlineFunc(null);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      if (interval === 0) {
        if (deadlineFunc) {
          deadlineFunc();
        }
        reset();
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return <div>{seconds}</div>;
};

export default Timer;
