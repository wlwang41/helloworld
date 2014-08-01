// Initialize Phaser, and creates a 400x490px game
var width = $('#game_div').width() || 400;
var height = $('#game_div').height() || 500;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game_div');

// Creates a new 'main' state that wil contain the game
var main_state = {

    preload: function() {
	  // Function called first to load all the assets
      // Change the background color of the game

      this.game.stage.backgroundColor = '#71c5cf';
      // this.game.load.image('background', 'assets/b.png');
      // Load the bird sprite
      this.game.load.image('bird', 'assets/bird.png');
      // Load the pipe sprite
      this.game.load.image('pipe', 'assets/pipe.png');
      this.game.load.audio('jump', 'assets/jump.wav');
    },

    create: function() {
      // fuck
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      // this.game.add.sprite(0 ,0, 'background');

   	  // Fuction called after 'preload' to setup the game
      this.score = 0;
      var style = { font: "30px Arial", fill: "#ffffff" };
      this.label_score = this.game.add.text(20, 20, "0", style);

      // Display the bird on the screen
      this.bird = this.game.add.sprite(100, 245, 'bird');

      // fuck
      this.game.physics.arcade.enable(this.bird);

      this.bird.body.gravity.y = 1000;
      this.bird.anchor.setTo(-0.2, 0.5);

      var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      space_key.onDown.add(this.jump, this);
      // pipe creation
      this.pipes = this.game.add.group();

      // fuck
      this.pipes.enableBody = true;

      this.pipes.createMultiple(20, 'pipe');
      this.pipes_timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

      this.jump_sound = this.game.add.audio('jump');
    },

    update: function() {
	  // Function called 60 times per second
      if (this.bird.inWorld == false) {
        // 弹出框
        this.alert_window();
        this.game.destroy();
        return;
      };
      if (this.bird.angle < 20) {
        this.bird.angle += 1;
      }
      // this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);

      // fuck
      this.game.physics.arcade.overlap(this.bird, this.pipes, this.hit_pipe, null, this);

    },

    hit_pipe: function() {
      if (this.bird.alive == false) {
        return;
      }
      this.bird.alive = false;

      this.game.time.events.remove(this.pipes_timer);

      this.pipes.forEachAlive(function(p){
        p.body.velocity.x = 0;
      }, this);
    },

    jump: function() {
      if (this.bird.alive == false) {
        return;
      }
      this.game.add.tween(this.bird).to({angle: -20}, 100).start();
      this.bird.body.velocity.y = -350;
      this.jump_sound.play();
    },

    alert_window: function() {
      // debug

      var that = this;
      var shadow = '<div class="ernie-ui-shadow"></div>'
      var html = '<div class="ernie-ui-alert"><div class="ernie-ui-button"></div></div>'
      var $e = $(html).append('本次得分: ' + this.label_score.text);

      $shadow = $(shadow);
      $shadow.css({'height': document.body.scrollHeight ? document.body.scrollHeight : "640px",'width': document.body.scrollWidth ? document.body.scrollWidth : "320px"});
      $e.find('.ernie-ui-button').click(function(){
        $e.remove();
        $shadow.remove();
        // that.restart_game();
        // 这个写法就是shit, 浪费了用户手机流量
        var url = window.location.href;
        window.location.href = url;
      });
      $('body').append($e);
      $('body').append($shadow);
    },

    restart_game: function() {
      this.game.time.events.remove(this.pipes_timer);
      this.game.state.start('main');
    },

    add_score: function() {
      this.score += 1;
      this.label_score.text = this.score;
    },

    add_one_pipe: function(x, y) {
      var pipe = this.pipes.getFirstDead();

      // set new position of the pipe

      // fuck
      if (pipe) {
        pipe.reset(x, y);
      } else {
        pipe = this.pipes.create(x, y, 'pipe');
      };
      pipe.body.velocity.x = -200;
      pipe.outOfBoundsKill = true;

      // pipe.reset(x, y);

      // pipe.body.velocity.x = -200;

      // pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
      var hole = Math.floor(Math.random() * 5) + 1;
      for (var i = 0; i < Math.ceil(height / 50); i++) {
        if (i != hole && i != hole + 1 && i != hole + 2) {
          this.add_one_pipe(width, i * 50);
        }
      };
      this.add_score();
      // this.score += 1;

      // //fuck
      // this.label_score.text = this.score;

      // // this.label_score.content = this.score;
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);
game.state.start('main');
