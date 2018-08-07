let CURRENT_TIMER = null;

/**
 * Timer class
 * 
 * Manages one timer and keeps reference of next timer if it exists.
 */
class Timer {
  constructor(name, duration) {
    if (!moment.isDuration(duration)) {
      console.log('ERROR: Duration is not a moment.duration() object', duration);
      return;
    }

    // Name
    this.name = name;

    // Start time
    this.start = null;

    // Duration to timeout in seconds
    this.duration = duration;

    // Next timer
    this.next = null;
  }

  /**
   * Private method for appending a timer to the list once it is validated.
   * 
   * @param timer Timer object to append to timer chain.
   */
  _appendTimer = (timer) => {
    if (this.next !== null) {
      this.next._appendTimer(timer);
    } else {
      this.setNextTimer(timer);
    }
  }

  /**
   * Public method for appending a timer to the list. It also validates the
   * timer is an instance of Timer.
   * 
   * @param timer Timer object to append to timer chain.
   */
  appendTimer = (timer) => {
    if (!timer instanceof Timer) {
      console.log('ERROR: Cannot set next timer because next timer is not a Timer object', timer);
      return;
    }

    this._appendTimer(timer);
  }

  /**
   * Setter for this.next.
   * 
   * @param timer Timer object.
   */
  setNextTimer = (timer) => {
    this.next = timer;
  }

  /**
   * Starts the timer with setTimeout for the current timer.
   */
  start = () => {
    // Get the starting moment for the timer
    this.start = moment();

    setTimeout(() => {
      this._onTimerEnd();
    }, this.duration * 1000);
  }

  /**
   * Pause executed when global pause called.
   */
  pause = () => {

  }

  /**
   * Executed when this timer runs timeout.
   */
  _onTimerEnd = () => {
    this._notify();

    if(this.next !== null) {
      CURRENT_TIMER = this.next;
      this.next.run();
    } else {
      CURRENT_TIMER = null;
    }
  }

  /**
   * Notify executed when this timer runs timeout.
   */
  _notify = () => {
    console.log('TIMER: Done', this.name);
  }
}

const addTimer = (timer) => {
  if (CURRENT_TIMER === null) {
    CURRENT_TIMER = timer;
  } else {
    CURRENT_TIMER.appendTimer(timer);
  }
};

const createTimers = (timers) => {
  const splittedTimers = timers.split('+');

  splittedTimers.map(timer => {
    const t = timer.split(':');
    const duration = moment.duration(t[0], 'minutes');
    const name = (t.length == 2) ? t[1] : t[0] + 'm';

    addTimer(new Timer(name, duration));
  });

  console.log('Created timers:', CURRENT_TIMER);
};

const pauseTimer = () => {
  if (CURRENT_TIMER !== null) {
    CURRENT_TIMER.pause();
  }
};

const startTimer = () => {
  if (CURRENT_TIMER !== null) {
    CURRENT_TIMER.start();
  }
};