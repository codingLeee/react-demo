export class CreateSocket {
  constructor(url) {
    const _this = this;
    _this.wsUrl = url;
    _this.Socket = null;
    _this.setIntervalWesocketPush = null;
    _this.setTimeoutConnecting = null;

    _this.Socket && _this.Socket.close();

    if (!_this.Socket) {
      console.log('建立websocket连接');
      _this.Socket = new WebSocket(_this.wsUrl);
      
      _this.Socket.onopen = function(time = 5000, ping = 'ping') {
        clearInterval(_this.setIntervalWesocketPush);
        _this.Socket.send();
        _this.setIntervalWesocketPush = setInterval(() => {
          _this.Socket.send();
        }, time);
      };

      _this.Socket.onclose = function() {
        _this.Socket.close();
        _this.Socket = null
        clearInterval(_this.setIntervalWesocketPush);
        clearTimeout(_this.setTimeoutConnecting);
        // if (_this.Socket.readyState !== 2) {
        //   _this.Socket = null;
        //   new CreateSocket(_this.wsUrl);
        // }
      };

      _this.Socket.onerror = function(e) {
        _this.Socket.close();
        clearInterval(_this.setIntervalWesocketPush);
        clearTimeout(_this.setTimeoutConnecting);
        console.log('连接失败重连中');
        if (_this.Socket.readyState !== 3) {
          _this.Socket = null
          new CreateSocket(_this.wsUrl);
        }
      };

      // this.Socket.onmessage = this.onmessageWS;
    } else {
      console.log('websocket已连接');
    }
  }

  /**
   * 发送数据但连接未建立时进行处理等待重发
   * @param {any} message 需要发送的数据
   */
  connecting(message) {
    clearTimeout(this.setTimeoutConnecting);
    this.setTimeoutConnecting = setTimeout(() => {
      if (this.Socket.readyState === 0) {
        this.connecting(message);
      } else {
        this.Socket.send(JSON.stringify(message));
      }
    }, 1000);
  }

  /**
   * 发送数据
   * @param {any} message 需要发送的数据
   */
  sendWSPush(message) {
    if (this.Socket !== null && this.Socket.readyState === 3) {
      this.Socket.close();
      new CreateSocket(this.wsUrl);
    } else if (this.Socket.readyState === 1) {
      this.Socket.send(JSON.stringify(message));
    } else if (this.Socket.readyState === 0) {
      this.connecting(message);
    }
  }

  /**断开连接 */
  closeWs() {
    this.Socket.close();
    this.Socket = null;
    clearInterval(this.setIntervalWesocketPush);
    clearTimeout(this.setTimeoutConnecting);
    console.log('websocket已断开')
  }

}
