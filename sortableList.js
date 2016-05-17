function SortableList(root, data){
	this.root = $(root);
	this.data = data;
	this.render();
}
SortableList.prototype = {
	render: function(){
		this.root.empty();

		var buttons = ["Name" , "Surname" , "wealth"];

		for (var j = 0 ; j < buttons.length; j++) {
			$('<button class="btn">').text(buttons[j]).attr("data-field", buttons[j].toLowerCase()).appendTo(this.root);
		}

		var ul = $("<ul>").addClass('list-group').appendTo(this.root);		

		for(var i = 0; i < this.data.length; i++){
			var obj = this.data[i];
			var str = ob.name + ' ' + obj.surname + ' owns ' + obj.wealth + ' billion $';
			
			$("<li>").text(str).addClass('list-group-item').appendTo(ul);
		}
	}
}
