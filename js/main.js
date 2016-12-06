(function(){
	"use strict";
	var typr = function(el){
		var _self = this;
		_self.$el = document.querySelector(el);
		_self.init = function(){
			_self.audioStream = new Audio('res/tkey_cut3.mp3');
			_self.audioDuration = _self.audioStream.duration;
			_self.audioSrc = 'res/tkey_cut3.mp3';
			_self.maxChannels = 15;
			_self.audioChannels = [];
			_self.initAudioPlayer();
			_self.addListeners(_self.$el,'keydown',_self.play);
		},
		_self.play = function(){
			for(var a=0;a<_self.audioChannels.length;a+=1){
				var now = new Date();console.log(a);
				if(_self.audioChannels[a]['finished'] < now.getTime() ){
					_self.audioChannels[a]['finished'] = now.getTime() + _self.audioStream.duration*1000;
					_self.audioChannels[a]['channel'].src = _self.audioSrc;
					_self.audioChannels[a]['channel'].load();
					_self.audioChannels[a]['channel'].play();
					break;
				}
			}
		},
		_self.addListeners = function(el,e,callback){
			el.addEventListener(e,callback);
		},
		_self.initAudioPlayer = function(){
			for(var a=0;a<_self.maxChannels;a+=1){
				_self.audioChannels[a] = [];
				_self.audioChannels[a]['channel']= new Audio();
				_self.audioChannels[a]['finished'] = -1;
			}
		}

	return _self;	
	}

	var nTypr = new typr('.typr_text').init();

})()
