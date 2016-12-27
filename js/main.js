(function(){
	"use strict";
	var typr = function(el,volumeController){
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
			_self.volumeController = volumeController;
			_self.volumeController.init('.typr_volume');
			
		},
		_self.play = function(){
			for(var a=0;a<_self.audioChannels.length;a+=1){
				var now = new Date();console.log(a);
				if(_self.audioChannels[a]['finished'] < now.getTime() ){
					_self.audioChannels[a]['finished'] = now.getTime() + _self.audioStream.duration*1000;
					_self.audioChannels[a]['channel'].src = _self.audioSrc;
					_self.audioChannels[a]['channel'].load();
					_self.audioChannels[a]['channel'].volume = (_self.volumeController.getVolume() / 10 );
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

	
	var draggableVol = {

		init: function(el){
			this.$el = document.querySelector(el);
			this.$speaker = this.$el.querySelector('.typr_volume_speaker');
			this.$levelScale = this.$el.querySelector('.typr_volume_level_scale');
			this.$levelHandle = this.$el.querySelector('.typr_volume_level_handle');
			this.volume = this.getVolume;
			this.BOUNDING_RECT = this.$levelScale.getBoundingClientRect();
			this.MIN_LEFT = this.$levelScale.offsetLeft;
			this.MAX_LEFT = this.MIN_LEFT + this.BOUNDING_RECT.width;
			this.VOL_NAME  = 'typr_volume'
			this.bindListeners();
			this.setHandlePos(function(vol,minLeft){
				return (vol*70) + minLeft;
			}(this.volume(), this.MIN_LEFT));
		},
		
		setHandlePos: function(pos){
console.log(pos);
			this.$levelHandle.style.left = pos + "px";
		},

		setVolume: function(vol){
			this.storeVolume(vol);
		},
		
		storeVolume: function(vol){
			localStorage.setItem(this.VOL_NAME, vol);
		},

		getVolume: function(vol){
			return localStorage.getItem(this.VOL_NAME) ? localStorage.getItem(this.VOL_NAME) : 0;
		},
		
		handleDown: function(){
			this.handleDraggable = true;
		},

		handleReleased: function(){
			this.handleDraggable = false;
		},
		
		onHandleDrag: function(e){
			if(!e) return;
			if(this.handleDraggable === true){
				var posX = e.pageX + this.MIN_LEFT - this.MAX_LEFT;
				var percentagePos = ( e.pageX - this.MAX_LEFT) / 70;
				this.setHandlePos(posX);
				this.setVolume(percentagePos);
				console.log("X Pos: " + posX);
				console.log("event Pos: " + e.pageX);
				console.log("actual Pos: " + ( e.pageX - this.MAX_LEFT));
			}
			
		},
		
		bindListeners: function(){
			this.$levelHandle.addEventListener("mousedown", this.handleDown.bind(this));
			this.$levelHandle.addEventListener("mouseup",this.handleReleased.bind(this));
			this.$levelScale.addEventListener("mousemove",this.onHandleDrag.bind(this));
			//this.$el.addEventListener("mousemove",this.onHandleDrag.bind(this));

		}
	}

	var nTypr = new typr('.typr_text', draggableVol ).init();
})()
