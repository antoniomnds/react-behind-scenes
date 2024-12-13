import { useState, useCallback, useMemo } from 'react';

import IconButton from '../UI/IconButton.jsx';
import MinusIcon from '../UI/Icons/MinusIcon.jsx';
import PlusIcon from '../UI/Icons/PlusIcon.jsx';
import CounterOutput from './CounterOutput.jsx';
import { log } from '../../log.js';
import CounterHistory from "./CounterHistory.jsx";

function isPrime(number) {
  log(
    'Calculating if is prime number',
    2,
    'other'
  );
  if (number <= 1) {
    return false;
  }

  const limit = Math.sqrt(number);

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

/*
The reason why the initialCount prop does not update the component is because the useState hook
only uses the prop value for the initial state. Any subsequent changes to the prop value will
be ignored after the first render. This is because the state, once set, is persisted across the
lifetime of the component (until we remove that component from our screen).
The component can re-render as many times as it wants but the state value will be persisted,
and consequently any changes to that prop value will not be taken into account.

To update the component when the initialCount changes, the key prop should be used when
calling this component so React un-mount and mounts the component in every initialCount change.
 */
export default function Counter({ initialCount }) {
  log('<Counter /> rendered', 1);

  // initialCount only changes when the set button is clicked. Re-executions can be avoided when the counter changes
  const initialCountIsPrime = useMemo(() => isPrime(initialCount), [initialCount]);

  // const [counter, setCounter] = useState(initialCount);
  const [counterChanges, setCounterChanges] = useState([{
    id: Math.random() * 1000,
    value: initialCount
  }]);

  const currentCounter = counterChanges.reduce(
    (prevCounter, counterChange) => prevCounter + counterChange.value, 0);

  // useCallback used together with memo in the IconButton will avoid unnecessary re-executions
  const handleDecrement = useCallback(function handleDecrement() {
    // setCounter((prevCounter) => prevCounter - 1);
    setCounterChanges(prevCounterChanges => [
      {
        id: Math.random() * 1000,
        value: -1
      },
      ...prevCounterChanges
    ]);
  }, []);

  const handleIncrement = useCallback(function handleIncrement() {
    // setCounter((prevCounter) => prevCounter + 1);
    setCounterChanges(prevCounterChanges => [
      {
        id: Math.random() * 1000,
        value: 1
      },
      ...prevCounterChanges
    ]);
  }, []);

  return (
    <section className="counter">
      <p className="counter-info">
        The initial counter value was <strong>{initialCount}</strong>. It{' '}
        <strong>is {initialCountIsPrime ? 'a' : 'not a'}</strong> prime number.
      </p>
      <p>
        <IconButton icon={MinusIcon} onClick={handleDecrement}>
          Decrement
        </IconButton>
        <CounterOutput value={currentCounter} />
        <IconButton icon={PlusIcon} onClick={handleIncrement}>
          Increment
        </IconButton>
      </p>
      <CounterHistory history={counterChanges} />
    </section>
  );
}
