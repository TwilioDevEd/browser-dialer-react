var DTMFTone = React.createClass({
  // Handle numeric buttons
  sendDigit(digit) {
    Twilio.Device.activeConnection().sendDigits(digit);
  },

  render: function() {
    return (
      <div className="keys">
        <div className="key-row">
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('1')}>1</button>
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('2')}>2
            <span>A B C</span>
          </button>
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('3')}>3
            <span>D E F</span>
          </button>
        </div>
        <div className="key-row">
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('4')}>4
            <span>G H I</span>
          </button>
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('5')}>5
            <span>J K L</span>
          </button>
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('6')}>6
            <span>M N O</span>
          </button>
        </div>
        <div className="key-row">
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('7')}>7
            <span>P Q R S</span>
          </button>
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('8')}>8
            <span>T U V</span>
          </button>
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('9')}>9
            <span>W X Y Z</span>
          </button>
        </div>
        <div className="key-row">
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('*')}>*</button>
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('0')}>0</button>
          <button className="btn btn-circle btn-default" onClick={() => this.sendDigit('#')}>#</button>
        </div>
      </div>
    );
  }
});

var DialerApp = React.createClass({
  getInitialState() {
    return {
      muted: false,
      identity: '',
      log: 'Connecting...',
      onPhone: false,
      countryCode: '1',
      currentNumber: '',
      isValidNumber: false,
      countries: [
        { name: 'United States', cc: '1', code: 'us' },
        { name: 'Great Britain', cc: '44', code: 'gb' },
        { name: 'Colombia', cc: '57', code: 'co' },
        { name: 'Ecuador', cc: '593', code: 'ec' },
        { name: 'Estonia', cc: '372', code: 'ee' },
        { name: 'Germany', cc: '49', code: 'de' },
        { name: 'Hong Kong', cc: '852', code: 'hk' },
        { name: 'Ireland', cc: '353', code: 'ie' },
        { name: 'Singapore', cc: '65', code: 'sg' },
        { name: 'Spain', cc: '34', code: 'es' },
        { name: 'Brazil', cc: '55', code: 'br' },
      ]
    }
  },

  // Initialize after component creation
  componentDidMount() {
    var self = this;

    // Fetch Twilio capability token from our Node.js server
    $.getJSON('/token').done(function(data) {
      self.setState({identity: data.identity});
      Twilio.Device.setup(data.token);
      self.setState({log: `Connected with generated client name "${data.identity}"`});
    }).fail(function(err) {
      console.log(err);
      self.setState({log: 'Could not fetch token, see console.log'});
    })

    // Configure event handlers for Twilio Device
    Twilio.Device.disconnect(function() {
      self.setState({
        onPhone: false,
        log: 'Call ended.'
      });
    });
  },

  // Handle country code selection
  handleChangeCountryCode(countryCode) {
    this.setState({countryCode: countryCode});
  },

  // Handle number input
  handleChangeNumber(e) {
    this.setState({
      currentNumber: e.target.value,
      isValidNumber: /^([0-9]|#|\*)+$/.test(e.target.value.replace(/[-()\s]/g,''))
    });
  },

  // Handle muting
  handleToggleMute() {
    var muted = !this.state.muted;

    this.setState({muted: muted});
    Twilio.Device.activeConnection().mute(muted);
  },

  // Make an outbound call with the current number,
  // or hang up the current call
  handleToggleCall() {
    if (!this.state.onPhone) {
      this.setState({
        muted: false,
        onPhone: true
      })
      // make outbound call with current number
      var n = '+' + this.state.countryCode + this.state.currentNumber.replace(/\D/g, '');
      Twilio.Device.connect({ number: n });
      this.setState({log: 'Calling ' + n})
    } else {
      // hang up call in progress
      Twilio.Device.disconnectAll();
    }
  },

  render: function() {
    var self = this;

    var countryOptions = self.state.countries.map(function(country) {
      var flagClass = 'flag flag-' + country.code;

      return (
        <li>
          <a href="#" onClick={() => self.handleChangeCountryCode(country.cc)}>
            <div className={ flagClass }></div>
            <span>{ country.name } (+{ country.cc })</span>
          </a>
        </li>
      );
    });

    return (
      <div id="dialer">
        <div id="dial-form" className="input-group input-group-sm">
          
          <div className="input-group-btn">
            <button type="button" className="btn btn-default dropdown-toggle" 
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                +<span className="country-code">{this.state.countryCode}</span>
                <i className="fa fa-caret-down"></i>
            </button>
            <ul className="dropdown-menu">
                {countryOptions}
            </ul>
          </div>

          <div className="input-group input-group-sm">
            <input type="tel" value={this.state.currentNumber} onChange={this.handleChangeNumber}
                className="form-control" placeholder="555-666-7777" />
          </div>
        </div>

        <div className="controls">
          <button className={'btn btn-circle btn-success ' + (this.state.onPhone ? 'btn-danger': 'btn-success')}
              onClick={this.handleToggleCall} disabled={!this.state.isValidNumber}>
            <i className={'fa fa-fw fa-phone '+ (this.state.onPhone ? 'fa-close': 'fa-phone')}></i>
          </button>
          
          <button className="btn btn-circle btn-default" onClick={this.handleToggleMute}>
            <i className={'fa fa-fw fa-microphone ' + (this.state.muted ? 'fa-microphone-slash': 'fa-microphone')}></i>
          </button>
        </div>

        { this.state.onPhone ? <DTMFTone/> : null }

        <div>
          <div className="log">{this.state.log}</div>
          <p>{this.state.identity}</p>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <DialerApp/>,
  document.getElementById('dialer-app')
);