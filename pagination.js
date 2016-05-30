function Pagination(config, state){
  this.config = {
    arrows: true,
    innerLength: 3,
    sideLength: 2
  };
  this.config.arrows = config.arrows || this.config.arrows;
  this.config.innerLength = (config.innerLength || this.config.innerLength) | 1;
  this.config.sideLength = config.sideLength || this.config.sideLength;
  this.config.root = $(config.root);

  this.state = {
    page: 0,
    count: 1
  };
  state = state || {}; 
  this.state.page = state.page || this.state.page;
  this.state.count = state.count || this.state.count;
  this.addListener('page', this.refresh);
  this.addListener('count', this.refresh);
  this.render();
}

Pagination.prototype = $.extend(Object.create(Emitter.prototype), {
  render: function(){
    var root = this.config.root.addClass("pagination");
    root.on('click', this._onclick.bind(this));
    root.on('mousedown', this._onmousedown.bind(this));
    root.on('keydown', this._onkeydown.bind(this));
    if(!root.is('[tabindex]'))
      root.attr('tabindex', '0');
    this.refresh();
  },
  refresh: function(){
    var root = this.config.root;
    var page = this.page(), count = this.count();
    root.empty();
    if(count > 1){
      var i = 0, li;
      var leftMax = Math.min(this.config.sideLength, count);
      var innerMin = Math.max(0, page - (this.config.innerLength >> 1));
      var innerMax = Math.min(page + (this.config.innerLength >> 1) + 1, count);
      var rightMin = Math.max(0, count - this.config.sideLength);

      function addRange(limit){
        for (; i < limit; ++i){
          li = $('<li><a href="#">' + (i + 1) + '</a></li>').appendTo(root);
          if(i == page)
            li.addClass('active');
        }
      }

      if(this.config.arrows){
        var previous = $('<li><a href="#" class="previous">&laquo;</a></li>');
        if(page == 0)
          previous.addClass('disabled');
        previous.appendTo(root);
      }
      addRange(leftMax);
      if(leftMax < innerMin - 1){
        $('<li class="disabled"><a>...</a></li>').appendTo(root);
        i = innerMin;
      }
      addRange(innerMax);
      if(innerMax < rightMin - 1){
        $('<li class="disabled"><a>...</a></li>').appendTo(root);
        i = rightMin;
      }
      addRange(count);
      if(this.config.arrows){
        var next = $('<li><a href="#" class="next">&raquo;</a></li>');
        if(page == count - 1)
          next.addClass('disabled');
        next.appendTo(root);
      }

      root.find('a[href]').attr('tabindex', '-1');
    }
  },
  page: function(page, force){
    if(arguments.length){
      page = Math.max(0, Math.min(page, this.count() - 1));
      if(force || this.state.page != page){
        this.state.page = page;
        this.emit('page', page);
        return this;
      }
    }else
      return this.state.page;
  },
  count: function(count, force){
    if(arguments.length){
      if(force || this.state.count != count){
        this.state.count = count;
        this.emit('count', count);
        return this;
      }
    }else
      return this.state.count;
  },
  _onclick: function(e){
    var target = $(e.target);
    if(target.is('a') && !target.parent().is('.disabled')){
      if(target.hasClass('previous'))
        this.page(this.page() - 1);
      else if(target.hasClass('next'))
        this.page(this.page() + 1);
      else
        this.page(+target.text() - 1);
    }
  },
  _onmousedown: function(e){
    if($(e.target).is('a'))
      e.preventDefault();
  },
  _onkeydown: function(e){
    if(e.keyCode >= 33 && e.keyCode <= 40)
      e.preventDefault();
    switch (e.keyCode){
    case 38:  //up arrow
    case 36:  //home
      this.page(0);
      break;
    case 40:  //down arrow
    case 35:  //end
      this.page(this.count() - 1);
      break;
    case 37:  //left arrow
    case 33:  //page up
      this.page(this.page() - 1);
      break;
    case 39:  //right arrow
    case 34:  //page down
      this.page(this.page() + 1);
      break;
    }
  }
});
