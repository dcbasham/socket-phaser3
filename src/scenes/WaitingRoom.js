import Phaser from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super('WaitingRoom');
    this.state = {};
    this.hasBeenSet = false;
  }
  init(data) {
    this.socket = data.socket;
  }
  preload () {
    this.load.html('codeform', 'assets/text/codeform.html')
  }
  create () {
    const scene = this;
    scene.popUp = scene.add.graphics()
    scene.boxes = scene.add.graphics()
    // for popup window
    scene.popUp.lineStyle(1, 0xffffff)
    scene.popUp.fillStyle(0xffffff, 0.5)

    //for Boxes
    scene.boxes.lineStyle(1, 0xffffff)
    scene.boxes.fillStyle(0xa9a9a9, 1)

    //popup window
    scene.popUp.strokeRect(25, 25, 750, 500)
    scene.popUp.fillRect(25, 25, 750, 500)

    //title
    scene.title = scene.add.text(100, 75, 'RegEx Spaceship'{
      fill: '#add8e6',
      fontSize: '66px',
      fontStyle: 'bold'
    })
    // left popup
    scene.boxes.strokeRect(100, 200, 275, 100)
    scene.boxes.fillRect(100, 200, 275, 100)
    scene.requestButton = scene.add.text(140, 215, 'Request Room Key', {
      fill: '#000000',
      fontSize: '20px',
      fontStyle: 'bold'
    })
    // right popup
    scene.boxes.strokeRect(425, 200, 275, 100)
    scene.boxes.fillRect(425, 200, 275, 100)
    scene.inputElement = scene.add.dom(562.5, 250).createFromCache('codeform')
    scene.inputElement.addListener('click')

    scene.inputElement.on('click', function (event) {
      if (event.target.name === 'enterRoom') {
        const input = scene.inputElement.getChildByName('code-form')
        scene.socket.emit('isKeyValid', input.value)
      }
    })
    // request button functionality
    scene.requestButton.setInteractive()
    scene.requestButton.on('pointerdown', () => {
      scene.socket.emit('getRoomCode')
    })
    scene.notValidText = scene.add.text(670, 295, '', {
      fill: '#ff0000',
      fontSize: '15px'
    })
    scene.roomKeyText = scene.add.text(210, 250, '', {
      fill: '#00ff00',
      fontSize: '20px',
      fontStyle: 'bold'
    })

    // socket listeners.
    scene.socket.on('keyNotValid', function () {
      scene.notValidText.setText('invalid room key')
    });
    scene.socket.on('keyIsValid', function (input) {
      scene.socket.emit('joinRoom', input);
      scene.scene.stop('WaitingRoom')
    });

    scene.socket.on('roomCreated', function (roomKey) {
      scene.roomKey = roomKey;
      scene.roomKeyText.setText(scene.roomKey)
    })
    scene.socket.on('keyNotValid', function () {
      scene.notValidText.setText('Invalid Room Key')
    })

  }
  update(){}
}
/* line 51 codeForm and input element :
Here we are putting a click event listener on our entire codeform, and inside of the click function, we are checking to see if what was clicked was our submit button, named “enterRoom” in our codeform html. Then, we save the input that the user has entered to a variable called input. We “emit” the input.value(the text the user entered) from our socket, with the identifier ‘isKeyValid’. add listener for this emit in server/socket/index.js */
/* room created
When we hear ‘roomCreated’, we save the roomKey to our local state (on the WaitingRoom scene) and set the roomKeyText on our interface to the room key we get from the callback function. */
