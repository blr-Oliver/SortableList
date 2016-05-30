function SortableList(root, data){
  this.root = $(root);
  this.allData = data;
  this.pageSize = 10;
  this.state = {
    sort: ''
  };
  this.render();
}

SortableList.prototype = $.extend(Object.create(Emitter.prototype), {
  render: function(){
    this.root.empty().addClass('sortable-list');
    this.renderSort();
    this.renderList();
  },

  refresh: function(){
    this.refreshSort();
    this.refreshList();
  },

  renderList: function(){
    var div = $('<div class="display">').appendTo(this.root);
    $('<ul class="content">').addClass('list-group').appendTo(div);
    this.pagination = new Pagination({
      root: $("<ul>").appendTo(div)
    });
    this.pagination.addListener('page', this.updateData.bind(this));
    this.updateData();
  },

  refreshList: function(){
    var ul = this.root.find(".display>.content").empty();
    var data = this.data;
    for (var i = 0; i < data.length; i++){
      var obj = data[i];
      var str = obj.name + ' ' + obj.surname + ' owns ' + obj.wealth + ' billion $';
      $("<li>").text(str).addClass('list-group-item').appendTo(ul);
    }
  },

  renderSort: function(){
    var buttons = ["Name", "Surname", "Wealth"];
    var div = $('<ul class="sidebar">').appendTo(this.root);
    for (var j = 0; j < buttons.length; j++){
      $('<a class="lever" role="button">').html(buttons[j]).appendTo($('<li class="toggler" tabindex="0">')
          .attr("data-field", buttons[j].toLowerCase()).appendTo(div));
    }
    div.click(this.onSortClick.bind(this));
    this.refreshSort();
  },

  refreshSort: function(){
    this.root.find(".sidebar>.active").removeClass("active").find("a").removeClass("asc desc");
    if(this.state.sort){
      var field = this.state.sort.substr(1);
      var asc = this.state.sort[0] == "+";
      this.root.find('.sidebar .toggler[data-field="' + field + '"] a').addClass(asc ? "asc" : "desc").parent()
          .addClass("active");
    }
  },

  updateData: function(){
    var allData = this.allData;
    var pgn = this.pagination;
    pgn.count(Math.ceil(allData.length / this.pageSize));
    if(this.state.sort)
      allData = this.sortByField(allData, this.state.sort);
    var start = pgn.page() * this.pageSize;
    this.data = allData.slice(start, start + this.pageSize);
    this.refreshList();
  },

  onSortClick: function(event){
    var target = $(event.target);
    if(target.is('a'))
      target = target.parent();
    if(target.is('li')){
      var field = target.attr('data-field');
      var sort = this.sort();
      sort = ((sort && sort.substr(1) == field && sort[0] == '+') ? '-' : '+') + field;
      this.sort(sort);
    }
  },

  sort: function(sort){
    if(arguments.length){
      if(this.state.sort != sort){
        this.state.sort = sort;
        this.refreshSort();
        this.pagination.page(0, true);
        this.emit('sort', sort);
        return this;
      }
    }else
      return this.state.sort;
  },

  getField: function(obj, path){
    return path.split('.').reduce(function(obj, prop){
      return (obj || undefined) && obj[prop];
    }, obj);
  },

  sortByField: function(a, field){
    if(typeof (field) === 'string')
      return this.sortByField(a, [field]);
    var sort = field.map(function(key){
      return {
        asc: key[0] !== '-',
        key: (key[0] === '+' || key[0] === '-') ? key.substr(1) : key
      };
    })
    var getField = this.getField;
    return a.sort(function(a, b){
      for (var i = 0; i < sort.length; ++i){
        var valueA = getField(a, sort[i].key), valueB = getField(b, sort[i].key);
        if(valueA != valueB)
          return (valueA < valueB ^ sort[i].asc) ? 1 : -1;
      }
      return 0;
    });
  }

});
