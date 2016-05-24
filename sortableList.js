function SortableList(root, data){
  this.root = $(root);
  this.data = data;
  this.state = {};
  this.state.sort = "";
  this.render();
}
SortableList.prototype = {
  render: function(){
    this.root.empty().addClass('vertical-container');
    this.renderSort();
    this.renderList();
  },

  refresh: function(){
    this.refreshSort();
    this.refreshList();
  },

  renderList: function() {
    $("<ul>").addClass('list-group vertical-content').appendTo(this.root);
    this.refreshList();
  },

  refreshList: function() {
    var ul = this.root.find(".vertical-content").empty();

    for(var i = 0; i < this.data.length; i++){
      var obj = this.data[i];
      var str = obj.name + ' ' + obj.surname + ' owns ' + obj.wealth + ' billion $';
      $("<li>").text(str).addClass('list-group-item').appendTo(ul);
    }

  },

  renderSort: function(){
    var buttons = ["Name" , "Surname" , "Wealth"];
    var div = $("<ul>").addClass('vertical-sidebar').appendTo(this.root);  
    for (var j = 0; j < buttons.length; j++) {
      $('<a class="lever">').html(buttons[j]).attr("data-field", buttons[j].toLowerCase()).appendTo($('<li class="toggler">').appendTo(div));
    }
    div.click( this.onSortClick.bind( this ) );

    this.refreshSort();
  },

  refreshSort: function() {
  
    this.root.find(".vertical-sidebar>.active").removeClass("active").find("a").removeClass("asc desc");
    if (this.state.sort)  {
      var field = this.state.sort.substr(1);
      var asc = this.state.sort[0] == "+";
      this.root.find('.vertical-sidebar a[data-field="' + field + '"]').addClass(asc ? "asc" : "desc").parent().addClass("active");

    }
  },


  onSortClick: function( event ){
    var target = event.target;
    if(target.tagName.toLowerCase() == 'a'){
      var field = target.getAttribute('data-field');

      if( this.state.sort && this.state.sort.substr(1) == field ){
        if(this.state.sort[0] == '+'){
          this.state.sort = '-' + field;
        }else{
          this.state.sort = '+' + field;
        }
      }else{
        this.state.sort = '+' + field;
      }
      this.sortByField(this.data, this.state.sort);
      this.refresh();
    }
  },

  getField : function (obj, path) {
    return path.split('.').reduce((obj, prop) => (obj || undefined) && obj[prop], obj);
  },

  sortByField : function (a, field) {
    if (typeof(field) === 'string') return this.sortByField(a, [field]);
    var sort = field.map(function(key) {
      return {
        asc: key[0] !== '-',
        key: (key[0] === '+' || key[0] === '-') ? key.substr(1) : key
      };
    })
    var getField = this.getField;
    return a.sort(function(a, b) {
      for (var i = 0; i < sort.length; ++i) {
        var valueA = getField(a, sort[i].key), valueB = getField(b, sort[i].key);
        if (valueA != valueB)
          return (valueA < valueB ^ sort[i].asc) ? 1 : -1;
      }
      return 0;
    });
  }

}
