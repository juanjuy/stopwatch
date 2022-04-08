class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindClickStartStop(this.handleStart.bind(this), this.handleStop.bind(this));
    this.model.bindTimeChanged(this.onTimeChanged.bind(this));
    this.view.bindClickReset(this.handleReset.bind(this));
  }

  onTimeChanged(timeObj) {
    this.view.updateTime(timeObj);
  }

  handleStart() {
    this.model.startWatch();
  }

  handleStop() {
    this.model.stopWatch();
  }

  handleReset() {
    this.model.reset();
  }
}

class Model {
  constructor() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.centiseconds = 0;
    this.intervalId;
  }

  startWatch() {
    this.intervalId = setInterval(() => {
      this.centiseconds++;

      if (this.centiseconds > 99) {
        this.seconds++;
        this.centiseconds = 0;
      }

      if (this.seconds > 59) {
        this.minutes++;
        this.seconds = 0;
      }

      if (this.minutes > 59) {
        this.hours++;
        this.minutes = 0;
      }

      if (this.hours > 99) {
        this.stopWatch();
      }

      this.timeChanged( {
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds,
        centiseconds: this.centiseconds
      });
    }, 10)
  }

  stopWatch() {
    clearInterval(this.intervalId);
  }

  reset() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.centiseconds = 0;
    this.stopWatch();
    this.timeChanged( {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      centiseconds: this.centiseconds
    })
  }

  bindTimeChanged(callback) {
    this.timeChanged = callback;
  }
}

class View {
  constructor() {
    this.$hours = $('#hours');
    this.$minutes = $('#minutes');
    this.$seconds = $('#seconds');
    this.$centiseconds = $('#centiseconds');
    this.$startStop = $('#start-stop');
    this.$reset = $('#reset');
  }

  updateTime( { hours, minutes, seconds, centiseconds } ) {
    this.$hours.text(this.convertToString(hours));
    this.$minutes.text(this.convertToString(minutes));
    this.$seconds.text(this.convertToString(seconds));
    this.$centiseconds.text(this.convertToString(centiseconds));
  }

  convertToString(num) {
    if (String(num).length === 1) {
      return '0' + String(num);
    } else {
      return num;
    }
  }

  bindClickStartStop(startHandler, stopHandler) {
    this.$startStop.on('mousedown', event => {
      if (this.$startStop.text() === 'Start') {
        this.$startStop.text('Stop')
        startHandler();
      } else if (this.$startStop.text() === 'Stop') {
        this.$startStop.text('Start');
        stopHandler();
      }
    })
  }

  bindClickReset(handler) {
    this.$reset.on('mousedown', event => {
      this.$startStop.text('Start');
      handler();
    })
  }
}

$(function() {
  const app = new Controller(new Model(), new View());
})