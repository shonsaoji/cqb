jsPlumb.ready(function() {
	var cqb = new CQB({
		elementId: "cqb_container"
	});
	cqb.init()
});

function CQB(opts) {
	this.elementId = opts.elementId;
	this.element = $("#" + this.elementId);
	this.tables_list = [
	{
		name: "customers",
		fields: ["customer_id", "name", "address"]
	},
	{
		name: "orders",
		fields: ["order_id", "customer_id", "total"],
	}
	];
	this.tableList = [];

	this.init = function() {
		this.element.html("<div id='table_list'></div><div id='er-diagram' class='er-diagram'><h1>Drag Tables Here</div>");		
		this.tableList = new TableList({
			element: "table_list",
			tables: this.tables_list
		});
		this.erDiagram = new ERDiagram();		
		this.tableList.draw();
		this.erDiagram.draw();
		this.attachEvents();

	};

	this.get_fields_for_table = function(table_name) {
		var table = this.tables_list.find(function(d) {
			return d.name == table_name;
		});
		if(table) {
			return table[0].fields;
		}
	};

	this.attachEvents = function() {
		for(var i = 0; i < this.tables_list.length; i++) {
			var table_name_elem = $("#" + this.tables_list[i].name);
			table_name_elem.draggable({ revert: true });			
		}		

		var er_elem = $("#er-diagram");
		er_elem.find(".draggable").draggable();
		$("#er-diagram").droppable({
			drop: function( event, ui ) {
		    	
		    }
		});
		er_elem.find(".table-cell").draggable({
			helper: "clone"
		});
		er_elem.find(".table-cell").droppable({			
			hoverClass: "droppable-hover",
			drop: function( event, ui ) {
		    	alert(ui.draggable.text() + " dropped into " + this.textContent);
		    }
		});
	}

};

function TableList(opts) { 
	this.elementId = opts.element;
	this.element = $("#" + this.elementId);
	this.tables = opts.tables;
	this.container_class = opts.container_class || "table-container";
	this.cell_class = opts.cell_class || "table-cell";
	this.draw = function() {
		var html = "";
		for(var i = 0; i < this.tables.length; i++) {
			html += "<div class='" + this.cell_class + "' id='" + this.tables[i].name + "'>" + this.tables[i].name + " </div>";
		}


		if(!this.element.hasClass(this.container_class)) {
			this.element.addClass(this.container_class);
		}
		this.element.html(html);		
	};
};


function ERDiagram() {
	this.tables = [
	{
		name: "customers",
		fields: ["customer_id", "name", "address"]
	},
	{
		name: "orders",
		fields: ["order_id", "customer_id", "total"],
	}
	];

	this.draw = function() {
		var elem = $("#er-diagram"),
		html = "";
		for(var i = 0; i < this.tables.length; i++) {
			html += "<div class='table-container draggable' style=\"left: " + i*75 + "\">" + this.tables[i].name;
			for(var j = 0; j < this.tables[i].fields.length; j++) {
				html += "<div class='table-cell'>" ;
				html += "<input type=checkbox value='" + this.tables[i].fields[j] + "' />&nbsp;";
				html += this.tables[i].fields[j] ;
				html += "</div>";
			}
			
			html += "</div>";
		}
		elem.html(html);
	};
}